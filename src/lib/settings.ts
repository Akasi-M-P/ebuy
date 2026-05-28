import { unstable_cache } from 'next/cache'
import { prisma } from '@/lib/prisma'

export const SETTING_DEFAULTS: Record<string, string> = {
  store_name:            'eBuy',
  brand_color:           '#C9A84C',
  store_email:           'hello@ebuy.com',
  store_phone:           '',
  store_address:         '',
  currency:              'USD',
  timezone:              'UTC-5',
  free_shipping_enabled: 'true',
  free_shipping_minimum: '150',
  notify_new_order:      'true',
  notify_low_stock:      'true',
  notify_new_customer:   'true',
  notify_refund_request: 'true',
}

export const getSettings = unstable_cache(
  async (): Promise<Record<string, string>> => {
    try {
      const rows = await prisma.setting.findMany()
      return { ...SETTING_DEFAULTS, ...Object.fromEntries(rows.map((r) => [r.key, r.value])) }
    } catch {
      return SETTING_DEFAULTS
    }
  },
  ['settings'],
  { tags: ['settings'], revalidate: 3600 }
)