import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-ebuy-bg px-4">
      <p className="text-xs tracking-[0.3em] uppercase text-ebuy-gold">404</p>
      <h1 className="font-serif text-5xl sm:text-6xl text-ebuy-text text-center">Page Not Found</h1>
      <p className="text-ebuy-muted text-center max-w-sm">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link href="/" className="btn-gold text-sm px-10">Go Home</Link>
    </div>
  )
}