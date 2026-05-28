'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send } from 'lucide-react'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setSubmitted(true)
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-ebuy-border bg-ebuy-surface">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-xl mx-auto text-center"
      >
        <p className="text-xs tracking-[0.3em] uppercase text-ebuy-gold mb-3">Stay Connected</p>
        <h2 className="font-serif text-4xl text-ebuy-text mb-3">Join Our Circle</h2>
        <p className="text-ebuy-muted mb-8 leading-relaxed">
          Be first to know — exclusive access to new arrivals, private sales, and curated edits delivered to your inbox.
        </p>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-4 text-ebuy-gold font-serif text-xl"
          >
            ✓ Welcome to the circle.
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2 max-w-md mx-auto">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="input-dark flex-1"
            />
            <button type="submit" className="btn-gold px-5 py-3 flex items-center gap-2 text-sm">
              <Send size={15} />
              <span className="hidden sm:inline">Subscribe</span>
            </button>
          </form>
        )}

        <p className="text-xs text-ebuy-muted/50 mt-4">No spam. Unsubscribe anytime.</p>
      </motion.div>
    </section>
  )
}