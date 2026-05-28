'use client'

import { createContext, useContext, useEffect } from 'react'
import { SessionProvider } from 'next-auth/react'
import type { Session } from 'next-auth'
import { brandCssVars } from '@/lib/colorUtils'

interface SiteSettings {
  storeName: string
  brandColor: string
}

const SettingsCtx = createContext<SiteSettings>({ storeName: 'eBuy', brandColor: '#C9A84C' })

export function useSettings(): SiteSettings {
  return useContext(SettingsCtx)
}

interface Props {
  children: React.ReactNode
  session?: Session | null
  storeName?: string
  brandColor?: string
}

export default function Providers({ children, session, storeName = 'eBuy', brandColor = '#C9A84C' }: Props) {
  useEffect(() => {
    const vars = brandCssVars(brandColor)
    const root = document.documentElement
    Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v))
  }, [brandColor])

  return (
    <SettingsCtx.Provider value={{ storeName, brandColor }}>
      <SessionProvider session={session}>{children}</SessionProvider>
    </SettingsCtx.Provider>
  )
}