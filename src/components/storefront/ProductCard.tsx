'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Heart, ShoppingBag, Star } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCartStore } from '@/store/cartStore'
import { useUIStore } from '@/store/uiStore'
import { formatPrice, getDiscountPercent, cn } from '@/lib/utils'
import type { Product } from '@/lib/types'

interface Props { product: Product }

export default function ProductCard({ product }: Props) {
  const [hovered, setHovered] = useState(false)
  const [addedFeedback, setAddedFeedback] = useState(false)

  const { addItem, openCart } = useCartStore()
  const { toggleWishlist, isWishlisted } = useUIStore()
  const wishlisted = isWishlisted(product.id)

  const discount = product.compareAtPrice
    ? getDiscountPercent(product.price, product.compareAtPrice)
    : 0

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem({
      productId: product.id,
      variantId: product.variants?.[0]?.id,
      name: product.name,
      image: product.images[0],
      price: product.price,
      quantity: 1,
      color: product.variants?.[0]?.color,
      sku: product.variants?.[0]?.sku ?? product.sku,
    })
    setAddedFeedback(true)
    openCart()
    setTimeout(() => setAddedFeedback(false), 2000)
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleWishlist(product.id)
  }

  return (
    <Link
      href={`/products/${product.slug}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group block relative"
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded bg-ebuy-surface">
        <img
          src={product.images[0]}
          alt={product.name}
          className={cn(
            'absolute inset-0 w-full h-full object-cover transition-all duration-500',
            hovered && product.images[1] ? 'opacity-0' : 'opacity-100',
            hovered ? 'scale-[1.03]' : 'scale-100'
          )}
        />
        {product.images[1] && (
          <img
            src={product.images[1]}
            alt={`${product.name} alternate`}
            className={cn(
              'absolute inset-0 w-full h-full object-cover transition-all duration-500',
              hovered ? 'opacity-100 scale-[1.03]' : 'opacity-0 scale-100'
            )}
          />
        )}

        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isNew && <span className="badge-new">New</span>}
          {discount > 0 && <span className="badge-sale">−{discount}%</span>}
        </div>

        <button
          onClick={handleWishlist}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className={cn(
            'absolute top-3 right-3 z-10 p-2 rounded-full transition-all duration-200',
            wishlisted
              ? 'bg-ebuy-gold text-ebuy-bg'
              : 'bg-ebuy-bg/70 text-ebuy-muted hover:bg-ebuy-gold hover:text-ebuy-bg'
          )}
        >
          <Heart size={14} fill={wishlisted ? 'currentColor' : 'none'} />
        </button>

        <AnimatePresence>
          {hovered && (
            <motion.button
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              onClick={handleQuickAdd}
              className={cn(
                'absolute bottom-0 left-0 right-0 py-3 text-xs tracking-widest uppercase font-semibold transition-colors z-10',
                addedFeedback
                  ? 'bg-ebuy-success text-white'
                  : 'bg-ebuy-gold text-ebuy-bg hover:bg-ebuy-gold-light'
              )}
            >
              {addedFeedback ? '✓ Added to Cart' : (
                <span className="flex items-center justify-center gap-2">
                  <ShoppingBag size={13} />
                  Quick Add
                </span>
              )}
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-4 px-0.5">
        <p className="text-[11px] tracking-widest uppercase text-ebuy-muted mb-1">{product.brand}</p>
        <h3 className="font-serif text-[15px] text-ebuy-text group-hover:text-ebuy-gold transition-colors leading-snug mb-2">
          {product.name}
        </h3>
        <div className="flex items-center gap-1.5 mb-2">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={10}
                className={i < Math.round(product.rating) ? 'text-ebuy-gold fill-ebuy-gold' : 'text-ebuy-border'}
                fill={i < Math.round(product.rating) ? 'currentColor' : 'none'}
              />
            ))}
          </div>
          <span className="text-[11px] text-ebuy-muted">({product.reviewCount})</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-base font-semibold tabular-nums text-ebuy-text">{formatPrice(product.price)}</span>
          {product.compareAtPrice && (
            <span className="text-sm tabular-nums text-ebuy-muted line-through">{formatPrice(product.compareAtPrice)}</span>
          )}
        </div>
      </div>
    </Link>
  )
}