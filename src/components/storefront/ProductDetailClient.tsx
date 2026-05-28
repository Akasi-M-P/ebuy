'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ShoppingBag, Heart, Star, Minus, Plus, ChevronRight, ZoomIn, Truck, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCartStore } from '@/store/cartStore'
import { useUIStore } from '@/store/uiStore'
import { formatPrice, formatDate, cn } from '@/lib/utils'
import ProductCard from '@/components/storefront/ProductCard'
import type { Product, ProductVariant } from '@/lib/types'

interface Props { slug: string }

export default function ProductDetailClient({ slug }: Props) {
  const router = useRouter()
  const [product,        setProduct]        = useState<Product | null>(null)
  const [loading,        setLoading]        = useState(true)
  const [notFound,       setNotFound]       = useState(false)
  const [related,        setRelated]        = useState<Product[]>([])
  const [recentProds,    setRecentProds]    = useState<Product[]>([])
  const [activeImg,      setActiveImg]      = useState(0)
  const [selectedVariant, setVariant]       = useState<ProductVariant | undefined>(undefined)
  const [quantity,       setQuantity]       = useState(1)
  const [openAccordion,  setAccordion]      = useState<string | null>('details')
  const [addedFeedback,  setAddedFeedback]  = useState(false)

  const { addItem, openCart } = useCartStore()
  const { toggleWishlist, isWishlisted, addRecentlyViewed, recentlyViewed } = useUIStore()

  useEffect(() => {
    setLoading(true)
    setNotFound(false)
    setActiveImg(0)
    fetch(`/api/products/${slug}`)
      .then((r) => {
        if (!r.ok) { setNotFound(true); setLoading(false); return null }
        return r.json()
      })
      .then((data: Product | null) => {
        if (!data) return
        setProduct(data)
        setVariant(data.variants?.[0])
        setLoading(false)
        addRecentlyViewed(data.id)
      })
      .catch(() => { setNotFound(true); setLoading(false) })
  }, [slug])

  useEffect(() => {
    if (!product) return
    const params = new URLSearchParams({ category: product.categorySlug, exclude: product.id, limit: '4' })
    fetch(`/api/products?${params}`).then((r) => r.json()).then(setRelated).catch(() => {})
  }, [product?.id])

  useEffect(() => {
    if (!product) return
    const ids = recentlyViewed.filter((id) => id !== product.id).slice(0, 4)
    if (!ids.length) { setRecentProds([]); return }
    fetch(`/api/products?ids=${ids.join(',')}`).then((r) => r.json()).then(setRecentProds).catch(() => {})
  }, [product?.id, recentlyViewed])

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-ebuy-gold" />
      </div>
    )
  }

  if (notFound || !product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <h1 className="font-serif text-3xl text-ebuy-muted">Product not found</h1>
        <button onClick={() => router.push('/products')} className="btn-gold">Back to Shop</button>
      </div>
    )
  }

  const wishlisted   = isWishlisted(product.id)
  const currentPrice = selectedVariant?.price ?? product.price
  const maxQty       = selectedVariant?.stock ?? product.stock
  const lowStock     = maxQty < 5 && maxQty > 0

  const handleAdd = () => {
    addItem({
      productId: product.id,
      variantId: selectedVariant?.id,
      name: product.name,
      image: product.images[0] ?? '',
      price: currentPrice,
      quantity,
      color: selectedVariant?.color,
      size: selectedVariant?.size,
      sku: selectedVariant?.sku ?? product.sku,
    })
    setAddedFeedback(true)
    openCart()
    setTimeout(() => setAddedFeedback(false), 2500)
  }

  const accordions = [
    ...(product.details?.length ? [{
      id: 'details',
      label: 'Product Details',
      content: (
        <ul className="space-y-2 text-sm text-ebuy-muted">
          {product.details!.map((d) => (
            <li key={d} className="flex gap-2"><ChevronRight size={14} className="text-ebuy-gold flex-shrink-0 mt-0.5" />{d}</li>
          ))}
        </ul>
      ),
    }] : []),
    {
      id: 'shipping',
      label: 'Shipping & Returns',
      content: <p className="text-sm text-ebuy-muted leading-relaxed">{product.shippingInfo} Free returns within 30 days.</p>,
    },
    ...(product.careInstructions?.length ? [{
      id: 'care',
      label: 'Care Instructions',
      content: (
        <ul className="space-y-2 text-sm text-ebuy-muted">
          {product.careInstructions!.map((c) => (
            <li key={c} className="flex gap-2"><ChevronRight size={14} className="text-ebuy-gold flex-shrink-0 mt-0.5" />{c}</li>
          ))}
        </ul>
      ),
    }] : []),
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <nav className="flex items-center gap-2 text-xs text-ebuy-muted mb-8" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-ebuy-gold transition-colors">Home</Link>
        <ChevronRight size={12} />
        <Link href="/products" className="hover:text-ebuy-gold transition-colors">Shop</Link>
        <ChevronRight size={12} />
        <Link href={`/products?category=${product.categorySlug}`} className="hover:text-ebuy-gold transition-colors capitalize">
          {product.category}
        </Link>
        <ChevronRight size={12} />
        <span className="text-ebuy-text truncate max-w-[150px]">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mb-16">
        {/* Image gallery */}
        <div>
          <div className="relative aspect-square rounded overflow-hidden bg-ebuy-surface mb-3 group">
            {product.images.length > 0 ? (
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImg}
                  src={product.images[activeImg]}
                  alt={`${product.name} image ${activeImg + 1}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-ebuy-muted text-sm">No image</div>
            )}
            {product.images.length > 0 && (
              <>
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="bg-ebuy-bg/80 text-ebuy-muted text-xs px-2 py-1 rounded flex items-center gap-1">
                    <ZoomIn size={12} /> Zoom
                  </span>
                </div>
                <span className="absolute bottom-3 right-3 text-xs text-ebuy-muted bg-ebuy-bg/70 px-2 py-1 rounded">
                  {activeImg + 1} / {product.images.length}
                </span>
              </>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={cn(
                    'w-16 h-16 rounded overflow-hidden border-2 transition-colors flex-shrink-0',
                    i === activeImg ? 'border-ebuy-gold' : 'border-ebuy-border hover:border-ebuy-muted'
                  )}
                >
                  <img src={img} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product details */}
        <div className="flex flex-col">
          <p className="text-xs tracking-widest uppercase text-ebuy-muted mb-2">{product.brand} · {product.category}</p>
          <h1 className="font-serif text-3xl sm:text-4xl text-ebuy-text leading-tight mb-3">{product.name}</h1>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={14}
                  className={i < Math.round(product.rating) ? 'text-ebuy-gold fill-ebuy-gold' : 'text-ebuy-border'}
                  fill={i < Math.round(product.rating) ? 'currentColor' : 'none'}
                />
              ))}
            </div>
            <span className="text-sm text-ebuy-muted">{product.rating} · {product.reviewCount} reviews</span>
          </div>

          <div className="flex items-baseline gap-3 mb-5">
            <span className="font-serif text-3xl text-ebuy-text tabular-nums">{formatPrice(currentPrice)}</span>
            {product.compareAtPrice && (
              <span className="text-lg text-ebuy-muted line-through tabular-nums">{formatPrice(product.compareAtPrice)}</span>
            )}
          </div>

          <p className="text-ebuy-muted leading-relaxed mb-6 text-[15px]">{product.shortDescription}</p>

          {product.variants && product.variants.length > 0 && (
            <div className="mb-6">
              <p className="text-xs font-semibold tracking-widest uppercase text-ebuy-text mb-3">
                {product.variants[0].color ? 'Color' : 'Option'}:
                <span className="text-ebuy-gold ml-2 font-normal normal-case tracking-normal">
                  {selectedVariant?.color ?? selectedVariant?.size}
                </span>
              </p>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v) => {
                  const outOfStock = v.stock === 0
                  return v.colorHex ? (
                    <button
                      key={v.id}
                      title={v.color}
                      onClick={() => !outOfStock && setVariant(v)}
                      className={cn(
                        'w-8 h-8 rounded-full border-2 transition-all',
                        selectedVariant?.id === v.id ? 'border-ebuy-gold scale-110' : 'border-transparent hover:border-ebuy-muted',
                        outOfStock && 'opacity-30 cursor-not-allowed'
                      )}
                      style={{ backgroundColor: v.colorHex }}
                    />
                  ) : (
                    <button
                      key={v.id}
                      onClick={() => !outOfStock && setVariant(v)}
                      className={cn(
                        'px-3 py-1.5 border rounded text-sm transition-all',
                        selectedVariant?.id === v.id
                          ? 'border-ebuy-gold text-ebuy-gold bg-ebuy-gold/10'
                          : 'border-ebuy-border text-ebuy-muted hover:border-ebuy-muted',
                        outOfStock && 'opacity-30 cursor-not-allowed line-through'
                      )}
                    >
                      {v.size ?? v.color}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {lowStock && (
            <p className="text-sm text-ebuy-error mb-4">⚠ Only {maxQty} left in stock — order soon.</p>
          )}

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center border border-ebuy-border rounded">
              <button
                aria-label="Decrease"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-3 py-2 text-ebuy-muted hover:text-ebuy-text transition-colors"
              >
                <Minus size={14} />
              </button>
              <span className="w-10 text-center text-sm tabular-nums text-ebuy-text">{quantity}</span>
              <button
                aria-label="Increase"
                onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
                className="px-3 py-2 text-ebuy-muted hover:text-ebuy-text transition-colors"
                disabled={quantity >= maxQty}
              >
                <Plus size={14} />
              </button>
            </div>
            <span className="text-xs text-ebuy-muted">{maxQty} in stock</span>
          </div>

          <div className="flex flex-col gap-3 mb-6">
            <button
              onClick={handleAdd}
              disabled={maxQty === 0}
              className={cn(
                'btn-gold w-full flex items-center justify-center gap-2 text-sm tracking-widest uppercase',
                addedFeedback && 'bg-ebuy-success hover:bg-ebuy-success text-white',
                maxQty === 0 && 'opacity-40 cursor-not-allowed'
              )}
            >
              <ShoppingBag size={16} />
              {maxQty === 0 ? 'Out of Stock' : addedFeedback ? '✓ Added to Cart' : 'Add to Cart'}
            </button>
            <button
              onClick={() => toggleWishlist(product.id)}
              className={cn(
                'btn-outline w-full flex items-center justify-center gap-2 text-sm',
                wishlisted && 'border-ebuy-gold text-ebuy-gold'
              )}
            >
              <Heart size={16} fill={wishlisted ? 'currentColor' : 'none'} />
              {wishlisted ? 'Saved to Wishlist' : 'Add to Wishlist'}
            </button>
          </div>

          <div className="flex items-center gap-2 text-sm text-ebuy-muted py-3 border-t border-ebuy-border">
            <Truck size={15} className="text-ebuy-gold" />
            <span>{product.shippingInfo}</span>
          </div>

          <div className="mt-4 space-y-0 border-t border-ebuy-border">
            {accordions.map((acc) => (
              <div key={acc.id} className="border-b border-ebuy-border">
                <button
                  onClick={() => setAccordion(openAccordion === acc.id ? null : acc.id)}
                  className="w-full flex items-center justify-between py-4 text-sm font-medium text-ebuy-text hover:text-ebuy-gold transition-colors text-left"
                >
                  {acc.label}
                  <ChevronRight size={16} className={cn('text-ebuy-muted transition-transform', openAccordion === acc.id && 'rotate-90')} />
                </button>
                <AnimatePresence>
                  {openAccordion === acc.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="pb-5">{acc.content}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>

      {(product.reviews?.length ?? 0) > 0 && (
        <section className="mb-16 border-t border-ebuy-border pt-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-serif text-3xl text-ebuy-text">Customer Reviews</h2>
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14}
                    className={i < Math.round(product.rating) ? 'text-ebuy-gold fill-ebuy-gold' : 'text-ebuy-border'}
                    fill={i < Math.round(product.rating) ? 'currentColor' : 'none'}
                  />
                ))}
              </div>
              <span className="text-sm text-ebuy-muted font-semibold">{product.rating} out of 5</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {product.reviews?.map((r) => (
              <div key={r.id} className="bg-ebuy-surface border border-ebuy-border rounded p-6">
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={13}
                      className={i < r.rating ? 'text-ebuy-gold fill-ebuy-gold' : 'text-ebuy-border'}
                      fill={i < r.rating ? 'currentColor' : 'none'}
                    />
                  ))}
                </div>
                <p className="font-semibold text-sm text-ebuy-text mb-1">{r.title}</p>
                <p className="text-sm text-ebuy-muted leading-relaxed mb-4">{r.body}</p>
                <div className="flex items-center justify-between text-xs text-ebuy-muted">
                  <div>
                    <span className="font-medium text-ebuy-text">{r.author}</span>
                    {r.location && <><span className="mx-1">·</span>{r.location}</>}
                  </div>
                  <div className="flex items-center gap-2">
                    {r.verified && <span className="text-ebuy-gold">✓ Verified</span>}
                    <span>{formatDate(r.date)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="mb-16 border-t border-ebuy-border pt-12">
          <h2 className="font-serif text-3xl text-ebuy-text mb-8">You May Also Like</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      {recentProds.length > 0 && (
        <section className="border-t border-ebuy-border pt-12">
          <h2 className="font-serif text-3xl text-ebuy-text mb-8">Recently Viewed</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {recentProds.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  )
}