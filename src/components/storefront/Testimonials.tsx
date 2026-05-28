'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, ChevronLeft, ChevronRight } from 'lucide-react'

const REVIEWS = [
  {
    id: 1,
    name: 'Alexandra M.',
    location: 'New York, USA',
    rating: 5,
    quote: "eBuy has completely redefined my expectations for online shopping. The S22 arrived beautifully packaged, and the quality is simply extraordinary. I won't shop anywhere else.",
  },
  {
    id: 2,
    name: 'James K.',
    location: 'London, UK',
    rating: 5,
    quote: 'The Victus laptop I ordered exceeded every expectation. Shipping was faster than promised, and the packaging was immaculate. Customer service helped me choose the right model — genuinely impressive.',
  },
  {
    id: 3,
    name: 'Sophie L.',
    location: 'Paris, France',
    rating: 5,
    quote: 'I was hesitant to purchase a $2,700 speaker system online, but the white-glove delivery and setup made it effortless. The sound quality is breathtaking. eBuy has earned a customer for life.',
  },
]

export default function Testimonials() {
  const [idx, setIdx] = useState(0)
  const next = useCallback(() => setIdx((i) => (i + 1) % REVIEWS.length), [])
  const prev = () => setIdx((i) => (i - 1 + REVIEWS.length) % REVIEWS.length)

  useEffect(() => {
    const t = setInterval(next, 6000)
    return () => clearInterval(t)
  }, [next])

  const review = REVIEWS[idx]

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-ebuy-bg">
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-xs tracking-[0.3em] uppercase text-ebuy-gold mb-3">Reviews</p>
        <h2 className="font-serif text-4xl text-ebuy-text mb-12">What Our Clients Say</h2>

        <div className="relative min-h-[220px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
              className="bg-ebuy-surface border border-ebuy-border rounded p-8 sm:p-10"
            >
              <div className="flex justify-center gap-1 mb-6">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star key={i} size={16} className="text-ebuy-gold fill-ebuy-gold" />
                ))}
              </div>
              <blockquote className="font-serif text-xl sm:text-2xl text-ebuy-text leading-relaxed italic mb-6">
                "{review.quote}"
              </blockquote>
              <div>
                <p className="text-sm font-semibold text-ebuy-text">{review.name}</p>
                <p className="text-xs text-ebuy-muted">{review.location}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-center gap-4 mt-8">
          <button onClick={prev} aria-label="Previous review"
            className="p-2 border border-ebuy-border text-ebuy-muted hover:border-ebuy-gold hover:text-ebuy-gold rounded transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="flex gap-2">
            {REVIEWS.map((_, i) => (
              <button key={i} onClick={() => setIdx(i)} aria-label={`Go to review ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${i === idx ? 'w-8 bg-ebuy-gold' : 'w-2 bg-ebuy-border hover:bg-ebuy-muted'}`}
              />
            ))}
          </div>
          <button onClick={next} aria-label="Next review"
            className="p-2 border border-ebuy-border text-ebuy-muted hover:border-ebuy-gold hover:text-ebuy-gold rounded transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  )
}