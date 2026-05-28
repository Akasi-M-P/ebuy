import type { Metadata } from 'next'
import Hero from '@/components/storefront/Hero'
import FeaturedCategories from '@/components/storefront/FeaturedCategories'
import TrendingSection from '@/components/storefront/TrendingSection'
import BrandValueStrip from '@/components/storefront/BrandValueStrip'
import FeaturedProduct from '@/components/storefront/FeaturedProduct'
import Testimonials from '@/components/storefront/Testimonials'
import Newsletter from '@/components/storefront/Newsletter'
import { getSettings } from '@/lib/settings'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  const name = settings.store_name || 'eBuy'
  return {
    title: `${name} — Premium Electronics & Audio`,
    description: 'Discover premium smartphones, laptops, audio systems, and gaming gear. Curated for those who refuse to compromise.',
    openGraph: {
      title: `${name} — Premium Electronics & Audio`,
      description: 'Elevated technology, intentional design.',
    },
  }
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedCategories />
      <TrendingSection />
      <BrandValueStrip />
      <FeaturedProduct />
      <Testimonials />
      <Newsletter />
    </>
  )
}