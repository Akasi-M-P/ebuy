import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')?.trim().toUpperCase()
  if (!code) return NextResponse.json({ error: 'Code is required.' }, { status: 400 })

  const coupon = await prisma.coupon.findUnique({ where: { code } })

  if (!coupon || coupon.status !== 'active') {
    return NextResponse.json({ error: 'Invalid or expired coupon code.' }, { status: 404 })
  }
  if (coupon.expiryDate && coupon.expiryDate < new Date()) {
    return NextResponse.json({ error: 'This coupon has expired.' }, { status: 400 })
  }
  if (coupon.usageLimit !== null && coupon.usageCount >= coupon.usageLimit) {
    return NextResponse.json({ error: 'This coupon has reached its usage limit.' }, { status: 400 })
  }

  return NextResponse.json({
    couponType:    coupon.type,
    couponValue:   coupon.value,
    minOrderValue: coupon.minOrderValue,
  })
}