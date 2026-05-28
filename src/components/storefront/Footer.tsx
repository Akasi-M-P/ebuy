'use client'

import Link from 'next/link'
import { Instagram, Twitter, Facebook, Youtube } from 'lucide-react'
import { useSettings } from '@/components/providers'

const SHOP_LINKS    = ['Smartphones', 'Laptops', 'Audio', 'Gaming', 'New Arrivals', 'Sale']
const SUPPORT_LINKS = ['Help Center', 'Track Order', 'Returns & Exchanges', 'Shipping Info', 'Contact Us']

export default function Footer() {
  const { storeName } = useSettings()
  const year = new Date().getFullYear()
  const companyLinks = [`About ${storeName}`, 'Careers', 'Press', 'Sustainability', 'Partnerships']

  return (
    <footer className="bg-ebuy-surface border-t border-ebuy-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">

          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="font-serif text-2xl tracking-[0.12em] text-ebuy-text hover:text-ebuy-gold transition-colors">
              {storeName}
            </Link>
            <p className="text-sm text-ebuy-muted mt-3 leading-relaxed max-w-xs">
              Premium electronics curated for those who appreciate quality without compromise.
            </p>
            <div className="flex gap-3 mt-5">
              {[
                { icon: Instagram, label: 'Instagram' },
                { icon: Twitter,   label: 'Twitter/X' },
                { icon: Facebook,  label: 'Facebook' },
                { icon: Youtube,   label: 'YouTube' },
              ].map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-9 h-9 rounded-full border border-ebuy-border flex items-center justify-center text-ebuy-muted hover:border-ebuy-gold hover:text-ebuy-gold transition-colors"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-ebuy-text mb-5">Shop</p>
            <ul className="space-y-2.5">
              {SHOP_LINKS.map((item) => (
                <li key={item}>
                  <Link href="/products" className="text-sm text-ebuy-muted hover:text-ebuy-gold transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-ebuy-text mb-5">Support</p>
            <ul className="space-y-2.5">
              {SUPPORT_LINKS.map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-ebuy-muted hover:text-ebuy-gold transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-ebuy-text mb-5">Company</p>
            <ul className="space-y-2.5">
              {companyLinks.map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-ebuy-muted hover:text-ebuy-gold transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-ebuy-border px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-ebuy-muted">© {year} {storeName}. All rights reserved.</p>
          <div className="flex gap-5">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((l) => (
              <a key={l} href="#" className="text-xs text-ebuy-muted hover:text-ebuy-gold transition-colors">{l}</a>
            ))}
          </div>
          <div className="flex items-center gap-2">
            {['VISA', 'MC', 'AMEX', 'PP', 'APPLE'].map((name) => (
              <span key={name} className="px-2 py-1 border border-ebuy-border rounded text-[9px] font-bold tracking-wide text-ebuy-muted">
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}