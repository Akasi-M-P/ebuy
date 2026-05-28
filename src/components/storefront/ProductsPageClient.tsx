'use client'

import { useState, useMemo, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { SlidersHorizontal, X, ChevronDown, Grid2x2, LayoutGrid, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import ProductCard from '@/components/storefront/ProductCard'
import type { Product, Category, SortOption } from '@/lib/types'
import { cn } from '@/lib/utils'

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'featured',   label: 'Featured' },
  { value: 'newest',     label: 'Newest' },
  { value: 'price-asc',  label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating',     label: 'Best Rated' },
]

function ProductsPageInner() {
  const params = useSearchParams()
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [categories,  setCategories]  = useState<Category[]>([])
  const [loading,     setLoading]     = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [sort,        setSort]        = useState<SortOption>('featured')
  const [columns,     setColumns]     = useState<2 | 4>(4)
  const [search,      setSearch]      = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [priceMax,    setPriceMax]    = useState(5000)
  const [inStockOnly, setInStockOnly] = useState(false)
  const [visible,     setVisible]     = useState(8)

  useEffect(() => {
    Promise.all([
      fetch('/api/products').then((r) => r.json()),
      fetch('/api/categories').then((r) => r.json()),
    ]).then(([prods, cats]) => {
      setAllProducts(prods)
      setCategories(cats)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    const cat = params.get('category')
    if (cat) setSelectedCategories([cat])
  }, [params])

  const activeProducts = useMemo(() => {
    let result = allProducts.filter((p) => p.status === 'active')
    if (search)
      result = result.filter(
        (p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase())
      )
    if (selectedCategories.length)
      result = result.filter((p) => selectedCategories.includes(p.categorySlug))
    result = result.filter((p) => p.price <= priceMax)
    if (inStockOnly) result = result.filter((p) => p.stock > 0)
    switch (sort) {
      case 'newest':     result = [...result].sort((a, b) => b.createdAt.localeCompare(a.createdAt)); break
      case 'price-asc':  result = [...result].sort((a, b) => a.price - b.price); break
      case 'price-desc': result = [...result].sort((a, b) => b.price - a.price); break
      case 'rating':     result = [...result].sort((a, b) => b.rating - a.rating); break
    }
    return result
  }, [allProducts, search, selectedCategories, priceMax, inStockOnly, sort])

  const toggleCategory = (slug: string) =>
    setSelectedCategories((prev) => prev.includes(slug) ? prev.filter((c) => c !== slug) : [...prev, slug])

  const clearFilters = () => {
    setSelectedCategories([])
    setPriceMax(5000)
    setInStockOnly(false)
    setSearch('')
  }

  const hasFilters = selectedCategories.length > 0 || priceMax < 5000 || inStockOnly || search

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <p className="text-xs tracking-[0.3em] uppercase text-ebuy-gold mb-2">Collections</p>
        <h1 className="font-serif text-4xl sm:text-5xl text-ebuy-text">All Products</h1>
        <p className="text-ebuy-muted mt-2 text-sm">Showing {activeProducts.length} products</p>
      </div>

      <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-ebuy-border flex-wrap">
        <div className="flex items-center gap-3">
          <input
            type="search"
            placeholder="Search products…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-dark max-w-[200px] py-2 text-sm"
          />
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 border rounded text-sm transition-colors ${
              showFilters ? 'border-ebuy-gold text-ebuy-gold' : 'border-ebuy-border text-ebuy-muted hover:border-ebuy-gold hover:text-ebuy-gold'
            }`}
          >
            <SlidersHorizontal size={15} />
            Filters
            {hasFilters && (
              <span className="ml-1 w-4 h-4 rounded-full bg-ebuy-gold text-ebuy-bg text-[9px] font-bold flex items-center justify-center">!</span>
            )}
          </button>
          {hasFilters && (
            <button onClick={clearFilters} className="text-xs text-ebuy-muted hover:text-ebuy-error transition-colors flex items-center gap-1">
              <X size={12} /> Clear all
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="input-dark pr-8 py-2 text-sm appearance-none cursor-pointer"
            >
              {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-ebuy-muted pointer-events-none" />
          </div>
          <div className="hidden sm:flex items-center gap-1 border border-ebuy-border rounded p-1">
            <button
              onClick={() => setColumns(4)}
              className={`p-1.5 rounded transition-colors ${columns === 4 ? 'bg-ebuy-gold text-ebuy-bg' : 'text-ebuy-muted hover:text-ebuy-text'}`}
              aria-label="4-column grid"
            >
              <LayoutGrid size={15} />
            </button>
            <button
              onClick={() => setColumns(2)}
              className={`p-1.5 rounded transition-colors ${columns === 2 ? 'bg-ebuy-gold text-ebuy-bg' : 'text-ebuy-muted hover:text-ebuy-text'}`}
              aria-label="2-column grid"
            >
              <Grid2x2 size={15} />
            </button>
          </div>
        </div>
      </div>

      {selectedCategories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {selectedCategories.map((slug) => {
            const cat = categories.find((c) => c.slug === slug)
            return (
              <button
                key={slug}
                onClick={() => toggleCategory(slug)}
                className="flex items-center gap-1.5 px-3 py-1 bg-ebuy-gold/10 text-ebuy-gold border border-ebuy-gold/30 rounded-full text-xs hover:bg-ebuy-gold/20 transition-colors"
              >
                {cat?.name ?? slug}<X size={11} />
              </button>
            )
          })}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-32">
          <Loader2 size={32} className="animate-spin text-ebuy-gold" />
        </div>
      ) : (
        <div className="flex gap-8">
          <AnimatePresence>
            {showFilters && (
              <motion.aside
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 220, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="hidden lg:block flex-shrink-0 overflow-hidden"
              >
                <div className="w-[220px] space-y-8 pr-4">
                  <div>
                    <p className="text-xs font-semibold tracking-widest uppercase text-ebuy-text mb-4">Category</p>
                    <div className="space-y-2">
                      {categories.map((cat) => (
                        <label key={cat.slug} className="flex items-center gap-3 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={selectedCategories.includes(cat.slug)}
                            onChange={() => toggleCategory(cat.slug)}
                            className="w-4 h-4 accent-ebuy-gold"
                          />
                          <span className="text-sm text-ebuy-muted group-hover:text-ebuy-text transition-colors">{cat.name}</span>
                          <span className="ml-auto text-xs text-ebuy-muted/50">{cat.productCount}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold tracking-widest uppercase text-ebuy-text mb-4">
                      Max Price: <span className="text-ebuy-gold">${priceMax.toLocaleString()}</span>
                    </p>
                    <input
                      type="range" min={100} max={5000} step={100} value={priceMax}
                      onChange={(e) => setPriceMax(Number(e.target.value))}
                      className="w-full accent-ebuy-gold"
                    />
                    <div className="flex justify-between text-xs text-ebuy-muted mt-1">
                      <span>$100</span><span>$5,000</span>
                    </div>
                  </div>
                  <div>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={inStockOnly}
                        onChange={(e) => setInStockOnly(e.target.checked)}
                        className="w-4 h-4 accent-ebuy-gold"
                      />
                      <span className="text-sm text-ebuy-muted">In Stock Only</span>
                    </label>
                  </div>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          <div className="flex-1 min-w-0">
            {activeProducts.length === 0 ? (
              <div className="text-center py-20">
                <p className="font-serif text-2xl text-ebuy-muted mb-3">No products found</p>
                <p className="text-sm text-ebuy-muted/60">Try adjusting your filters or search query.</p>
                <button onClick={clearFilters} className="btn-gold mt-6 text-sm px-8">Clear Filters</button>
              </div>
            ) : (
              <>
                <div className={`grid gap-4 sm:gap-6 ${columns === 4 ? 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-4' : 'grid-cols-2'}`}>
                  {activeProducts.slice(0, visible).map((product, i) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: Math.min(i * 0.05, 0.3) }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </div>
                {visible < activeProducts.length && (
                  <div className="text-center mt-12">
                    <button onClick={() => setVisible((v) => v + 8)} className="btn-outline px-12">Load More</button>
                    <p className="text-xs text-ebuy-muted mt-3">
                      Showing {Math.min(visible, activeProducts.length)} of {activeProducts.length}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default function ProductsPageClient() {
  return (
    <Suspense>
      <ProductsPageInner />
    </Suspense>
  )
}