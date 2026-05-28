// ─── Product ──────────────────────────────────────────────────────────────────

export interface ProductVariant {
  id: string
  color?: string
  colorHex?: string
  size?: string
  stock: number
  price?: number
  sku: string
  image?: string
}

export interface ProductReview {
  id: string
  author: string
  location: string
  rating: number
  title: string
  body: string
  date: string
  verified: boolean
}

export interface Product {
  id: string
  slug: string
  name: string
  brand: string
  category: string
  categorySlug: string
  images: string[]
  price: number
  compareAtPrice?: number
  description: string
  shortDescription: string
  details: string[]
  careInstructions?: string[]
  shippingInfo: string
  box?: string[]
  variants?: ProductVariant[]
  tags: string[]
  rating: number
  reviewCount: number
  reviews?: ProductReview[]
  stock: number
  sku: string
  weight?: number
  isNew?: boolean
  isFeatured?: boolean
  status: 'active' | 'draft' | 'archived'
  createdAt: string
}

export interface Category {
  id: string
  name: string
  slug: string
  image: string
  description?: string
  productCount: number
}

// ─── Cart ─────────────────────────────────────────────────────────────────────

export interface CartItem {
  productId: string
  variantId?: string
  name: string
  image: string
  price: number
  quantity: number
  color?: string
  size?: string
  sku: string
}

// ─── Order ────────────────────────────────────────────────────────────────────

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'

export interface OrderItem {
  productId: string
  name: string
  image: string
  price: number
  quantity: number
  variant?: string
  sku: string
}

export interface ShippingAddress {
  fullName: string
  email: string
  phone: string
  address1: string
  address2?: string
  city: string
  state: string
  zip: string
  country: string
}

export interface Order {
  id: string
  orderNumber: string
  customerId: string
  customerName: string
  customerEmail: string
  items: OrderItem[]
  subtotal: number
  shipping: number
  tax: number
  total: number
  status: OrderStatus
  paymentStatus: PaymentStatus
  paymentMethod: string
  shippingAddress: ShippingAddress
  trackingNumber?: string
  carrier?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

// ─── Customer ─────────────────────────────────────────────────────────────────

export interface Customer {
  id: string
  name: string
  email: string
  phone?: string
  avatar?: string
  totalOrders: number
  totalSpent: number
  averageOrderValue: number
  lastOrderDate?: string
  status: 'active' | 'blocked'
  joinDate: string
  lastLogin?: string
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'customer'
  avatar?: string
}

// ─── Marketing ────────────────────────────────────────────────────────────────

export type CouponType = 'percentage' | 'fixed' | 'free_shipping' | 'buy_x_get_y'

export interface Coupon {
  id: string
  code: string
  type: CouponType
  value: number
  minOrderValue?: number
  usageLimit?: number
  usageCount: number
  expiryDate?: string
  status: 'active' | 'expired' | 'disabled'
  createdAt: string
}

// ─── Analytics ────────────────────────────────────────────────────────────────

export interface RevenueDataPoint {
  date: string
  revenue: number
  orders: number
}

export interface TopProduct {
  id: string
  name: string
  revenue: number
  units: number
  image: string
}

// ─── UI Filters ───────────────────────────────────────────────────────────────

export interface FilterOptions {
  categories: string[]
  priceMin: number
  priceMax: number
  sizes: string[]
  colors: string[]
  rating: number | null
  inStockOnly: boolean
}

export type SortOption = 'featured' | 'newest' | 'price-asc' | 'price-desc' | 'rating'

export interface ShippingMethod {
  id: string
  name: string
  description: string
  price: number
  estimatedDays: string
}
