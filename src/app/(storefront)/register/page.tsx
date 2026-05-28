'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { useSettings } from '@/components/providers'

function RegisterForm() {
  const router = useRouter()
  const { storeName } = useSettings()

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [k]: e.target.value }))

  const [showPw,  setShowPw]  = useState(false)
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) {
      setError('Passwords do not match.')
      return
    }
    setLoading(true)
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
    })
    if (!res.ok) {
      const { error: msg } = await res.json()
      setError(msg ?? 'Registration failed.')
      setLoading(false)
      return
    }
    // Auto sign-in after registration
    const result = await signIn('credentials', {
      email: form.email,
      password: form.password,
      redirect: false,
    })
    setLoading(false)
    if (result?.error) {
      setError('Account created but sign-in failed. Please log in manually.')
      router.push('/login')
    } else {
      router.push('/account')
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
          <h1 className="font-serif text-2xl text-ebuy-text mt-6 mb-2">Create an Account</h1>
          <p className="text-sm text-ebuy-muted">Join {storeName} for a premium shopping experience.</p>
        </div>

        <div className="bg-ebuy-surface border border-ebuy-border rounded p-8">
          {error && (
            <div className="mb-5 px-4 py-3 bg-ebuy-error/10 border border-ebuy-error/30 rounded text-sm text-ebuy-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-xs font-semibold tracking-widest uppercase text-ebuy-muted mb-2">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                required
                autoComplete="name"
                value={form.name}
                onChange={set('name')}
                className="input-dark"
                placeholder="Jane Smith"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-semibold tracking-widest uppercase text-ebuy-muted mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={form.email}
                onChange={set('email')}
                className="input-dark"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold tracking-widest uppercase text-ebuy-muted mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPw ? 'text' : 'password'}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  value={form.password}
                  onChange={set('password')}
                  className="input-dark pr-10"
                  placeholder="Min 8 characters"
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

            <div>
              <label htmlFor="confirm" className="block text-xs font-semibold tracking-widest uppercase text-ebuy-muted mb-2">
                Confirm Password
              </label>
              <input
                id="confirm"
                type={showPw ? 'text' : 'password'}
                required
                autoComplete="new-password"
                value={form.confirm}
                onChange={set('confirm')}
                className="input-dark"
                placeholder="Repeat password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full flex items-center justify-center gap-2 text-sm tracking-widest uppercase mt-2"
            >
              {loading ? <><Loader2 size={16} className="animate-spin" /> Creating account…</> : 'Create Account'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-ebuy-muted mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-ebuy-gold hover:text-ebuy-gold-light transition-colors">Sign in</Link>
        </p>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  )
}