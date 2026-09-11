'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SetupPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '', firstName: '', lastName: '' })
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const res = await fetch('/api/admin/bootstrap', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const json = await res.json()
    setLoading(false)
    if (!res.ok) { setError(json.error ?? 'Setup failed'); return }
    setDone(true)
    setTimeout(() => router.push('/login'), 2000)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--sidebar)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 400, background: '#fff', borderRadius: 14, padding: 32, boxShadow: '0 20px 50px rgba(0,0,0,.3)' }}>
        <div style={{ fontWeight: 800, fontSize: 20, marginBottom: 6 }}>Platform Setup</div>
        <div style={{ fontSize: 13, color: 'var(--ink3)', marginBottom: 24 }}>Create the first super admin account. This form is disabled once any user exists.</div>

        {done ? (
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, padding: '12px 16px', color: '#14532d', fontWeight: 600 }}>
            Account created. Redirecting to login…
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {error && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 7, padding: '8px 12px', fontSize: 12.5, color: '#dc2626' }}>{error}</div>
            )}
            {(['firstName', 'lastName', 'email', 'password'] as const).map(k => (
              <div key={k}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--ink3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 5 }}>
                  {k === 'firstName' ? 'First Name' : k === 'lastName' ? 'Last Name' : k === 'email' ? 'Email' : 'Password (min 10 chars)'}
                </label>
                <input
                  type={k === 'password' ? 'password' : k === 'email' ? 'email' : 'text'}
                  value={form[k]} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid var(--border)', borderRadius: 7, fontSize: 13, boxSizing: 'border-box' }}
                />
              </div>
            ))}
            <button type="submit" disabled={loading}
              style={{ background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 0', fontWeight: 700, fontSize: 13, cursor: 'pointer', marginTop: 4 }}>
              {loading ? 'Creating…' : 'Create Super Admin'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
