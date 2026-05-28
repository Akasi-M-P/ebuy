import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

async function requireAdmin() {
  const s = await getServerSession(authOptions)
  return s?.user?.role === 'admin' ? s : null
}

const STATUS_COLOR: Record<string, string> = {
  pending:    '#9A9A90',
  processing: '#3B82F6',
  shipped:    '#C9A84C',
  delivered:  '#4CAF50',
  cancelled:  '#EF4444',
  refunded:   '#F97316',
}

function pctChange(cur: number, prev: number) {
  if (prev === 0) return cur > 0 ? 100 : 0
  return Math.round(((cur - prev) / prev) * 1000) / 10
}

export async function GET(req: Request) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const rangeDays = ({ '7d': 7, '30d': 30, '90d': 90 } as Record<string, number>)[searchParams.get('range') ?? '30d'] ?? 30

  const now         = new Date()
  const periodStart = new Date(now.getTime() - rangeDays * 24 * 60 * 60 * 1000)
  const prevStart   = new Date(now.getTime() - rangeDays * 2 * 24 * 60 * 60 * 1000)

  const [curOrders, prevOrders, statusGroups, orderItems] = await Promise.all([
    prisma.order.findMany({ where: { createdAt: { gte: periodStart } },              select: { total: true, createdAt: true, status: true } }),
    prisma.order.findMany({ where: { createdAt: { gte: prevStart, lt: periodStart } }, select: { total: true } }),
    prisma.order.groupBy({ by: ['status'], _count: { id: true } }),
    prisma.orderItem.findMany({ where: { order: { createdAt: { gte: periodStart } } }, select: { productId: true, name: true, price: true, quantity: true } }),
  ])

  const curRevenue  = curOrders.reduce((s, o) => s + o.total, 0)
  const prevRevenue = prevOrders.reduce((s, o) => s + o.total, 0)
  const curAov      = curOrders.length ? curRevenue  / curOrders.length  : 0
  const prevAov     = prevOrders.length ? prevRevenue / prevOrders.length : 0

  // Revenue chart — bucket into days (up to 30) or weeks (90d)
  const bucketDays = rangeDays <= 30 ? 1 : 7
  const buckets    = Math.ceil(rangeDays / bucketDays)
  const dayMap: Record<string, { revenue: number; orders: number }> = {}
  curOrders.forEach(o => {
    const key = o.createdAt.toISOString().split('T')[0]
    dayMap[key] ??= { revenue: 0, orders: 0 }
    dayMap[key].revenue += o.total
    dayMap[key].orders  += 1
  })
  const revenueChart = Array.from({ length: buckets }, (_, i) => {
    const bucketEnd   = new Date(now.getTime() - (buckets - 1 - i) * bucketDays * 24 * 60 * 60 * 1000)
    let revenue = 0; let orders = 0
    for (let d = 0; d < bucketDays; d++) {
      const dayD = new Date(bucketEnd.getTime() - d * 24 * 60 * 60 * 1000)
      const key  = dayD.toISOString().split('T')[0]
      revenue   += dayMap[key]?.revenue ?? 0
      orders    += dayMap[key]?.orders  ?? 0
    }
    const label = bucketDays === 1
      ? bucketEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      : `Week ${i + 1}`
    return { date: label, revenue, orders }
  })

  // Top products
  const prodMap: Record<string, { name: string; revenue: number; units: number }> = {}
  orderItems.forEach(item => {
    prodMap[item.productId] ??= { name: item.name, revenue: 0, units: 0 }
    prodMap[item.productId].revenue += item.price * item.quantity
    prodMap[item.productId].units   += item.quantity
  })
  const topProductIds = Object.keys(prodMap)
  const productImages = topProductIds.length
    ? await prisma.product.findMany({ where: { id: { in: topProductIds } }, select: { id: true, images: true } })
    : []
  const imgMap: Record<string, string> = {}
  productImages.forEach(p => { imgMap[p.id] = p.images[0] ?? '' })
  const topProducts = Object.entries(prodMap)
    .map(([id, p]) => ({ id, name: p.name, revenue: p.revenue, units: p.units, image: imgMap[id] ?? '' }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 8)

  return NextResponse.json({
    kpis: {
      grossRevenue:  curRevenue,
      netRevenue:    curRevenue,
      aov:           curAov,
      aovChange:     pctChange(curAov, prevAov),
      revenueChange: pctChange(curRevenue, prevRevenue),
      refunds:       0,
    },
    revenueChart,
    topProducts,
    ordersByStatus: statusGroups.map(s => ({
      name: s.status, value: s._count.id, color: STATUS_COLOR[s.status] ?? '#9A9A90',
    })),
  })
}