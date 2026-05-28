'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { useSettings } from '@/components/providers'

function ResetForm() {
  const router       = useRouter()
  const params       = useSearchParams()
  const token        = params.get('token') ?? ''
  const { storeName } = useSettings()

  const [password, setPassword] = useState('')
  const [confirm,  setConfirm]  = useState('')
  const [showPw,   setShowPw]   = useState(false)
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  if (!token) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-ebuy-muted mb-4">Invalid reset link.</p>
          <Link href="/forgot-password" className="btn-gold text-sm">Request a new link</Link>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (password !== confirm) { setError('Passwords do not match.'); return }
    setLoading(true)
    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password }),
    })
    const data = await res.json()
    setLoading(false)
    if (!res.ok) { setError(data.error ?? 'Something went wrong.'); return }
    router.push('/login?reset=1')
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/" className="font-serif text-3xl tracking-[0.12em] text-ebuy-text hover:text-ebuy-gold transition-colors">
            {storeName}
          </Link>
          <h1 className="font-serif text-2xl text-ebuy-text mt-6 mb-2">Choose a New Password</h1>
          <p className="text-sm text-ebuy-muted">Must be at least 8 characters.</p>
        </div>

        <div className="bg-ebuy-surface border border-ebuy-border rounded p-8">
          {error && (
            <div className="mb-5 px-4 py-3 bg-ebuy-error/10 border border-ebuy-error/30 rounded text-sm text-ebuy-error">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold tracking-widest uppercase text-ebuy-muted mb-2">New Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-dark pr-10"
                  placeholder="Min 8 characters"
                  autoComplete="new-password"
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ebuy-muted hover:text-ebuy-text transition-colors">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold tracking-widest uppercase text-ebuy-muted mb-2">Confirm Password</label>
              <input
                type={showPw ? 'text' : 'password'}
                required
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="input-dark"
                placeholder="Repeat password"
                autoComplete="new-password"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full flex items-center justify-center gap-2 text-sm tracking-widest uppercase"
            >
              {loading ? <><Loader2 size={16} className="animate-spin" /> Saving…</> : 'Set New Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return <Suspense><ResetForm /></Suspense>
}