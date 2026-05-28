import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem } from '@/lib/types'

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  couponCode: string
  couponType: string   // 'percentage' | 'fixed' | 'free_shipping' | ''
  couponValue: number  // raw DB value: 10 for 10%, 50 for $50 off
  couponError: string

  addItem: (item: CartItem) => void
  removeItem: (productId: string, variantId?: string) => void
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  applyCoupon: (code: string) => Promise<boolean>
  removeCoupon: () => void
  getSubtotal: () => number
  getDiscount: () => number
  getItemCount: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      couponCode: '',
      couponType: '',
      couponValue: 0,
      couponError: '',

      addItem: (item) =>
        set((state) => {
          const existing = state.items.find(
            (i) => i.productId === item.productId && i.variantId === item.variantId
          )
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === item.productId && i.variantId === item.variantId
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            }
          }
          return { items: [...state.items, item] }
        }),

      removeItem: (productId, variantId) =>
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.productId === productId && i.variantId === variantId)
          ),
        })),

      updateQuantity: (productId, quantity, variantId) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter(
                  (i) => !(i.productId === productId && i.variantId === variantId)
                )
              : state.items.map((i) =>
                  i.productId === productId && i.variantId === variantId
                    ? { ...i, quantity }
                    : i
                ),
        })),

      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      applyCoupon: async (code) => {
        const upper = code.trim().toUpperCase()
        set({ couponError: '' })
        try {
          const res = await fetch(`/api/coupons/validate?code=${encodeURIComponent(upper)}`)
          const data = await res.json()
          if (!res.ok) {
            set({ couponError: data.error ?? 'Invalid or expired coupon code.' })
            return false
          }
          set({ couponCode: upper, couponType: data.couponType, couponValue: data.couponValue, couponError: '' })
          return true
        } catch {
          set({ couponError: 'Could not validate coupon. Please try again.' })
          return false
        }
      },

      removeCoupon: () => set({ couponCode: '', couponType: '', couponValue: 0, couponError: '' }),

      getSubtotal: () =>
        get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),

      getDiscount: () => {
        const { couponType, couponValue } = get()
        if (!couponType) return 0
        const subtotal = get().getSubtotal()
        if (couponType === 'percentage') return subtotal * (couponValue / 100)
        if (couponType === 'fixed')      return Math.min(couponValue, subtotal)
        return 0 // free_shipping handled at checkout level
      },

      getItemCount: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),
    }),
    { name: 'ebuy-cart' }
  )
)
