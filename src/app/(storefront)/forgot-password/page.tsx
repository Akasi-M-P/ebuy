'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Loader2, ArrowLeft } from 'lucide-react'
import { useSettings } from '@/components/providers'

export default function ForgotPasswordPage() {
  const { storeName } = useSettings()
  const [email,     setEmail]     = useState('')
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState('')
  const [resetUrl,  setResetUrl]  = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const res = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    const data = await res.json()
    setLoading(false)
    if (!res.ok) { setError(data.error ?? 'Something went wrong.'); return }
    setResetUrl(data.resetUrl ?? '')
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/" className="font-serif text-3xl tracking-[0.12em] text-ebuy-text hover:text-ebuy-gold transition-colors">
            {storeName}
          </Link>
          <h1 className="font-serif text-2xl text-ebuy-text mt-6 mb-2">Reset Your Password</h1>
          <p className="text-sm text-ebuy-muted">Enter your email and we'll send you a reset link.</p>
        </div>

        {resetUrl ? (
          <div className="bg-ebuy-surface border border-ebuy-border rounded p-8 text-center space-y-4">
            <div className="w-12 h-12 bg-ebuy-success/20 rounded-full flex items-center justify-center mx-auto">
              <span className="text-ebuy-success text-xl">✓</span>
            </div>
            <p className="text-sm text-ebuy-text font-medium">Reset link generated</p>
            <p className="text-xs text-ebuy-muted">
              In production, this link is emailed to you. Until an email service is connected, use the link below:
            </p>
            <div className="bg-ebuy-surface-2 border border-ebuy-border rounded p-3 text-left">
              <p className="text-[10px] text-ebuy-muted mb-1 uppercase tracking-widest font-semibold">Reset Link</p>
              <a
                href={resetUrl}
                className="text-xs text-ebuy-gold break-all hover:underline font-mono"
              >
                {resetUrl}
              </a>
            </div>
            <p className="text-xs text-ebuy-muted/60">This link expires in 1 hour.</p>
          </div>
        ) : (
          <div className="bg-ebuy-surface border border-ebuy-border rounded p-8">
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
              <button
                type="submit"
                disabled={loading}
                className="btn-gold w-full flex items-center justify-center gap-2 text-sm tracking-widest uppercase"
              >
                {loading ? <><Loader2 size={16} className="animate-spin" /> Sending…</> : 'Send Reset Link'}
              </button>
            </form>
          </div>
        )}

        <p className="text-center text-sm text-ebuy-muted mt-6">
          <Link href="/login" className="text-ebuy-gold hover:text-ebuy-gold-light transition-colors flex items-center justify-center gap-1">
            <ArrowLeft size={14} /> Back to Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}