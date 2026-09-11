'use client'
import Link from 'next/link'

export default function PrintBar({ name, backHref }: { name: string; backHref: string }) {
  return (
    <div className="no-print" style={{ background: '#1a3a1a', padding: '10px 20px', display: 'flex', gap: 12, alignItems: 'center' }}>
      <span style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>I-693 — {name}</span>
      <button
        onClick={() => window.print()}
        style={{ background: '#4ade80', color: '#14532d', border: 'none', borderRadius: 6, padding: '6px 16px', fontWeight: 700, cursor: 'pointer' }}
      >
        Print / Save PDF
      </button>
      <Link href={backHref} style={{ color: '#86efac', textDecoration: 'none', fontSize: 12 }}>← Back to Exam</Link>
      <span style={{ color: 'rgba(255,255,255,.4)', fontSize: 11, marginLeft: 'auto' }}>
        Seal completed form in envelope — hand to applicant unopened per 8 CFR 232.2
      </span>
    </div>
  )
}
