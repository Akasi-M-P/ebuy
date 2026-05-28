import { NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const DEFAULTS: Record<string, string> = {
  store_name:              'eBuy',
  brand_color:             '#C9A84C',
  store_email:             'hello@ebuy.com',
  store_phone:             '',
  store_address:           '',
  currency:                'USD',
  timezone:                'UTC-5',
  free_shipping_enabled:   'true',
  free_shipping_minimum:   '150',
  notify_new_order:        'true',
  notify_low_stock:        'true',
  notify_new_customer:     'true',
  notify_refund_request:   'true',
}

async function requireAdmin() {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== 'admin') return null
  return session
}

export async function GET() {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const rows = await prisma.setting.findMany()
  const stored = Object.fromEntries(rows.map((r) => [r.key, r.value]))
  return NextResponse.json({ ...DEFAULTS, ...stored })
}

export async function PATCH(req: Request) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body: Record<string, string> = await req.json()
  await prisma.$transaction(
    Object.entries(body).map(([key, value]) =>
      prisma.setting.upsert({
        where:  { key },
        create: { key, value: String(value) },
        update: { value: String(value) },
      })
    )
  )
  revalidateTag('settings')
  const rows = await prisma.setting.findMany()
  const stored = Object.fromEntries(rows.map((r) => [r.key, r.value]))
  return NextResponse.json({ ...DEFAULTS, ...stored })
}