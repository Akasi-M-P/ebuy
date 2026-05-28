'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import {
  LayoutDashboard, Package, ShoppingCart, Users, Megaphone,
  BarChart2, Settings, LogOut, Tag, ChevronRight, X, Layers,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useSettings } from '@/components/providers'

interface Props { onClose?: () => void }

const NAV = [
  { label: 'Dashboard',  href: '/admin',            icon: LayoutDashboard, exact: true },
  { label: 'Products',   href: '/admin/products',   icon: Package },
  { label: 'Orders',     href: '/admin/orders',     icon: ShoppingCart },
  { label: 'Customers',  href: '/admin/customers',  icon: Users },
  { label: 'Marketing',  href: '/admin/marketing',  icon: Megaphone },
  { label: 'Analytics',  href: '/admin/analytics',  icon: BarChart2 },
  { label: 'Settings',   href: '/admin/settings',   icon: Settings },
]

export default function AdminSidebar({ onClose }: Props) {
  const { data: session } = useSession()
  const { storeName } = useSettings()
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push('/login')
  }

  return (
    <aside className="flex flex-col h-full bg-ebuy-surface border-r border-ebuy-border w-60">
      <div className="flex items-center justify-between px-5 py-5 border-b border-ebuy-border">
        <Link href="/" className="font-serif text-xl tracking-[0.12em] text-ebuy-text hover:text-ebuy-gold transition-colors">
          {storeName}
          <span className="ml-2 text-[10px] tracking-widest text-ebuy-gold bg-ebuy-gold/10 px-1.5 py-0.5 rounded align-middle">
            ADMIN
          </span>
        </Link>
        {onClose && (
          <button onClick={onClose} className="text-ebuy-muted hover:text-ebuy-text lg:hidden">
            <X size={20} />
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <p className="text-[10px] tracking-widest uppercase text-ebuy-muted/50 px-3 mb-2">Main</p>
        <ul className="space-y-0.5">
          {NAV.map((item) => {
            const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href)
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-colors',
                    isActive
                      ? 'bg-ebuy-gold/10 text-ebuy-gold'
                      : 'text-ebuy-muted hover:text-ebuy-text hover:bg-ebuy-surface-2'
                  )}
                >
                  <item.icon size={16} />
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>

        <div className="mt-6 pt-4 border-t border-ebuy-border">
          <p className="text-[10px] tracking-widest uppercase text-ebuy-muted/50 px-3 mb-2">Store</p>
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded text-sm text-ebuy-muted hover:text-ebuy-text hover:bg-ebuy-surface-2 transition-colors"
          >
            <Layers size={16} />
            View Storefront
            <ChevronRight size={12} className="ml-auto" />
          </Link>
          <Link
            href="/admin/marketing"
            onClick={onClose}
            className="flex items-center gap-3 px-3 py-2.5 rounded text-sm text-ebuy-muted hover:text-ebuy-text hover:bg-ebuy-surface-2 transition-colors"
          >
            <Tag size={16} />
            Discount Codes
          </Link>
        </div>
      </nav>

      <div className="px-4 py-4 border-t border-ebuy-border">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-ebuy-gold/20 flex items-center justify-center text-ebuy-gold font-serif text-sm flex-shrink-0">
            {session?.user?.name?.[0] ?? 'A'}
          </div>
          <div className="min-w-0">
            <p className="text-sm text-ebuy-text truncate">{session?.user?.name}</p>
            <p className="text-[10px] text-ebuy-muted truncate">{session?.user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded text-sm text-ebuy-muted hover:text-ebuy-error hover:bg-ebuy-surface-2 transition-colors"
        >
          <LogOut size={14} />
          Sign Out
        </button>
      </div>
    </aside>
  )
}