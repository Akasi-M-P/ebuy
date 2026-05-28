import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

async function requireAdmin() {
  const s = await getServerSession(authOptions)
  return s?.user?.role === 'admin' ? s : null
}

export async function GET() {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const sales = await prisma.flashSale.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(sales)
}

export async function POST(req: Request) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { name, discount, startsAt, endsAt, productIds = [] } = await req.json()
  if (!name || !discount || !startsAt || !endsAt) {
    return NextResponse.json({ error: 'Name, discount, start and end time are required.' }, { status: 400 })
  }
  const sale = await prisma.flashSale.create({
    data: { name, discount: Number(discount), startsAt: new Date(startsAt), endsAt: new Date(endsAt), productIds, isActive: true },
  })
  return NextResponse.json(sale, { status: 201 })
}