'use client'

import { useState, useEffect, useCallback } from 'react'
import { Plus, Search, Edit2, Trash2, ChevronDown, ChevronUp, X, Loader2, ImagePlus } from 'lucide-react'
import { formatPrice, formatDate, cn } from '@/lib/utils'

type ProductStatus = 'active' | 'draft' | 'archived'
type SortField = 'name' | 'price' | 'stock' | 'createdAt'

const STATUS_CLASSES: Record<ProductStatus, string> = {
  active:   'bg-ebuy-success/20 text-ebuy-success',
  draft:    'bg-ebuy-muted/20 text-ebuy-muted',
  archived: 'bg-ebuy-error/20 text-ebuy-error',
}

const CATEGORIES = ['Smartphones', 'Laptops', 'Audio', 'Gaming']

interface Product {
  id: string; name: string; brand: string; category: string
  images: string[]; price: number; compareAtPrice: number | null
  stock: number; sku: string; status: ProductStatus; createdAt: string
  shortDescription?: string
}

const EMPTY_FORM = {
  name: '', brand: '', category: 'Smartphones', price: '', compareAtPrice: '',
  stock: '', sku: '', shortDescription: '', status: 'active' as ProductStatus,
  images: [] as string[],
}

export default function AdminProducts() {
  const [products,      setProducts]      = useState<Product[]>([])
  const [loading,       setLoading]       = useState(true)
  const [search,        setSearch]        = useState('')
  const [statusFilter,  setStatusFilter]  = useState<ProductStatus | 'all'>('all')
  const [sortField,     setSortField]     = useState<SortField>('createdAt')
  const [sortDir,       setSortDir]       = useState<'asc' | 'desc'>('desc')
  const [page,          setPage]          = useState(1)
  const [showModal,     setShowModal]     = useState(false)
  const [editTarget,    setEditTarget]    = useState<Product | null>(null)
  const [form,          setForm]          = useState(EMPTY_FORM)
  const [saving,        setSaving]        = useState(false)
  const [deleteId,      setDeleteId]      = useState<string | null>(null)
  const [uploadingImg,  setUploadingImg]  = useState(false)
  const PER_PAGE = 8

  const load = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/admin/products')
    if (res.ok) setProducts(await res.json())
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortField(field); setSortDir('asc') }
  }

  const openCreate = () => { setEditTarget(null); setForm(EMPTY_FORM); setShowModal(true) }
  const openEdit   = (p: Product) => {
    setEditTarget(p)
    setForm({
      name: p.name, brand: p.brand, category: p.category,
      price: String(p.price), compareAtPrice: p.compareAtPrice ? String(p.compareAtPrice) : '',
      stock: String(p.stock), sku: p.sku, shortDescription: p.shortDescription ?? '',
      status: p.status, images: p.images,
    })
    setShowModal(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const url    = editTarget ? `/api/admin/products/${editTarget.id}` : '/api/admin/products'
    const method = editTarget ? 'PATCH' : 'POST'
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    if (res.ok) {
      const saved: Product = await res.json()
      setProducts(prev => editTarget ? prev.map(p => p.id === saved.id ? saved : p) : [saved, ...prev])
      setShowModal(false)
    }
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
    if (res.ok) { setProducts(prev => prev.filter(p => p.id !== id)); setDeleteId(null) }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingImg(true)
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
    if (res.ok) {
      const { url } = await res.json()
      setForm(f => ({ ...f, images: [...f.images, url] }))
    }
    setUploadingImg(false)
    e.target.value = ''
  }

  const removeImage = (index: number) => {
    setForm(f => ({ ...f, images: f.images.filter((_, i) => i !== index) }))
  }

  const filtered = products
    .filter(p => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase())
      const matchStatus = statusFilter === 'all' || p.status === statusFilter
      return matchSearch && matchStatus
    })
    .sort((a, b) => {
      const m = sortDir === 'asc' ? 1 : -1
      if (sortField === 'name')      return m * a.name.localeCompare(b.name)
      if (sortField === 'price')     return m * (a.price - b.price)
      if (sortField === 'stock')     return m * (a.stock - b.stock)
      if (sortField === 'createdAt') return m * (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      return 0
    })

  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const SortIcon = ({ field }: { field: SortField }) =>
    sortField === field ? (sortDir === 'asc' ? <ChevronUp size={12} className="inline ml-0.5" /> : <ChevronDown size={12} className="inline ml-0.5" />) : null

  return (
    <>
      <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-serif text-3xl text-ebuy-text">Products</h1>
          <p className="text-sm text-ebuy-muted mt-1">{products.length} total products</p>
        </div>
        <button onClick={openCreate} className="btn-gold flex items-center gap-2 text-sm"><Plus size={15} /> Add Product</button>
      </div>

      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ebuy-muted pointer-events-none" />
          <input type="search" value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} placeholder="Search products…" className="input-dark pl-9 py-2 text-sm max-w-[220px]" />
        </div>
        {(['all', 'active', 'draft', 'archived'] as const).map(s => (
          <button key={s} onClick={() => { setStatusFilter(s); setPage(1) }} className={cn('px-3 py-1.5 border rounded text-xs capitalize transition-colors', statusFilter === s ? 'border-ebuy-gold text-ebuy-gold bg-ebuy-gold/10' : 'border-ebuy-border text-ebuy-muted hover:border-ebuy-muted')}>{s}</button>
        ))}
      </div>

      <div className="bg-ebuy-surface border border-ebuy-border rounded overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 size={24} className="animate-spin text-ebuy-gold" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ebuy-border bg-ebuy-surface-2">
                  <th className="text-left py-3 px-4 text-xs font-semibold tracking-widest uppercase text-ebuy-muted">Product</th>
                  {([{ label: 'Category', field: null }, { label: 'Price', field: 'price' as SortField }, { label: 'Stock', field: 'stock' as SortField }, { label: 'Status', field: null }, { label: 'Created', field: 'createdAt' as SortField }, { label: '', field: null }] as const).map(({ label, field }) => (
                    <th key={label} className={cn('text-left py-3 px-4 text-xs font-semibold tracking-widest uppercase text-ebuy-muted', field && 'cursor-pointer hover:text-ebuy-text select-none')} onClick={() => field && handleSort(field as SortField)}>
                      {label}{field && <SortIcon field={field as SortField} />}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.map(p => (
                  <tr key={p.id} className="border-b border-ebuy-border/50 hover:bg-ebuy-surface-2 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {p.images[0]
                          ? <img src={p.images[0]} alt={p.name} className="w-10 h-10 rounded object-cover bg-ebuy-surface-2 flex-shrink-0" />
                          : <div className="w-10 h-10 rounded bg-ebuy-surface-2 flex-shrink-0 flex items-center justify-center text-ebuy-muted"><ImagePlus size={14} /></div>
                        }
                        <div><p className="text-ebuy-text font-medium">{p.name}</p><p className="text-xs text-ebuy-muted">{p.sku}</p></div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-ebuy-muted">{p.category}</td>
                    <td className="py-3 px-4 font-semibold tabular-nums text-ebuy-text">{formatPrice(p.price)}</td>
                    <td className="py-3 px-4"><span className={cn('text-xs font-medium', p.stock < 5 ? 'text-ebuy-error' : 'text-ebuy-muted')}>{p.stock}</span></td>
                    <td className="py-3 px-4"><span className={cn('text-xs px-2 py-0.5 rounded-full capitalize', STATUS_CLASSES[p.status])}>{p.status}</span></td>
                    <td className="py-3 px-4 text-xs text-ebuy-muted">{formatDate(p.createdAt)}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(p)} className="p-1.5 text-ebuy-muted hover:text-ebuy-gold transition-colors rounded"><Edit2 size={14} /></button>
                        <button onClick={() => setDeleteId(p.id)} className="p-1.5 text-ebuy-muted hover:text-ebuy-error transition-colors rounded"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!loading && filtered.length === 0 && <div className="text-center py-12"><p className="text-ebuy-muted text-sm">No products found.</p></div>}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-ebuy-border">
            <p className="text-xs text-ebuy-muted">Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}</p>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                <button key={n} onClick={() => setPage(n)} className={cn('w-7 h-7 text-xs rounded transition-colors', n === page ? 'bg-ebuy-gold text-ebuy-bg font-bold' : 'text-ebuy-muted hover:text-ebuy-text hover:bg-ebuy-surface-2')}>{n}</button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Product form modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-ebuy-surface border border-ebuy-border rounded w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-ebuy-border">
              <h2 className="font-serif text-xl text-ebuy-text">{editTarget ? 'Edit Product' : 'Add Product'}</h2>
              <button onClick={() => setShowModal(false)} className="text-ebuy-muted hover:text-ebuy-text"><X size={18} /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              {/* Images */}
              <div>
                <label className="block text-xs font-semibold tracking-widest uppercase text-ebuy-muted mb-1.5">
                  Photos ({form.images.length}/5)
                </label>
                <div className="flex flex-wrap gap-2">
                  {form.images.map((url, i) => (
                    <div key={i} className="relative w-20 h-20 rounded overflow-hidden border border-ebuy-border group flex-shrink-0">
                      <img src={url} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                      >
                        <X size={16} className="text-white" />
                      </button>
                    </div>
                  ))}
                  {form.images.length < 5 && (
                    <label className={cn(
                      'w-20 h-20 rounded border-2 border-dashed border-ebuy-border flex flex-col items-center justify-center cursor-pointer transition-colors hover:border-ebuy-gold flex-shrink-0',
                      uploadingImg && 'opacity-50 cursor-not-allowed pointer-events-none'
                    )}>
                      {uploadingImg
                        ? <Loader2 size={18} className="animate-spin text-ebuy-gold" />
                        : <><ImagePlus size={18} className="text-ebuy-muted mb-1" /><span className="text-[9px] text-ebuy-muted uppercase tracking-wider">Add</span></>
                      }
                      <input type="file" accept="image/*" className="hidden" disabled={uploadingImg} onChange={handleImageUpload} />
                    </label>
                  )}
                </div>
                <p className="text-[11px] text-ebuy-muted mt-1.5">Upload up to 5 photos. First photo is the main image.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold tracking-widest uppercase text-ebuy-muted mb-1.5">Product Name *</label>
                  <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="input-dark" placeholder="Samsung Galaxy S22" />
                </div>
                <div>
                  <label className="block text-xs font-semibold tracking-widest uppercase text-ebuy-muted mb-1.5">Brand *</label>
                  <input required value={form.brand} onChange={e => setForm(f => ({ ...f, brand: e.target.value }))} className="input-dark" placeholder="Samsung" />
                </div>
                <div>
                  <label className="block text-xs font-semibold tracking-widest uppercase text-ebuy-muted mb-1.5">Category *</label>
                  <select required value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="input-dark">
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold tracking-widest uppercase text-ebuy-muted mb-1.5">Price ($) *</label>
                  <input required type="number" step="0.01" min="0" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} className="input-dark" placeholder="999.00" />
                </div>
                <div>
                  <label className="block text-xs font-semibold tracking-widest uppercase text-ebuy-muted mb-1.5">Compare At ($)</label>
                  <input type="number" step="0.01" min="0" value={form.compareAtPrice} onChange={e => setForm(f => ({ ...f, compareAtPrice: e.target.value }))} className="input-dark" placeholder="Optional" />
                </div>
                <div>
                  <label className="block text-xs font-semibold tracking-widest uppercase text-ebuy-muted mb-1.5">Stock *</label>
                  <input required type="number" min="0" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} className="input-dark" placeholder="0" />
                </div>
                <div>
                  <label className="block text-xs font-semibold tracking-widest uppercase text-ebuy-muted mb-1.5">SKU *</label>
                  <input required value={form.sku} onChange={e => setForm(f => ({ ...f, sku: e.target.value }))} className="input-dark" placeholder="PROD-001" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold tracking-widest uppercase text-ebuy-muted mb-1.5">Short Description</label>
                  <textarea rows={2} value={form.shortDescription} onChange={e => setForm(f => ({ ...f, shortDescription: e.target.value }))} className="input-dark resize-none" placeholder="One-line product summary…" />
                </div>
                <div>
                  <label className="block text-xs font-semibold tracking-widest uppercase text-ebuy-muted mb-1.5">Status</label>
                  <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as ProductStatus }))} className="input-dark">
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="btn-outline text-sm">Cancel</button>
                <button type="submit" disabled={saving || uploadingImg} className="btn-gold text-sm flex items-center gap-2">
                  {saving && <Loader2 size={14} className="animate-spin" />}
                  {editTarget ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-ebuy-surface border border-ebuy-border rounded p-6 w-full max-w-sm">
            <h3 className="font-serif text-lg text-ebuy-text mb-2">Delete Product?</h3>
            <p className="text-sm text-ebuy-muted mb-6">This action cannot be undone. Associated order item history is preserved.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeleteId(null)} className="btn-outline text-sm">Cancel</button>
              <button onClick={() => handleDelete(deleteId)} className="px-4 py-2 bg-ebuy-error text-white text-sm rounded hover:bg-ebuy-error/80 transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}