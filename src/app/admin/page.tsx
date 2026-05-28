'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { TrendingUp, TrendingDown, ShoppingCart, Users, DollarSign, BarChart2, Loader2 } from 'lucide-react'
import { formatPrice, formatDate } from '@/lib/utils'

const TOOLTIP_STYLE = {
  contentStyle: { background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: 6, color: '#F5F5F0' },
  itemStyle: { color: '#C9A84C' },
}

const STATUS_COLORS: Record<string, string> = {
  pending:    'bg-ebuy-muted/20 text-ebuy-muted',
  processing: 'bg-blue-500/20 text-blue-400',
  shipped:    'bg-ebuy-gold/20 text-ebuy-gold',
  delivered:  'bg-ebuy-success/20 text-ebuy-success',
  cancelled:  'bg-ebuy-error/20 text-ebuy-error',
  refunded:   'bg-ebuy-error/20 text-ebuy-error',
}

interface Stats {
  kpis: { revenue: number; revenueChange: number; orders: number; ordersChange: number; newCustomers: number; customersChange: number; aov: number; aovChange: number }
  revenueChart: { date: string; revenue: number; orders: number }[]
  ordersByStatus: { name: string; value: number; color: string }[]
  topProducts: { id: string; name: string; revenue: number; units: number; image: string }[]
  lowStock: { id: string; name: string; images: string[]; stock: number; slug: string }[]
  recentOrders: { id: string; orderNumber: string; customerName: string; customerEmail: string; createdAt: string; status: string; total: number }[]
}

function KpiChange({ change }: { change: number }) {
  const up = change >= 0
  return (
    <span className={`flex items-center gap-0.5 text-xs font-semibold ${up ? 'text-ebuy-success' : 'text-ebuy-error'}`}>
      {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
      {Math.abs(change).toFixed(1)}%
    </span>
  )
}

export default function AdminDashboard() {
  const [stats,   setStats]   = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(r => r.json())
      .then(setStats)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 size={28} className="animate-spin text-ebuy-gold" />
      </div>
    )
  }

  const { kpis, revenueChart, ordersByStatus, topProducts, lowStock, recentOrders } = stats ?? {
    kpis: { revenue: 0, revenueChange: 0, orders: 0, ordersChange: 0, newCustomers: 0, customersChange: 0, aov: 0, aovChange: 0 },
    revenueChart: [], ordersByStatus: [], topProducts: [], lowStock: [], recentOrders: [],
  }

  const kpiCards = [
    { label: 'Total Revenue',   value: formatPrice(kpis.revenue),    change: kpis.revenueChange,   icon: DollarSign },
    { label: 'Total Orders',    value: String(kpis.orders),           change: kpis.ordersChange,    icon: ShoppingCart },
    { label: 'New Customers',   value: String(kpis.newCustomers),     change: kpis.customersChange, icon: Users },
    { label: 'Avg Order Value', value: formatPrice(kpis.aov),         change: kpis.aovChange,       icon: BarChart2 },
  ]

  return (
    <>
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-ebuy-text">Dashboard</h1>
        <p className="text-sm text-ebuy-muted mt-1">Overview for the last 14 days</p>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {kpiCards.map((kpi) => (
          <div key={kpi.label} className="bg-ebuy-surface border border-ebuy-border rounded p-5">
            <div className="flex items-start justify-between mb-4">
              <kpi.icon size={18} className="text-ebuy-gold" />
              <KpiChange change={kpi.change} />
            </div>
            <p className="text-2xl font-semibold text-ebuy-text tabular-nums mb-1">{kpi.value}</p>
            <p className="text-xs text-ebuy-muted">{kpi.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        <div className="xl:col-span-2 bg-ebuy-surface border border-ebuy-border rounded p-6">
          <h2 className="font-semibold text-ebuy-text mb-1 text-sm">Revenue Over Time</h2>
          <p className="text-xs text-ebuy-muted mb-4">Last 14 days</p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={revenueChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9A9A90' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9A9A90' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip {...TOOLTIP_STYLE} formatter={(v: number) => [formatPrice(v), 'Revenue']} />
              <Line type="monotone" dataKey="revenue" stroke="#C9A84C" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-ebuy-surface border border-ebuy-border rounded p-6">
          <h2 className="font-semibold text-ebuy-text mb-1 text-sm">Orders by Status</h2>
          <p className="text-xs text-ebuy-muted mb-4">All time</p>
          {ordersByStatus.length === 0 ? (
            <p className="text-xs text-ebuy-muted text-center py-8">No orders yet</p>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={ordersByStatus} innerRadius={45} outerRadius={70} dataKey="value" paddingAngle={3}>
                    {ordersByStatus.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: 6, color: '#F5F5F0' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5 mt-2">
                {ordersByStatus.map((s) => (
                  <div key={s.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: s.color }} />
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

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        <div className="bg-ebuy-surface border border-ebuy-border rounded p-6">
          <h2 className="font-semibold text-ebuy-text mb-1 text-sm">Top Products by Revenue</h2>
          <p className="text-xs text-ebuy-muted mb-4">Last 14 days</p>
          {topProducts.length === 0 ? (
            <p className="text-xs text-ebuy-muted text-center py-8">No sales data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={topProducts} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10, fill: '#9A9A90' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: '#9A9A90' }} axisLine={false} tickLine={false} width={130} />
                <Tooltip {...TOOLTIP_STYLE} formatter={(v: number) => [formatPrice(v), 'Revenue']} />
                <Bar dataKey="revenue" fill="#C9A84C" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-ebuy-surface border border-ebuy-border rounded p-6">
          <h2 className="font-semibold text-ebuy-text mb-1 text-sm">Low Stock Alerts</h2>
          <p className="text-xs text-ebuy-muted mb-4">Products below 10 units</p>
          {lowStock.length === 0 ? (
            <p className="text-xs text-ebuy-muted text-center py-8">All products are well-stocked</p>
          ) : (
            <div className="space-y-3">
              {lowStock.map((p) => (
                <div key={p.id} className="flex items-center gap-3">
                  <img src={p.images[0] ?? ''} alt={p.name} className="w-10 h-10 rounded object-cover bg-ebuy-surface-2 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-ebuy-text truncate">{p.name}</p>
                    <p className={`text-xs ${p.stock < 5 ? 'text-ebuy-error' : 'text-ebuy-muted'}`}>{p.stock} in stock</p>
                  </div>
                  <Link href={`/admin/products`} className="text-xs text-ebuy-gold hover:text-ebuy-gold-light transition-colors border border-ebuy-gold/40 px-2.5 py-1 rounded">
                    Edit
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-ebuy-surface border border-ebuy-border rounded p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-ebuy-text text-sm">Recent Orders</h2>
          <Link href="/admin/orders" className="text-xs text-ebuy-gold hover:text-ebuy-gold-light transition-colors">View all →</Link>
        </div>
        {recentOrders.length === 0 ? (
          <p className="text-sm text-ebuy-muted text-center py-6">No orders yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ebuy-border">
                  {['Order ID', 'Customer', 'Date', 'Status', 'Total', ''].map((h) => (
                    <th key={h} className="text-left py-2 px-3 text-xs font-semibold tracking-widest uppercase text-ebuy-muted first:pl-0 last:pr-0">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-ebuy-border/50 hover:bg-ebuy-surface-2 transition-colors">
                    <td className="py-3 px-3 first:pl-0 font-mono text-xs text-ebuy-gold">{order.orderNumber}</td>
                    <td className="py-3 px-3">
                      <p className="text-ebuy-text">{order.customerName}</p>
                      <p className="text-xs text-ebuy-muted">{order.customerEmail}</p>
                    </td>
                    <td className="py-3 px-3 text-ebuy-muted text-xs">{formatDate(order.createdAt)}</td>
                    <td className="py-3 px-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${STATUS_COLORS[order.status] ?? ''}`}>{order.status}</span>
                    </td>
                    <td className="py-3 px-3 font-semibold tabular-nums text-ebuy-text">{formatPrice(order.total)}</td>
                    <td className="py-3 last:pr-0">
                      <Link href="/admin/orders" className="text-xs text-ebuy-gold hover:text-ebuy-gold-light transition-colors">View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}