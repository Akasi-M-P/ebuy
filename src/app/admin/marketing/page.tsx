'use client'

import { useState, useEffect, useCallback } from 'react'
import { Plus, Tag, Zap, Mail, Copy, Edit2, Trash2, X, Loader2, Send } from 'lucide-react'
import { formatDate, cn } from '@/lib/utils'

const TABS = ['Discount Codes', 'Flash Sales', 'Email Campaigns']

const STATUS_CLASSES: Record<string, string> = {
  active:   'bg-ebuy-success/20 text-ebuy-success',
  expired:  'bg-ebuy-error/20 text-ebuy-error',
  disabled: 'bg-ebuy-muted/20 text-ebuy-muted',
  draft:    'bg-ebuy-muted/20 text-ebuy-muted',
  sent:     'bg-ebuy-success/20 text-ebuy-success',
  scheduled:'bg-blue-500/20 text-blue-400',
}

// ─── Coupon types ─────────────────────────────────────────────────────────────
type CouponType   = 'percentage' | 'fixed' | 'free_shipping' | 'buy_x_get_y'
type CouponStatus = 'active' | 'expired' | 'disabled'

interface Coupon {
  id: string; code: string; type: CouponType; value: number
  minOrderValue: number | null; usageLimit: number | null; usageCount: number
  expiryDate: string | null; status: CouponStatus; createdAt: string
}

const EMPTY_COUPON = { code: '', type: 'percentage' as CouponType, value: '', minOrderValue: '', usageLimit: '', expiryDate: '', status: 'active' as CouponStatus }

// ─── Flash Sale types ─────────────────────────────────────────────────────────
interface FlashSale {
  id: string; name: string; discount: number
  startsAt: string; endsAt: string; isActive: boolean; createdAt: string
}

const EMPTY_SALE = { name: '', discount: '', startsAt: '', endsAt: '' }

// ─── Campaign types ───────────────────────────────────────────────────────────
interface Campaign {
  id: string; name: string; subject: string; status: string
  sentAt: string | null; recipients: number; openRate: number | null
  clickRate: number | null; createdAt: string
}

const EMPTY_CAMPAIGN = { name: '', subject: '' }

export default function AdminMarketing() {
  const [tab, setTab] = useState(0)

  // ── Coupons ──────────────────────────────────────────────────────────────
  const [coupons,     setCoupons]     = useState<Coupon[]>([])
  const [couponLoad,  setCouponLoad]  = useState(true)
  const [showCoupon,  setShowCoupon]  = useState(false)
  const [editCoupon,  setEditCoupon]  = useState<Coupon | null>(null)
  const [couponForm,  setCouponForm]  = useState(EMPTY_COUPON)
  const [savingC,     setSavingC]     = useState(false)
  const [deleteId,    setDeleteId]    = useState<string | null>(null)

  // ── Flash Sales ──────────────────────────────────────────────────────────
  const [sales,       setSales]       = useState<FlashSale[]>([])
  const [salesLoad,   setSalesLoad]   = useState(false)
  const [showSale,    setShowSale]    = useState(false)
  const [editSale,    setEditSale]    = useState<FlashSale | null>(null)
  const [saleForm,    setSaleForm]    = useState(EMPTY_SALE)
  const [savingS,     setSavingS]     = useState(false)
  const [deleteSaleId, setDeleteSaleId] = useState<string | null>(null)

  // ── Campaigns ────────────────────────────────────────────────────────────
  const [campaigns,   setCampaigns]   = useState<Campaign[]>([])
  const [campLoad,    setCampLoad]    = useState(false)
  const [showCamp,    setShowCamp]    = useState(false)
  const [campForm,    setCampForm]    = useState(EMPTY_CAMPAIGN)
  const [savingCamp,  setSavingCamp]  = useState(false)
  const [sendingId,   setSendingId]   = useState<string | null>(null)
  const [deleteCampId, setDeleteCampId] = useState<string | null>(null)

  // ── Loaders ──────────────────────────────────────────────────────────────
  const loadCoupons = useCallback(async () => {
    setCouponLoad(true)
    const r = await fetch('/api/admin/coupons')
    if (r.ok) setCoupons(await r.json())
    setCouponLoad(false)
  }, [])

  const loadSales = useCallback(async () => {
    setSalesLoad(true)
    const r = await fetch('/api/admin/flash-sales')
    if (r.ok) setSales(await r.json())
    setSalesLoad(false)
  }, [])

  const loadCampaigns = useCallback(async () => {
    setCampLoad(true)
    const r = await fetch('/api/admin/campaigns')
    if (r.ok) setCampaigns(await r.json())
    setCampLoad(false)
  }, [])

  useEffect(() => { loadCoupons() }, [loadCoupons])
  useEffect(() => { if (tab === 1) loadSales() },    [tab, loadSales])
  useEffect(() => { if (tab === 2) loadCampaigns() }, [tab, loadCampaigns])

  // ── Coupon handlers ───────────────────────────────────────────────────────
  const openCreateCoupon = () => { setEditCoupon(null); setCouponForm(EMPTY_COUPON); setShowCoupon(true) }
  const openEditCoupon = (c: Coupon) => {
    setEditCoupon(c)
    setCouponForm({ code: c.code, type: c.type, value: String(c.value), minOrderValue: c.minOrderValue ? String(c.minOrderValue) : '', usageLimit: c.usageLimit ? String(c.usageLimit) : '', expiryDate: c.expiryDate ? c.expiryDate.slice(0, 10) : '', status: c.status })
    setShowCoupon(true)
  }
  const handleSaveCoupon = async (e: React.FormEvent) => {
    e.preventDefault(); setSavingC(true)
    const url    = editCoupon ? `/api/admin/coupons/${editCoupon.id}` : '/api/admin/coupons'
    const method = editCoupon ? 'PATCH' : 'POST'
    const r = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(couponForm) })
    if (r.ok) {
      const saved: Coupon = await r.json()
      setCoupons(prev => editCoupon ? prev.map(c => c.id === saved.id ? saved : c) : [saved, ...prev])
      setShowCoupon(false)
    }
    setSavingC(false)
  }
  const handleDeleteCoupon = async (id: string) => {
    const r = await fetch(`/api/admin/coupons/${id}`, { method: 'DELETE' })
    if (r.ok) { setCoupons(prev => prev.filter(c => c.id !== id)); setDeleteId(null) }
  }

  // ── Flash Sale handlers ───────────────────────────────────────────────────
  const openCreateSale = () => { setEditSale(null); setSaleForm(EMPTY_SALE); setShowSale(true) }
  const openEditSale = (s: FlashSale) => {
    setEditSale(s)
    setSaleForm({ name: s.name, discount: String(s.discount), startsAt: s.startsAt.slice(0, 16), endsAt: s.endsAt.slice(0, 16) })
    setShowSale(true)
  }
  const handleSaveSale = async (e: React.FormEvent) => {
    e.preventDefault(); setSavingS(true)
    const url    = editSale ? `/api/admin/flash-sales/${editSale.id}` : '/api/admin/flash-sales'
    const method = editSale ? 'PATCH' : 'POST'
    const r = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(saleForm) })
    if (r.ok) {
      const saved: FlashSale = await r.json()
      setSales(prev => editSale ? prev.map(s => s.id === saved.id ? saved : s) : [saved, ...prev])
      setShowSale(false)
    }
    setSavingS(false)
  }
  const handleToggleSale = async (s: FlashSale) => {
    const r = await fetch(`/api/admin/flash-sales/${s.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isActive: !s.isActive }) })
    if (r.ok) setSales(prev => prev.map(x => x.id === s.id ? { ...x, isActive: !s.isActive } : x))
  }
  const handleDeleteSale = async (id: string) => {
    const r = await fetch(`/api/admin/flash-sales/${id}`, { method: 'DELETE' })
    if (r.ok) { setSales(prev => prev.filter(s => s.id !== id)); setDeleteSaleId(null) }
  }

  // ── Campaign handlers ─────────────────────────────────────────────────────
  const handleCreateCampaign = async (e: React.FormEvent, send: boolean) => {
    e.preventDefault(); setSavingCamp(true)
    const r = await fetch('/api/admin/campaigns', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...campForm, send }) })
    if (r.ok) {
      const saved: Campaign = await r.json()
      setCampaigns(prev => [saved, ...prev])
      setShowCamp(false); setCampForm(EMPTY_CAMPAIGN)
    }
    setSavingCamp(false)
  }
  const handleSendCampaign = async (id: string) => {
    setSendingId(id)
    const r = await fetch(`/api/admin/campaigns/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ send: true }) })
    if (r.ok) {
      const updated: Campaign = await r.json()
      setCampaigns(prev => prev.map(c => c.id === id ? updated : c))
    }
    setSendingId(null)
  }
  const handleDeleteCampaign = async (id: string) => {
    const r = await fetch(`/api/admin/campaigns/${id}`, { method: 'DELETE' })
    if (r.ok) { setCampaigns(prev => prev.filter(c => c.id !== id)); setDeleteCampId(null) }
  }

  const saleStatus = (s: FlashSale) => {
    const now = Date.now()
    if (!s.isActive) return 'disabled'
    if (new Date(s.endsAt).getTime() < now) return 'expired'
    if (new Date(s.startsAt).getTime() > now) return 'scheduled'
    return 'active'
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="font-serif text-3xl text-ebuy-text">Marketing</h1>
        <p className="text-sm text-ebuy-muted mt-1">Manage discounts, sales, and campaigns</p>
      </div>

      <div className="flex gap-0 border-b border-ebuy-border mb-6">
        {TABS.map((t, i) => (
          <button key={t} onClick={() => setTab(i)} className={cn('px-4 py-2.5 text-sm flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap', tab === i ? 'border-ebuy-gold text-ebuy-gold' : 'border-transparent text-ebuy-muted hover:text-ebuy-text')}>
            {i === 0 && <Tag size={14} />}{i === 1 && <Zap size={14} />}{i === 2 && <Mail size={14} />}
            {t}
          </button>
        ))}
      </div>

      {/* ── Discount Codes ────────────────────────────────────────────────── */}
      {tab === 0 && (
        <div>
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm text-ebuy-muted">{coupons.length} codes</p>
            <button onClick={openCreateCoupon} className="btn-gold flex items-center gap-2 text-sm"><Plus size={14} /> Create Code</button>
          </div>
          <div className="bg-ebuy-surface border border-ebuy-border rounded overflow-hidden">
            {couponLoad ? (
              <div className="flex items-center justify-center py-20"><Loader2 size={24} className="animate-spin text-ebuy-gold" /></div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-ebuy-border bg-ebuy-surface-2">
                    {['Code', 'Type', 'Value', 'Usage', 'Expires', 'Status', ''].map(h => (
                      <th key={h} className="text-left py-3 px-4 text-xs font-semibold tracking-widest uppercase text-ebuy-muted">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {coupons.map(c => (
                    <tr key={c.id} className="border-b border-ebuy-border/50 hover:bg-ebuy-surface-2 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-ebuy-gold font-semibold">{c.code}</span>
                          <button onClick={() => navigator.clipboard.writeText(c.code)} className="text-ebuy-muted hover:text-ebuy-text transition-colors"><Copy size={12} /></button>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-ebuy-muted capitalize text-xs">{c.type.replace('_', ' ')}</td>
                      <td className="py-3 px-4 text-ebuy-text font-semibold">{c.type === 'percentage' ? `${c.value}%` : c.type === 'fixed' ? `$${c.value}` : 'Free'}</td>
                      <td className="py-3 px-4 text-ebuy-muted text-xs">{c.usageCount}{c.usageLimit ? ` / ${c.usageLimit}` : ''}</td>
                      <td className="py-3 px-4 text-xs text-ebuy-muted">{c.expiryDate ? formatDate(c.expiryDate) : '—'}</td>
                      <td className="py-3 px-4"><span className={cn('text-xs px-2 py-0.5 rounded-full capitalize', STATUS_CLASSES[c.status])}>{c.status}</span></td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          <button onClick={() => openEditCoupon(c)} className="p-1.5 text-ebuy-muted hover:text-ebuy-gold transition-colors rounded"><Edit2 size={14} /></button>
                          <button onClick={() => setDeleteId(c.id)} className="p-1.5 text-ebuy-muted hover:text-ebuy-error transition-colors rounded"><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {!couponLoad && coupons.length === 0 && <div className="text-center py-12"><p className="text-ebuy-muted text-sm">No discount codes yet.</p></div>}
          </div>
        </div>
      )}

      {/* ── Flash Sales ───────────────────────────────────────────────────── */}
      {tab === 1 && (
        <div>
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm text-ebuy-muted">{sales.length} flash sale{sales.length !== 1 ? 's' : ''}</p>
            <button onClick={openCreateSale} className="btn-gold flex items-center gap-2 text-sm"><Plus size={14} /> Create Flash Sale</button>
          </div>
          {salesLoad ? (
            <div className="flex items-center justify-center py-20"><Loader2 size={24} className="animate-spin text-ebuy-gold" /></div>
          ) : sales.length === 0 ? (
            <div className="bg-ebuy-surface border border-dashed border-ebuy-border rounded p-16 text-center">
              <Zap size={36} className="text-ebuy-border mx-auto mb-3" />
              <p className="text-ebuy-muted font-serif text-xl mb-2">No Flash Sales</p>
              <p className="text-sm text-ebuy-muted/60 mb-6">Create a timed sale to drive urgency and boost conversions.</p>
              <button onClick={openCreateSale} className="btn-gold text-sm px-8">Create Your First Flash Sale</button>
            </div>
          ) : (
            <div className="bg-ebuy-surface border border-ebuy-border rounded overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-ebuy-border bg-ebuy-surface-2">
                    {['Name', 'Discount', 'Starts', 'Ends', 'Status', ''].map(h => (
                      <th key={h} className="text-left py-3 px-4 text-xs font-semibold tracking-widest uppercase text-ebuy-muted">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sales.map(s => {
                    const st = saleStatus(s)
                    return (
                      <tr key={s.id} className="border-b border-ebuy-border/50 hover:bg-ebuy-surface-2 transition-colors">
                        <td className="py-3 px-4 font-medium text-ebuy-text">{s.name}</td>
                        <td className="py-3 px-4 text-ebuy-gold font-semibold">{s.discount}% off</td>
                        <td className="py-3 px-4 text-xs text-ebuy-muted">{formatDate(s.startsAt)}</td>
                        <td className="py-3 px-4 text-xs text-ebuy-muted">{formatDate(s.endsAt)}</td>
                        <td className="py-3 px-4"><span className={cn('text-xs px-2 py-0.5 rounded-full capitalize', STATUS_CLASSES[st] ?? STATUS_CLASSES.disabled)}>{st}</span></td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1">
                            <button onClick={() => handleToggleSale(s)} className={cn('text-xs px-2 py-0.5 rounded border transition-colors', s.isActive ? 'border-ebuy-muted text-ebuy-muted hover:border-ebuy-error hover:text-ebuy-error' : 'border-ebuy-gold/40 text-ebuy-gold hover:bg-ebuy-gold/10')}>
                              {s.isActive ? 'Disable' : 'Enable'}
                            </button>
                            <button onClick={() => openEditSale(s)} className="p-1.5 text-ebuy-muted hover:text-ebuy-gold transition-colors rounded"><Edit2 size={14} /></button>
                            <button onClick={() => setDeleteSaleId(s.id)} className="p-1.5 text-ebuy-muted hover:text-ebuy-error transition-colors rounded"><Trash2 size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── Email Campaigns ───────────────────────────────────────────────── */}
      {tab === 2 && (
        <div>
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm text-ebuy-muted">{campaigns.length} campaign{campaigns.length !== 1 ? 's' : ''}</p>
            <button onClick={() => setShowCamp(true)} className="btn-gold flex items-center gap-2 text-sm"><Plus size={14} /> New Campaign</button>
          </div>
          {campLoad ? (
            <div className="flex items-center justify-center py-20"><Loader2 size={24} className="animate-spin text-ebuy-gold" /></div>
          ) : campaigns.length === 0 ? (
            <div className="bg-ebuy-surface border border-dashed border-ebuy-border rounded p-16 text-center">
              <Mail size={36} className="text-ebuy-border mx-auto mb-3" />
              <p className="text-ebuy-muted font-serif text-xl mb-2">No Campaigns</p>
              <p className="text-sm text-ebuy-muted/60 mb-6">Create your first email campaign to engage customers.</p>
              <button onClick={() => setShowCamp(true)} className="btn-gold text-sm px-8">Create Campaign</button>
            </div>
          ) : (
            <div className="space-y-3">
              {campaigns.map(c => (
                <div key={c.id} className="bg-ebuy-surface border border-ebuy-border rounded p-5 flex items-center justify-between gap-4 flex-wrap">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-ebuy-text">{c.name}</p>
                    <p className="text-xs text-ebuy-muted mt-0.5 truncate">Subject: {c.subject}</p>
                    {c.sentAt && <p className="text-xs text-ebuy-muted/60 mt-0.5">{formatDate(c.sentAt)} · {c.recipients.toLocaleString()} recipients</p>}
                  </div>
                  <div className="flex items-center gap-5">
                    {c.status === 'sent' && (
                      <>
                        <div className="text-center"><p className="text-sm font-semibold text-ebuy-text">{c.openRate ? `${c.openRate}%` : '—'}</p><p className="text-xs text-ebuy-muted">Open Rate</p></div>
                        <div className="text-center"><p className="text-sm font-semibold text-ebuy-gold">{c.clickRate ? `${c.clickRate}%` : '—'}</p><p className="text-xs text-ebuy-muted">Click Rate</p></div>
                      </>
                    )}
                    <span className={cn('text-xs px-2 py-0.5 rounded-full capitalize', STATUS_CLASSES[c.status])}>{c.status}</span>
                    {c.status === 'draft' && (
                      <button
                        onClick={() => handleSendCampaign(c.id)}
                        disabled={sendingId === c.id}
                        className="btn-gold text-xs flex items-center gap-1.5 py-1.5 px-3"
                      >
                        {sendingId === c.id ? <Loader2 size={11} className="animate-spin" /> : <Send size={11} />}
                        Send
                      </button>
                    )}
                    <button onClick={() => setDeleteCampId(c.id)} className="p-1.5 text-ebuy-muted hover:text-ebuy-error transition-colors rounded"><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Coupon modal ───────────────────────────────────────────────────── */}
      {showCoupon && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-ebuy-surface border border-ebuy-border rounded w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-ebuy-border">
              <h2 className="font-serif text-xl text-ebuy-text">{editCoupon ? 'Edit Discount Code' : 'Create Discount Code'}</h2>
              <button onClick={() => setShowCoupon(false)} className="text-ebuy-muted hover:text-ebuy-text"><X size={18} /></button>
            </div>
            <form onSubmit={handleSaveCoupon} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold tracking-widest uppercase text-ebuy-muted mb-1.5">Code *</label>
                <input required value={couponForm.code} onChange={e => setCouponForm(f => ({ ...f, code: e.target.value.toUpperCase() }))} className="input-dark font-mono" placeholder="SUMMER20" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold tracking-widest uppercase text-ebuy-muted mb-1.5">Type *</label>
                  <select required value={couponForm.type} onChange={e => setCouponForm(f => ({ ...f, type: e.target.value as CouponType }))} className="input-dark">
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                    <option value="free_shipping">Free Shipping</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold tracking-widest uppercase text-ebuy-muted mb-1.5">
                    {couponForm.type === 'percentage' ? 'Discount %' : couponForm.type === 'fixed' ? 'Amount ($)' : 'Value'}
                  </label>
                  <input type="number" min="0" step="0.01" value={couponForm.value} onChange={e => setCouponForm(f => ({ ...f, value: e.target.value }))} className="input-dark" />
                </div>
                <div>
                  <label className="block text-xs font-semibold tracking-widest uppercase text-ebuy-muted mb-1.5">Min Order ($)</label>
                  <input type="number" min="0" value={couponForm.minOrderValue} onChange={e => setCouponForm(f => ({ ...f, minOrderValue: e.target.value }))} className="input-dark" placeholder="Optional" />
                </div>
                <div>
                  <label className="block text-xs font-semibold tracking-widest uppercase text-ebuy-muted mb-1.5">Usage Limit</label>
                  <input type="number" min="1" value={couponForm.usageLimit} onChange={e => setCouponForm(f => ({ ...f, usageLimit: e.target.value }))} className="input-dark" placeholder="Unlimited" />
                </div>
                <div>
                  <label className="block text-xs font-semibold tracking-widest uppercase text-ebuy-muted mb-1.5">Expiry Date</label>
                  <input type="date" value={couponForm.expiryDate} onChange={e => setCouponForm(f => ({ ...f, expiryDate: e.target.value }))} className="input-dark" />
                </div>
                <div>
                  <label className="block text-xs font-semibold tracking-widest uppercase text-ebuy-muted mb-1.5">Status</label>
                  <select value={couponForm.status} onChange={e => setCouponForm(f => ({ ...f, status: e.target.value as CouponStatus }))} className="input-dark">
                    <option value="active">Active</option>
                    <option value="disabled">Disabled</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowCoupon(false)} className="btn-outline text-sm">Cancel</button>
                <button type="submit" disabled={savingC} className="btn-gold text-sm flex items-center gap-2">
                  {savingC && <Loader2 size={14} className="animate-spin" />}
                  {editCoupon ? 'Save Changes' : 'Create Code'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Flash Sale modal ──────────────────────────────────────────────── */}
      {showSale && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-ebuy-surface border border-ebuy-border rounded w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-ebuy-border">
              <h2 className="font-serif text-xl text-ebuy-text">{editSale ? 'Edit Flash Sale' : 'Create Flash Sale'}</h2>
              <button onClick={() => setShowSale(false)} className="text-ebuy-muted hover:text-ebuy-text"><X size={18} /></button>
            </div>
            <form onSubmit={handleSaveSale} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold tracking-widest uppercase text-ebuy-muted mb-1.5">Sale Name *</label>
                <input required value={saleForm.name} onChange={e => setSaleForm(f => ({ ...f, name: e.target.value }))} className="input-dark" placeholder="Black Friday Sale" />
              </div>
              <div>
                <label className="block text-xs font-semibold tracking-widest uppercase text-ebuy-muted mb-1.5">Discount % *</label>
                <input required type="number" min="1" max="99" value={saleForm.discount} onChange={e => setSaleForm(f => ({ ...f, discount: e.target.value }))} className="input-dark" placeholder="20" />
                <p className="text-xs text-ebuy-muted/60 mt-1">Applied to all products during the sale window.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold tracking-widest uppercase text-ebuy-muted mb-1.5">Starts At *</label>
                  <input required type="datetime-local" value={saleForm.startsAt} onChange={e => setSaleForm(f => ({ ...f, startsAt: e.target.value }))} className="input-dark" />
                </div>
                <div>
                  <label className="block text-xs font-semibold tracking-widest uppercase text-ebuy-muted mb-1.5">Ends At *</label>
                  <input required type="datetime-local" value={saleForm.endsAt} onChange={e => setSaleForm(f => ({ ...f, endsAt: e.target.value }))} className="input-dark" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowSale(false)} className="btn-outline text-sm">Cancel</button>
                <button type="submit" disabled={savingS} className="btn-gold text-sm flex items-center gap-2">
                  {savingS && <Loader2 size={14} className="animate-spin" />}
                  {editSale ? 'Save Changes' : 'Create Sale'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Campaign modal ────────────────────────────────────────────────── */}
      {showCamp && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-ebuy-surface border border-ebuy-border rounded w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-ebuy-border">
              <h2 className="font-serif text-xl text-ebuy-text">New Email Campaign</h2>
              <button onClick={() => setShowCamp(false)} className="text-ebuy-muted hover:text-ebuy-text"><X size={18} /></button>
            </div>
            <form className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold tracking-widest uppercase text-ebuy-muted mb-1.5">Campaign Name *</label>
                <input required value={campForm.name} onChange={e => setCampForm(f => ({ ...f, name: e.target.value }))} className="input-dark" placeholder="Summer Sale Announcement" />
              </div>
              <div>
                <label className="block text-xs font-semibold tracking-widest uppercase text-ebuy-muted mb-1.5">Email Subject *</label>
                <input required value={campForm.subject} onChange={e => setCampForm(f => ({ ...f, subject: e.target.value }))} className="input-dark" placeholder="Don't miss our biggest sale of the year 🔥" />
              </div>
              <p className="text-xs text-ebuy-muted/60">Sending will be delivered to all registered customers.</p>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowCamp(false)} className="btn-outline text-sm">Cancel</button>
                <button type="button" onClick={(e) => handleCreateCampaign(e, false)} disabled={savingCamp} className="btn-outline text-sm flex items-center gap-2">
                  {savingCamp && <Loader2 size={14} className="animate-spin" />}
                  Save Draft
                </button>
                <button type="button" onClick={(e) => handleCreateCampaign(e, true)} disabled={savingCamp} className="btn-gold text-sm flex items-center gap-2">
                  {savingCamp && <Loader2 size={14} className="animate-spin" />}
                  <Send size={13} /> Send Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete confirmations ───────────────────────────────────────────── */}
      {(deleteId || deleteSaleId || deleteCampId) && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-ebuy-surface border border-ebuy-border rounded p-6 w-full max-w-sm">
            <h3 className="font-serif text-lg text-ebuy-text mb-2">Confirm Delete</h3>
            <p className="text-sm text-ebuy-muted mb-6">This action cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => { setDeleteId(null); setDeleteSaleId(null); setDeleteCampId(null) }} className="btn-outline text-sm">Cancel</button>
              <button
                onClick={() => {
                  if (deleteId)     handleDeleteCoupon(deleteId)
                  if (deleteSaleId) handleDeleteSale(deleteSaleId)
                  if (deleteCampId) handleDeleteCampaign(deleteCampId)
                }}
                className="px-4 py-2 bg-ebuy-error text-white text-sm rounded hover:bg-ebuy-error/80 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}