'use client'

import { useState } from 'react'
import { Menu, Bell } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import AdminSidebar from './AdminSidebar'

interface Props { children: React.ReactNode }

export default function AdminLayout({ children }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-ebuy-bg flex">
      <div className="hidden lg:flex flex-shrink-0">
        <AdminSidebar />
      </div>

      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.28 }}
              className="fixed left-0 top-0 bottom-0 z-50 lg:hidden"
            >
              <AdminSidebar onClose={() => setSidebarOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 bg-ebuy-surface border-b border-ebuy-border flex items-center px-4 sm:px-6 gap-4 sticky top-0 z-30">
          <button
            aria-label="Toggle sidebar"
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-ebuy-muted hover:text-ebuy-text transition-colors"
          >
            <Menu size={20} />
          </button>

          <div className="ml-auto flex items-center gap-2">
            <button aria-label="Notifications" className="relative p-2 text-ebuy-muted hover:text-ebuy-gold transition-colors rounded">
              <Bell size={18} />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-ebuy-gold" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}