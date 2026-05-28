'use client'

import { useState, useEffect } from 'react'
import {
  LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { Loader2 } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

type Range = '7d' | '30d' | '90d'

const TOOLTIP = {
  contentStyle: { background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: 6, color: '#F5F5F0' },
  itemStyle: { color: '#C9A84C' },
}

// Conversion funnel and traffic source are placeholder — requires external analytics integration
const FUNNEL = [
  { stage: 'Visitors',      pct: 100  },
  { stage: 'Product Views', pct: 48.4 },
  { stage: 'Add to Cart',   pct: 14.2 },
  { stage: 'Checkout',      pct: 5.0  },
  { stage: 'Purchased',     pct: 3.8  },
]
const TRAFFIC = [
  { name: 'Organic Search', value: 38, color: '#C9A84C' },
  { name: 'Direct',         value: 27, color: '#4CAF50' },
  { name: 'Social',         value: 19, color: '#3B82F6' },
  { name: 'Referral',       value: 16, color: '#9A9A90' },
]

interface AnalyticsData {
  kpis: { grossRevenue: number; netRevenue: number; aov: number; aovChange: number; revenueChange: number; refunds: number }
  revenueChart: { date: string; revenue: number; orders: number }[]
  topProducts: { id: string; name: string; revenue: number; units: number; image: string }[]
  ordersByStatus: { name: string; value: number; color: string }[]
}

export default function AdminAnalytics() {
  const [range,   setRange]   = useState<Range>('30d')
  const [data,    setData]    = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/admin/analytics?range=${range}`)
      .then(r => r.json())
      .then(setData)
      .finally(() => setLoading(false))
  }, [range])

  const empty: AnalyticsData = {
    kpis: { grossRevenue: 0, netRevenue: 0, aov: 0, aovChange: 0, revenueChange: 0, refunds: 0 },
    revenueChart: [], topProducts: [], ordersByStatus: [],
  }
  const { kpis, revenueChart, topProducts, ordersByStatus } = data ?? empty

  return (
    <>
      <div className="flex items-start justify-between gap-4 flex-wrap mb-8">
        <div>
          <h1 className="font-serif text-3xl text-ebuy-text">Analytics</h1>
          <p className="text-sm text-ebuy-muted mt-1">Store performance overview</p>
        </div>
        <div className="flex gap-1 bg-ebuy-surface border border-ebuy-border rounded p-1">
          {(['7d', '30d', '90d'] as Range[]).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1.5 text-xs rounded transition-colors ${range === r ? 'bg-ebuy-gold text-ebuy-bg font-semibold' : 'text-ebuy-muted hover:text-ebuy-text'}`}
            >
              {r === '7d' ? 'Last 7 days' : r === '30d' ? 'Last 30 days' : 'Last 90 days'}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-32">
          <Loader2 size={28} className="animate-spin text-ebuy-gold" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Gross Revenue',   value: formatPrice(kpis.grossRevenue), sub: `${kpis.revenueChange >= 0 ? '+' : ''}${kpis.revenueChange.toFixed(1)}% vs prev period` },
              { label: 'Net Revenue',     value: formatPrice(kpis.netRevenue),   sub: 'After refunds & discounts' },
              { label: 'Avg Order Value', value: formatPrice(kpis.aov),          sub: `${kpis.aovChange >= 0 ? '+' : ''}${kpis.aovChange.toFixed(1)}% vs prev period` },
              { label: 'Refunds',         value: formatPrice(kpis.refunds),      sub: 'No payment processor connected' },
            ].map((s) => (
              <div key={s.label} className="bg-ebuy-surface border border-ebuy-border rounded p-5">
                <p className="text-2xl font-semibold text-ebuy-text tabular-nums mb-1">{s.value}</p>
                <p className="text-xs font-medium text-ebuy-muted">{s.label}</p>
                <p className="text-[11px] text-ebuy-muted/60 mt-0.5">{s.sub}</p>
              </div>
            ))}
          </div>

          <div className="bg-ebuy-surface border border-ebuy-border rounded p-6 mb-6">
            <h2 className="font-semibold text-ebuy-text text-sm mb-4">Revenue Over Time</h2>
            {revenueChart.length === 0 ? (
              <p className="text-xs text-ebuy-muted text-center py-8">No orders in this period</p>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={revenueChart}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9A9A90' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#9A9A90' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip {...TOOLTIP} formatter={(v: number) => [formatPrice(v), 'Revenue']} />
                  <Line type="monotone" dataKey="revenue" stroke="#C9A84C" strokeWidth={2.5} dot={false} />
                  <Line type="monotone" dataKey="orders" stroke="#9A9A90" strokeWidth={1.5} dot={false} strokeDasharray="4 2" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
            <div className="bg-ebuy-surface border border-ebuy-border rounded p-6">
              <h2 className="font-semibold text-ebuy-text text-sm mb-4">Top Products by Revenue</h2>
              {topProducts.length === 0 ? (
                <p className="text-xs text-ebuy-muted text-center py-8">No sales data in this period</p>
              ) : (
                <div className="space-y-4">
                  {topProducts.map((p, i) => (
                    <div key={p.id} className="flex items-center gap-3">
                      <span className="text-xs text-ebuy-muted w-4 text-right">{i + 1}</span>
                      {p.image && <img src={p.image} alt={p.name} className="w-9 h-9 rounded object-cover bg-ebuy-surface-2 flex-shrink-0" />}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-ebuy-text truncate">{p.name}</p>
                        <div className="h-1 bg-ebuy-surface-2 rounded-full overflow-hidden mt-1">
                          <div className="h-full bg-ebuy-gold rounded-full" style={{ width: `${topProducts[0].revenue ? (p.revenue / topProducts[0].revenue) * 100 : 0}%` }} />
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-semibold tabular-nums text-ebuy-text">{formatPrice(p.revenue)}</p>
                        <p className="text-xs text-ebuy-muted">{p.units} units</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-ebuy-surface border border-ebuy-border rounded p-6">
              <h2 className="font-semibold text-ebuy-text text-sm mb-1">Traffic Sources</h2>
              <p className="text-[11px] text-ebuy-muted/60 mb-4">Estimated — connect an analytics provider for real data</p>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={TRAFFIC} innerRadius={40} outerRadius={65} dataKey="value" paddingAngle={3}>
                    {TRAFFIC.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: 6, color: '#F5F5F0' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-3">
                {TRAFFIC.map((s) => (
                  <div key={s.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                      <span className="text-ebuy-muted">{s.name}</span>
                    </div>
                    <span className="text-ebuy-text font-medium">{s.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="bg-ebuy-surface border border-ebuy-border rounded p-6">
              <h2 className="font-semibold text-ebuy-text text-sm mb-1">Conversion Funnel</h2>
              <p className="text-[11px] text-ebuy-muted/60 mb-4">Estimated — requires storefront analytics tracking</p>
              <div className="space-y-2">
                {FUNNEL.map((f, i) => (
                  <div key={f.stage}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-ebuy-muted">{f.stage}</span>
                      <span className="text-ebuy-muted">({f.pct}%)</span>
                    </div>
                    <div className="h-6 bg-ebuy-surface-2 rounded overflow-hidden">
                      <div className="h-full rounded" style={{ width: `${f.pct}%`, background: `rgba(201, 168, 76, ${1 - i * 0.15})` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-ebuy-surface border border-ebuy-border rounded p-6">
              <h2 className="font-semibold text-ebuy-text text-sm mb-4">Orders by Status</h2>
              {ordersByStatus.length === 0 ? (
                <p className="text-xs text-ebuy-muted text-center py-8">No orders yet</p>
              ) : (
                <>
                  <ResponsiveContainer width="100%" height={160}>
                    <PieChart>
                      <Pie data={ordersByStatus} innerRadius={40} outerRadius={65} dataKey="value" paddingAngle={3}>
                        {ordersByStatus.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                      </Pie>
                      <Tooltip contentStyle={{ background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: 6, color: '#F5F5F0' }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-2 mt-3">
                    {ordersByStatus.map((s) => (
                      <div key={s.name} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                          <span className="text-ebuy-muted capitalize">{s.name}</span>
                        </div>
                        <span className="text-ebuy-text font-medium">{s.value}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </>
  )
}