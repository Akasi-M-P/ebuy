import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UIStore {
  wishlist: string[]
  recentlyViewed: string[]
  isMobileMenuOpen: boolean
  isSearchOpen: boolean

  addToWishlist: (productId: string) => void
  removeFromWishlist: (productId: string) => void
  toggleWishlist: (productId: string) => void
  isWishlisted: (productId: string) => boolean
  clearWishlist: () => void

  addRecentlyViewed: (productId: string) => void

  openMobileMenu: () => void
  closeMobileMenu: () => void
  openSearch: () => void
  closeSearch: () => void
}

export const useUIStore = create<UIStore>()(
  persist(
    (set, get) => ({
      wishlist: [],
      recentlyViewed: [],
      isMobileMenuOpen: false,
      isSearchOpen: false,

      addToWishlist: (productId) =>
        set((state) =>
          state.wishlist.includes(productId)
            ? state
            : { wishlist: [...state.wishlist, productId] }
        ),

      removeFromWishlist: (productId) =>
        set((state) => ({ wishlist: state.wishlist.filter((id) => id !== productId) })),

      toggleWishlist: (productId) => {
        const { wishlist } = get()
        if (wishlist.includes(productId)) {
          set((state) => ({ wishlist: state.wishlist.filter((id) => id !== productId) }))
        } else {
          set((state) => ({ wishlist: [...state.wishlist, productId] }))
        }
      },

      isWishlisted: (productId) => get().wishlist.includes(productId),

      clearWishlist: () => set({ wishlist: [] }),

      addRecentlyViewed: (productId) =>
        set((state) => {
          const filtered = state.recentlyViewed.filter((id) => id !== productId)
          return { recentlyViewed: [productId, ...filtered].slice(0, 8) }
        }),

      openMobileMenu: () => set({ isMobileMenuOpen: true }),
      closeMobileMenu: () => set({ isMobileMenuOpen: false }),
      openSearch: () => set({ isSearchOpen: true }),
      closeSearch: () => set({ isSearchOpen: false }),
    }),
    { name: 'ebuy-ui' }
  )
)
