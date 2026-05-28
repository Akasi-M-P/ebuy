'use client'

import { useState, useEffect, useCallback } from 'react'
import { Search, Download, Eye, Ban, CheckCircle, X, Loader2 } from 'lucide-react'
import { formatPrice, formatDate, cn } from '@/lib/utils'

interface Customer {
  id: string; name: string; email: string; phone: string | null
  status: 'active' | 'blocked'; joinDate: string; lastOrderDate: string | null
  totalOrders: number; totalSpent: number; averageOrderValue: number
}

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading,   setLoading]   = useState(true)
  const [search,    setSearch]    = useState('')
  const [selected,  setSelected]  = useState<Customer | null>(null)
  const [toggling,  setToggling]  = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/admin/customers')
    if (res.ok) setCustomers(await res.json())
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase())
  )

  const toggleBlock = async (customer: Customer) => {
    setToggling(customer.id)
    const newStatus = customer.status === 'active' ? 'blocked' : 'active'
    const res = await fetch(`/api/admin/customers/${customer.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
    if (res.ok) {
      setCustomers(prev => prev.map(c => c.id === customer.id ? { ...c, status: newStatus } : c))
      if (selected?.id === customer.id) setSelected(s => s ? { ...s, status: newStatus } : null)
    }
    setToggling(null)
  }

  return (
    <>
      <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-serif text-3xl text-ebuy-text">Customers</h1>
          <p className="text-sm text-ebuy-muted mt-1">{customers.length} total customers</p>
        </div>
        <button className="btn-outline flex items-center gap-2 text-sm"><Download size={14} /> Export CSV</button>
      </div>

      <div className="relative mb-5 max-w-xs">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ebuy-muted pointer-events-none" />
        <input type="search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email…" className="input-dark !pl-9 py-2 text-sm w-full" />
      </div>

      <div className="bg-ebuy-surface border border-ebuy-border rounded overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 size={24} className="animate-spin text-ebuy-gold" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ebuy-border bg-ebuy-surface-2">
                  {['Customer', 'Joined', 'Orders', 'Total Spent', 'Avg Order', 'Last Order', 'Status', ''].map(h => (
                    <th key={h} className="text-left py-3 px-4 text-xs font-semibold tracking-widest uppercase text-ebuy-muted">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => (
                  <tr key={c.id} className="border-b border-ebuy-border/50 hover:bg-ebuy-surface-2 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-ebuy-gold/20 flex items-center justify-center text-ebuy-gold text-sm font-serif flex-shrink-0">{c.name[0]}</div>
                        <div><p className="text-ebuy-text font-medium">{c.name}</p><p className="text-xs text-ebuy-muted">{c.email}</p></div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-xs text-ebuy-muted">{formatDate(c.joinDate)}</td>
                    <td className="py-3 px-4 text-ebuy-muted">{c.totalOrders}</td>
                    <td className="py-3 px-4 font-semibold tabular-nums text-ebuy-text">{formatPrice(c.totalSpent)}</td>
                    <td className="py-3 px-4 tabular-nums text-ebuy-muted">{c.totalOrders > 0 ? formatPrice(c.averageOrderValue) : '—'}</td>
                    <td className="py-3 px-4 text-xs text-ebuy-muted">{c.lastOrderDate ? formatDate(c.lastOrderDate) : '—'}</td>
                    <td className="py-3 px-4">
                      <span className={cn('text-xs px-2 py-0.5 rounded-full capitalize', c.status === 'active' ? 'bg-ebuy-success/20 text-ebuy-success' : 'bg-ebuy-error/20 text-ebuy-error')}>{c.status}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <button onClick={() => setSelected(c)} className="p-1.5 text-ebuy-muted hover:text-ebuy-gold transition-colors rounded" aria-label="View"><Eye size={14} /></button>
                        <button onClick={() => toggleBlock(c)} disabled={toggling === c.id} className={cn('p-1.5 transition-colors rounded', c.status === 'active' ? 'text-ebuy-muted hover:text-ebuy-error' : 'text-ebuy-muted hover:text-ebuy-success')} aria-label={c.status === 'active' ? 'Block' : 'Unblock'}>
                          {toggling === c.id ? <Loader2 size={14} className="animate-spin" /> : c.status === 'active' ? <Ban size={14} /> : <CheckCircle size={14} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!loading && filtered.length === 0 && <div className="text-center py-12"><p className="text-ebuy-muted text-sm">No customers found.</p></div>}
      </div>

      {/* Customer detail modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-ebuy-surface border border-ebuy-border rounded w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-ebuy-border">
              <h2 className="font-serif text-xl text-ebuy-text">Customer Details</h2>
              <button onClick={() => setSelected(null)} className="text-ebuy-muted hover:text-ebuy-text"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-ebuy-gold/20 flex items-center justify-center text-ebuy-gold text-xl font-serif">{selected.name[0]}</div>
                <div>
                  <p className="text-ebuy-text font-semibold">{selected.name}</p>
                  <p className="text-sm text-ebuy-muted">{selected.email}</p>
                  {selected.phone && <p className="text-xs text-ebuy-muted">{selected.phone}</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Status',       value: <span className={cn('text-xs px-2 py-0.5 rounded-full capitalize', selected.status === 'active' ? 'bg-ebuy-success/20 text-ebuy-success' : 'bg-ebuy-error/20 text-ebuy-error')}>{selected.status}</span> },
                  { label: 'Joined',       value: formatDate(selected.joinDate) },
                  { label: 'Total Orders', value: selected.totalOrders },
                  { label: 'Total Spent',  value: formatPrice(selected.totalSpent) },
                  { label: 'Avg Order',    value: selected.totalOrders > 0 ? formatPrice(selected.averageOrderValue) : '—' },
                  { label: 'Last Order',   value: selected.lastOrderDate ? formatDate(selected.lastOrderDate) : '—' },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-ebuy-surface-2 rounded p-3">
                    <p className="text-xs text-ebuy-muted mb-1">{label}</p>
                    <p className="text-sm text-ebuy-text font-medium">{value}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setSelected(null)} className="btn-outline text-sm flex-1">Close</button>
                <button
                  onClick={() => toggleBlock(selected)}
                  disabled={toggling === selected.id}
                  className={cn('text-sm flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded transition-colors', selected.status === 'active' ? 'bg-ebuy-error/10 text-ebuy-error border border-ebuy-error/30 hover:bg-ebuy-error/20' : 'bg-ebuy-success/10 text-ebuy-success border border-ebuy-success/30 hover:bg-ebuy-success/20')}
                >
                  {toggling === selected.id ? <Loader2 size={14} className="animate-spin" /> : selected.status === 'active' ? <Ban size={14} /> : <CheckCircle size={14} />}
                  {selected.status === 'active' ? 'Block Customer' : 'Unblock Customer'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}