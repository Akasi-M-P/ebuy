'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { categories } from '@/lib/data'

export default function FeaturedCategories() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <p className="text-xs tracking-[0.3em] uppercase text-ebuy-gold mb-3">Collections</p>
        <h2 className="font-serif text-4xl sm:text-5xl text-ebuy-text">Shop by Category</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
          >
            <Link
              href={`/products?category=${cat.slug}`}
              className="group relative block overflow-hidden rounded aspect-[3/4] bg-ebuy-surface"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ebuy-bg/90 via-ebuy-bg/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-ebuy-muted text-xs tracking-widest uppercase mb-1">{cat.productCount} Products</p>
                <h3 className="font-serif text-2xl text-ebuy-text mb-3">{cat.name}</h3>
                <span className="inline-flex items-center gap-1 text-xs text-ebuy-gold tracking-widest uppercase opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  Explore
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}