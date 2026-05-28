'use client'

import Link from 'next/link'
import { X, Minus, Plus, Trash2, ShoppingBag, Tag, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { useCartStore } from '@/store/cartStore'
import { formatPrice } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

const FREE_SHIPPING_THRESHOLD = 150

export default function CartDrawer() {
  const {
    items, isOpen, closeCart,
    removeItem, updateQuantity,
    couponCode, couponType, couponValue, couponError,
    applyCoupon, removeCoupon,
    getSubtotal, getDiscount, getItemCount,
  } = useCartStore()

  const [couponInput, setCouponInput] = useState('')
  const [applying,    setApplying]    = useState(false)
  const subtotal   = getSubtotal()
  const discount   = getDiscount()
  const total      = subtotal - discount
  const toFreeShip = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal)
  const freeShipPct = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)

  const couponLabel =
    couponType === 'percentage' ? `${couponValue}% off` :
    couponType === 'fixed'      ? `$${couponValue} off` :
    couponType === 'free_shipping' ? 'Free shipping' : ''

  const handleApply = async () => {
    if (!couponInput.trim()) return
    setApplying(true)
    await applyCoupon(couponInput)
    setCouponInput('')
    setApplying(false)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={closeCart}
          />

          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3, ease: 'easeOut' }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-ebuy-surface flex flex-col shadow-luxury-lg"
            aria-label="Shopping cart"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-ebuy-border">
              <div className="flex items-center gap-2">
                <ShoppingBag size={18} className="text-ebuy-gold" />
                <h2 className="font-serif text-xl text-ebuy-text">Your Cart</h2>
                <span className="text-ebuy-muted text-sm">({getItemCount()})</span>
              </div>
              <button onClick={closeCart} aria-label="Close cart" className="p-1.5 text-ebuy-muted hover:text-ebuy-text transition-colors rounded">
                <X size={20} />
              </button>
            </div>

            {subtotal > 0 && (
              <div className="px-6 py-3 bg-ebuy-surface-2 border-b border-ebuy-border">
                {toFreeShip > 0 ? (
                  <p className="text-xs text-ebuy-muted mb-2">
                    Add <span className="text-ebuy-gold font-semibold">{formatPrice(toFreeShip)}</span> more for free shipping
                  </p>
                ) : (
                  <p className="text-xs text-ebuy-gold mb-2">✓ You qualify for free shipping!</p>
                )}
                <div className="h-1 bg-ebuy-surface-3 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-ebuy-gold rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${freeShipPct}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center gap-4 text-center">
                  <ShoppingBag size={48} className="text-ebuy-border" />
                  <p className="font-serif text-xl text-ebuy-muted">Your cart is empty</p>
                  <p className="text-sm text-ebuy-muted/60">Explore our collections and add something you love.</p>
                  <button onClick={closeCart} className="btn-gold mt-2 text-sm px-8">Continue Shopping</button>
                </div>
              ) : (
                <ul className="space-y-4">
                  {items.map((item) => (
                    <li key={`${item.productId}-${item.variantId ?? ''}`}
                      className="flex gap-4 py-4 border-b border-ebuy-border last:border-0"
                    >
                      <div className="w-20 h-20 bg-ebuy-surface-2 rounded overflow-hidden flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-ebuy-text font-medium truncate">{item.name}</p>
                        {(item.color || item.size) && (
                          <p className="text-xs text-ebuy-muted mt-0.5">
                            {[item.color, item.size].filter(Boolean).join(' · ')}
                          </p>
                        )}
                        <p className="text-sm text-ebuy-gold font-semibold mt-1">{formatPrice(item.price)}</p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2 border border-ebuy-border rounded">
                            <button
                              aria-label="Decrease quantity"
                              onClick={() => updateQuantity(item.productId, item.quantity - 1, item.variantId)}
                              className="p-1.5 text-ebuy-muted hover:text-ebuy-text transition-colors"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="w-6 text-center text-sm text-ebuy-text tabular-nums">{item.quantity}</span>
                            <button
                              aria-label="Increase quantity"
                              onClick={() => updateQuantity(item.productId, item.quantity + 1, item.variantId)}
                              className="p-1.5 text-ebuy-muted hover:text-ebuy-text transition-colors"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                          <button
                            aria-label="Remove item"
                            onClick={() => removeItem(item.productId, item.variantId)}
                            className="p-1.5 text-ebuy-muted hover:text-ebuy-error transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm font-semibold text-ebuy-text tabular-nums flex-shrink-0">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className="px-6 py-5 border-t border-ebuy-border space-y-4">
                {couponCode ? (
                  <div className="flex items-center justify-between bg-ebuy-surface-2 rounded px-3 py-2">
                    <div className="flex items-center gap-2 text-ebuy-gold text-sm">
                      <Tag size={14} />
                      <span className="font-semibold">{couponCode}</span>
                      {couponLabel && <span className="text-ebuy-muted">({couponLabel})</span>}
                    </div>
                    <button onClick={removeCoupon} className="text-ebuy-muted hover:text-ebuy-error text-xs underline">Remove</button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleApply()}
                      placeholder="Promo code"
                      className="input-dark flex-1 py-2 text-sm"
                      disabled={applying}
                    />
                    <button
                      onClick={handleApply}
                      disabled={applying}
                      className="px-4 py-2 border border-ebuy-gold text-ebuy-gold text-sm rounded hover:bg-ebuy-gold hover:text-ebuy-bg transition-all disabled:opacity-50 flex items-center gap-1.5"
                    >
                      {applying ? <Loader2 size={14} className="animate-spin" /> : 'Apply'}
                    </button>
                  </div>
                )}
                {couponError && <p className="text-ebuy-error text-xs">{couponError}</p>}

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-ebuy-muted">
                    <span>Subtotal</span>
                    <span className="tabular-nums">{formatPrice(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-ebuy-success">
                      <span>Discount</span>
                      <span className="tabular-nums">−{formatPrice(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-ebuy-muted">
                    <span>Shipping</span>
                    <span>{subtotal >= FREE_SHIPPING_THRESHOLD ? 'Free' : 'Calculated at checkout'}</span>
                  </div>
                  <div className="flex justify-between text-ebuy-text font-semibold text-base pt-2 border-t border-ebuy-border">
                    <span>Total</span>
                    <span className="tabular-nums">{formatPrice(total)}</span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="flex items-center justify-center gap-2 btn-gold w-full text-sm"
                >
                  Proceed to Checkout
                  <ChevronRight size={16} />
                </Link>
                <button
                  onClick={closeCart}
                  className="w-full text-center text-sm text-ebuy-muted hover:text-ebuy-text transition-colors py-1"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}