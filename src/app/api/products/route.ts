import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const categorySlug = searchParams.get('category')
  const exclude     = searchParams.get('exclude')
  const limit       = searchParams.get('limit')
  const ids         = searchParams.get('ids')

  const products = await prisma.product.findMany({
    where: {
      status: 'active',
      ...(categorySlug && { categorySlug }),
      ...(exclude      && { id: { not: exclude } }),
      ...(ids          && { id: { in: ids.split(',') } }),
    },
    orderBy: { createdAt: 'desc' },
    include: { variants: true },
    ...(limit && { take: parseInt(limit) }),
  })
  return NextResponse.json(products)
}