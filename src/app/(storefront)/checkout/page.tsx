'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Check, ChevronRight, Truck, CreditCard, ShieldCheck } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCartStore } from '@/store/cartStore'
import { formatPrice } from '@/lib/utils'
import { useSettings } from '@/components/providers'

type Step = 'shipping' | 'payment' | 'confirmation'

const SHIPPING_METHODS = [
  { id: 'standard', name: 'Standard Delivery', desc: '5–7 business days', price: 0 },
  { id: 'express',  name: 'Express Delivery',  desc: '2–3 business days', price: 12.99 },
  { id: 'next-day', name: 'Next-Day Delivery', desc: 'Order by 2pm today',  price: 24.99 },
]

const STEPS: { id: Step; label: string }[] = [
  { id: 'shipping',     label: 'Shipping' },
  { id: 'payment',      label: 'Payment' },
  { id: 'confirmation', label: 'Confirmation' },
]

export default function CheckoutPage() {
  const { items, getSubtotal, getDiscount, couponCode, clearCart } = useCartStore()
  const { storeName } = useSettings()
  const subtotal = getSubtotal()
  const discount = getDiscount()

  const [step, setStep]               = useState<Step>('shipping')
  const [shippingMethod, setShipping] = useState('standard')
  const [orderNumber,    setOrderNumber] = useState('')
  const [placing,        setPlacing]    = useState(false)
  const [placeError,     setPlaceError] = useState('')

  const shipping = SHIPPING_METHODS.find((m) => m.id === shippingMethod)?.price ?? 0
  const tax      = (subtotal - discount + shipping) * 0.08
  const total    = subtotal - discount + shipping + tax
  const stepIdx  = STEPS.findIndex((s) => s.id === step)

  const handlePlaceOrder = async () => {
    setPlacing(true)
    setPlaceError('')
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          shippingMethod,
          items,
          subtotal,
          discount,
          shipping,
          tax,
          total,
          couponCode,
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        setPlaceError(data.error ?? 'Failed to place order. Please try again.')
        return
      }
      const order = await res.json()
      setOrderNumber(`#${order.orderNumber}`)
      setStep('confirmation')
      clearCart()
    } catch {
      setPlaceError('Something went wrong. Please try again.')
    } finally {
      setPlacing(false)
    }
  }

  const [form, setForm] = useState({
    email: '', firstName: '', lastName: '',
    address1: '', address2: '', city: '', state: '', zip: '', country: 'United States',
    cardNumber: '', expiry: '', cvc: '', nameOnCard: '',
  })
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [k]: e.target.value }))

  if (items.length === 0 && step !== 'confirmation') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4">
        <h1 className="font-serif text-3xl text-ebuy-muted">Your cart is empty</h1>
        <Link href="/products" className="btn-gold">Start Shopping</Link>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <Link href="/" className="font-serif text-2xl tracking-[0.12em] text-ebuy-text hover:text-ebuy-gold transition-colors">
          {storeName}
        </Link>
      </div>

      <div className="flex items-center justify-center gap-0 mb-12">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                i <= stepIdx ? 'bg-ebuy-gold text-ebuy-bg' : 'bg-ebuy-surface-2 text-ebuy-muted border border-ebuy-border'
              }`}>
                {i < stepIdx ? <Check size={14} /> : i + 1}
              </div>
              <span className={`text-xs ${i === stepIdx ? 'text-ebuy-gold' : 'text-ebuy-muted'}`}>{s.label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`w-16 sm:w-24 h-px mx-2 mb-5 transition-colors ${i < stepIdx ? 'bg-ebuy-gold' : 'bg-ebuy-border'}`} />
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {step === 'shipping' && (
              <motion.div key="shipping" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="font-serif text-2xl text-ebuy-text mb-6">Contact & Shipping</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold tracking-widest uppercase text-ebuy-muted mb-2">Email</label>
                    <input type="email" value={form.email} onChange={set('email')} className="input-dark" placeholder="you@example.com" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold tracking-widest uppercase text-ebuy-muted mb-2">First Name</label>
                      <input value={form.firstName} onChange={set('firstName')} className="input-dark" required />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold tracking-widest uppercase text-ebuy-muted mb-2">Last Name</label>
                      <input value={form.lastName} onChange={set('lastName')} className="input-dark" required />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold tracking-widest uppercase text-ebuy-muted mb-2">Address</label>
                    <input value={form.address1} onChange={set('address1')} className="input-dark mb-2" placeholder="Street address" required />
                    <input value={form.address2} onChange={set('address2')} className="input-dark" placeholder="Apartment, suite (optional)" />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold tracking-widest uppercase text-ebuy-muted mb-2">City</label>
                      <input value={form.city} onChange={set('city')} className="input-dark" required />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold tracking-widest uppercase text-ebuy-muted mb-2">State</label>
                      <input value={form.state} onChange={set('state')} className="input-dark" required />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold tracking-widest uppercase text-ebuy-muted mb-2">ZIP</label>
                      <input value={form.zip} onChange={set('zip')} className="input-dark" required />
                    </div>
                  </div>
                  <div className="pt-4">
                    <p className="text-xs font-semibold tracking-widest uppercase text-ebuy-text mb-4">Shipping Method</p>
                    <div className="space-y-3">
                      {SHIPPING_METHODS.map((m) => (
                        <label key={m.id} className={`flex items-center justify-between p-4 border rounded cursor-pointer transition-colors ${
                          shippingMethod === m.id ? 'border-ebuy-gold bg-ebuy-gold/5' : 'border-ebuy-border hover:border-ebuy-muted'
                        }`}>
                          <div className="flex items-center gap-3">
                            <input type="radio" name="shipping" value={m.id} checked={shippingMethod === m.id} onChange={() => setShipping(m.id)} className="accent-ebuy-gold" />
                            <div>
                              <p className="text-sm font-medium text-ebuy-text">{m.name}</p>
                              <p className="text-xs text-ebuy-muted">{m.desc}</p>
                            </div>
                          </div>
                          <span className="text-sm font-semibold text-ebuy-text">{m.price === 0 ? 'Free' : formatPrice(m.price)}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <button onClick={() => setStep('payment')} className="btn-gold w-full mt-4 flex items-center justify-center gap-2 text-sm tracking-widest uppercase">
                    Continue to Payment <ChevronRight size={16} />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 'payment' && (
              <motion.div key="payment" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="font-serif text-2xl text-ebuy-text mb-6">Payment</h2>
                <div className="space-y-4">
                  <div className="p-4 bg-ebuy-surface-2 border border-ebuy-border rounded flex items-center gap-3">
                    <ShieldCheck size={16} className="text-ebuy-gold flex-shrink-0" />
                    <p className="text-xs text-ebuy-muted">All transactions are secured and encrypted. Your card details are never stored.</p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold tracking-widest uppercase text-ebuy-muted mb-2">Name on Card</label>
                    <input value={form.nameOnCard} onChange={set('nameOnCard')} className="input-dark" placeholder="As it appears on card" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold tracking-widest uppercase text-ebuy-muted mb-2">Card Number</label>
                    <div className="relative">
                      <input value={form.cardNumber} onChange={set('cardNumber')} className="input-dark pr-10" placeholder="0000 0000 0000 0000" maxLength={19} />
                      <CreditCard size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-ebuy-muted" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold tracking-widest uppercase text-ebuy-muted mb-2">Expiry Date</label>
                      <input value={form.expiry} onChange={set('expiry')} className="input-dark" placeholder="MM / YY" maxLength={7} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold tracking-widest uppercase text-ebuy-muted mb-2">CVC</label>
                      <input value={form.cvc} onChange={set('cvc')} className="input-dark" placeholder="•••" maxLength={4} />
                    </div>
                  </div>
                  <div className="p-4 border border-dashed border-ebuy-border rounded text-xs text-ebuy-muted text-center">
                    Stripe integration point — add <code>@stripe/react-stripe-js</code> for real payments.
                  </div>
                  {placeError && (
                    <div className="px-4 py-3 bg-ebuy-error/10 border border-ebuy-error/30 rounded text-sm text-ebuy-error">
                      {placeError}
                    </div>
                  )}
                  <div className="flex gap-3">
                    <button onClick={() => setStep('shipping')} className="btn-outline flex-1 text-sm">← Back</button>
                    <button
                      onClick={handlePlaceOrder}
                      disabled={placing}
                      className="btn-gold flex-1 flex items-center justify-center gap-2 text-sm tracking-widest uppercase disabled:opacity-60"
                    >
                      {placing ? 'Placing Order…' : <> Place Order <ChevronRight size={16} /></>}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 'confirmation' && (
              <motion.div key="confirmation" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10">
                <div className="w-16 h-16 bg-ebuy-gold rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check size={28} className="text-ebuy-bg" />
                </div>
                <h2 className="font-serif text-3xl text-ebuy-text mb-3">Order Confirmed!</h2>
                <p className="text-ebuy-muted mb-2">Thank you for your purchase.</p>
                <p className="text-ebuy-gold font-semibold text-lg mb-6 font-mono">{orderNumber}</p>
                <p className="text-sm text-ebuy-muted mb-8">
                  A confirmation has been sent to <strong className="text-ebuy-text">{form.email || 'your email'}</strong>. Estimated delivery: 3–5 business days.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href="/account" className="btn-outline text-sm">Track Your Order</Link>
                  <Link href="/products" className="btn-gold text-sm">Continue Shopping</Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {step !== 'confirmation' && (
          <div className="lg:col-span-2">
            <div className="bg-ebuy-surface border border-ebuy-border rounded p-6 sticky top-24">
              <h3 className="font-serif text-xl text-ebuy-text mb-5">Order Summary</h3>
              <ul className="space-y-3 mb-5 max-h-52 overflow-y-auto">
                {items.map((item) => (
                  <li key={`${item.productId}-${item.variantId}`} className="flex items-center gap-3">
                    <div className="relative">
                      <img src={item.image} alt={item.name} className="w-12 h-12 rounded object-cover bg-ebuy-surface-2" />
                      <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-ebuy-gold text-ebuy-bg text-[9px] font-bold flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-ebuy-text truncate">{item.name}</p>
                      {item.color && <p className="text-xs text-ebuy-muted">{item.color}</p>}
                    </div>
                    <p className="text-sm font-semibold tabular-nums">{formatPrice(item.price * item.quantity)}</p>
                  </li>
                ))}
              </ul>
              <div className="divider mb-4" />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-ebuy-muted">
                  <span>Subtotal</span><span className="tabular-nums">{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-ebuy-success">
                    <span>Discount ({couponCode})</span><span>−{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-ebuy-muted">
                  <span>Shipping</span>
                  <span className="tabular-nums">{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between text-ebuy-muted">
                  <span>Tax (8%)</span><span className="tabular-nums">{formatPrice(tax)}</span>
                </div>
                <div className="flex justify-between font-semibold text-base text-ebuy-text pt-3 border-t border-ebuy-border">
                  <span>Total</span><span className="tabular-nums">{formatPrice(total)}</span>
                </div>
              </div>
              <div className="flex items-center justify-center gap-1 mt-4 text-xs text-ebuy-muted">
                <Truck size={12} />
                <span>Free returns · 30-day guarantee</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}