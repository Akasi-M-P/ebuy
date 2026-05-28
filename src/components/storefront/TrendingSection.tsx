'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import ProductCard from './ProductCard'
import type { Product } from '@/lib/types'

export default function TrendingSection() {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    fetch('/api/products?limit=4')
      .then((r) => r.json())
      .then(setProducts)
      .catch(() => {})
  }, [])

  if (!products.length) return null

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="text-xs tracking-[0.3em] uppercase text-ebuy-gold mb-3">Curated Picks</p>
          <h2 className="font-serif text-4xl sm:text-5xl text-ebuy-text">New Arrivals</h2>
        </div>
        <Link
          href="/products"
          className="text-sm text-ebuy-muted hover:text-ebuy-gold transition-colors tracking-wide border-b border-ebuy-muted/30 hover:border-ebuy-gold pb-0.5"
        >
          View All
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {products.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>
    </section>
  )
}