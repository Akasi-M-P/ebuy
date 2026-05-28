'use client'

import { useState, useEffect, useCallback } from 'react'
import { Search, Download, Eye, X, Loader2 } from 'lucide-react'
import { formatPrice, formatDate, cn } from '@/lib/utils'
import type { OrderStatus } from '@/lib/types'

const ALL_TABS: { id: OrderStatus | 'all'; label: string }[] = [
  { id: 'all',        label: 'All' },
  { id: 'pending',    label: 'Pending' },
  { id: 'processing', label: 'Processing' },
  { id: 'shipped',    label: 'Shipped' },
  { id: 'delivered',  label: 'Delivered' },
  { id: 'cancelled',  label: 'Cancelled' },
  { id: 'refunded',   label: 'Refunded' },
]

const STATUS_CLASSES: Record<string, string> = {
  pending:    'bg-ebuy-muted/20 text-ebuy-muted',
  processing: 'bg-blue-500/20 text-blue-400',
  shipped:    'bg-ebuy-gold/20 text-ebuy-gold',
  delivered:  'bg-ebuy-success/20 text-ebuy-success',
  cancelled:  'bg-ebuy-error/20 text-ebuy-error',
  refunded:   'bg-ebuy-error/20 text-ebuy-error',
}

interface OrderItem { id: string; name: string; image: string; price: number; quantity: number; variant?: string; sku: string }
interface Order {
  id: string; orderNumber: string; customerName: string; customerEmail: string
  createdAt: string; items: OrderItem[]; paymentMethod: string; status: OrderStatus
  paymentStatus: string; total: number; subtotal: number; shipping: number; tax: number
  trackingNumber?: string; carrier?: string; notes?: string; shippingAddress: Record<string, string>
}

export default function AdminOrders() {
  const [orders,   setOrders]   = useState<Order[]>([])
  const [loading,  setLoading]  = useState(true)
  const [tab,      setTab]      = useState<OrderStatus | 'all'>('all')
  const [search,   setSearch]   = useState('')
  const [selected, setSelected] = useState<Order | null>(null)
  const [saving,   setSaving]   = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/admin/orders')
    if (res.ok) setOrders(await res.json())
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const filtered = orders.filter(o => {
    const matchTab    = tab === 'all' || o.status === tab
    const matchSearch = o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(search.toLowerCase())
    return matchTab && matchSearch
  })

  const handleStatusUpdate = async (id: string, status: string, trackingNumber: string, carrier: string, notes: string) => {
    setSaving(true)
    const res = await fetch(`/api/admin/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, trackingNumber: trackingNumber || null, carrier: carrier || null, notes: notes || null }),
    })
    if (res.ok) {
      const updated: Order = await res.json()
      setOrders(prev => prev.map(o => o.id === updated.id ? updated : o))
      setSelected(updated)
    }
    setSaving(false)
  }

  return (
    <>
      <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-serif text-3xl text-ebuy-text">Orders</h1>
          <p className="text-sm text-ebuy-muted mt-1">{orders.length} total orders</p>
        </div>
        <button className="btn-outline flex items-center gap-2 text-sm"><Download size={14} /> Export CSV</button>
      </div>

      <div className="flex gap-0 border-b border-ebuy-border mb-5 overflow-x-auto">
        {ALL_TABS.map(t => {
          const count = t.id === 'all' ? orders.length : orders.filter(o => o.status === t.id).length
          return (
            <button key={t.id} onClick={() => setTab(t.id)} className={cn('px-4 py-2.5 text-sm whitespace-nowrap border-b-2 transition-colors', tab === t.id ? 'border-ebuy-gold text-ebuy-gold' : 'border-transparent text-ebuy-muted hover:text-ebuy-text')}>
              {t.label}<span className="ml-1.5 text-xs text-ebuy-muted/60">({count})</span>
            </button>
          )
        })}
      </div>

      <div className="relative mb-5 max-w-xs">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ebuy-muted pointer-events-none" />
        <input type="search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by order, customer…" className="input-dark pl-9 py-2 text-sm w-full" />
      </div>

      <div className="bg-ebuy-surface border border-ebuy-border rounded overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 size={24} className="animate-spin text-ebuy-gold" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ebuy-border bg-ebuy-surface-2">
                  {['Order ID', 'Customer', 'Date', 'Items', 'Payment', 'Status', 'Total', ''].map(h => (
                    <th key={h} className="text-left py-3 px-4 text-xs font-semibold tracking-widest uppercase text-ebuy-muted">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(order => (
                  <tr key={order.id} className="border-b border-ebuy-border/50 hover:bg-ebuy-surface-2 transition-colors">
                    <td className="py-3 px-4 font-mono text-xs text-ebuy-gold">{order.orderNumber}</td>
                    <td className="py-3 px-4"><p className="text-ebuy-text">{order.customerName}</p><p className="text-xs text-ebuy-muted">{order.customerEmail}</p></td>
                    <td className="py-3 px-4 text-xs text-ebuy-muted">{formatDate(order.createdAt)}</td>
                    <td className="py-3 px-4 text-ebuy-muted">{order.items.length}</td>
                    <td className="py-3 px-4 text-xs text-ebuy-muted">{order.paymentMethod}</td>
                    <td className="py-3 px-4"><span className={cn('text-xs px-2 py-0.5 rounded-full capitalize', STATUS_CLASSES[order.status])}>{order.status}</span></td>
                    <td className="py-3 px-4 font-semibold tabular-nums text-ebuy-text">{formatPrice(order.total)}</td>
                    <td className="py-3 px-4">
                      <button onClick={() => setSelected(order)} className="p-1.5 text-ebuy-muted hover:text-ebuy-gold transition-colors rounded" aria-label="View order"><Eye size={14} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!loading && filtered.length === 0 && <div className="text-center py-12"><p className="text-ebuy-muted text-sm">No orders found.</p></div>}
      </div>

      {/* Order detail modal */}
      {selected && <OrderModal order={selected} onClose={() => setSelected(null)} onSave={handleStatusUpdate} saving={saving} />}
    </>
  )
}

function OrderModal({ order, onClose, onSave, saving }: {
  order: Order
  onClose: () => void
  onSave: (id: string, status: string, tracking: string, carrier: string, notes: string) => void
  saving: boolean
}) {
  const [status,   setStatus]   = useState(order.status)
  const [tracking, setTracking] = useState(order.trackingNumber ?? '')
  const [carrier,  setCarrier]  = useState(order.carrier ?? '')
  const [notes,    setNotes]    = useState(order.notes ?? '')
  const addr = order.shippingAddress as Record<string, string>

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-ebuy-surface border border-ebuy-border rounded w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-ebuy-border">
          <div>
            <h2 className="font-serif text-xl text-ebuy-text">{order.orderNumber}</h2>
            <p className="text-xs text-ebuy-muted mt-0.5">{formatDate(order.createdAt)} · {order.customerName}</p>
          </div>
          <button onClick={onClose} className="text-ebuy-muted hover:text-ebuy-text"><X size={18} /></button>
        </div>

        <div className="p-6 space-y-6">
          {/* Items */}
          <div>
            <h3 className="text-xs font-semibold tracking-widest uppercase text-ebuy-muted mb-3">Items</h3>
            <div className="space-y-2">
              {order.items.map(item => (
                <div key={item.id} className="flex items-center gap-3 py-2 border-b border-ebuy-border/50 last:border-0">
                  <img src={item.image} alt={item.name} className="w-10 h-10 rounded object-cover bg-ebuy-surface-2 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-ebuy-text truncate">{item.name}</p>
                    {item.variant && <p className="text-xs text-ebuy-muted">{item.variant}</p>}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm text-ebuy-text">{formatPrice(item.price)} × {item.quantity}</p>
                    <p className="text-xs text-ebuy-muted">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 space-y-1 text-xs text-right">
              <p className="text-ebuy-muted">Subtotal: <span className="text-ebuy-text tabular-nums">{formatPrice(order.subtotal)}</span></p>
              <p className="text-ebuy-muted">Tax: <span className="text-ebuy-text tabular-nums">{formatPrice(order.tax)}</span></p>
              <p className="font-semibold text-ebuy-gold text-sm">Total: {formatPrice(order.total)}</p>
            </div>
          </div>

          {/* Shipping address */}
          <div>
            <h3 className="text-xs font-semibold tracking-widest uppercase text-ebuy-muted mb-2">Shipping Address</h3>
            <div className="text-sm text-ebuy-muted space-y-0.5">
              <p className="text-ebuy-text">{addr.fullName}</p>
              <p>{addr.address1}{addr.address2 ? `, ${addr.address2}` : ''}</p>
              <p>{addr.city}, {addr.state} {addr.zip}</p>
              <p>{addr.country}</p>
            </div>
          </div>

          {/* Update status */}
          <div className="border-t border-ebuy-border pt-5">
            <h3 className="text-xs font-semibold tracking-widest uppercase text-ebuy-muted mb-3">Update Order</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs text-ebuy-muted mb-1.5">Status</label>
                <select value={status} onChange={e => setStatus(e.target.value as OrderStatus)} className="input-dark text-sm">
                  {['pending','processing','shipped','delivered','cancelled','refunded'].map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
                </select>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs text-ebuy-muted mb-1.5">Carrier</label>
                <input value={carrier} onChange={e => setCarrier(e.target.value)} className="input-dark text-sm" placeholder="UPS, DHL, FedEx…" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs text-ebuy-muted mb-1.5">Tracking Number</label>
                <input value={tracking} onChange={e => setTracking(e.target.value)} className="input-dark text-sm" placeholder="e.g. UPS1Z9284AB1" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs text-ebuy-muted mb-1.5">Notes</label>
                <textarea rows={2} value={notes} onChange={e => setNotes(e.target.value)} className="input-dark text-sm resize-none" placeholder="Internal notes…" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 px-6 pb-6">
          <button onClick={onClose} className="btn-outline text-sm">Close</button>
          <button onClick={() => onSave(order.id, status, tracking, carrier, notes)} disabled={saving} className="btn-gold text-sm flex items-center gap-2">
            {saving && <Loader2 size={14} className="animate-spin" />}
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}