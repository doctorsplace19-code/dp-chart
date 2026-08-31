'use client'

import { useState } from 'react'
import Link from 'next/link'

// ── Demo data ────────────────────────────────────────────────────────────────

const driver = {
  name:     'Dorian Bedoya Serna',
  dob:      '04/12/1981',
  cdl:      'NJ-B4423965',
  cdlState: 'NJ',
  phone:    '(973) 836-6135',
  email:    'dbedoya@email.com',
}

const certStatus = {
  exid:         '4423965',
  result:       'Medically Qualified',
  issued:       '05/23/2026',
  expires:      '05/23/2028',
  examiner:     'Dr. Chantal Simpson-Gabriel',
  clinic:       'WorkOccMed Medical Group',
  clinicPhone:  '(888) 233-4567',
  clinicEmail:  'support@workoccmed.com',
  clinicHours:  'Mon – Fri, 8:00 AM – 5:00 PM EST',
  nrcme:        'NR-1182736',
  restrictions: ['Wearing corrective lenses'],
  fmcsaStatus:  'ACCEPTED',
}

const examHistory = [
  { exid: '4423965', date: '05/23/2026', clinic: 'WorkOccMed Medical Group', examiner: 'Simpson-Gabriel, C', result: 'Medically Qualified', certExp: '05/23/2028', certStatus: 'Current',  fmcsa: 'ACCEPTED' },
  { exid: '4210384', date: '05/18/2024', clinic: 'WorkOccMed Medical Group', examiner: 'Simpson-Gabriel, C', result: 'Medically Qualified', certExp: '05/18/2026', certStatus: 'Expired',  fmcsa: 'ACCEPTED' },
  { exid: '3987211', date: '06/02/2022', clinic: 'WorkOccMed Medical Group', examiner: 'Williams, A',        result: 'Medically Qualified', certExp: '06/02/2024', certStatus: 'Expired',  fmcsa: 'ACCEPTED' },
]

// ── Helpers ──────────────────────────────────────────────────────────────────

function parseMDY(s: string) {
  const [m, d, y] = s.split('/').map(Number)
  return new Date(y, m - 1, d)
}

function daysFromNow(dateStr: string) {
  return Math.round((parseMDY(dateStr).getTime() - Date.now()) / 86400000)
}

function maskCdl(cdl: string) {
  if (cdl.length <= 4) return cdl
  return cdl.slice(0, cdl.length - 4).replace(/./g, '•') + cdl.slice(-4)
}

type CertState = 'current' | 'renewal-soon' | 'expired'

function getCertState(daysLeft: number): CertState {
  if (daysLeft <= 0) return 'expired'
  if (daysLeft <= 180) return 'renewal-soon'
  return 'current'
}

const CERT_STYLES: Record<CertState, { bg: string; border: string; label: string; labelColor: string; valueColor: string }> = {
  'current':      { bg: '#f0fdf4', border: '#86efac', label: 'MEDICALLY QUALIFIED',    labelColor: '#166534', valueColor: '#15803d' },
  'renewal-soon': { bg: '#fffbeb', border: '#fcd34d', label: 'RENEWAL RECOMMENDED',    labelColor: '#92400e', valueColor: '#d97706' },
  'expired':      { bg: '#fef2f2', border: '#fca5a5', label: 'CERTIFICATE EXPIRED',    labelColor: '#991b1b', valueColor: '#dc2626' },
}

// ── Status badge ─────────────────────────────────────────────────────────────

function StatusBadge({ state, small }: { state: string; small?: boolean }) {
  const map: Record<string, { bg: string; color: string; label: string }> = {
    'Current':      { bg: '#dcfce7', color: '#166534', label: 'Current' },
    'Expired':      { bg: '#f3f4f6', color: '#6b7280', label: 'Expired' },
    'Renewal Soon': { bg: '#fffbeb', color: '#92400e', label: 'Renewal Soon' },
  }
  const s = map[state] ?? map['Expired']
  return (
    <span style={{
      display: 'inline-block',
      background: s.bg, color: s.color,
      fontSize: small ? 9 : 10, fontWeight: 700,
      padding: small ? '1px 6px' : '2px 8px', borderRadius: 5,
    }}>{s.label}</span>
  )
}

// ── Correction request modal ─────────────────────────────────────────────────

const CORRECTION_FIELDS = [
  'Full name', 'Date of birth', 'CDL / License number', 'Phone number',
  'Email address', 'Exam date', 'Exam result', 'Restrictions',
  'Certificate expiration', 'Other',
]

function CorrectionModal({ onClose }: { onClose: () => void }) {
  const [field, setField]   = useState('')
  const [details, setDetails] = useState('')
  const [contact, setContact] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <>
      <div onClick={onClose} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.45)', zIndex:300 }} />
      <div style={{
        position:'fixed', top:'50%', left:'50%', transform:'translate(-50%,-50%)',
        width: Math.min(480, window.innerWidth - 32), maxHeight:'90vh', overflowY:'auto',
        background:'#fff', borderRadius:12, zIndex:301, boxShadow:'0 20px 60px rgba(0,0,0,.3)',
        padding:'24px',
      }}>
        {submitted ? (
          <div style={{ textAlign:'center', padding:'24px 0' }}>
            <div style={{ fontSize:40, marginBottom:12 }}>✅</div>
            <div style={{ fontSize:17, fontWeight:800, color:'#166534', marginBottom:8 }}>Correction Request Submitted</div>
            <p style={{ fontSize:13, color:'#6b7280', marginBottom:20 }}>
              A clinic staff member will review your request and contact you at {contact || 'the phone or email on file'} within 1–2 business days. Regulated records cannot be modified without clinic review.
            </p>
            <button onClick={onClose} style={{ background:'#16a34a', color:'#fff', border:'none', borderRadius:8, padding:'10px 24px', fontSize:13, fontWeight:700, cursor:'pointer' }}>
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20 }}>
              <div>
                <div style={{ fontSize:16, fontWeight:800, color:'#111', marginBottom:4 }}>Request a Correction</div>
                <div style={{ fontSize:12, color:'#6b7280' }}>Corrections are reviewed by clinic staff. Regulated records are not modified automatically.</div>
              </div>
              <button type="button" onClick={onClose} style={{ background:'none', border:'none', fontSize:22, cursor:'pointer', color:'#9ca3af', lineHeight:1, padding:0, marginLeft:12 }}>×</button>
            </div>

            <label style={lbl}>What needs to be corrected? *</label>
            <select required value={field} onChange={e=>setField(e.target.value)} style={sel}>
              <option value="">Select a field…</option>
              {CORRECTION_FIELDS.map(f => <option key={f}>{f}</option>)}
            </select>

            <label style={{ ...lbl, marginTop:14 }}>Describe the correction needed *</label>
            <textarea
              required value={details} onChange={e=>setDetails(e.target.value)}
              placeholder="What is incorrect, and what should it be?"
              rows={4}
              style={{ ...inp, resize:'vertical', fontFamily:'inherit' } as React.CSSProperties}
            />

            <label style={{ ...lbl, marginTop:14 }}>Best way to reach you *</label>
            <input required value={contact} onChange={e=>setContact(e.target.value)}
              placeholder="Phone or email"
              style={inp}
            />

            <div style={{ marginTop:16, padding:'10px 12px', background:'#eff6ff', border:'1px solid #bfdbfe', borderRadius:8, fontSize:11, color:'#1e40af' }}>
              ℹ Your request will be reviewed by a clinic staff member. You will be contacted before any changes are made to your record.
            </div>

            <button type="submit" style={{ marginTop:16, width:'100%', background:'#2563eb', color:'#fff', border:'none', borderRadius:8, padding:'11px', fontSize:14, fontWeight:700, cursor:'pointer' }}>
              Submit Correction Request
            </button>
          </form>
        )}
      </div>
    </>
  )
}

// ── Certificate viewer modal ─────────────────────────────────────────────────

function CertModal({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div onClick={onClose} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.45)', zIndex:300 }} />
      <div style={{
        position:'fixed', top:'50%', left:'50%', transform:'translate(-50%,-50%)',
        width: Math.min(520, window.innerWidth - 32), maxHeight:'90vh', overflowY:'auto',
        background:'#fff', borderRadius:12, zIndex:301, boxShadow:'0 20px 60px rgba(0,0,0,.3)',
      }}>
        {/* Header */}
        <div style={{ padding:'16px 20px', borderBottom:'1px solid #e5e7eb', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div style={{ fontWeight:800, fontSize:14 }}>DOT Medical Certificate</div>
          <div style={{ display:'flex', gap:8, alignItems:'center' }}>
            <a href={`/api/certificate/${certStatus.exid}`} target="_blank" rel="noopener noreferrer"
              style={{ background:'#16a34a', color:'#fff', borderRadius:7, padding:'6px 14px', fontSize:12, fontWeight:700, textDecoration:'none' }}>
              Download PDF
            </a>
            <button onClick={onClose} style={{ background:'none', border:'none', fontSize:22, cursor:'pointer', color:'#9ca3af' }}>×</button>
          </div>
        </div>

        {/* Certificate body */}
        <div style={{ padding:'20px', fontFamily:'serif' }}>
          <div style={{ border:'3px solid #15803d', borderRadius:8, padding:'20px', background:'#f0fdf4' }}>
            <div style={{ textAlign:'center', marginBottom:16 }}>
              <div style={{ fontSize:10, letterSpacing:'.1em', textTransform:'uppercase', color:'#166534', fontWeight:700 }}>
                U.S. Department of Transportation — FMCSA
              </div>
              <div style={{ fontSize:18, fontWeight:900, color:'#15803d', marginTop:4 }}>
                Medical Examiner's Certificate
              </div>
              <div style={{ fontSize:10, color:'#6b7280', marginTop:2 }}>MCSA-5876</div>
            </div>

            <div style={{ background:'#fff', border:'1px solid #86efac', borderRadius:6, padding:'14px 16px', marginBottom:12 }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, fontSize:12 }}>
                {[
                  ['Driver Name', certStatus.examiner ? driver.name : '—'],
                  ['Date of Birth', driver.dob],
                  ['CDL Number', driver.cdl],
                  ['State', driver.cdlState],
                  ['Issued', certStatus.issued],
                  ['Expires', certStatus.expires],
                  ['Medical Examiner', certStatus.examiner],
                  ['NRCME Registry #', certStatus.nrcme],
                  ['Clinic', certStatus.clinic],
                  ['FMCSA Status', certStatus.fmcsaStatus],
                ].map(([l, v]) => (
                  <div key={l}>
                    <div style={{ fontSize:9, color:'#6b7280', textTransform:'uppercase', letterSpacing:'.04em', marginBottom:2 }}>{l}</div>
                    <div style={{ fontWeight:600, color:'#111', fontSize:12 }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>

            {certStatus.restrictions.length > 0 && (
              <div style={{ background:'#fffbeb', border:'1px solid #fcd34d', borderRadius:6, padding:'10px 14px', marginBottom:12, fontSize:12 }}>
                <div style={{ fontWeight:700, color:'#92400e', marginBottom:4 }}>Restrictions</div>
                {certStatus.restrictions.map(r => <div key={r} style={{ color:'#78350f' }}>• {r}</div>)}
              </div>
            )}

            <div style={{ textAlign:'center', fontSize:11, color:'#166534', fontWeight:700, padding:'8px', border:'1px solid #86efac', borderRadius:6 }}>
              ✓ MEDICALLY QUALIFIED — Valid through {certStatus.expires}
            </div>
          </div>

          <div style={{ marginTop:12, padding:'10px 12px', background:'#f9fafb', border:'1px solid #e5e7eb', borderRadius:8, fontSize:10, color:'#6b7280' }}>
            This certificate is issued under 49 CFR Part 391 and is only valid when used with a valid CDL. Employers may verify this record directly with FMCSA at nationalregistry.fmcsa.dot.gov.
          </div>
        </div>
      </div>
    </>
  )
}

// ── Shared styles ─────────────────────────────────────────────────────────────
const inp: React.CSSProperties = { width:'100%', padding:'9px 12px', border:'1px solid #d1d5db', borderRadius:7, fontSize:13, color:'#111', background:'#fff', boxSizing:'border-box', fontFamily:'inherit' }
const sel: React.CSSProperties = { ...inp, cursor:'pointer' }
const lbl: React.CSSProperties = { display:'block', fontSize:12, fontWeight:600, color:'#374151', marginBottom:5 }

// ── Top bar ───────────────────────────────────────────────────────────────────
function TopBar() {
  return (
    <header style={{
      background: 'var(--sidebar)', height: 54,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 24px', flexShrink: 0,
      borderBottom: '1px solid rgba(255,255,255,.08)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width:30, height:30, background:'var(--accent)', borderRadius:7, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <span style={{ color:'#fff', fontWeight:900, fontSize:9 }}>WOM</span>
        </div>
        <span style={{ color:'#fff', fontWeight:700, fontSize:15, letterSpacing:'-0.02em' }}>
          WorkOccMed<span style={{ color:'#4ade80', fontWeight:400 }}> Driver Portal</span>
        </span>
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:16 }}>
        <span style={{ fontSize:12, color:'rgba(255,255,255,.5)' }}>{driver.name}</span>
        <Link href="/driver/login" style={{ fontSize:12, color:'rgba(255,255,255,.4)', textDecoration:'none', border:'1px solid rgba(255,255,255,.15)', borderRadius:6, padding:'4px 10px' }}>Sign out</Link>
      </div>
    </header>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function DriverDashboard() {
  const [showCert, setShowCert]           = useState(false)
  const [showCorrection, setShowCorrection] = useState(false)
  const [showCdl, setShowCdl]             = useState(false)
  const [expandedExam, setExpandedExam]   = useState<string | null>(null)

  const daysLeft = daysFromNow(certStatus.expires)
  const certState = getCertState(daysLeft)
  const cs = CERT_STYLES[certState]

  const nextAction =
    certState === 'expired'      ? 'Your DOT medical certificate has expired. You cannot operate a CMV until a new certificate is issued.' :
    certState === 'renewal-soon' ? `Your certificate expires in ${daysLeft} days. Schedule a renewal exam before it lapses.` :
                                   `Your certificate is valid for ${daysLeft} more days.`

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)', display:'flex', flexDirection:'column' }}>
      <TopBar />

      {showCert       && <CertModal onClose={() => setShowCert(false)} />}
      {showCorrection && <CorrectionModal onClose={() => setShowCorrection(false)} />}

      <main style={{ flex:1, maxWidth:860, margin:'0 auto', width:'100%', padding:'24px 16px 48px' }}>

        {/* ── Certificate status hero ─────────────────────────── */}
        <div style={{ background:cs.bg, border:`2px solid ${cs.border}`, borderRadius:14, padding:'20px 22px', marginBottom:18 }}>
          <div style={{ fontSize:10, fontWeight:800, letterSpacing:'.08em', textTransform:'uppercase', color:cs.labelColor, marginBottom:6 }}>
            Current DOT Physical Status
          </div>
          <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:16, flexWrap:'wrap' as const }}>
            <div>
              <div style={{ fontSize:24, fontWeight:900, color:cs.valueColor, letterSpacing:'-0.03em', marginBottom:6 }}>
                {cs.label}
              </div>
              <div style={{ fontSize:13, color:'#374151', marginBottom:4 }}>
                Issued <strong>{certStatus.issued}</strong> &nbsp;·&nbsp; Expires <strong style={{ color:cs.valueColor }}>{certStatus.expires}</strong>
              </div>
              {daysLeft > 0 && (
                <div style={{ fontSize:13, color: certState === 'renewal-soon' ? '#92400e' : '#374151', fontWeight: certState !== 'current' ? 700 : 400 }}>
                  {daysLeft} days remaining
                </div>
              )}
              {certStatus.restrictions.length > 0 && (
                <div style={{ marginTop:8, fontSize:12, color:'#374151' }}>
                  <span style={{ fontWeight:600 }}>Restrictions: </span>
                  {certStatus.restrictions.join(', ')}
                </div>
              )}
              <div style={{ marginTop:10, fontSize:12, color: certState === 'expired' ? '#dc2626' : '#374151', maxWidth:380 }}>
                {nextAction}
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ display:'flex', flexDirection:'column' as const, gap:8, flexShrink:0, minWidth:160 }}>
              <button onClick={() => setShowCert(true)} style={{ background:'var(--accent)', color:'#fff', fontWeight:700, fontSize:13, padding:'10px 18px', borderRadius:8, border:'none', cursor:'pointer', textAlign:'center' as const }}>
                View Certificate
              </button>
              <a href={`/api/certificate/${certStatus.exid}`} target="_blank" rel="noopener noreferrer"
                style={{ background:'#fff', color:'var(--accent)', fontWeight:600, fontSize:12, padding:'9px 18px', borderRadius:8, textDecoration:'none', textAlign:'center' as const, border:'1px solid var(--accent)' }}>
                Download PDF
              </a>
              {(certState === 'renewal-soon' || certState === 'expired') && (
                <a href={`tel:${certStatus.clinicPhone.replace(/\D/g,'')}`}
                  style={{ background:'#d97706', color:'#fff', fontWeight:700, fontSize:12, padding:'9px 18px', borderRadius:8, textDecoration:'none', textAlign:'center' as const }}>
                  {certState === 'expired' ? '📞 Book New Exam' : '📞 Schedule Renewal'}
                </a>
              )}
              <div style={{ fontSize:9, color:'#6b7280', textAlign:'center' as const }}>
                MCSA-5876 · FMCSA: {certStatus.fmcsaStatus}
              </div>
            </div>
          </div>
        </div>

        {/* ── Two-column: driver info + exam details ──────────── */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(260px, 1fr))', gap:14, marginBottom:18 }}>

          {/* Driver info */}
          <div style={{ background:'#fff', border:'1px solid var(--border)', borderRadius:10, padding:'16px 18px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
              <div style={{ fontSize:11, fontWeight:700, letterSpacing:'.05em', textTransform:'uppercase', color:'var(--ink3)' }}>Your Information</div>
              <button onClick={() => setShowCorrection(true)} style={{ fontSize:11, color:'#2563eb', background:'none', border:'none', cursor:'pointer', fontWeight:600, padding:0 }}>
                Request Correction
              </button>
            </div>
            {[
              { label: 'Name',         val: driver.name },
              { label: 'Date of birth',val: driver.dob },
              { label: 'CDL number',   val: showCdl ? driver.cdl : maskCdl(driver.cdl), mono: true,
                action: <button onClick={()=>setShowCdl(v=>!v)} style={{ fontSize:10, color:'#2563eb', background:'none', border:'none', cursor:'pointer', padding:0 }}>{showCdl ? 'Hide' : 'Show'}</button> },
              { label: 'Phone',        val: driver.phone },
              { label: 'Email',        val: driver.email },
            ].map(row => (
              <div key={row.label} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'7px 0', borderBottom:'1px solid var(--border)', fontSize:13 }}>
                <span style={{ color:'var(--ink3)' }}>{row.label}</span>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <span style={{ fontWeight:500, color:'var(--ink)', fontFamily: row.mono ? 'monospace' : undefined }}>{row.val}</span>
                  {row.action}
                </div>
              </div>
            ))}
            <div style={{ marginTop:10, padding:'8px 10px', background:'#f9fafb', border:'1px solid #e5e7eb', borderRadius:7, fontSize:10, color:'#6b7280' }}>
              🔒 Your information is only visible to you and authorized clinic staff.
            </div>
          </div>

          {/* Exam details */}
          <div style={{ background:'#fff', border:'1px solid var(--border)', borderRadius:10, padding:'16px 18px' }}>
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:'.05em', textTransform:'uppercase', color:'var(--ink3)', marginBottom:12 }}>
              Most Recent Exam
            </div>
            {[
              { label: 'Exam date',           val: certStatus.issued },
              { label: 'Medical examiner',     val: certStatus.examiner },
              { label: 'Clinic',               val: certStatus.clinic },
              { label: 'Certificate expires',  val: certStatus.expires, highlight: true },
              { label: 'FMCSA submission',     val: certStatus.fmcsaStatus },
            ].map(row => (
              <div key={row.label} style={{ display:'flex', justifyContent:'space-between', padding:'7px 0', borderBottom:'1px solid var(--border)', fontSize:13 }}>
                <span style={{ color:'var(--ink3)' }}>{row.label}</span>
                <span style={{ fontWeight:500, color: row.highlight ? cs.valueColor : 'var(--ink)', textAlign:'right' as const, maxWidth:200 }}>{row.val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Exam history ─────────────────────────────────────── */}
        <div style={{ background:'#fff', border:'1px solid var(--border)', borderRadius:10, overflow:'hidden', marginBottom:18 }}>
          <div style={{ padding:'12px 18px', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div style={{ fontSize:13, fontWeight:700, color:'var(--ink)' }}>Exam History</div>
            <div style={{ fontSize:11, color:'var(--ink3)' }}>{examHistory.length} exams on file</div>
          </div>

          {examHistory.map((e, i) => {
            const isCurrent = e.certStatus === 'Current'
            const isOpen    = expandedExam === e.exid
            return (
              <div key={e.exid} style={{ borderBottom: i < examHistory.length - 1 ? '1px solid var(--border)' : 'none' }}>
                {/* Row */}
                <div
                  onClick={() => setExpandedExam(prev => prev === e.exid ? null : e.exid)}
                  style={{
                    display:'flex', alignItems:'center', gap:12, padding:'12px 18px', cursor:'pointer',
                    background: isOpen ? '#f9fafb' : (i % 2 ? '#fafafa' : '#fff'),
                    transition:'background .1s',
                  }}
                >
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' as const }}>
                      <span style={{ fontSize:13, fontWeight:600, color:'var(--ink)' }}>{e.date}</span>
                      <StatusBadge state={isCurrent ? 'Current' : 'Expired'} small />
                      {!isCurrent && <span style={{ fontSize:10, color:'#6b7280' }}>Certificate expired {e.certExp}</span>}
                    </div>
                    <div style={{ fontSize:12, color:'var(--ink3)', marginTop:2 }}>
                      {e.result} · {e.examiner}
                    </div>
                  </div>
                  <div style={{ flexShrink:0, display:'flex', gap:8, alignItems:'center' }}>
                    {isCurrent && (
                      <button onClick={ev => { ev.stopPropagation(); setShowCert(true) }}
                        style={{ background:'#16a34a', color:'#fff', border:'none', borderRadius:6, padding:'4px 10px', fontSize:11, fontWeight:600, cursor:'pointer' }}>
                        View Cert
                      </button>
                    )}
                    <span style={{ color:'var(--ink4)', fontSize:14 }}>{isOpen ? '▲' : '▼'}</span>
                  </div>
                </div>

                {/* Expanded details */}
                {isOpen && (
                  <div style={{ padding:'12px 20px 16px', background:'#f9fafb', borderTop:'1px solid var(--border)' }}>
                    {!isCurrent && (
                      <div style={{ marginBottom:10, padding:'8px 12px', background:'#f3f4f6', border:'1px solid #e5e7eb', borderRadius:7, fontSize:11, color:'#6b7280' }}>
                        ⓘ This certificate expired on {e.certExp} and is kept as a historical record only. It is no longer valid for operating a CMV.
                      </div>
                    )}
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(160px, 1fr))', gap:10, fontSize:12 }}>
                      {[
                        ['Exam date', e.date],
                        ['Result', e.result],
                        ['Cert expires', e.certExp],
                        ['Clinic', e.clinic],
                        ['Examiner', e.examiner],
                        ['FMCSA', e.fmcsa],
                      ].map(([l, v]) => (
                        <div key={l} style={{ padding:'8px 10px', background:'#fff', border:'1px solid #e5e7eb', borderRadius:7 }}>
                          <div style={{ fontSize:9, color:'#9ca3af', textTransform:'uppercase', letterSpacing:'.04em', marginBottom:3 }}>{l}</div>
                          <div style={{ fontWeight:600, color:'#111' }}>{v}</div>
                        </div>
                      ))}
                    </div>
                    {isCurrent && (
                      <div style={{ marginTop:10, display:'flex', gap:8 }}>
                        <a href={`/api/certificate/${e.exid}`} target="_blank" rel="noopener noreferrer"
                          style={{ background:'#16a34a', color:'#fff', borderRadius:7, padding:'7px 14px', fontSize:12, fontWeight:600, textDecoration:'none' }}>
                          Download Certificate (PDF)
                        </a>
                        <button onClick={() => { navigator.clipboard?.writeText(window.location.origin + `/api/certificate/${e.exid}`) }}
                          style={{ background:'#fff', border:'1px solid #e5e7eb', borderRadius:7, padding:'7px 14px', fontSize:12, fontWeight:500, cursor:'pointer', color:'#374151' }}>
                          Copy Share Link
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* ── Contact clinic ───────────────────────────────────── */}
        <div style={{ background:'#eff6ff', border:'1px solid #bfdbfe', borderRadius:10, padding:'16px 18px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap' as const, gap:12 }}>
            <div>
              <div style={{ fontSize:13, fontWeight:700, color:'#1e40af', marginBottom:6 }}>Contact {certStatus.clinic}</div>
              <div style={{ fontSize:12, color:'#1e3a8a', marginBottom:3 }}>📞 <a href={`tel:${certStatus.clinicPhone.replace(/\D/g,'')}`} style={{ color:'inherit', fontWeight:600 }}>{certStatus.clinicPhone}</a></div>
              <div style={{ fontSize:12, color:'#1e3a8a', marginBottom:3 }}>✉ <a href={`mailto:${certStatus.clinicEmail}`} style={{ color:'inherit', fontWeight:600 }}>{certStatus.clinicEmail}</a></div>
              <div style={{ fontSize:11, color:'#6b7280', marginTop:4 }}>Hours: {certStatus.clinicHours}</div>
            </div>
            <div style={{ display:'flex', gap:8, flexWrap:'wrap' as const }}>
              <a href={`tel:${certStatus.clinicPhone.replace(/\D/g,'')}`}
                style={{ background:'#2563eb', color:'#fff', borderRadius:8, padding:'9px 18px', fontSize:13, fontWeight:700, textDecoration:'none', whiteSpace:'nowrap' as const }}>
                Call Clinic
              </a>
              <button onClick={() => setShowCorrection(true)}
                style={{ background:'#fff', border:'1px solid #bfdbfe', color:'#2563eb', borderRadius:8, padding:'9px 18px', fontSize:13, fontWeight:600, cursor:'pointer', whiteSpace:'nowrap' as const }}>
                Request Correction
              </button>
            </div>
          </div>
        </div>

      </main>
    </div>
  )
}
