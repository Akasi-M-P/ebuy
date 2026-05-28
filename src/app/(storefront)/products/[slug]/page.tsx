import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import ProductDetailClient from '@/components/storefront/ProductDetailClient'

interface Props { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    select: { name: true, shortDescription: true, images: true },
  })
  if (!product) return { title: 'Product Not Found' }
  return {
    title: product.name,
    description: product.shortDescription,
    openGraph: {
      title: `${product.name} — eBuy`,
      description: product.shortDescription,
      ...(product.images[0] && { images: [{ url: product.images[0] }] }),
    },
  }
}

export default function ProductDetailPage({ params }: Props) {
  return <ProductDetailClient slug={params.slug} />
}