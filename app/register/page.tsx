'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const json = await res.json()
      if (!res.ok) { setError(json.error ?? 'Registration failed'); setLoading(false); return }

      // Auto sign-in after registration
      await signIn('credentials', { email: form.email, password: form.password, redirect: false })
      router.push('/')
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-5 bg-surface">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #00458f, #005cbb)' }}>
            <span className="material-symbols-outlined text-white material-symbols-filled text-2xl">
              health_and_safety
            </span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-on-surface">Create Account</h1>
          <p className="text-sm text-on-surface-variant mt-1">Start your health sanctuary</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {(['name', 'email', 'password'] as const).map(field => (
            <div key={field}>
              <label className="label-caps mb-2 block">{field.toUpperCase()}</label>
              <input
                type={field === 'password' ? 'password' : field === 'email' ? 'email' : 'text'}
                value={form[field]}
                onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                className="input-field w-full"
                placeholder={field === 'name' ? 'John Richardson' : field === 'email' ? 'you@example.com' : '8+ characters'}
                required
              />
            </div>
          ))}

          {error && (
            <div className="p-3 rounded-xl bg-error-container text-error text-sm font-medium">{error}</div>
          )}

          <button type="submit" disabled={loading}
            className="btn-primary w-full justify-center py-3.5 disabled:opacity-60">
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-on-surface-variant mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
