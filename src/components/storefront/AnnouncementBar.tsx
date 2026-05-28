import Link from 'next/link'

export default function AnnouncementBar() {
  return (
    <div className="bg-ebuy-surface border-b border-ebuy-border text-center py-2 px-4 text-xs tracking-widest uppercase text-ebuy-muted">
      Free shipping on orders over $150&nbsp;·&nbsp;
      <Link href="/products" className="text-ebuy-gold hover:text-ebuy-gold-light transition-colors underline underline-offset-2">
        Shop Now
      </Link>
    </div>
  )
}