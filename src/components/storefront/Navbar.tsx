'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { ShoppingBag, Heart, Search, User, Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSession, signOut } from 'next-auth/react'
import { useCartStore } from '@/store/cartStore'
import { useUIStore } from '@/store/uiStore'
import { cn } from '@/lib/utils'
import { useSettings } from '@/components/providers'

const NAV_LINKS = [
  { label: 'Shop',        href: '/products' },
  { label: 'Smartphones', href: '/products?category=smartphones' },
  { label: 'Laptops',     href: '/products?category=laptops' },
  { label: 'Audio',       href: '/products?category=audio' },
  { label: 'Gaming',      href: '/products?category=gaming' },
]

function NavItem({ href, label }: { href: string; label: string }) {
  const pathname = usePathname()
  const isActive = pathname === href || (href !== '/products' && pathname.startsWith(href.split('?')[0]))
  return (
    <Link
      href={href}
      className={cn(
        'text-sm tracking-wide transition-colors duration-150',
        isActive ? 'text-ebuy-gold' : 'text-ebuy-muted hover:text-ebuy-text'
      )}
    >
      {label}
    </Link>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { toggleCart, getItemCount } = useCartStore()
  const { wishlist } = useUIStore()
  const { data: session } = useSession()
  const { storeName } = useSettings()
  const router = useRouter()
  const itemCount = getItemCount()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-50 transition-all duration-300',
          scrolled
            ? 'bg-ebuy-bg/95 backdrop-blur-md border-b border-ebuy-border shadow-luxury'
            : 'bg-ebuy-bg border-b border-ebuy-border'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            <Link href="/" className="flex-shrink-0">
              <span className="font-serif text-2xl tracking-[0.12em] text-ebuy-text hover:text-ebuy-gold transition-colors">
                {storeName}
              </span>
            </Link>

            <nav className="hidden lg:flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <NavItem key={link.href} href={link.href} label={link.label} />
              ))}
            </nav>

            <div className="flex items-center gap-1">
              <button
                aria-label="Search"
                className="p-2 text-ebuy-muted hover:text-ebuy-gold transition-colors rounded"
                onClick={() => router.push('/products')}
              >
                <Search size={20} />
              </button>

              <Link href="/account" aria-label={`Wishlist (${wishlist.length})`}
                className="relative p-2 text-ebuy-muted hover:text-ebuy-gold transition-colors rounded"
              >
                <Heart size={20} />
                {wishlist.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-4 w-4 flex items-center justify-center rounded-full bg-ebuy-gold text-ebuy-bg text-[9px] font-bold">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {session ? (
                <div className="relative group">
                  <button aria-label="Account" className="p-2 text-ebuy-muted hover:text-ebuy-gold transition-colors rounded">
                    <User size={20} />
                  </button>
                  <div className="absolute right-0 top-full mt-1 w-48 bg-ebuy-surface border border-ebuy-border rounded shadow-luxury opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                    <div className="px-4 py-3 border-b border-ebuy-border">
                      <p className="text-xs text-ebuy-muted">Signed in as</p>
                      <p className="text-sm text-ebuy-text truncate">{session.user?.name}</p>
                    </div>
                    <div className="py-1">
                      {session.user?.role === 'admin' && (
                        <Link href="/admin" className="block px-4 py-2 text-sm text-ebuy-gold hover:bg-ebuy-surface-2 transition-colors">
                          Admin Dashboard
                        </Link>
                      )}
                      <Link href="/account" className="block px-4 py-2 text-sm text-ebuy-muted hover:text-ebuy-text hover:bg-ebuy-surface-2 transition-colors">
                        My Account
                      </Link>
                      <button
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="w-full text-left px-4 py-2 text-sm text-ebuy-muted hover:text-ebuy-error hover:bg-ebuy-surface-2 transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link href="/login" aria-label="Sign In"
                  className="p-2 text-ebuy-muted hover:text-ebuy-gold transition-colors rounded"
                >
                  <User size={20} />
                </Link>
              )}

              <button
                aria-label={`Cart (${itemCount} items)`}
                onClick={toggleCart}
                className="relative p-2 text-ebuy-muted hover:text-ebuy-gold transition-colors rounded"
              >
                <ShoppingBag size={20} />
                {itemCount > 0 && (
                  <motion.span
                    key={itemCount}
                    initial={{ scale: 0.6 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 h-4 w-4 flex items-center justify-center rounded-full bg-ebuy-gold text-ebuy-bg text-[9px] font-bold"
                  >
                    {itemCount}
                  </motion.span>
                )}
              </button>

              <button
                aria-label="Toggle menu"
                className="lg:hidden p-2 text-ebuy-muted hover:text-ebuy-text transition-colors"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                {menuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
              onClick={() => setMenuOpen(false)}
            />
            <motion.nav
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-80 bg-ebuy-surface flex flex-col lg:hidden"
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-ebuy-border">
                <span className="font-serif text-xl tracking-widest text-ebuy-text">Menu</span>
                <button onClick={() => setMenuOpen(false)} aria-label="Close menu" className="text-ebuy-muted hover:text-ebuy-text">
                  <X size={22} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto py-6 px-6 flex flex-col gap-2">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="py-3 text-lg font-serif text-ebuy-muted hover:text-ebuy-gold border-b border-ebuy-border/50 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              <div className="px-6 pb-8 border-t border-ebuy-border pt-4 flex flex-col gap-3">
                {session ? (
                  <>
                    <Link href="/account" onClick={() => setMenuOpen(false)} className="btn-outline text-center text-sm">My Account</Link>
                    <button onClick={() => { signOut({ callbackUrl: '/' }); setMenuOpen(false) }} className="btn-gold text-center text-sm">Sign Out</button>
                  </>
                ) : (
                  <Link href="/login" onClick={() => setMenuOpen(false)} className="btn-gold text-center text-sm">Sign In</Link>
                )}
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  )
}