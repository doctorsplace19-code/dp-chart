'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const INDUSTRIES = [
  { value: 'occupational_health', label: 'Occupational Health Clinic' },
  { value: 'urgent_care', label: 'Urgent Care / Walk-In Clinic' },
  { value: 'trucking', label: 'Trucking / Transportation Company' },
  { value: 'construction', label: 'Construction / Industrial' },
  { value: 'hospital', label: 'Hospital / Health System' },
  { value: 'other', label: 'Other' },
]

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    firstName: '', lastName: '', companyName: '',
    industry: '', email: '', phone: '', password: '', nrcmeNumber: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  function set(k: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Registration failed. Please try again.')
        return
      }
      setDone(true)
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 12px', border: '1px solid #d1d5db',
    borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box',
    fontFamily: 'inherit',
  }
  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: 13, fontWeight: 600,
    color: '#374151', marginBottom: 5,
  }

  if (done) {
    return (
      <div style={{ minHeight: '100vh', background: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif' }}>
        <div style={{ maxWidth: 480, width: '100%', textAlign: 'center' }}>
          <div style={{ width: 64, height: 64, background: '#f0fdf4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 28 }}>✅</div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#09090b', marginBottom: 8 }}>Account Created</h1>
          <p style={{ color: '#71717a', fontSize: 15, lineHeight: 1.6, marginBottom: 24 }}>
            Your account is active. WorkOccMed will review and approve your examiner credentials.
            You can sign in now to explore the platform.
          </p>
          <Link href="/login" style={{
            display: 'inline-block', background: '#16a34a', color: '#fff',
            padding: '12px 28px', borderRadius: 8, fontWeight: 700, fontSize: 14,
            textDecoration: 'none',
          }}>
            Sign In to Your Account →
          </Link>
          <p style={{ marginTop: 16, fontSize: 12, color: '#a1a1aa' }}>
            Questions? Email <a href="mailto:support@workoccmed.com" style={{ color: '#16a34a' }}>support@workoccmed.com</a>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 16px', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif' }}>
      <div style={{ width: '100%', maxWidth: 520 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, background: '#16a34a', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#fff', fontWeight: 900, fontSize: 11 }}>WOM</span>
            </div>
            <span style={{ fontWeight: 800, fontSize: 18, color: '#09090b', letterSpacing: '-0.02em' }}>
              WorkOccMed<span style={{ color: '#16a34a', fontWeight: 400 }}> Examiner</span>
            </span>
          </Link>
          <p style={{ color: '#71717a', fontSize: 13, marginTop: 6 }}>14-day free trial · No credit card required</p>
        </div>

        {/* Card */}
        <div style={{ background: '#fff', border: '1px solid #e4e4e7', borderRadius: 16, padding: '28px 28px 24px', boxShadow: '0 1px 4px rgba(0,0,0,.05)' }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, color: '#09090b', margin: '0 0 20px' }}>Create your account</h2>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

            {/* Name row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <label style={labelStyle}>First Name</label>
                <input required value={form.firstName} onChange={set('firstName')} style={inputStyle} placeholder="Jane" />
              </div>
              <div>
                <label style={labelStyle}>Last Name</label>
                <input required value={form.lastName} onChange={set('lastName')} style={inputStyle} placeholder="Smith" />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Clinic / Company Name</label>
              <input required value={form.companyName} onChange={set('companyName')} style={inputStyle} placeholder="ABC Occupational Health" />
            </div>

            <div>
              <label style={labelStyle}>Type of Practice</label>
              <select value={form.industry} onChange={set('industry')} style={inputStyle}>
                <option value="">Select...</option>
                {INDUSTRIES.map(i => <option key={i.value} value={i.value}>{i.label}</option>)}
              </select>
            </div>

            <div>
              <label style={labelStyle}>Work Email</label>
              <input required type="email" value={form.email} onChange={set('email')} style={inputStyle} placeholder="admin@yourclinic.com" autoComplete="email" />
            </div>

            <div>
              <label style={labelStyle}>Phone</label>
              <input type="tel" value={form.phone} onChange={set('phone')} style={inputStyle} placeholder="(555) 000-0000" />
            </div>

            <div>
              <label style={labelStyle}>
                NRCME Number <span style={{ fontSize: 11, fontWeight: 400, color: '#9ca3af' }}>(if you are the examiner)</span>
              </label>
              <input value={form.nrcmeNumber} onChange={set('nrcmeNumber')} style={inputStyle} placeholder="NR-XXXXXXX" />
              <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 4 }}>
                Leave blank if registering for clinic admin only. Examiners can be added later.
              </p>
            </div>

            <div>
              <label style={labelStyle}>Password</label>
              <input required type="password" value={form.password} onChange={set('password')} style={inputStyle} placeholder="Min. 8 characters" autoComplete="new-password" />
            </div>

            {/* Pricing note */}
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#15803d' }}>
              <strong>$50/mo per NRCME-certified examiner</strong> — front desk staff are always free.
              14-day trial starts today, cancel anytime.
            </div>

            {error && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#7f1d1d' }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                background: loading ? '#9ca3af' : '#16a34a', color: '#fff',
                padding: '12px 0', borderRadius: 8, border: 'none',
                fontWeight: 700, fontSize: 14, cursor: loading ? 'not-allowed' : 'pointer',
                width: '100%',
              }}
            >
              {loading ? 'Creating account…' : 'Create Free Account'}
            </button>

            <p style={{ fontSize: 11, color: '#9ca3af', textAlign: 'center', margin: 0 }}>
              By registering, you agree to our{' '}
              <Link href="/terms" style={{ color: '#16a34a' }}>Terms of Service</Link> and{' '}
              <Link href="/privacy" style={{ color: '#16a34a' }}>Privacy Policy</Link>.
              Your account will be reviewed by WorkOccMed within 1 business day.
            </p>
          </form>
        </div>

        <p style={{ textAlign: 'center', fontSize: 13, color: '#71717a', marginTop: 16 }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: '#16a34a', fontWeight: 600, textDecoration: 'none' }}>Sign in →</Link>
        </p>
      </div>
    </div>
  )
}
