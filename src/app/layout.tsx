import type { Metadata } from 'next'
import { Cormorant_Garamond, Inter } from 'next/font/google'
import Providers from '@/components/providers'
import { getSettings } from '@/lib/settings'
import { brandCssVars } from '@/lib/colorUtils'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  const name = settings.store_name || 'eBuy'
  return {
    title: {
      default: `${name} — Premium Electronics & Audio`,
      template: `%s — ${name}`,
    },
    description: 'Discover premium smartphones, laptops, audio systems, and gaming gear. Curated for those who refuse to compromise.',
    metadataBase: new URL('https://ebuy.com'),
    openGraph: {
      siteName: name,
      type: 'website',
    },
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings   = await getSettings()
  const storeName  = settings.store_name  || 'eBuy'
  const brandColor = settings.brand_color || '#C9A84C'
  const cssVars    = brandCssVars(brandColor)
  const inlineCss  = `:root{${Object.entries(cssVars).map(([k, v]) => `${k}:${v}`).join(';')}}`

  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <head>
        <style dangerouslySetInnerHTML={{ __html: inlineCss }} />
      </head>
      <body>
        <Providers storeName={storeName} brandColor={brandColor}>
          {children}
        </Providers>
      </body>
    </html>
  )
}