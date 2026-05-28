'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Package, Heart, User, Bell, LogOut, ShoppingBag, ChevronRight, Loader2 } from 'lucide-react'
import { useUIStore } from '@/store/uiStore'
import { formatPrice, formatDate } from '@/lib/utils'
import ProductCard from '@/components/storefront/ProductCard'
import type { Product } from '@/lib/types'

const TABS = [
  { id: 'dashboard',     label: 'Dashboard',     icon: User },
  { id: 'orders',        label: 'My Orders',      icon: Package },
  { id: 'wishlist',      label: 'Wishlist',        icon: Heart },
  { id: 'profile',       label: 'Profile',         icon: User },
  { id: 'notifications', label: 'Notifications',   icon: Bell },
]

const STATUS_COLORS: Record<string, string> = {
  pending:    'bg-ebuy-muted/20 text-ebuy-muted',
  processing: 'bg-blue-500/20 text-blue-400',
  shipped:    'bg-ebuy-gold/20 text-ebuy-gold',
  delivered:  'bg-ebuy-success/20 text-ebuy-success',
  cancelled:  'bg-ebuy-error/20 text-ebuy-error',
  refunded:   'bg-ebuy-error/20 text-ebuy-error',
}

interface OrderItem { sku: string; image: string; name: string; quantity: number; price: number }
interface Order {
  id: string; orderNumber: string; createdAt: string
  items: OrderItem[]; status: string; total: number
  trackingNumber?: string; carrier?: string
}

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const { data: session } = useSession()
  const { wishlist } = useUIStore()

  // Orders
  const [orders,        setOrders]        = useState<Order[]>([])
  const [ordersLoading, setOrdersLoading] = useState(true)

  // Profile
  const [profile,        setProfile]        = useState({ name: '', email: '', phone: '' })
  const [profileLoading, setProfileLoading] = useState(true)
  const [savingProfile,  setSavingProfile]  = useState(false)
  const [profileSaved,   setProfileSaved]   = useState(false)

  // Wishlist products
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([])
  const [wishlistLoading,  setWishlistLoading]  = useState(false)

  // Notifications (local toggle state — no backend yet)
  const [notifPrefs, setNotifPrefs] = useState<Record<string, boolean>>({
    order_confirm: true, shipping: true, promo: false, restock: false, review: true,
  })

  const loadOrders = useCallback(async () => {
    setOrdersLoading(true)
    const res = await fetch('/api/orders')
    if (res.ok) setOrders(await res.json())
    setOrdersLoading(false)
  }, [])

  const loadProfile = useCallback(async () => {
    setProfileLoading(true)
    const res = await fetch('/api/profile')
    if (res.ok) {
      const data = await res.json()
      setProfile({ name: data.name ?? '', email: data.email ?? '', phone: data.phone ?? '' })
    }
    setProfileLoading(false)
  }, [])

  useEffect(() => { loadOrders() }, [loadOrders])
  useEffect(() => { loadProfile() }, [loadProfile])

  useEffect(() => {
    if (activeTab !== 'wishlist') return
    if (wishlist.length === 0) { setWishlistProducts([]); return }
    setWishlistLoading(true)
    fetch(`/api/products?ids=${wishlist.join(',')}`)
      .then(r => r.json())
      .then(data => setWishlistProducts(data))
      .finally(() => setWishlistLoading(false))
  }, [activeTab, wishlist])

  const saveProfile = async () => {
    setSavingProfile(true)
    const res = await fetch('/api/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: profile.name, phone: profile.phone }),
    })
    if (res.ok) {
      const data = await res.json()
      setProfile(p => ({ ...p, name: data.name ?? p.name, phone: data.phone ?? '' }))
      setProfileSaved(true)
      setTimeout(() => setProfileSaved(false), 2500)
    }
    setSavingProfile(false)
  }

  const totalSpent = orders.reduce((s, o) => s + o.total, 0)

  const OrderCard = ({ order }: { order: Order }) => (
    <div className="bg-ebuy-surface border border-ebuy-border rounded p-4 flex items-center justify-between gap-4 flex-wrap">
      <div>
        <p className="text-sm font-semibold text-ebuy-text font-mono">{order.orderNumber}</p>
        <p className="text-xs text-ebuy-muted mt-0.5">
          {formatDate(order.createdAt)} · {order.items.length} item{order.items.length !== 1 ? 's' : ''}
        </p>
      </div>
      <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${STATUS_COLORS[order.status] ?? STATUS_COLORS.pending}`}>
        {order.status}
      </span>
      <p className="text-sm font-semibold tabular-nums text-ebuy-text">{formatPrice(order.total)}</p>
      <button
        onClick={() => setActiveTab('orders')}
        className="text-xs text-ebuy-gold hover:text-ebuy-gold-light transition-colors flex items-center gap-1"
      >
        View <ChevronRight size={12} />
      </button>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-60 flex-shrink-0">
          <div className="bg-ebuy-surface border border-ebuy-border rounded p-6 mb-4">
            <div className="w-14 h-14 rounded-full bg-ebuy-gold/20 flex items-center justify-center mb-3">
              <span className="font-serif text-2xl text-ebuy-gold">{session?.user?.name?.[0] ?? 'U'}</span>
            </div>
            <p className="font-semibold text-ebuy-text">{session?.user?.name}</p>
            <p className="text-xs text-ebuy-muted mt-0.5">{session?.user?.email}</p>
          </div>

          <nav className="bg-ebuy-surface border border-ebuy-border rounded overflow-hidden">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-5 py-3.5 text-sm transition-colors border-b border-ebuy-border last:border-0 ${
                  activeTab === tab.id
                    ? 'bg-ebuy-gold/10 text-ebuy-gold'
                    : 'text-ebuy-muted hover:text-ebuy-text hover:bg-ebuy-surface-2'
                }`}
              >
                <tab.icon size={15} />
                {tab.label}
              </button>
            ))}
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="w-full flex items-center gap-3 px-5 py-3.5 text-sm text-ebuy-muted hover:text-ebuy-error hover:bg-ebuy-surface-2 transition-colors"
            >
              <LogOut size={15} /> Logout
            </button>
          </nav>
        </aside>

        <main className="flex-1 min-w-0">
          {/* Dashboard */}
          {activeTab === 'dashboard' && (
            <div>
              <h1 className="font-serif text-3xl text-ebuy-text mb-6">
                Welcome back, {session?.user?.name?.split(' ')[0]}.
              </h1>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
                {[
                  { label: 'Total Orders',   value: ordersLoading ? '—' : orders.length },
                  { label: 'Total Spent',    value: ordersLoading ? '—' : formatPrice(totalSpent) },
                  { label: 'Wishlist Items', value: wishlist.length },
                ].map((stat) => (
                  <div key={stat.label} className="bg-ebuy-surface border border-ebuy-border rounded p-5">
                    <p className="text-2xl font-semibold text-ebuy-gold tabular-nums">{stat.value}</p>
                    <p className="text-xs text-ebuy-muted mt-1 tracking-wide">{stat.label}</p>
                  </div>
                ))}
              </div>
              <h2 className="font-serif text-xl text-ebuy-text mb-4">Recent Orders</h2>
              {ordersLoading ? (
                <div className="flex justify-center py-8"><Loader2 size={20} className="animate-spin text-ebuy-gold" /></div>
              ) : orders.length === 0 ? (
                <p className="text-sm text-ebuy-muted">No orders yet. <Link href="/products" className="text-ebuy-gold hover:underline">Start shopping</Link></p>
              ) : (
                <div className="space-y-3">
                  {orders.slice(0, 3).map(order => <OrderCard key={order.id} order={order} />)}
                </div>
              )}
            </div>
          )}

          {/* Orders */}
          {activeTab === 'orders' && (
            <div>
              <h1 className="font-serif text-3xl text-ebuy-text mb-6">My Orders</h1>
              {ordersLoading ? (
                <div className="flex justify-center py-8"><Loader2 size={20} className="animate-spin text-ebuy-gold" /></div>
              ) : orders.length === 0 ? (
                <div className="text-center py-16">
                  <ShoppingBag size={40} className="text-ebuy-border mx-auto mb-3" />
                  <p className="text-ebuy-muted">No orders yet.</p>
                  <Link href="/products" className="btn-gold mt-5 inline-block text-sm">Start Shopping</Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="bg-ebuy-surface border border-ebuy-border rounded p-6">
                      <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
                        <div>
                          <p className="font-semibold text-ebuy-text font-mono">{order.orderNumber}</p>
                          <p className="text-xs text-ebuy-muted mt-0.5">{formatDate(order.createdAt)}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${STATUS_COLORS[order.status] ?? STATUS_COLORS.pending}`}>
                            {order.status}
                          </span>
                          <span className="text-sm font-semibold tabular-nums text-ebuy-text">{formatPrice(order.total)}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {order.items.map((item) => (
                          <div key={item.sku} className="flex items-center gap-3">
                            <img src={item.image} alt={item.name} className="w-12 h-12 rounded object-cover bg-ebuy-surface-2" />
                            <div>
                              <p className="text-sm text-ebuy-text">{item.name}</p>
                              <p className="text-xs text-ebuy-muted">Qty: {item.quantity} · {formatPrice(item.price)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      {order.trackingNumber && (
                        <p className="text-xs text-ebuy-muted mt-3 pt-3 border-t border-ebuy-border">
                          Tracking: <span className="text-ebuy-gold font-mono">{order.trackingNumber}</span>
                          {order.carrier && ` via ${order.carrier}`}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Wishlist */}
          {activeTab === 'wishlist' && (
            <div>
              <h1 className="font-serif text-3xl text-ebuy-text mb-6">Wishlist ({wishlist.length})</h1>
              {wishlistLoading ? (
                <div className="flex justify-center py-8"><Loader2 size={20} className="animate-spin text-ebuy-gold" /></div>
              ) : wishlist.length === 0 ? (
                <div className="text-center py-16">
                  <Heart size={40} className="text-ebuy-border mx-auto mb-3" />
                  <p className="text-ebuy-muted">Your wishlist is empty.</p>
                  <Link href="/products" className="btn-gold mt-5 inline-block text-sm">Browse Products</Link>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {wishlistProducts.map((p) => <ProductCard key={p.id} product={p} />)}
                </div>
              )}
            </div>
          )}

          {/* Profile */}
          {activeTab === 'profile' && (
            <div>
              <h1 className="font-serif text-3xl text-ebuy-text mb-6">Profile & Security</h1>
              {profileLoading ? (
                <div className="flex justify-center py-8"><Loader2 size={20} className="animate-spin text-ebuy-gold" /></div>
              ) : (
                <div className="bg-ebuy-surface border border-ebuy-border rounded p-6 space-y-5 max-w-lg">
                  <div>
                    <label className="block text-xs font-semibold tracking-widest uppercase text-ebuy-muted mb-2">Full Name</label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
                      className="input-dark"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold tracking-widest uppercase text-ebuy-muted mb-2">Email Address</label>
                    <input
                      type="email"
                      value={profile.email}
                      readOnly
                      className="input-dark opacity-50 cursor-not-allowed"
                    />
                    <p className="text-xs text-ebuy-muted/60 mt-1">Email cannot be changed.</p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold tracking-widest uppercase text-ebuy-muted mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))}
                      placeholder="+1 (555) 000-0000"
                      className="input-dark"
                    />
                  </div>
                  <button
                    onClick={saveProfile}
                    disabled={savingProfile}
                    className="btn-gold text-sm px-8 flex items-center gap-2"
                  >
                    {savingProfile && <Loader2 size={14} className="animate-spin" />}
                    {profileSaved ? 'Saved!' : 'Save Changes'}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Notifications */}
          {activeTab === 'notifications' && (
            <div>
              <h1 className="font-serif text-3xl text-ebuy-text mb-6">Notification Preferences</h1>
              <div className="bg-ebuy-surface border border-ebuy-border rounded p-6 space-y-4 max-w-lg">
                {[
                  { key: 'order_confirm', label: 'Order confirmation emails' },
                  { key: 'shipping',      label: 'Shipping notifications' },
                  { key: 'promo',         label: 'Promotional offers & sales' },
                  { key: 'restock',       label: 'Product restock alerts' },
                  { key: 'review',        label: 'Review request emails' },
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-center justify-between gap-4 cursor-pointer">
                    <span className="text-sm text-ebuy-muted">{label}</span>
                    <div className="relative" onClick={() => setNotifPrefs(p => ({ ...p, [key]: !p[key] }))}>
                      <div className={`w-10 h-5 rounded-full transition-colors border ${notifPrefs[key] ? 'bg-ebuy-gold border-ebuy-gold' : 'bg-ebuy-surface-2 border-ebuy-border'}`} />
                      <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${notifPrefs[key] ? 'translate-x-5' : ''}`} />
                    </div>
                  </label>
                ))}
                <button className="btn-gold text-sm px-8 mt-2">Save Preferences</button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}