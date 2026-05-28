'use client'

import { motion } from 'framer-motion'
import { RotateCcw, ShieldCheck, Lock, Headphones } from 'lucide-react'

const VALUES = [
  { icon: RotateCcw,   label: 'Free Returns',              desc: '30-day hassle-free returns' },
  { icon: ShieldCheck, label: 'Authenticity Guaranteed',   desc: '100% genuine products only' },
  { icon: Lock,        label: 'Secure Checkout',           desc: 'SSL encrypted & PCI compliant' },
  { icon: Headphones,  label: '24 / 7 Support',            desc: 'Dedicated premium support team' },
]

export default function BrandValueStrip() {
  return (
    <section className="border-y border-ebuy-border bg-ebuy-surface py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8">
        {VALUES.map((v, i) => (
          <motion.div
            key={v.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="flex flex-col items-center text-center gap-3"
          >
            <div className="w-11 h-11 rounded-full border border-ebuy-gold/40 flex items-center justify-center">
              <v.icon size={20} className="text-ebuy-gold" />
            </div>
            <div>
              <p className="text-sm font-semibold text-ebuy-text tracking-wide">{v.label}</p>
              <p className="text-xs text-ebuy-muted mt-0.5">{v.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}