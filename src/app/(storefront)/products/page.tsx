import type { Metadata } from 'next'
import ProductsPageClient from '@/components/storefront/ProductsPageClient'

export const metadata: Metadata = {
  title: 'Shop All Products',
  description: 'Browse our full range of premium electronics, audio, and gaming gear.',
}

export default function ProductsPage() {
  return <ProductsPageClient />
}