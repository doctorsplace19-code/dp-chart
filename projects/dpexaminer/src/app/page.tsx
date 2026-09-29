import Link from 'next/link'

const FEATURES = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
      </svg>
    ),
    title: 'For examiners',
    desc: 'Streamline exams and documentation so you can focus on quality care.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    title: 'For staff',
    desc: 'Save time with smart workflows, automated forms, and easy tracking.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
      </svg>
    ),
    title: 'For drivers',
    desc: 'Simple, digital experience that gets drivers back on the road.',
  },
]

const NAV_ICONS: Record<string, JSX.Element> = {
  Dashboard: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
  Exams: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/></svg>,
  Drivers: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>,
  Forms: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/></svg>,
  Certificates: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>,
  Reports: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  Settings: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  Help: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
}

export default function HomePage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#ffffff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
      color: '#0f172a',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        .wom-page { font-family: 'Plus Jakarta Sans', -apple-system, sans-serif; }
        .nav-link:hover { color: #0f172a !important; }
        .btn-outline:hover { background: #f0fdf4 !important; }
        .feature-card:hover { border-color: #bbf7d0 !important; box-shadow: 0 4px 16px rgba(22,163,74,.08) !important; }
        .faq-item { border-bottom: 1px solid #e2e8f0; }
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .mockup-wrap { display: none !important; }
          .feature-grid { grid-template-columns: 1fr !important; }
          .pricing-grid { grid-template-columns: 1fr !important; }
          .how-grid { grid-template-columns: 1fr 1fr !important; }
          .stat-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 480px) {
          .how-grid { grid-template-columns: 1fr !important; }
          .stat-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* Nav */}
      <nav style={{
        background: '#fff',
        borderBottom: '1px solid #e2e8f0',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <div style={{
          maxWidth: 1180, margin: '0 auto', padding: '0 24px',
          height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 34, height: 34, background: '#16a34a', borderRadius: 9,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <span style={{ color: '#fff', fontWeight: 900, fontSize: 10, letterSpacing: '.04em' }}>WOM</span>
            </div>
            <span style={{ fontWeight: 800, fontSize: 16, letterSpacing: '-0.02em', color: '#0f172a' }}>
              WorkOccMed <span style={{ color: '#16a34a', fontWeight: 600 }}>Examiner</span>
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Link href="#pricing" className="nav-link" style={{ fontSize: 14, color: '#64748b', textDecoration: 'none', fontWeight: 500, padding: '6px 12px' }}>Pricing</Link>
            <Link href="/login" className="nav-link" style={{ fontSize: 14, color: '#64748b', textDecoration: 'none', fontWeight: 500, padding: '6px 12px' }}>Sign in</Link>
            <Link href="/register" style={{
              background: '#16a34a', color: '#fff', padding: '8px 18px',
              borderRadius: 8, fontSize: 14, fontWeight: 700, textDecoration: 'none', letterSpacing: '-0.01em',
            }}>Start Free Trial</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ background: '#fff', padding: '72px 24px 0' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <div className="hero-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>

            {/* Left */}
            <div>
              {/* Badges */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  background: '#f0fdf4', border: '1px solid #bbf7d0',
                  color: '#166534', padding: '5px 12px', borderRadius: 99,
                  fontSize: 12, fontWeight: 600,
                }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  FMCSA National Registry · 49 CFR 391.43(g) Compliant
                </span>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  background: '#f8fafc', border: '1px solid #e2e8f0',
                  color: '#475569', padding: '5px 12px', borderRadius: 99,
                  fontSize: 12, fontWeight: 600,
                }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  Built for busy occupational-health clinics
                </span>
              </div>

              {/* Headline */}
              <h1 style={{
                fontSize: 52, fontWeight: 900, lineHeight: 1.06,
                letterSpacing: '-0.035em', color: '#0f172a',
                margin: '0 0 20px', textWrap: 'balance' as React.CSSProperties['textWrap'],
              }}>
                DOT physicals<br />made simple for<br />your clinic.
              </h1>

              {/* Bullets */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32 }}>
                {['Spend less time on paperwork.', 'Spend more time caring for drivers.'].map(b => (
                  <div key={b} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 16, color: '#334155', fontWeight: 500 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#dcfce7"/><path d="M8 12l3 3 5-5" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    {b}
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
                <Link href="/register" style={{
                  background: '#16a34a', color: '#fff', padding: '13px 26px',
                  borderRadius: 9, fontWeight: 800, fontSize: 15, textDecoration: 'none',
                  letterSpacing: '-0.01em', display: 'inline-block',
                }}>Start Your Free Trial</Link>
                <Link href="#how-it-works" className="btn-outline" style={{
                  background: '#fff', color: '#0f172a', padding: '13px 22px',
                  borderRadius: 9, fontWeight: 700, fontSize: 15, textDecoration: 'none',
                  border: '1.5px solid #e2e8f0', display: 'inline-flex', alignItems: 'center', gap: 8,
                }}>
                  <span style={{
                    width: 26, height: 26, background: '#f1f5f9', borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="#0f172a"><polygon points="5,3 19,12 5,21"/></svg>
                  </span>
                  See How It Works
                </Link>
              </div>
              <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>No credit card required · 14 days free</p>
            </div>

            {/* Right — App Mockup */}
            <div className="mockup-wrap" style={{ position: 'relative' }}>
              {/* Browser chrome */}
              <div style={{
                background: '#1e293b', borderRadius: 14, overflow: 'hidden',
                boxShadow: '0 32px 80px rgba(15,23,42,.25), 0 4px 16px rgba(15,23,42,.1)',
              }}>
                {/* Browser bar */}
                <div style={{
                  background: '#0f172a', padding: '10px 16px',
                  display: 'flex', alignItems: 'center', gap: 6,
                }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444', display: 'inline-block' }}/>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }}/>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }}/>
                  <div style={{
                    flex: 1, margin: '0 12px', background: '#1e293b', borderRadius: 5,
                    padding: '3px 10px', fontSize: 10, color: '#64748b', textAlign: 'center',
                  }}>examiner.workoccmed.com</div>
                </div>

                {/* App UI */}
                <div style={{ display: 'flex', height: 380 }}>
                  {/* Sidebar */}
                  <div style={{ width: 130, background: '#0c1a2e', padding: '16px 0', flexShrink: 0 }}>
                    <div style={{ padding: '0 12px 16px', display: 'flex', alignItems: 'center', gap: 7 }}>
                      <div style={{ width: 24, height: 24, background: '#16a34a', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ color: '#fff', fontWeight: 900, fontSize: 7 }}>WOM</span>
                      </div>
                      <span style={{ color: '#fff', fontWeight: 700, fontSize: 11 }}>WorkOccMed</span>
                    </div>
                    {Object.entries(NAV_ICONS).map(([label, icon], i) => (
                      <div key={label} style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        padding: '7px 12px', fontSize: 11, fontWeight: i === 0 ? 700 : 500,
                        color: i === 0 ? '#fff' : '#64748b',
                        background: i === 0 ? 'rgba(22,163,74,.15)' : 'transparent',
                        borderLeft: i === 0 ? '2px solid #16a34a' : '2px solid transparent',
                        cursor: 'default',
                      }}>
                        {icon}
                        {label}
                      </div>
                    ))}
                  </div>

                  {/* Main content */}
                  <div style={{ flex: 1, background: '#f8fafc', padding: 16, overflow: 'hidden', position: 'relative' }}>
                    {/* Toast */}
                    <div style={{
                      position: 'absolute', top: 12, right: 12,
                      background: '#fff', border: '1px solid #bbf7d0',
                      borderRadius: 8, padding: '8px 12px',
                      display: 'flex', alignItems: 'center', gap: 7,
                      boxShadow: '0 4px 16px rgba(0,0,0,.08)', fontSize: 11, fontWeight: 600, color: '#166534',
                    }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#16a34a"/><path d="M8 12l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      Certificate submitted successfully.
                    </div>

                    <div style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', marginBottom: 2 }}>Dashboard</div>
                    <div style={{ fontSize: 11, color: '#64748b', marginBottom: 12 }}>Good morning, Dr. Smith</div>

                    {/* Stats */}
                    <div className="stat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginBottom: 14 }}>
                      {[
                        { label: "Today's Exams", val: '12', sub: '6 completed', color: '#16a34a', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
                        { label: 'Pending Forms', val: '8', sub: 'Require attention', color: '#f97316', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/></svg> },
                        { label: 'FMCSA Status', val: '✓', sub: 'Up to date', color: '#16a34a', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="1.5"><polyline points="16,16 12,12 8,16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg> },
                        { label: 'Certs Issued', val: '47', sub: 'This month', color: '#3b82f6', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.5"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg> },
                      ].map(s => (
                        <div key={s.label} style={{ background: '#fff', borderRadius: 8, padding: '10px 10px 8px', border: '1px solid #e2e8f0' }}>
                          {s.icon}
                          <div style={{ fontSize: 18, fontWeight: 800, color: s.label === 'FMCSA Status' ? '#16a34a' : s.color, lineHeight: 1.2, marginTop: 4 }}>{s.val}</div>
                          <div style={{ fontSize: 9, color: '#64748b', marginTop: 2, fontWeight: 500 }}>{s.sub}</div>
                        </div>
                      ))}
                    </div>

                    {/* Recent exams */}
                    <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                      <div style={{ padding: '8px 12px', borderBottom: '1px solid #e2e8f0', fontSize: 11, fontWeight: 700, color: '#0f172a' }}>Recent Exams</div>
                      {[
                        { initials: 'JT', name: 'John Thompson', cdl: '1234567890', date: 'May 16, 2024', status: 'Completed', cert: '2 years' },
                        { initials: 'MR', name: 'Maria Rodriguez', cdl: '9876543210', date: 'May 15, 2024', status: 'Pending', cert: '—' },
                      ].map(r => (
                        <div key={r.name} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 12px', borderBottom: '1px solid #f1f5f9', fontSize: 10 }}>
                          <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 8, color: '#64748b', flexShrink: 0 }}>{r.initials}</div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontWeight: 600, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.name}</div>
                            <div style={{ color: '#94a3b8', fontSize: 9 }}>{r.cdl}</div>
                          </div>
                          <div style={{ color: '#64748b', flexShrink: 0 }}>{r.date}</div>
                          <div style={{
                            padding: '2px 7px', borderRadius: 99, fontSize: 9, fontWeight: 700, flexShrink: 0,
                            background: r.status === 'Completed' ? '#dcfce7' : '#fef3c7',
                            color: r.status === 'Completed' ? '#166534' : '#92400e',
                          }}>{r.status}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature cards */}
      <div style={{ background: '#fff', padding: '64px 24px 0' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <h2 style={{ fontSize: 26, fontWeight: 800, textAlign: 'center', letterSpacing: '-0.025em', color: '#0f172a', marginBottom: 8 }}>
            Everything your clinic needs to keep exams moving
          </h2>
          <div className="feature-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginTop: 32 }}>
            {FEATURES.map(f => (
              <div key={f.title} className="feature-card" style={{
                background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: 12,
                padding: '22px 20px', display: 'flex', alignItems: 'center', gap: 16,
                cursor: 'default', transition: 'border-color .15s, box-shadow .15s',
              }}>
                <div style={{ width: 44, height: 44, background: '#f0fdf4', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {f.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#0f172a', marginBottom: 4 }}>{f.title}</div>
                  <div style={{ fontSize: 12.5, color: '#64748b', lineHeight: 1.55 }}>{f.desc}</div>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2"><polyline points="9,18 15,12 9,6"/></svg>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Compliance strip */}
      <div style={{ background: '#f0fdf4', borderTop: '1px solid #bbf7d0', borderBottom: '1px solid #bbf7d0', padding: '14px 24px', marginTop: 64 }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'center', justifyContent: 'center' }}>
          {[
            '✓ FMCSA National Registry TPO',
            '✓ 49 CFR Part 391.43 Compliant',
            '✓ MCSA-5875 / MCSA-5876 Official Forms',
            '✓ 24-Hour Reporting Built In',
            '✓ NRCME Credential Verification',
          ].map(b => (
            <span key={b} style={{ fontSize: 12, fontWeight: 600, color: '#166534', letterSpacing: '.01em' }}>{b}</span>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div id="how-it-works" style={{ padding: '72px 24px', background: '#fff' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <h2 style={{ fontSize: 30, fontWeight: 800, textAlign: 'center', letterSpacing: '-0.025em', marginBottom: 8 }}>Up and running in a day</h2>
          <p style={{ textAlign: 'center', color: '#64748b', fontSize: 14, marginBottom: 48 }}>From registration to your first FMCSA submission — we guide you every step.</p>
          <div className="how-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
            {[
              { step: '01', title: 'Register your clinic', desc: 'Create an account in minutes. Add your NRCME-certified examiners and front-desk staff.' },
              { step: '02', title: 'Designate WorkOccMed as your TPO', desc: 'Each examiner completes a one-time designation on the FMCSA site — we walk you through it.' },
              { step: '03', title: 'Conduct DOT physicals digitally', desc: 'Complete MCSA-5875 on any device. Results auto-submitted to the National Registry within 24 hours.' },
              { step: '04', title: 'Drivers get their certificate instantly', desc: 'MCSA-5876 generated automatically. Drivers view their DOT card through their own portal.' },
            ].map((s, i) => (
              <div key={s.step} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: '20px 18px', position: 'relative' }}>
                {i < 3 && <div style={{ position: 'absolute', top: 24, right: -9, fontSize: 16, color: '#cbd5e1' }}>›</div>}
                <div style={{ fontWeight: 900, fontSize: 11, color: '#16a34a', letterSpacing: '.1em', marginBottom: 10 }}>{s.step}</div>
                <h3 style={{ fontWeight: 700, fontSize: 13, color: '#0f172a', margin: '0 0 6px' }}>{s.title}</h3>
                <p style={{ fontSize: 12, color: '#64748b', lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div id="pricing" style={{ background: '#f8fafc', borderTop: '1px solid #e2e8f0', padding: '72px 24px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <h2 style={{ fontSize: 30, fontWeight: 800, textAlign: 'center', letterSpacing: '-0.025em', marginBottom: 8 }}>Simple, transparent pricing</h2>
          <p style={{ textAlign: 'center', color: '#64748b', fontSize: 14, marginBottom: 48 }}>Pay only for active NRCME-certified examiners. Staff, admins, and drivers are always free.</p>
          <div className="pricing-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, maxWidth: 720, margin: '0 auto' }}>
            <div style={{ background: '#fff', border: '2px solid #16a34a', borderRadius: 16, padding: 28 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#16a34a', textTransform: 'uppercase' as const, letterSpacing: '.08em', marginBottom: 10 }}>Per-Examiner</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 6 }}>
                <span style={{ fontSize: 42, fontWeight: 900, letterSpacing: '-0.03em', color: '#0f172a' }}>$50</span>
                <span style={{ fontSize: 13, color: '#64748b' }}>/mo per active examiner</span>
              </div>
              <p style={{ fontSize: 12, color: '#64748b', marginBottom: 22 }}>Billed monthly. No annual lock-in. Cancel anytime.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginBottom: 24 }}>
                {['Unlimited DOT physicals', 'FMCSA National Registry submission', 'MCSA-5875 + MCSA-5876 generation', 'Driver intake portal', 'Certificate history', 'NRCME verification', 'Free trial — 14 days, no card'].map(item => (
                  <div key={item} style={{ display: 'flex', gap: 8, fontSize: 13, color: '#334155' }}>
                    <span style={{ color: '#16a34a', fontWeight: 700, flexShrink: 0 }}>✓</span>{item}
                  </div>
                ))}
              </div>
              <Link href="/register" style={{ display: 'block', textAlign: 'center', background: '#16a34a', color: '#fff', padding: '11px 0', borderRadius: 8, fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>Start Free Trial</Link>
            </div>
            <div style={{ background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: 16, padding: 28 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' as const, letterSpacing: '.08em', marginBottom: 10 }}>Always Free</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 6 }}>
                <span style={{ fontSize: 42, fontWeight: 900, letterSpacing: '-0.03em', color: '#0f172a' }}>$0</span>
                <span style={{ fontSize: 13, color: '#64748b' }}>for support staff</span>
              </div>
              <p style={{ fontSize: 12, color: '#64748b', marginBottom: 22 }}>Unlimited admin and front-desk accounts, always included.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginBottom: 24 }}>
                {['Company admin accounts', 'Front-desk / scheduling staff', 'Driver portal access', 'Intake request management', 'Reports & dashboards', 'Support access'].map(item => (
                  <div key={item} style={{ display: 'flex', gap: 8, fontSize: 13, color: '#334155' }}>
                    <span style={{ color: '#16a34a', fontWeight: 700, flexShrink: 0 }}>✓</span>{item}
                  </div>
                ))}
              </div>
              <Link href="/register" style={{ display: 'block', textAlign: 'center', background: '#f1f5f9', color: '#334155', padding: '11px 0', borderRadius: 8, fontWeight: 700, fontSize: 14, textDecoration: 'none', border: '1px solid #e2e8f0' }}>Create Account</Link>
            </div>
          </div>
          <p style={{ textAlign: 'center', fontSize: 13, color: '#64748b', marginTop: 24 }}>
            Multiple clinics or high-volume practice?{' '}
            <a href="mailto:sales@workoccmed.com" style={{ color: '#16a34a', fontWeight: 600, textDecoration: 'none' }}>Contact us for enterprise pricing →</a>
          </p>
        </div>
      </div>

      {/* FAQ */}
      <div style={{ maxWidth: 700, margin: '0 auto', padding: '72px 24px' }}>
        <h2 style={{ fontSize: 30, fontWeight: 800, textAlign: 'center', letterSpacing: '-0.025em', marginBottom: 48 }}>Common questions</h2>
        {[
          { q: 'Does this replace the FMCSA National Registry?', a: 'No — it submits to it. WorkOccMed Examiner is a FMCSA-approved Third Party Organization (TPO). After a one-time setup on the FMCSA site, your examiners\' results are submitted automatically within 24 hours of certification.' },
          { q: 'What is a TPO and why does it matter?', a: 'A Third Party Organization (TPO) is authorized by FMCSA to transmit exam results to the National Registry on behalf of certified medical examiners. Without a TPO, each examiner must log in to the FMCSA site manually for every exam. As your TPO, we do that automatically.' },
          { q: 'Do my examiners need to do anything special?', a: 'Each NRCME-certified examiner does a one-time designation on the FMCSA National Registry site — it takes about 5 minutes. We provide step-by-step instructions inside the platform. After that, submissions are fully automatic.' },
          { q: 'What if I just need the admin software, not FMCSA submission?', a: 'You can use WorkOccMed Examiner for digital MCSA-5875 documentation and certificate generation even before FMCSA submission is active. Submissions are queued and sent automatically once your TPO setup is complete.' },
          { q: 'How does billing work?', a: 'You\'re billed $50/month for each active NRCME-certified examiner. Front desk staff and company admins are always free. Your 14-day trial includes full functionality with no credit card required.' },
        ].map(({ q, a }) => (
          <div key={q} className="faq-item" style={{ padding: '22px 0' }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', margin: '0 0 8px' }}>{q}</h3>
            <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.7, margin: 0 }}>{a}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div style={{ background: '#052e16', padding: '72px 24px' }}>
        <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 30, fontWeight: 800, color: '#fff', marginBottom: 12, letterSpacing: '-0.025em' }}>Ready to streamline your DOT physicals?</h2>
          <p style={{ color: 'rgba(255,255,255,.6)', fontSize: 15, marginBottom: 28, lineHeight: 1.6 }}>Join occupational health clinics using WorkOccMed Examiner to handle FMCSA compliance automatically.</p>
          <Link href="/register" style={{ background: '#fff', color: '#052e16', padding: '14px 32px', borderRadius: 9, fontWeight: 800, fontSize: 15, textDecoration: 'none', display: 'inline-block', letterSpacing: '-0.01em' }}>Start Your Free Trial</Link>
          <p style={{ color: 'rgba(255,255,255,.35)', fontSize: 11, marginTop: 14 }}>14 days free · No credit card · $50/mo per examiner after trial</p>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #e2e8f0', padding: '20px 24px', background: '#fff' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ fontSize: 11, color: '#94a3b8' }}>© {new Date().getFullYear()} WorkOccMed LLC · All rights reserved</div>
          <div style={{ display: 'flex', gap: 20 }}>
            <a href="mailto:support@workoccmed.com" style={{ fontSize: 11, color: '#94a3b8', textDecoration: 'none' }}>support@workoccmed.com</a>
            <Link href="/privacy" style={{ fontSize: 11, color: '#94a3b8', textDecoration: 'none' }}>Privacy</Link>
            <Link href="/terms" style={{ fontSize: 11, color: '#94a3b8', textDecoration: 'none' }}>Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
