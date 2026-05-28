import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const users = await prisma.user.findMany({
    where: { role: { not: 'admin' } },
    orderBy: { createdAt: 'desc' },
    include: {
      orders: { select: { total: true, createdAt: true }, orderBy: { createdAt: 'desc' } },
    },
  })

  const customers = users.map((u) => ({
    id:                 u.id,
    name:               u.name ?? '—',
    email:              u.email ?? '—',
    phone:              u.phone ?? null,
    status:             u.status,
    joinDate:           u.createdAt,
    totalOrders:        u.orders.length,
    totalSpent:         u.orders.reduce((s, o) => s + o.total, 0),
    averageOrderValue:  u.orders.length > 0 ? u.orders.reduce((s, o) => s + o.total, 0) / u.orders.length : 0,
    lastOrderDate:      u.orders[0]?.createdAt ?? null,
  }))

  return NextResponse.json(customers)
}