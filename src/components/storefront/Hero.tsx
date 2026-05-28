'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/assets/heroimage1.jpg')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ebuy-bg/60 via-ebuy-bg/40 to-ebuy-bg/80" />

      <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-xs tracking-[0.3em] uppercase text-ebuy-gold mb-4"
        >
          Premium Electronics &amp; Audio
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-serif text-5xl sm:text-6xl lg:text-7xl text-ebuy-text leading-tight mb-6"
        >
          Elevate Every
          <br />
          <em className="not-italic gold-shimmer">Experience</em>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-ebuy-muted text-lg mb-10 max-w-xl mx-auto leading-relaxed"
        >
          Curated premium technology for those who refuse to compromise. Discover devices that redefine what's possible.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link href="/products" className="btn-gold px-10 py-4 text-sm tracking-widest uppercase">
            Shop Collection
          </Link>
          <Link href="/products?category=audio" className="btn-outline px-10 py-4 text-sm tracking-widest uppercase">
            Explore Audio
          </Link>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-ebuy-muted"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
      >
        <ChevronDown size={24} />
      </motion.div>
    </section>
  )
}