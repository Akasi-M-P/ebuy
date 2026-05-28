import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

async function requireAdmin() {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== 'admin') return null
  return session
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const coupon = await prisma.coupon.update({
    where: { id: params.id },
    data: {
      ...(body.code          !== undefined && { code:          body.code.trim().toUpperCase() }),
      ...(body.type          !== undefined && { type:          body.type }),
      ...(body.value         !== undefined && { value:         parseFloat(body.value) }),
      ...(body.minOrderValue !== undefined && { minOrderValue: body.minOrderValue ? parseFloat(body.minOrderValue) : null }),
      ...(body.usageLimit    !== undefined && { usageLimit:    body.usageLimit ? parseInt(body.usageLimit) : null }),
      ...(body.expiryDate    !== undefined && { expiryDate:    body.expiryDate ? new Date(body.expiryDate) : null }),
      ...(body.status        !== undefined && { status:        body.status }),
    },
  })
  return NextResponse.json(coupon)
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await prisma.coupon.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}