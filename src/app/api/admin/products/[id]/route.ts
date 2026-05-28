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
  const product = await prisma.product.update({
    where: { id: params.id },
    data: {
      ...(body.name        !== undefined && { name: body.name }),
      ...(body.brand       !== undefined && { brand: body.brand }),
      ...(body.category    !== undefined && { category: body.category, categorySlug: body.category.toLowerCase().replace(/\s+/g, '-') }),
      ...(body.price       !== undefined && { price: parseFloat(body.price) }),
      ...(body.compareAtPrice !== undefined && { compareAtPrice: body.compareAtPrice ? parseFloat(body.compareAtPrice) : null }),
      ...(body.stock       !== undefined && { stock: parseInt(body.stock) }),
      ...(body.sku         !== undefined && { sku: body.sku }),
      ...(body.status      !== undefined && { status: body.status }),
      ...(body.shortDescription !== undefined && { shortDescription: body.shortDescription }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.shippingInfo !== undefined && { shippingInfo: body.shippingInfo }),
      ...(body.images !== undefined && { images: body.images }),
    },
  })
  return NextResponse.json(product)
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await prisma.product.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}