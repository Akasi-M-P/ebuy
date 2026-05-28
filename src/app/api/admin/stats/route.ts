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

function pctChange(current: number, prev: number) {
  if (prev === 0) return current > 0 ? 100 : 0
  return Math.round(((current - prev) / prev) * 1000) / 10
}

export async function GET() {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const now         = new Date()
  const periodStart = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)
  const prevStart   = new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000)

  const [
    curOrders, prevOrders,
    curCustomers, prevCustomers,
    statusGroups,
    orderItems,
    lowStock,
    recentOrders,
  ] = await Promise.all([
    prisma.order.findMany({ where: { createdAt: { gte: periodStart } },                          select: { total: true, createdAt: true } }),
    prisma.order.findMany({ where: { createdAt: { gte: prevStart, lt: periodStart } },           select: { total: true } }),
    prisma.user.count({ where:    { createdAt: { gte: periodStart }, role: 'customer' } }),
    prisma.user.count({ where:    { createdAt: { gte: prevStart, lt: periodStart }, role: 'customer' } }),
    prisma.order.groupBy({ by: ['status'], _count: { id: true } }),
    prisma.orderItem.findMany({ where: { order: { createdAt: { gte: periodStart } } }, select: { productId: true, name: true, price: true, quantity: true } }),
    prisma.product.findMany({ where: { stock: { lt: 10 } }, orderBy: { stock: 'asc' }, take: 6, select: { id: true, name: true, images: true, stock: true, slug: true } }),
    prisma.order.findMany({ orderBy: { createdAt: 'desc' }, take: 5, select: { id: true, orderNumber: true, customerName: true, customerEmail: true, createdAt: true, status: true, total: true } }),
  ])

  const curRevenue  = curOrders.reduce((s, o) => s + o.total, 0)
  const prevRevenue = prevOrders.reduce((s, o) => s + o.total, 0)
  const curAov      = curOrders.length  ? curRevenue / curOrders.length   : 0
  const prevAov     = prevOrders.length ? prevRevenue / prevOrders.length : 0

  // Revenue chart — fill all 14 days even if no orders
  const dayMap: Record<string, { revenue: number; orders: number }> = {}
  curOrders.forEach(o => {
    const key = o.createdAt.toISOString().split('T')[0]
    dayMap[key] ??= { revenue: 0, orders: 0 }
    dayMap[key].revenue += o.total
    dayMap[key].orders  += 1
  })
  const revenueChart = Array.from({ length: 14 }, (_, i) => {
    const d   = new Date(now.getTime() - (13 - i) * 24 * 60 * 60 * 1000)
    const key = d.toISOString().split('T')[0]
    return {
      date:    d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      revenue: dayMap[key]?.revenue ?? 0,
      orders:  dayMap[key]?.orders  ?? 0,
    }
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
    .slice(0, 5)

  return NextResponse.json({
    kpis: {
      revenue:         curRevenue,
      revenueChange:   pctChange(curRevenue,     prevRevenue),
      orders:          curOrders.length,
      ordersChange:    pctChange(curOrders.length, prevOrders.length),
      newCustomers:    curCustomers,
      customersChange: pctChange(curCustomers,   prevCustomers),
      aov:             curAov,
      aovChange:       pctChange(curAov,         prevAov),
    },
    revenueChart,
    ordersByStatus: statusGroups.map(s => ({
      name:  s.status,
      value: s._count.id,
      color: STATUS_COLOR[s.status] ?? '#9A9A90',
    })),
    topProducts,
    lowStock,
    recentOrders,
  })
}