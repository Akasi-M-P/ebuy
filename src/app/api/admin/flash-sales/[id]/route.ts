import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

async function requireAdmin() {
  const s = await getServerSession(authOptions)
  return s?.user?.role === 'admin' ? s : null
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { name, discount, startsAt, endsAt, isActive, productIds } = await req.json()
  const sale = await prisma.flashSale.update({
    where: { id: params.id },
    data: {
      ...(name       !== undefined && { name }),
      ...(discount   !== undefined && { discount: Number(discount) }),
      ...(startsAt   !== undefined && { startsAt: new Date(startsAt) }),
      ...(endsAt     !== undefined && { endsAt: new Date(endsAt) }),
      ...(isActive   !== undefined && { isActive }),
      ...(productIds !== undefined && { productIds }),
    },
  })
  return NextResponse.json(sale)
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await prisma.flashSale.delete({ where: { id: params.id } })
  return NextResponse.json({ ok: true })
}