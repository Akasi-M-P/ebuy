import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const userId = (session.user as { id?: string }).id
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const orders = await prisma.order.findMany({
    where: { customerId: userId },
    orderBy: { createdAt: 'desc' },
    include: { items: true },
  })
  return NextResponse.json(orders)
}

export async function POST(req: Request) {
  const body = await req.json()
  const {
    email, firstName, lastName,
    address1, address2, city, state, zip, country,
    shippingMethod, items, couponCode,
  } = body

  if (!email || !firstName || !lastName || !address1 || !city || !zip || !items?.length) {
    return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
  }

  // Resolve customer — logged-in user takes priority; otherwise find/create guest by email
  const session = await getServerSession(authOptions)
  let customerId: string
  if (session?.user) {
    customerId = (session.user as { id?: string }).id!
  } else {
    let user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      user = await prisma.user.create({
        data: { email, name: `${firstName} ${lastName}` },
      })
    }
    customerId = user.id
  }

  // Verify prices server-side — never trust client-supplied totals
  const productIds = items.map((i: { productId: string }) => i.productId)
  const skus       = items.map((i: { sku: string }) => i.sku)
  const [products, variants] = await Promise.all([
    prisma.product.findMany({ where: { id: { in: productIds } }, select: { id: true, price: true } }),
    prisma.productVariant.findMany({ where: { sku: { in: skus } }, select: { sku: true, price: true } }),
  ])
  const productPriceMap = Object.fromEntries(products.map(p => [p.id, p.price]))
  const variantPriceMap = Object.fromEntries(variants.map(v => [v.sku, v.price]))

  const subtotal = items.reduce((sum: number, item: { productId: string; sku: string; quantity: number }) => {
    const price = variantPriceMap[item.sku] ?? productPriceMap[item.productId] ?? 0
    return sum + price * item.quantity
  }, 0)

  // Verify coupon server-side
  let discount = 0
  if (couponCode) {
    const coupon = await prisma.coupon.findUnique({ where: { code: couponCode.trim().toUpperCase() } })
    if (coupon && coupon.status === 'active' && !(coupon.expiryDate && coupon.expiryDate < new Date())) {
      if (coupon.type === 'percentage') discount = subtotal * (coupon.value / 100)
      else if (coupon.type === 'fixed')  discount = Math.min(coupon.value, subtotal)
    }
  }

  const FREE_SHIPPING_THRESHOLD = 150
  const SHIPPING_COSTS: Record<string, number> = {
    standard:  subtotal - discount >= FREE_SHIPPING_THRESHOLD ? 0 : 9.99,
    express:   19.99,
    'next-day': 29.99,
  }
  const shipping = SHIPPING_COSTS[shippingMethod] ?? 9.99
  const tax      = Math.round((subtotal - discount) * 0.08 * 100) / 100
  const total    = Math.round((subtotal - discount + shipping + tax) * 100) / 100

  const year = new Date().getFullYear()
  const rand = String(Math.floor(Math.random() * 90000) + 10000)
  const orderNumber = `EB-${year}-${rand}`

  const SHIPPING_NAMES: Record<string, string> = {
    standard: 'Standard Delivery',
    express:  'Express Delivery',
    'next-day': 'Next-Day Delivery',
  }

  const order = await prisma.order.create({
    data: {
      orderNumber,
      customerId,
      customerName:  `${firstName} ${lastName}`,
      customerEmail: email,
      subtotal,
      shipping,
      tax,
      total,
      status:        'pending',
      paymentStatus: 'pending',
      paymentMethod: SHIPPING_NAMES[shippingMethod] ?? 'card',
      notes:         couponCode ? `Coupon applied: ${couponCode}` : undefined,
      shippingAddress: {
        fullName: `${firstName} ${lastName}`,
        email,
        phone:    '',
        address1,
        address2: address2 ?? '',
        city, state, zip, country,
      },
      items: {
        create: items.map((item: {
          productId: string; name: string; image: string
          quantity: number; color?: string; size?: string; sku: string
        }) => ({
          productId: item.productId,
          name:      item.name,
          image:     item.image,
          price:     variantPriceMap[item.sku] ?? productPriceMap[item.productId] ?? 0,
          quantity:  item.quantity,
          variant:   item.color ?? item.size ?? undefined,
          sku:       item.sku,
        })),
      },
    },
    include: { items: true },
  })

  return NextResponse.json(order, { status: 201 })
}