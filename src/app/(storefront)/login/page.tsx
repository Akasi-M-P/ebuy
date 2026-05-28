'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { useSettings } from '@/components/providers'

function LoginForm() {
  const router       = useRouter()
  const params       = useSearchParams()
  const callbackUrl  = params.get('callbackUrl') ?? '/'
  const resetSuccess = params.get('reset') === '1'
  const { storeName } = useSettings()

  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [showPw,   setShowPw]   = useState(false)
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const result = await signIn('credentials', { email, password, redirect: false })
    setLoading(false)
    if (result?.error) {
      setError('Invalid email or password.')
    } else {
      router.push(callbackUrl)
      router.refresh()
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/" className="font-serif text-3xl tracking-[0.12em] text-ebuy-text hover:text-ebuy-gold transition-colors">
            {storeName}
          </Link>
          <h1 className="font-serif text-2xl text-ebuy-text mt-6 mb-2">Welcome Back</h1>
          <p className="text-sm text-ebuy-muted">Sign in to access your account and orders.</p>
        </div>

        <div className="bg-ebuy-surface border border-ebuy-border rounded p-8">
          {resetSuccess && (
            <div className="mb-5 px-4 py-3 bg-ebuy-success/10 border border-ebuy-success/30 rounded text-sm text-ebuy-success">
              Password reset successfully. Sign in with your new password.
            </div>
          )}
          {error && (
            <div className="mb-5 px-4 py-3 bg-ebuy-error/10 border border-ebuy-error/30 rounded text-sm text-ebuy-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-xs font-semibold tracking-widest uppercase text-ebuy-muted mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-dark"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="text-xs font-semibold tracking-widest uppercase text-ebuy-muted">
                  Password
                </label>
                <Link href="/forgot-password" className="text-xs text-ebuy-gold hover:text-ebuy-gold-light transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPw ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-dark pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ebuy-muted hover:text-ebuy-text transition-colors"
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full flex items-center justify-center gap-2 text-sm tracking-widest uppercase mt-2"
            >
              {loading ? <><Loader2 size={16} className="animate-spin" /> Signing in…</> : 'Sign In'}
            </button>
          </form>
        </div>

        <div className="mt-6 p-4 bg-ebuy-surface-2 border border-ebuy-border rounded text-xs text-ebuy-muted space-y-1">
          <p className="font-semibold text-ebuy-text mb-2">Demo accounts:</p>
          <p>Admin: <span className="text-ebuy-gold">admin@ebuy.com</span> / <span className="text-ebuy-gold">admin123</span></p>
          <p>Customer: <span className="text-ebuy-gold">jane@example.com</span> / <span className="text-ebuy-gold">password123</span></p>
        </div>

        <p className="text-center text-sm text-ebuy-muted mt-6">
          New here?{' '}
          <Link href="/register" className="text-ebuy-gold hover:text-ebuy-gold-light transition-colors">Create an account</Link>
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}