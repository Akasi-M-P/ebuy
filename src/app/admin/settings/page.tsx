'use client'

import { useState, useEffect, useCallback } from 'react'
import { Save, Eye, EyeOff, Plus, Trash2, Loader2, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { brandCssVars } from '@/lib/colorUtils'

const TABS = ['General', 'Shipping', 'Payments', 'Notifications', 'Admin Users']

interface AdminUser { id: string; name: string; email: string; createdAt: string }
type Settings = Record<string, string>

export default function AdminSettings() {
  const [tab,      setTab]      = useState(0)
  const [settings, setSettings] = useState<Settings>({})
  const [loading,  setLoading]  = useState(true)
  const [saving,   setSaving]   = useState(false)
  const [saved,    setSaved]    = useState(false)

  // Admin users state
  const [admins,       setAdmins]       = useState<AdminUser[]>([])
  const [adminsLoading, setAdminsLoading] = useState(false)
  const [showInvite,   setShowInvite]   = useState(false)
  const [inviteForm,   setInviteForm]   = useState({ name: '', email: '', password: '' })
  const [inviting,     setInviting]     = useState(false)
  const [inviteError,  setInviteError]  = useState('')
  const [revokingId,   setRevokingId]   = useState<string | null>(null)
  const [showStripeSecret, setShowStripeSecret] = useState(false)

  const loadSettings = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/admin/settings')
    if (res.ok) setSettings(await res.json())
    setLoading(false)
  }, [])

  const loadAdmins = useCallback(async () => {
    setAdminsLoading(true)
    const res = await fetch('/api/admin/users')
    if (res.ok) setAdmins(await res.json())
    setAdminsLoading(false)
  }, [])

  useEffect(() => { loadSettings() }, [loadSettings])
  useEffect(() => { if (tab === 4) loadAdmins() }, [tab, loadAdmins])

  const set = (key: string, value: string) => {
    setSettings(s => ({ ...s, [key]: value }))
    if (key === 'brand_color' && /^#[0-9a-fA-F]{6}$/.test(value)) {
      const vars = brandCssVars(value)
      const root = document.documentElement
      Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v))
    }
  }

  const saveSection = async (keys: string[]) => {
    setSaving(true)
    const patch = Object.fromEntries(keys.map(k => [k, settings[k] ?? '']))
    const res = await fetch('/api/admin/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    })
    if (res.ok) {
      setSettings(await res.json())
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    }
    setSaving(false)
  }

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    setInviting(true)
    setInviteError('')
    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inviteForm),
    })
    if (res.ok) {
      const user: AdminUser = await res.json()
      setAdmins(prev => [...prev, user])
      setShowInvite(false)
      setInviteForm({ name: '', email: '', password: '' })
    } else {
      const { error } = await res.json()
      setInviteError(error ?? 'Failed to create admin')
    }
    setInviting(false)
  }

  const handleRevoke = async (id: string) => {
    setRevokingId(id)
    const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' })
    if (res.ok) setAdmins(prev => prev.filter(u => u.id !== id))
    setRevokingId(null)
  }

  const SaveBtn = ({ keys }: { keys: string[] }) => (
    <button
      type="button"
      onClick={() => saveSection(keys)}
      disabled={saving}
      className="btn-gold flex items-center gap-2 text-sm"
    >
      {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
      {saved ? 'Saved!' : 'Save Changes'}
    </button>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 size={28} className="animate-spin text-ebuy-gold" />
      </div>
    )
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="font-serif text-3xl text-ebuy-text">Settings</h1>
        <p className="text-sm text-ebuy-muted mt-1">Configure your store preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <nav className="lg:w-48 flex-shrink-0">
          <div className="bg-ebuy-surface border border-ebuy-border rounded overflow-hidden">
            {TABS.map((t, i) => (
              <button
                key={t}
                onClick={() => setTab(i)}
                className={cn(
                  'w-full text-left px-4 py-3 text-sm border-b border-ebuy-border last:border-0 transition-colors',
                  tab === i ? 'bg-ebuy-gold/10 text-ebuy-gold' : 'text-ebuy-muted hover:text-ebuy-text hover:bg-ebuy-surface-2'
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </nav>

        <div className="flex-1 max-w-xl">

          {/* General */}
          {tab === 0 && (
            <div className="bg-ebuy-surface border border-ebuy-border rounded p-6 space-y-5">
              <h2 className="font-serif text-xl text-ebuy-text mb-2">General Settings</h2>
              {[
                { label: 'Store Name',    key: 'store_name',    placeholder: 'eBuy' },
                { label: 'Store Email',   key: 'store_email',   placeholder: 'hello@ebuy.com', type: 'email' },
                { label: 'Store Phone',   key: 'store_phone',   placeholder: '+1 (555) 000-0000', type: 'tel' },
                { label: 'Store Address', key: 'store_address', placeholder: '123 Commerce Street, New York, NY 10001' },
              ].map(({ label, key, placeholder, type = 'text' }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold tracking-widest uppercase text-ebuy-muted mb-2">{label}</label>
                  <input
                    type={type}
                    value={settings[key] ?? ''}
                    onChange={e => set(key, e.target.value)}
                    placeholder={placeholder}
                    className="input-dark"
                  />
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold tracking-widest uppercase text-ebuy-muted mb-2">Currency</label>
                <select value={settings.currency ?? 'USD'} onChange={e => set('currency', e.target.value)} className="input-dark">
                  <option value="USD">USD — US Dollar ($)</option>
                  <option value="EUR">EUR — Euro (€)</option>
                  <option value="GBP">GBP — British Pound (£)</option>
                  <option value="JPY">JPY — Japanese Yen (¥)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold tracking-widest uppercase text-ebuy-muted mb-2">Timezone</label>
                <select value={settings.timezone ?? 'UTC-5'} onChange={e => set('timezone', e.target.value)} className="input-dark">
                  <option value="UTC-5">UTC-5 — Eastern Time (US)</option>
                  <option value="UTC-8">UTC-8 — Pacific Time (US)</option>
                  <option value="UTC+0">UTC+0 — GMT (London)</option>
                  <option value="UTC+9">UTC+9 — Japan Standard Time</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold tracking-widest uppercase text-ebuy-muted mb-2">Brand Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={settings.brand_color ?? '#C9A84C'}
                    onChange={e => set('brand_color', e.target.value)}
                    className="w-10 h-10 rounded cursor-pointer border border-ebuy-border bg-transparent p-0.5"
                  />
                  <input
                    type="text"
                    value={settings.brand_color ?? '#C9A84C'}
                    onChange={e => set('brand_color', e.target.value)}
                    placeholder="#C9A84C"
                    className="input-dark font-mono"
                    maxLength={7}
                  />
                </div>
                <p className="text-xs text-ebuy-muted/60 mt-1">Applied to buttons, badges, and accent elements across the storefront.</p>
              </div>
              <SaveBtn keys={['store_name','store_email','store_phone','store_address','currency','timezone','brand_color']} />
            </div>
          )}

          {/* Shipping */}
          {tab === 1 && (
            <div className="bg-ebuy-surface border border-ebuy-border rounded p-6 space-y-5">
              <h2 className="font-serif text-xl text-ebuy-text mb-2">Shipping Settings</h2>
              <div>
                <label className="flex items-center justify-between gap-4 mb-4">
                  <span className="text-sm font-medium text-ebuy-text">Enable free shipping</span>
                  <input
                    type="checkbox"
                    checked={settings.free_shipping_enabled === 'true'}
                    onChange={e => set('free_shipping_enabled', String(e.target.checked))}
                    className="w-4 h-4 accent-ebuy-gold"
                  />
                </label>
                <div>
                  <label className="block text-xs font-semibold tracking-widest uppercase text-ebuy-muted mb-2">Free Shipping Minimum Order ($)</label>
                  <input
                    type="number"
                    min="0"
                    value={settings.free_shipping_minimum ?? '150'}
                    onChange={e => set('free_shipping_minimum', e.target.value)}
                    className="input-dark"
                  />
                  <p className="text-xs text-ebuy-muted/60 mt-1">Orders above this amount qualify for free shipping.</p>
                </div>
              </div>
              <div className="border-t border-ebuy-border pt-4 space-y-4">
                <p className="text-sm font-semibold text-ebuy-text">Shipping Methods</p>
                {[
                  { name: 'Standard (5–7 days)', price: 'Free' },
                  { name: 'Express (2–3 days)',  price: '$12.99' },
                  { name: 'Next-Day',            price: '$24.99' },
                ].map((m) => (
                  <div key={m.name} className="flex items-center justify-between border border-ebuy-border rounded p-3">
                    <span className="text-sm text-ebuy-muted">{m.name}</span>
                    <span className="text-sm font-medium text-ebuy-gold">{m.price}</span>
                  </div>
                ))}
              </div>
              <SaveBtn keys={['free_shipping_enabled','free_shipping_minimum']} />
            </div>
          )}

          {/* Payments */}
          {tab === 2 && (
            <div className="bg-ebuy-surface border border-ebuy-border rounded p-6 space-y-5">
              <h2 className="font-serif text-xl text-ebuy-text mb-2">Payment Settings</h2>
              <div className="p-3 bg-ebuy-gold/5 border border-ebuy-gold/30 rounded text-xs text-ebuy-gold">
                Test mode is enabled. No real charges will be made.
              </div>
              <div>
                <label className="block text-xs font-semibold tracking-widest uppercase text-ebuy-muted mb-2">Stripe Publishable Key</label>
                <input
                  type="text"
                  value={settings.stripe_pk ?? ''}
                  onChange={e => set('stripe_pk', e.target.value)}
                  placeholder="pk_test_..."
                  className="input-dark"
                />
                <p className="text-xs text-ebuy-muted/60 mt-1">Used in the browser to initialize Stripe.</p>
              </div>
              <div>
                <label className="block text-xs font-semibold tracking-widest uppercase text-ebuy-muted mb-2">Stripe Secret Key</label>
                <div className="relative">
                  <input
                    type={showStripeSecret ? 'text' : 'password'}
                    value={settings.stripe_sk ?? ''}
                    onChange={e => set('stripe_sk', e.target.value)}
                    placeholder="sk_test_..."
                    className="input-dark pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowStripeSecret(!showStripeSecret)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ebuy-muted hover:text-ebuy-text"
                  >
                    {showStripeSecret ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                <p className="text-xs text-ebuy-muted/60 mt-1">Never share your secret key publicly.</p>
              </div>
              <div>
                <label className="block text-xs font-semibold tracking-widest uppercase text-ebuy-muted mb-2">PayPal Client ID</label>
                <input
                  type="text"
                  value={settings.paypal_client_id ?? ''}
                  onChange={e => set('paypal_client_id', e.target.value)}
                  placeholder="AYSq3RDGsmBLJE-otTkBtM..."
                  className="input-dark"
                />
              </div>
              <div className="space-y-2 pt-2">
                {[
                  { label: 'Credit / Debit Cards', key: 'pay_cards' },
                  { label: 'Apple Pay',             key: 'pay_apple' },
                  { label: 'Google Pay',            key: 'pay_google' },
                  { label: 'PayPal',                key: 'pay_paypal' },
                ].map(({ label, key }) => (
                  <label key={key} className="flex items-center justify-between gap-4 py-2 border-b border-ebuy-border/50 last:border-0 cursor-pointer">
                    <span className="text-sm text-ebuy-muted">{label}</span>
                    <input
                      type="checkbox"
                      checked={settings[key] !== 'false'}
                      onChange={e => set(key, String(e.target.checked))}
                      className="w-4 h-4 accent-ebuy-gold"
                    />
                  </label>
                ))}
              </div>
              <SaveBtn keys={['stripe_pk','stripe_sk','paypal_client_id','pay_cards','pay_apple','pay_google','pay_paypal']} />
            </div>
          )}

          {/* Notifications */}
          {tab === 3 && (
            <div className="bg-ebuy-surface border border-ebuy-border rounded p-6 space-y-5">
              <h2 className="font-serif text-xl text-ebuy-text mb-2">Notifications</h2>
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase text-ebuy-muted mb-3">Admin Alerts</p>
                {[
                  { label: 'New order received',       key: 'notify_new_order' },
                  { label: 'Low stock alert',           key: 'notify_low_stock' },
                  { label: 'New customer signup',       key: 'notify_new_customer' },
                  { label: 'Refund request received',   key: 'notify_refund_request' },
                ].map(({ label, key }) => (
                  <label key={key} className="flex items-center justify-between gap-4 py-2.5 border-b border-ebuy-border/50 last:border-0 cursor-pointer">
                    <span className="text-sm text-ebuy-muted">{label}</span>
                    <input
                      type="checkbox"
                      checked={settings[key] !== 'false'}
                      onChange={e => set(key, String(e.target.checked))}
                      className="w-4 h-4 accent-ebuy-gold"
                    />
                  </label>
                ))}
              </div>
              <div className="pt-2">
                <p className="text-xs font-semibold tracking-widest uppercase text-ebuy-muted mb-3">Customer Email Templates</p>
                {['Order Confirmation', 'Shipping Notification', 'Password Reset', 'Review Request'].map((t) => (
                  <div key={t} className="flex items-center justify-between py-2.5 border-b border-ebuy-border/50 last:border-0">
                    <span className="text-sm text-ebuy-muted">{t}</span>
                    <button className="text-xs text-ebuy-gold hover:text-ebuy-gold-light transition-colors border border-ebuy-gold/40 px-2.5 py-1 rounded">
                      Preview
                    </button>
                  </div>
                ))}
              </div>
              <SaveBtn keys={['notify_new_order','notify_low_stock','notify_new_customer','notify_refund_request']} />
            </div>
          )}

          {/* Admin Users */}
          {tab === 4 && (
            <div className="bg-ebuy-surface border border-ebuy-border rounded p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-serif text-xl text-ebuy-text">Admin Users</h2>
                <button onClick={() => setShowInvite(true)} className="btn-gold text-sm flex items-center gap-1.5">
                  <Plus size={14} /> Add Admin
                </button>
              </div>

              {adminsLoading ? (
                <div className="flex justify-center py-8"><Loader2 size={20} className="animate-spin text-ebuy-gold" /></div>
              ) : (
                <div className="space-y-3">
                  {admins.map((u) => (
                    <div key={u.id} className="flex items-center justify-between gap-4 p-4 border border-ebuy-border rounded">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-ebuy-gold/20 flex items-center justify-center text-ebuy-gold font-serif text-sm flex-shrink-0">
                          {u.name?.[0] ?? u.email[0]}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-ebuy-text">{u.name ?? '—'}</p>
                          <p className="text-xs text-ebuy-muted">{u.email}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRevoke(u.id)}
                        disabled={revokingId === u.id}
                        className="text-xs text-ebuy-error hover:text-ebuy-error/80 transition-colors flex items-center gap-1"
                      >
                        {revokingId === u.id ? <Loader2 size={11} className="animate-spin" /> : <Trash2 size={11} />}
                        Revoke
                      </button>
                    </div>
                  ))}
                  {admins.length === 0 && <p className="text-sm text-ebuy-muted text-center py-6">No admin users found.</p>}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Invite admin modal */}
      {showInvite && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-ebuy-surface border border-ebuy-border rounded w-full max-w-sm">
            <div className="flex items-center justify-between p-5 border-b border-ebuy-border">
              <h3 className="font-serif text-lg text-ebuy-text">Add Admin User</h3>
              <button onClick={() => { setShowInvite(false); setInviteError('') }} className="text-ebuy-muted hover:text-ebuy-text"><X size={18} /></button>
            </div>
            <form onSubmit={handleInvite} className="p-5 space-y-4">
              {inviteError && <p className="text-xs text-ebuy-error bg-ebuy-error/10 border border-ebuy-error/30 rounded p-2">{inviteError}</p>}
              <div>
                <label className="block text-xs font-semibold tracking-widest uppercase text-ebuy-muted mb-1.5">Name *</label>
                <input required value={inviteForm.name} onChange={e => setInviteForm(f => ({ ...f, name: e.target.value }))} className="input-dark" placeholder="Jane Smith" />
              </div>
              <div>
                <label className="block text-xs font-semibold tracking-widest uppercase text-ebuy-muted mb-1.5">Email *</label>
                <input required type="email" value={inviteForm.email} onChange={e => setInviteForm(f => ({ ...f, email: e.target.value }))} className="input-dark" placeholder="jane@ebuy.com" />
              </div>
              <div>
                <label className="block text-xs font-semibold tracking-widest uppercase text-ebuy-muted mb-1.5">Password *</label>
                <input required type="password" value={inviteForm.password} onChange={e => setInviteForm(f => ({ ...f, password: e.target.value }))} className="input-dark" placeholder="Min 8 characters" minLength={8} />
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => { setShowInvite(false); setInviteError('') }} className="btn-outline text-sm flex-1">Cancel</button>
                <button type="submit" disabled={inviting} className="btn-gold text-sm flex-1 flex items-center justify-center gap-2">
                  {inviting && <Loader2 size={14} className="animate-spin" />}
                  Create Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}