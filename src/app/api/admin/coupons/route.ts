import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

async function requireAdmin() {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== 'admin') return null
  return session
}

export async function GET() {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(coupons)
}

export async function POST(req: Request) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const coupon = await prisma.coupon.create({
    data: {
      code:          body.code.trim().toUpperCase(),
      type:          body.type,
      value:         parseFloat(body.value) || 0,
      minOrderValue: body.minOrderValue ? parseFloat(body.minOrderValue) : null,
      usageLimit:    body.usageLimit    ? parseInt(body.usageLimit)     : null,
      expiryDate:    body.expiryDate    ? new Date(body.expiryDate)     : null,
      status:        body.status ?? 'active',
    },
  })
  return NextResponse.json(coupon, { status: 201 })
}