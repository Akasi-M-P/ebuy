import { MetadataRoute } from 'next'
import { products } from '@/lib/data'

export default function sitemap(): MetadataRoute.Sitemap {
  const productUrls = products.map((p) => ({
    url: `https://ebuy.com/products/${p.slug}`,
    lastModified: new Date(p.createdAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [
    { url: 'https://ebuy.com', lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: 'https://ebuy.com/products', lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    ...productUrls,
  ]
}