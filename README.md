# eBuy — Luxury E-Commerce Platform

A full-stack luxury e-commerce storefront built with Next.js 14, Prisma, Supabase, and NextAuth. Includes a complete customer-facing storefront and a full-featured admin panel.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + CSS custom properties |
| Database | PostgreSQL via Supabase |
| ORM | Prisma |
| Auth | NextAuth v4 (credentials provider) |
| State | Zustand (cart, UI) |
| Storage | Supabase Storage |
| Animations | Framer Motion |
| Charts | Recharts |
| UI Primitives | Radix UI |

---

## Features

### Storefront
- Home page with featured products, categories, hero banner
- Product listing with filters (category, price, brand, rating) and sorting
- Product detail page with variants (color/size), image gallery, reviews
- Persistent cart drawer with coupon codes, free-shipping progress bar
- Multi-step checkout (shipping → payment → confirmation) with order persistence
- Customer account page — order history, profile editing, wishlist
- Auth — register, login, forgot password, reset password

### Admin Panel (`/admin`)
- Dashboard with live KPIs (revenue, orders, customers, AOV) and recent activity
- Analytics with 7d / 30d / 90d revenue charts and top-product breakdown
- Products CRUD — create/edit/delete with image upload to Supabase Storage
- Orders management — status updates, order detail drawer
- Customers list — view history, block/unblock
- Marketing — Flash Sales CRUD, Email Campaigns (draft → send)
- Coupons — percentage, fixed, and free-shipping types with expiry and usage limits
- Settings — store name, brand color (live preview), contact info, policies

---

## Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project (free tier works)
- npm or pnpm

---

## Onboarding

### 1. Clone and install

```bash
git clone <repo-url>
cd ebuy-main
npm install
```

### 2. Set up environment variables

Create a `.env.local` file in the project root:

```env
# NextAuth
NEXTAUTH_SECRET=your-random-secret-string-here
NEXTAUTH_URL=http://localhost:3000

# Supabase PostgreSQL (find in Supabase → Settings → Database)
DATABASE_URL="postgresql://postgres.<ref>:<password>@aws-1-<region>.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.<ref>:<password>@aws-1-<region>.pooler.supabase.com:5432/postgres"

# Supabase client (find in Supabase → Settings → API)
NEXT_PUBLIC_SUPABASE_URL=https://<ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
```

> Generate `NEXTAUTH_SECRET` with: `openssl rand -base64 32`

### 3. Push the database schema

```bash
npx prisma db push
```

This creates all tables in your Supabase database. No migration files are needed for a fresh setup.

### 4. Seed the database

```bash
npx prisma db seed
```

This populates products, categories, demo users, and sample coupons.

**Demo accounts created by the seed:**

| Role | Email | Password |
|---|---|---|
| Admin | admin@ebuy.com | admin123 |
| Customer | jane@example.com | password123 |

### 5. Set up Supabase Storage

In the **Supabase Dashboard → SQL Editor**, run the following to create the product image bucket and access policies:

```sql
INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'products');

CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'products');

CREATE POLICY "Authenticated users can update"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'products');

CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'products');
```

### 6. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the storefront and [http://localhost:3000/admin](http://localhost:3000/admin) for the admin panel.

---

## Project Structure

```
src/
├── app/
│   ├── (storefront)/          # Public storefront pages
│   │   ├── page.tsx           # Home
│   │   ├── products/          # Listing + detail
│   │   ├── checkout/          # Multi-step checkout
│   │   ├── account/           # Customer account
│   │   ├── login/
│   │   ├── register/
│   │   ├── forgot-password/
│   │   └── reset-password/
│   ├── admin/                 # Admin panel pages
│   │   ├── page.tsx           # Dashboard
│   │   ├── analytics/
│   │   ├── products/
│   │   ├── orders/
│   │   ├── customers/
│   │   ├── marketing/         # Flash sales + campaigns
│   │   └── settings/
│   └── api/                   # API routes
│       ├── auth/              # NextAuth + register + forgot/reset password
│       ├── orders/
│       ├── products/
│       ├── profile/
│       ├── coupons/
│       └── admin/             # Admin-only endpoints
├── components/
│   ├── storefront/            # Header, CartDrawer, ProductCard, etc.
│   ├── admin/                 # Sidebar, AdminHeader
│   └── providers.tsx          # Settings context (storeName, brandColor)
├── lib/
│   ├── prisma.ts              # Prisma client singleton
│   ├── settings.ts            # Cached settings loader
│   ├── colorUtils.ts          # Brand color → CSS variables
│   └── utils.ts               # cn, formatPrice, formatDate, etc.
├── store/
│   ├── cartStore.ts           # Zustand cart (persisted)
│   └── uiStore.ts             # Zustand UI state
└── types/                     # Shared TypeScript types
prisma/
├── schema.prisma
└── seed.ts
```

---

## Brand Customization

Store name and brand color can be changed live from **Admin → Settings → General**. Changes apply immediately without a redeploy:

- The color picker updates CSS variables in real time across the entire UI.
- The store name appears in the browser tab, storefront header, and email templates.

---

## Password Reset (Development)

No email service is wired up by default. When a user requests a password reset, the reset link is returned directly in the UI so it can be used without an SMTP provider.

To connect a real email service, edit `src/app/api/auth/forgot-password/route.ts` and replace the `// In production: send resetUrl via email` comment with a call to your provider (Resend, SendGrid, etc.).

---

## Deployment

1. Set all `.env.local` variables as environment variables in your hosting provider (Vercel, Railway, etc.).
2. Set `NEXTAUTH_URL` to your production domain.
3. Generate a strong `NEXTAUTH_SECRET` for production.
4. Run `npx prisma db push` against your production database if it hasn't been seeded yet.
5. Run `npm run build` to verify there are no build errors before deploying.

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npx prisma db push` | Push schema to database |
| `npx prisma db seed` | Seed demo data |
| `npx prisma studio` | Open Prisma database browser |