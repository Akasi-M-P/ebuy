'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ShoppingBag, Star } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { formatPrice } from '@/lib/utils'
import type { Product } from '@/lib/types'

export default function FeaturedProduct() {
  const [featured, setFeatured] = useState<Product | null>(null)
  const { addItem, openCart } = useCartStore()

  useEffect(() => {
    fetch('/api/products?limit=8')
      .then((r) => r.json())
      .then((products: Product[]) => {
        setFeatured(products.find((p) => p.isFeatured) ?? products[0] ?? null)
      })
      .catch(() => {})
  }, [])

  if (!featured) return null

  const handleAdd = () => {
    addItem({
      productId: featured.id,
      variantId: featured.variants?.[0]?.id,
      name: featured.name,
      image: featured.images[0] ?? '',
      price: featured.price,
      quantity: 1,
      sku: featured.variants?.[0]?.sku ?? featured.sku,
    })
    openCart()
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-ebuy-surface border-y border-ebuy-border">
      <div className="max-w-7xl mx-auto">
        <p className="text-xs tracking-[0.3em] uppercase text-ebuy-gold text-center mb-12">Editorial Spotlight</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative aspect-square rounded overflow-hidden bg-ebuy-surface-2"
          >
            {featured.images[0] && (
              <img src={featured.images[0]} alt={featured.name} className="w-full h-full object-cover" />
            )}
            {featured.isNew && <span className="absolute top-4 left-4 badge-new">New Arrival</span>}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="flex flex-col justify-center"
          >
            <p className="text-xs tracking-widest uppercase text-ebuy-muted mb-2">{featured.brand}</p>
            <h2 className="font-serif text-4xl lg:text-5xl text-ebuy-text leading-tight mb-4">{featured.name}</h2>

            <div className="flex items-center gap-2 mb-6">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14}
                    className={i < Math.round(featured.rating) ? 'text-ebuy-gold fill-ebuy-gold' : 'text-ebuy-border'}
                    fill={i < Math.round(featured.rating) ? 'currentColor' : 'none'}
                  />
                ))}
              </div>
              <span className="text-sm text-ebuy-muted">{featured.rating} ({featured.reviewCount} reviews)</span>
            </div>

            <p className="text-ebuy-muted leading-relaxed mb-8 text-base">{featured.shortDescription}</p>

            <div className="flex items-baseline gap-3 mb-8">
              <span className="font-serif text-3xl text-ebuy-text tabular-nums">{formatPrice(featured.price)}</span>
              {featured.compareAtPrice && (
                <span className="text-lg text-ebuy-muted line-through tabular-nums">{formatPrice(featured.compareAtPrice)}</span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAdd}
                className="btn-gold flex items-center justify-center gap-2 text-sm tracking-widest uppercase flex-1"
              >
                <ShoppingBag size={16} />
                Add to Cart
              </button>
              <Link
                href={`/products/${featured.slug}`}
                className="btn-outline flex items-center justify-center text-sm tracking-widest uppercase flex-1"
              >
                View Details
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}