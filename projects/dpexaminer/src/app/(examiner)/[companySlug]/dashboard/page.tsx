'use client'

import { use, useState } from 'react'
import Shell from '@/components/layout/Shell'
import { TableCard, THead, TRow, TableFoot, Badge, BtnPrimary, BtnSecondary } from '@/components/ui/dp-table'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// ── Mock data ───────────────────────────────────────────────────────────────

const recentExams = [
  { exid: '4423965', driver: 'Bedoya Serna, Dorian',   type: 'DOT', date: '05/23/26', result: 'Medically Qualified',                 examiner: 'Simpson-Gabriel, C', status: 'Certified' },
  { exid: '4416745', driver: 'Rada, Roberto',           type: 'DOT', date: '05/20/26', result: 'Medically Qualified',                 examiner: 'Simpson-Gabriel, C', status: 'Certified' },
  { exid: '4409843', driver: 'Villalobos, Jose',        type: 'DOT', date: '05/16/26', result: 'Medically Qualified with Monitoring', examiner: 'Simpson-Gabriel, C', status: 'Awaiting Signature' },
  { exid: '4410080', driver: 'Jovcevski, Nikola',       type: 'DOT', date: '05/16/26', result: 'Medically Qualified',                 examiner: 'Simpson-Gabriel, C', status: 'Certified' },
  { exid: '4402511', driver: 'Vonderlinden, Francis',   type: 'DOT', date: '05/13/26', result: 'Medically Qualified',                 examiner: 'Simpson-Gabriel, C', status: 'Queued for FMCSA' },
  { exid: '4400974', driver: 'Pichardo, Javier',        type: 'DOT', date: '05/12/26', result: 'Medically Qualified',                 examiner: 'Simpson-Gabriel, C', status: 'Certified' },
  { exid: '4398201', driver: 'Garrett, Thomas',         type: 'DOT', date: '05/10/26', result: '—',                                  examiner: 'Simpson-Gabriel, C', status: 'In Progress' },
  { exid: '4391044', driver: 'Hensley, Darren',         type: 'DOT', date: '05/08/26', result: 'Medically Qualified',                 examiner: 'Simpson-Gabriel, C', status: 'Correction Required' },
]

const actionItems = [
  { id: 'a1', type: 'signature',  label: 'Awaiting Signature',     driver: 'Villalobos, Jose',      exid: '4409843', action: 'Capture Signature', urgency: 'high'   },
  { id: 'a2', type: 'fmcsa',      label: 'FMCSA Submission Failed', driver: 'Hensley, Darren',       exid: '4391044', action: 'Resolve & Retry',  urgency: 'high'   },
  { id: 'a3', type: 'draft',      label: 'Incomplete Exam',         driver: 'Garrett, Thomas',        exid: '4398201', action: 'Resume Exam',       urgency: 'medium' },
  { id: 'a4', type: 'nrcme',      label: 'NRCME Expiring in 107d',  driver: 'Dr. Andre Williams',    exid: null,      action: 'Renew Credential',  urgency: 'medium' },
  { id: 'a5', type: 'fmcsa',      label: 'Queued for FMCSA',        driver: 'Vonderlinden, Francis', exid: '4402511', action: 'View Queue',         urgency: 'low'    },
]

const practitioners = [
  { name: 'Dr. Chantal Simpson-Gabriel', nrcme: 'NR-1182736', exp: '12/14/26', exams: 412, status: 'Active' },
  { name: 'Dr. Andre Williams',          nrcme: 'NR-9923847', exp: '08/31/26', exams: 198, status: 'Active' },
  { name: 'Dr. Sofia Reyes',             nrcme: 'NR-7712938', exp: '03/15/27', exams:  89, status: 'Active' },
]

const staffList = [
  { name: 'Maria Torres', role: 'Front Desk', email: 'mtorres@dp.com', status: 'Active' },
  { name: 'James Wilson', role: 'Scheduler',  email: 'jwilson@dp.com', status: 'Active' },
]

const pendingQueue = [
  { exid: '4391044', driver: 'Hensley, Darren',  submitted: '05/08/26', status: 'Rejected',   error: 'Missing vision form attachment' },
  { exid: '4402511', driver: 'Vonderlinden, Francis', submitted: '05/13/26', status: 'Waiting', error: null },
]

const monthlyExams = [
  { month: 'Jan', count: 61 }, { month: 'Feb', count: 78 }, { month: 'Mar', count: 89 },
  { month: 'Apr', count: 96 }, { month: 'May', count: 88 },
]

// ── Status helpers ───────────────────────────────────────────────────────────

const STATUS_COLOR: Record<string, string> = {
  'Draft':              '#6b7280',
  'In Progress':        '#2563eb',
  'Awaiting Signature': '#d97706',
  'Certified':          '#16a34a',
  'Queued for FMCSA':   '#7c3aed',
  'Submitted':          '#0ea5e9',
  'Rejected':           '#dc2626',
  'Correction Required':'#dc2626',
}

function StatusBadge({ status }: { status: string }) {
  const color = STATUS_COLOR[status] ?? '#6b7280'
  return (
    <span style={{
      display:'inline-block', padding:'2px 8px', borderRadius:20,
      fontSize:10, fontWeight:700, letterSpacing:'.02em',
      background: color + '18', color, border: `1px solid ${color}44`,
    }}>{status}</span>
  )
}

function ExamAction({ exid, status, slug }: { exid: string; status: string; slug: string }) {
  if (status === 'Certified') {
    return (
      <div style={{ display:'flex', gap:4 }}>
        <Link href={`/${slug}/examiner/exams/${exid}`} style={btnStyle('ghost')}>View</Link>
        <a href={`/api/certificate/${exid}`} target="_blank" rel="noopener noreferrer" style={btnStyle('green')}>Cert</a>
      </div>
    )
  }
  if (status === 'Awaiting Signature' || status === 'In Progress' || status === 'Draft') {
    return (
      <div style={{ display:'flex', gap:4 }}>
        <Link href={`/${slug}/examiner/exams/${exid}`} style={btnStyle('blue')}>Resume</Link>
      </div>
    )
  }
  if (status === 'Correction Required' || status === 'Rejected') {
    return (
      <div style={{ display:'flex', gap:4 }}>
        <Link href={`/${slug}/examiner/exams/${exid}`} style={btnStyle('red')}>Resolve</Link>
      </div>
    )
  }
  if (status === 'Queued for FMCSA') {
    return (
      <div style={{ display:'flex', gap:4 }}>
        <Link href={`/${slug}/examiner/submissions`} style={btnStyle('purple')}>Queue</Link>
      </div>
    )
  }
  return <Link href={`/${slug}/examiner/exams/${exid}`} style={btnStyle('ghost')}>View</Link>
}

function btnStyle(variant: string): React.CSSProperties {
  const map: Record<string, React.CSSProperties> = {
    ghost:  { background:'var(--bg)', border:'1px solid var(--border)', color:'var(--ink)', borderRadius:5, padding:'3px 8px', fontSize:11, fontWeight:500, textDecoration:'none', display:'inline-block' },
    green:  { background:'#16a34a', color:'#fff', borderRadius:5, padding:'3px 8px', fontSize:11, fontWeight:600, textDecoration:'none', display:'inline-block' },
    blue:   { background:'#2563eb', color:'#fff', borderRadius:5, padding:'3px 8px', fontSize:11, fontWeight:600, textDecoration:'none', display:'inline-block' },
    red:    { background:'#dc2626', color:'#fff', borderRadius:5, padding:'3px 8px', fontSize:11, fontWeight:600, textDecoration:'none', display:'inline-block' },
    purple: { background:'#7c3aed', color:'#fff', borderRadius:5, padding:'3px 8px', fontSize:11, fontWeight:600, textDecoration:'none', display:'inline-block' },
  }
  return map[variant] ?? map.ghost
}

// ── Urgency colors ───────────────────────────────────────────────────────────
const URGENCY: Record<string, { bg: string; border: string; dot: string }> = {
  high:   { bg:'#fef2f2', border:'#fecaca', dot:'#dc2626' },
  medium: { bg:'#fffbeb', border:'#fcd34d', dot:'#d97706' },
  low:    { bg:'#f0fdf4', border:'#bbf7d0', dot:'#16a34a' },
}

// ── Drawer ───────────────────────────────────────────────────────────────────
type DrawerType = 'exams-month' | 'exams-ytd' | 'pending' | 'practitioners' | null

function Drawer({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!open) return null
  return (
    <>
      <div onClick={onClose} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.4)', zIndex:200 }} />
      <div style={{
        position:'fixed', top:0, right:0, bottom:0, width: Math.min(560, window.innerWidth - 32),
        background:'var(--card)', borderLeft:'1px solid var(--border)', zIndex:201,
        display:'flex', flexDirection:'column', boxShadow:'-8px 0 32px rgba(0,0,0,.18)',
      }}>
        <div style={{ padding:'18px 20px', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <span style={{ fontWeight:800, fontSize:15 }}>{title}</span>
          <button onClick={onClose} style={{ background:'none', border:'none', fontSize:20, cursor:'pointer', color:'var(--ink3)', lineHeight:1 }}>×</button>
        </div>
        <div style={{ flex:1, overflowY:'auto', padding:'18px 20px' }}>{children}</div>
      </div>
    </>
  )
}

function MiniBar({ value, max, color }: { value: number; max: number; color: string }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
      <div style={{ flex:1, background:'var(--border)', borderRadius:4, height:7 }}>
        <div style={{ width:`${Math.round((value/max)*100)}%`, background:color, borderRadius:4, height:7, transition:'width .4s' }} />
      </div>
      <span style={{ fontSize:11, fontWeight:700, color:'var(--ink)', minWidth:28, textAlign:'right' }}>{value}</span>
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function CompanyDashboard({ params }: { params: Promise<{ companySlug: string }> }) {
  const { companySlug } = use(params)
  const router = useRouter()
  const [drawer, setDrawer] = useState<DrawerType>(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [driverSearch, setDriverSearch] = useState('')

  const now = new Date()

  const filteredExams = recentExams.filter(e => {
    const q = search.toLowerCase()
    const matchQ = !q || e.driver.toLowerCase().includes(q) || e.exid.includes(q) || e.result.toLowerCase().includes(q)
    const matchS = !statusFilter || e.status === statusFilter
    return matchQ && matchS
  })

  function daysUntil(exp: string) {
    const [m, , y] = exp.split('/')
    const expDate = new Date(2000 + parseInt(y), parseInt(m) - 1, 1)
    return Math.round((expDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  }

  const expiringPractitioners = practitioners
    .map(p => ({ ...p, days: daysUntil(p.exp) }))
    .filter(p => p.days <= 120)
    .sort((a, b) => a.days - b.days)

  const statCards = [
    { label: 'Active Practitioners', value: practitioners.length, sub: '$150/mo to DP', accent: 'var(--accent)', drawer: 'practitioners' as DrawerType },
    { label: 'Exams This Month',     value: 24, sub: 'May 2026', accent: 'var(--ink)', drawer: 'exams-month' as DrawerType },
    { label: 'Exams YTD',            value: 412, sub: 'Jan–May 2026', accent: '#2563eb', drawer: 'exams-ytd' as DrawerType },
    { label: 'Pending Submissions',  value: pendingQueue.length, sub: 'FMCSA queue', accent: 'var(--amber)', drawer: 'pending' as DrawerType },
  ]

  return (
    <Shell
      companySlug={companySlug} companyName="WorkOccMed Medical Group"
      role="COMPANY_ADMIN" pageTitle="Company Dashboard"
      pageActions={
        <div style={{ display:'flex', gap:8 }}>
          <BtnPrimary href={`/${companySlug}/examiner/exams/add`}>+ New Exam</BtnPrimary>
          <BtnSecondary href={`/${companySlug}/practitioners`}>Practitioners</BtnSecondary>
        </div>
      }
    >

      {/* ── Search Driver bar ─────────────────────────────────── */}
      <div style={{ display:'flex', gap:10, marginBottom:16, alignItems:'center' }}>
        <div style={{ flex:1, position:'relative' }}>
          <span style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'var(--ink4)', fontSize:15, pointerEvents:'none' }}>🔍</span>
          <input
            value={driverSearch}
            onChange={e => setDriverSearch(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && driverSearch.trim()) router.push(`/${companySlug}/drivers?q=${encodeURIComponent(driverSearch.trim())}`) }}
            placeholder="Search driver by name, DOB, CDL, or phone…"
            style={{ width:'100%', padding:'10px 14px 10px 38px', border:'1px solid var(--border)', borderRadius:8, fontSize:13, background:'var(--bg)', color:'var(--ink)', fontFamily:'inherit', boxSizing:'border-box' as const }}
          />
        </div>
        <button
          onClick={() => { if (driverSearch.trim()) router.push(`/${companySlug}/drivers?q=${encodeURIComponent(driverSearch.trim())}`) }}
          style={{ background:'var(--accent)', color:'#fff', border:'none', borderRadius:8, padding:'10px 18px', fontSize:13, fontWeight:600, cursor:'pointer', whiteSpace:'nowrap' as const }}
        >
          Search Driver
        </button>
      </div>

      {/* ── NRCME expiry alerts ───────────────────────────────── */}
      {expiringPractitioners.map(p => (
        <div key={p.nrcme} style={{ background:'#fffbeb', border:'1px solid #f59e0b', borderRadius:8, padding:'10px 14px', marginBottom:10, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <span style={{ fontSize:13, color:'#92400e' }}>
            ⚠ <strong>{p.name}</strong> — NRCME expires <strong style={{ color: p.days <= 60 ? '#dc2626' : '#d97706' }}>{p.exp}</strong>
            {' '}<span style={{ fontWeight:700 }}>({p.days} days remaining)</span>
            {p.days <= 60 ? ' — Certification is at risk. Renewal required immediately.' : ' — Renewal required within 120 days.'}
          </span>
          <button onClick={() => setDrawer('practitioners')} style={{ background:'#f59e0b', color:'#fff', border:'none', borderRadius:6, padding:'4px 12px', fontSize:12, fontWeight:700, cursor:'pointer', flexShrink:0, marginLeft:12 }}>
            View
          </button>
        </div>
      ))}

      {/* ── Stat cards ────────────────────────────────────────── */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:16 }}>
        {statCards.map(({ label, value, sub, accent, drawer: d }) => (
          <div
            key={label}
            onClick={() => setDrawer(prev => prev === d ? null : d)}
            style={{
              background:'var(--card)', border: drawer === d ? `2px solid ${accent}` : '1px solid var(--border)',
              borderRadius:10, padding:'16px', cursor:'pointer',
              boxShadow: drawer === d ? `0 0 0 3px ${accent}22` : '0 1px 3px rgba(0,0,0,.06)',
              transition:'all .15s',
            }}
          >
            <div style={{ fontSize:28, fontWeight:800, color:accent, fontVariantNumeric:'tabular-nums' }}>{value}</div>
            <div style={{ fontSize:12, fontWeight:600, color:'var(--ink)', marginTop:2 }}>{label}</div>
            <div style={{ fontSize:10, color: drawer === d ? accent : 'var(--ink4)', marginTop:2 }}>
              {drawer === d ? 'Click to close ×' : sub}
            </div>
          </div>
        ))}
      </div>

      {/* ── Action Required ───────────────────────────────────── */}
      {actionItems.length > 0 && (
        <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:10, marginBottom:16, overflow:'hidden' }}>
          <div style={{ padding:'12px 16px', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <span style={{ fontWeight:700, fontSize:13 }}>
              Action Required
              <span style={{ marginLeft:8, background:'#dc2626', color:'#fff', borderRadius:20, padding:'1px 7px', fontSize:10, fontWeight:800 }}>
                {actionItems.filter(a => a.urgency === 'high').length}
              </span>
            </span>
            <span style={{ fontSize:11, color:'var(--ink3)' }}>{actionItems.length} items</span>
          </div>
          <div style={{ padding:'8px 12px', display:'flex', flexDirection:'column' as const, gap:6 }}>
            {actionItems.map(item => {
              const u = URGENCY[item.urgency]
              return (
                <div key={item.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'8px 10px', background:u.bg, border:`1px solid ${u.border}`, borderRadius:8 }}>
                  <div style={{ width:8, height:8, borderRadius:'50%', background:u.dot, flexShrink:0 }} />
                  <div style={{ flex:1, minWidth:0 }}>
                    <span style={{ fontSize:12, fontWeight:600, color:'var(--ink)' }}>{item.label}</span>
                    <span style={{ fontSize:11, color:'var(--ink3)', marginLeft:8 }}>{item.driver}</span>
                    {item.exid && <span style={{ fontSize:10, color:'var(--ink4)', marginLeft:6, fontFamily:'monospace' }}>#{item.exid}</span>}
                  </div>
                  {item.exid ? (
                    <Link
                      href={`/${companySlug}/examiner/exams/${item.exid}`}
                      style={{ background:u.dot, color:'#fff', border:'none', borderRadius:6, padding:'4px 10px', fontSize:11, fontWeight:700, textDecoration:'none', flexShrink:0 }}
                    >
                      {item.action}
                    </Link>
                  ) : (
                    <Link
                      href={`/${companySlug}/practitioners`}
                      style={{ background:u.dot, color:'#fff', border:'none', borderRadius:6, padding:'4px 10px', fontSize:11, fontWeight:700, textDecoration:'none', flexShrink:0 }}
                    >
                      {item.action}
                    </Link>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Two-column: Practitioners + Staff ─────────────────── */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:16 }}>
        <TableCard title="Practitioners" action={<BtnSecondary href={`/${companySlug}/practitioners`} small>Manage →</BtnSecondary>}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <THead cols={['Name','NRCME','Expires','Exams','Status']} />
            <tbody>
              {practitioners.map((p, i) => {
                const diff = daysUntil(p.exp)
                const expColor = diff <= 60 ? '#dc2626' : diff <= 120 ? '#f59e0b' : 'var(--ink3)'
                return (
                  <TRow key={i} i={i} cells={[
                    <span style={{ fontWeight:600, color:'var(--ink)', fontSize:12 }}>{p.name}</span>,
                    <span style={{ fontFamily:'monospace', fontSize:11 }}>{p.nrcme}</span>,
                    <span style={{ color:expColor, fontWeight: diff <= 120 ? 700 : 400 }}>{p.exp}</span>,
                    <span style={{ color:'var(--ink3)' }}>{p.exams}</span>,
                    <Badge label={p.status} color="green" />,
                  ]} />
                )
              })}
            </tbody>
          </table>
        </TableCard>

        <TableCard title="Staff" action={<BtnSecondary href={`/${companySlug}/staff`} small>Manage →</BtnSecondary>}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <THead cols={['Name','Role','Email','Status']} />
            <tbody>
              {staffList.map((s, i) => (
                <TRow key={i} i={i} cells={[
                  <span style={{ fontWeight:600, color:'var(--ink)', fontSize:12 }}>{s.name}</span>,
                  <span style={{ fontSize:11, background:'var(--bg)', border:'1px solid var(--border)', borderRadius:20, padding:'1px 7px' }}>{s.role}</span>,
                  <span style={{ color:'var(--ink3)', fontSize:12 }}>{s.email}</span>,
                  <Badge label={s.status} color="green" />,
                ]} />
              ))}
            </tbody>
          </table>
          <div style={{ padding:'10px 14px', borderTop:'1px solid var(--border)' }}>
            <Link href={`/${companySlug}/staff/new`} style={{ fontSize:12, color:'var(--accent)', textDecoration:'none', fontWeight:600 }}>+ Add Staff Member</Link>
          </div>
        </TableCard>
      </div>

      {/* ── Recent Exams ──────────────────────────────────────── */}
      <TableCard
        title="Recent Exams"
        action={<BtnSecondary href={`/${companySlug}/examiner/exams`} small>View All</BtnSecondary>}
      >
        <div style={{ padding:'10px 14px', borderBottom:'1px solid var(--border)', display:'flex', gap:8, alignItems:'center', flexWrap:'wrap' as const }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search driver, EXID, or result…"
            style={{ flex:1, minWidth:180, padding:'6px 10px', border:'1px solid var(--border)', borderRadius:6, fontSize:12, background:'var(--bg)', color:'var(--ink)', fontFamily:'inherit' }}
          />
          {(['Certified','Awaiting Signature','In Progress','Correction Required','Queued for FMCSA'] as const).map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(prev => prev === s ? null : s)}
              style={{
                padding:'4px 10px', borderRadius:6, fontSize:10, fontWeight:700, cursor:'pointer', border:'none',
                background: statusFilter === s ? (STATUS_COLOR[s] ?? '#6b7280') : 'var(--border)',
                color: statusFilter === s ? '#fff' : 'var(--ink)',
                whiteSpace:'nowrap' as const,
              }}
            >
              {s}
            </button>
          ))}
          {(search || statusFilter) && (
            <button onClick={() => { setSearch(''); setStatusFilter(null) }} style={{ fontSize:11, color:'var(--ink3)', background:'none', border:'none', cursor:'pointer' }}>Clear ×</button>
          )}
        </div>

        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <THead cols={['EXID','Driver','Type','Date','Result','Examiner','Status','']} />
            <tbody>
              {filteredExams.map((e, i) => (
                <TRow key={e.exid} i={i} cells={[
                  <Link href={`/${companySlug}/examiner/exams/${e.exid}`} style={{ color:'var(--accent)', fontWeight:700, textDecoration:'none', fontVariantNumeric:'tabular-nums' }}>{e.exid}</Link>,
                  <span style={{ fontWeight:500, color:'var(--ink)' }}>{e.driver}</span>,
                  e.type,
                  <span style={{ color:'var(--ink3)' }}>{e.date}</span>,
                  <span style={{ color: e.result.includes('Monitoring') ? 'var(--amber)' : e.result === '—' ? 'var(--ink4)' : 'var(--accent)', fontWeight:500, fontSize:12 }}>{e.result}</span>,
                  <span style={{ color:'var(--ink3)', fontSize:12 }}>{e.examiner}</span>,
                  <StatusBadge status={e.status} />,
                  <ExamAction exid={e.exid} status={e.status} slug={companySlug} />,
                ]} />
              ))}
              {filteredExams.length === 0 && (
                <tr><td colSpan={8} style={{ textAlign:'center', padding:'24px', color:'var(--ink4)', fontSize:13 }}>No exams match your search.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <TableFoot total={filteredExams.length} />
      </TableCard>

      {/* ── Drawers ───────────────────────────────────────────── */}

      <Drawer open={drawer === 'exams-month'} onClose={() => setDrawer(null)} title="Exams This Month — May 2026">
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:20 }}>
          {[['DOT Physicals','22','var(--accent)'],['Drug Screens','2','#7c3aed']].map(([l,v,c]) => (
            <div key={l} style={{ background:'var(--bg)', border:'1px solid var(--border)', borderRadius:8, padding:'12px 14px', textAlign:'center' }}>
              <div style={{ fontSize:22, fontWeight:800, color:c as string }}>{v}</div>
              <div style={{ fontSize:11, color:'var(--ink3)', marginTop:2 }}>{l}</div>
            </div>
          ))}
        </div>
        <div style={{ fontWeight:700, fontSize:13, marginBottom:10 }}>Daily Activity — May</div>
        {[{d:'May 23',n:3},{d:'May 20',n:2},{d:'May 16',n:4},{d:'May 13',n:3},{d:'May 12',n:2},{d:'May 10',n:3},{d:'May 7',n:2},{d:'May 5',n:5}].map(row => (
          <div key={row.d} style={{ marginBottom:8 }}>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, marginBottom:3 }}>
              <span style={{ color:'var(--ink3)' }}>{row.d}</span>
            </div>
            <MiniBar value={row.n} max={6} color="var(--accent)" />
          </div>
        ))}
      </Drawer>

      <Drawer open={drawer === 'exams-ytd'} onClose={() => setDrawer(null)} title="Exams Year-to-Date — 2026">
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:20 }}>
          {[['Total Exams','412','#2563eb'],['Avg / Month','82','var(--accent)'],['Certified','398','#16a34a'],['Pending / Issues','14','var(--amber)']].map(([l,v,c]) => (
            <div key={l} style={{ background:'var(--bg)', border:'1px solid var(--border)', borderRadius:8, padding:'12px 14px', textAlign:'center' }}>
              <div style={{ fontSize:22, fontWeight:800, color:c as string }}>{v}</div>
              <div style={{ fontSize:11, color:'var(--ink3)', marginTop:2 }}>{l}</div>
            </div>
          ))}
        </div>
        <div style={{ fontWeight:700, fontSize:13, marginBottom:12 }}>Monthly Breakdown</div>
        {monthlyExams.map(row => (
          <div key={row.month} style={{ marginBottom:10 }}>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, marginBottom:4 }}>
              <span style={{ fontWeight:600 }}>{row.month} 2026</span>
            </div>
            <MiniBar value={row.count} max={120} color="#2563eb" />
          </div>
        ))}
      </Drawer>

      <Drawer open={drawer === 'pending'} onClose={() => setDrawer(null)} title="Pending FMCSA Submissions">
        <p style={{ fontSize:12, color:'var(--ink3)', marginBottom:16 }}>These exams are awaiting submission or have a hold in the FMCSA queue.</p>
        {pendingQueue.map(item => {
          const isRejected = item.status === 'Rejected'
          return (
            <div key={item.exid} style={{ background: isRejected ? '#fef2f2' : '#fffbeb', border:`1px solid ${isRejected ? '#fecaca' : '#f59e0b'}`, borderRadius:8, padding:'12px 14px', marginBottom:10 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:4 }}>
                <Link href={`/${companySlug}/examiner/exams/${item.exid}`} style={{ fontWeight:700, color:'var(--accent)', textDecoration:'none', fontSize:13 }}>
                  EXID {item.exid}
                </Link>
                <span style={{ fontSize:11, background: isRejected ? '#dc2626' : '#f59e0b', color:'#fff', borderRadius:20, padding:'1px 8px', fontWeight:700 }}>
                  {item.status}
                </span>
              </div>
              <div style={{ fontWeight:600, fontSize:12, marginBottom:2 }}>{item.driver}</div>
              <div style={{ fontSize:11, color:'var(--ink3)', marginBottom:2 }}>Submitted: {item.submitted}</div>
              {item.error && <div style={{ fontSize:11, color: isRejected ? '#dc2626' : '#92400e', marginTop:4 }}>⚠ {item.error}</div>}
              <div style={{ marginTop:8, display:'flex', gap:6 }}>
                <Link href={`/${companySlug}/examiner/exams/${item.exid}`} style={{ background:'var(--accent)', color:'#fff', borderRadius:5, padding:'4px 10px', fontSize:11, fontWeight:600, textDecoration:'none' }}>
                  {isRejected ? 'Resolve' : 'View Exam'}
                </Link>
                {isRejected && (
                  <button style={{ background:'#dc2626', color:'#fff', border:'none', borderRadius:5, padding:'4px 10px', fontSize:11, fontWeight:600, cursor:'pointer' }}>
                    Retry Submission
                  </button>
                )}
              </div>
            </div>
          )
        })}
        <Link href={`/${companySlug}/examiner/submissions`} style={{ display:'block', textAlign:'center', marginTop:8, color:'var(--accent)', fontSize:13, fontWeight:600, textDecoration:'none' }}>
          View Full FMCSA Queue →
        </Link>
      </Drawer>

      <Drawer open={drawer === 'practitioners'} onClose={() => setDrawer(null)} title="Active Practitioners">
        {practitioners.map(p => {
          const diff = daysUntil(p.exp)
          const expColor = diff <= 60 ? '#dc2626' : diff <= 120 ? '#d97706' : '#16a34a'
          return (
            <div key={p.nrcme} style={{ background:'var(--bg)', border:'1px solid var(--border)', borderRadius:8, padding:'12px 14px', marginBottom:10 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
                <span style={{ fontWeight:700, fontSize:13 }}>{p.name}</span>
                <Badge label={p.status} color="green" />
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8, fontSize:11 }}>
                <div><div style={{ color:'var(--ink4)', marginBottom:1 }}>NRCME</div><span style={{ fontFamily:'monospace' }}>{p.nrcme}</span></div>
                <div>
                  <div style={{ color:'var(--ink4)', marginBottom:1 }}>Expires</div>
                  <span style={{ color:expColor, fontWeight:700 }}>{p.exp}</span>
                  <span style={{ fontSize:10, color:expColor, display:'block' }}>{diff}d remaining</span>
                </div>
                <div><div style={{ color:'var(--ink4)', marginBottom:1 }}>Exams</div><span style={{ fontWeight:600 }}>{p.exams}</span></div>
              </div>
              {diff <= 120 && (
                <div style={{ marginTop:8, padding:'6px 10px', background:'#fffbeb', border:'1px solid #f59e0b', borderRadius:6, fontSize:11, color:'#92400e' }}>
                  ⚠ NRCME renewal required — expires in {diff} days
                </div>
              )}
            </div>
          )
        })}
        <Link href={`/${companySlug}/practitioners`} style={{ display:'block', textAlign:'center', marginTop:8, color:'var(--accent)', fontSize:13, fontWeight:600, textDecoration:'none' }}>
          Manage All Practitioners →
        </Link>
      </Drawer>

    </Shell>
  )
}
