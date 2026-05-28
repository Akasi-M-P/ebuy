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
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    include: { variants: true },
  })
  return NextResponse.json(products)
}

export async function POST(req: Request) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  const product = await prisma.product.create({
    data: {
      slug,
      name: body.name,
      brand: body.brand,
      category: body.category,
      categorySlug: body.category.toLowerCase().replace(/\s+/g, '-'),
      images: Array.isArray(body.images) ? body.images : [],
      price: parseFloat(body.price),
      compareAtPrice: body.compareAtPrice ? parseFloat(body.compareAtPrice) : null,
      description: body.description || '',
      shortDescription: body.shortDescription || '',
      details: [],
      careInstructions: [],
      shippingInfo: body.shippingInfo || 'Free shipping. Delivered within 3–5 business days.',
      box: [],
      tags: [],
      stock: parseInt(body.stock) || 0,
      sku: body.sku,
      status: body.status || 'active',
    },
  })
  return NextResponse.json(product, { status: 201 })
}