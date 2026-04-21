'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('demo@healthsanctuary.com')
  const [password, setPassword] = useState('password123')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })
    setLoading(false)
    if (res?.error) {
      setError('Invalid email or password.')
    } else {
      router.push('/')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-5 bg-surface">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #00458f, #005cbb)' }}>
            <span className="material-symbols-outlined text-white material-symbols-filled text-2xl">
              health_and_safety
            </span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-on-surface">Health Sanctuary</h1>
          <p className="text-sm text-on-surface-variant mt-1">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label-caps mb-2 block">EMAIL</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="input-field w-full"
              required
              autoComplete="email"
            />
          </div>
          <div>
            <label className="label-caps mb-2 block">PASSWORD</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="input-field w-full"
              required
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-error-container text-error text-sm font-medium">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full justify-center py-3.5 disabled:opacity-60"
          >
            {loading ? (
              <>
                <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                Signing in...
              </>
            ) : 'Sign In'}
          </button>
        </form>

        {/* Demo hint */}
        <div className="mt-5 p-4 rounded-2xl bg-primary/8 border border-primary/15">
          <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Demo Account</p>
          <p className="text-xs text-on-surface-variant">
            Email: demo@healthsanctuary.com<br />
            Password: password123
          </p>
        </div>

        <p className="text-center text-sm text-on-surface-variant mt-6">
          No account?{' '}
          <Link href="/register" className="text-primary font-semibold hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  )
}
