import Link from 'next/link'

const FEATURES = [
  {
    icon: '📋',
    title: 'Digital MCSA-5875',
    desc: 'Complete the full DOT physical examination form digitally — structured, validated, and permanently stored.',
  },
  {
    icon: '🏛️',
    title: 'FMCSA Direct Submission',
    desc: 'Submit exam results to the National Registry within 24 hours as required by 49 CFR 391.43(g). Automatic retry on failure.',
  },
  {
    icon: '🪪',
    title: 'Instant MCSA-5876 Certificates',
    desc: 'Generate print-ready wallet cards automatically on exam certification. Drivers get a portal link immediately.',
  },
  {
    icon: '🔐',
    title: 'NRCME Verification',
    desc: 'All examiners verified against the FMCSA National Registry before they can certify or submit any exam.',
  },
  {
    icon: '📲',
    title: 'Driver Intake Portal',
    desc: 'Send drivers a secure intake link by text or email. They complete the health history before arrival — zero paperwork.',
  },
  {
    icon: '🏢',
    title: 'Multi-Clinic SaaS',
    desc: 'Each company manages its own examiners, staff, and drivers. Complete data isolation. One subscription per clinic.',
  },
]

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Register your clinic',
    desc: 'Create an account in minutes. Add your NRCME-certified examiners and front-desk staff.',
  },
  {
    step: '02',
    title: 'Designate WorkOccMed as your TPO',
    desc: 'Each examiner completes a one-time designation on the FMCSA site — we walk you through it step by step.',
  },
  {
    step: '03',
    title: 'Conduct DOT physicals digitally',
    desc: 'Complete MCSA-5875 on any device. Results are auto-submitted to the National Registry within 24 hours.',
  },
  {
    step: '04',
    title: 'Drivers get their certificate instantly',
    desc: 'MCSA-5876 certificate generated automatically. Drivers view their DOT card and history through their own portal.',
  },
]

export default function HomePage() {
  return (
    <div style={{ minHeight: '100vh', background: '#fff', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",sans-serif', color: '#09090b' }}>

      {/* Nav */}
      <nav style={{ borderBottom: '1px solid #e4e4e7', background: '#fff', position: 'sticky', top: 0, zIndex: 20 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 30, height: 30, background: '#16a34a', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#fff', fontWeight: 900, fontSize: 11 }}>WOM</span>
            </div>
            <span style={{ fontWeight: 800, fontSize: 16, color: '#09090b', letterSpacing: '-0.02em' }}>
              WorkOccMed<span style={{ color: '#16a34a', fontWeight: 400 }}> Examiner</span>
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Link href="#pricing" style={{ fontSize: 13, color: '#3f3f46', textDecoration: 'none', fontWeight: 500 }}>Pricing</Link>
            <Link href="/login" style={{ fontSize: 13, color: '#3f3f46', textDecoration: 'none', fontWeight: 500 }}>Sign In</Link>
            <Link href="/register" style={{ background: '#16a34a', color: '#fff', padding: '7px 16px', borderRadius: 7, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
              Start Free Trial
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 24px 64px' }}>
        <div style={{ maxWidth: 700 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0',
            padding: '4px 12px', borderRadius: 99, fontSize: 11, fontWeight: 700,
            marginBottom: 22, letterSpacing: '.03em',
          }}>
            <span style={{ width: 6, height: 6, background: '#16a34a', borderRadius: '50%', flexShrink: 0 }} />
            FMCSA National Registry · 49 CFR 391.43(g) Compliant
          </div>
          <h1 style={{ fontSize: 50, fontWeight: 800, lineHeight: 1.08, letterSpacing: '-0.03em', marginBottom: 20, marginTop: 0, textWrap: 'balance' } as React.CSSProperties}>
            The DOT Physical Platform Built for Medical Examiners
          </h1>
          <p style={{ fontSize: 17, color: '#52525b', lineHeight: 1.7, marginBottom: 32 }}>
            WorkOccMed Examiner handles MCSA-5875 documentation, FMCSA National Registry submission,
            and MCSA-5876 certificate generation — so you can focus on the exam, not the paperwork.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12, marginBottom: 14 }}>
            <Link href="/register" style={{ background: '#16a34a', color: '#fff', padding: '13px 26px', borderRadius: 8, fontWeight: 700, fontSize: 15, textDecoration: 'none', letterSpacing: '-0.01em' }}>
              Start 14-Day Free Trial
            </Link>
            <Link href="/login" style={{ color: '#16a34a', fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>
              Sign in to your account →
            </Link>
          </div>
          <p style={{ fontSize: 11, color: '#a1a1aa', margin: 0 }}>
            No credit card required · $50/mo per examiner after trial · Cancel anytime
          </p>
        </div>
      </div>

      {/* Compliance badges */}
      <div style={{ background: '#f4f4f5', borderTop: '1px solid #e4e4e7', borderBottom: '1px solid #e4e4e7', padding: '16px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'center', justifyContent: 'center' }}>
          {[
            '✓ FMCSA National Registry TPO',
            '✓ 49 CFR Part 391.43 Compliant',
            '✓ MCSA-5875 / MCSA-5876 Official Forms',
            '✓ 24-Hour Reporting Built In',
            '✓ NRCME Credential Verification',
          ].map(b => (
            <span key={b} style={{ fontSize: 12, fontWeight: 600, color: '#16a34a', letterSpacing: '.01em' }}>{b}</span>
          ))}
        </div>
      </div>

      {/* Features */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '64px 24px' }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, textAlign: 'center', letterSpacing: '-0.02em', marginBottom: 8 }}>
          Everything you need for DOT physicals
        </h2>
        <p style={{ textAlign: 'center', color: '#71717a', fontSize: 14, marginBottom: 40 }}>
          Built specifically for FMCSA-certified medical examiners and the occupational health companies that employ them.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
          {FEATURES.map(f => (
            <div key={f.title} style={{ background: '#fafafa', border: '1px solid #e4e4e7', borderRadius: 12, padding: 22 }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>{f.icon}</div>
              <h3 style={{ fontWeight: 700, fontSize: 14, color: '#09090b', margin: '0 0 6px' }}>{f.title}</h3>
              <p style={{ fontSize: 12, color: '#71717a', lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div style={{ background: '#f4f4f5', borderTop: '1px solid #e4e4e7', borderBottom: '1px solid #e4e4e7', padding: '64px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, textAlign: 'center', letterSpacing: '-0.02em', marginBottom: 8 }}>
            Up and running in a day
          </h2>
          <p style={{ textAlign: 'center', color: '#71717a', fontSize: 14, marginBottom: 40 }}>
            From registration to your first FMCSA submission — we guide you every step.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
            {HOW_IT_WORKS.map((s, i) => (
              <div key={s.step} style={{ background: '#fff', border: '1px solid #e4e4e7', borderRadius: 12, padding: 20, position: 'relative' }}>
                {i < HOW_IT_WORKS.length - 1 && (
                  <div style={{ position: 'absolute', top: 28, right: -9, fontSize: 16, color: '#d1d5db', zIndex: 1 }}>›</div>
                )}
                <div style={{ fontWeight: 900, fontSize: 11, color: '#16a34a', letterSpacing: '.1em', marginBottom: 8 }}>{s.step}</div>
                <h3 style={{ fontWeight: 700, fontSize: 13, color: '#09090b', margin: '0 0 6px' }}>{s.title}</h3>
                <p style={{ fontSize: 12, color: '#71717a', lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Who it's for */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '64px 24px' }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, textAlign: 'center', letterSpacing: '-0.02em', marginBottom: 8 }}>
          One platform — three portals
        </h2>
        <p style={{ textAlign: 'center', color: '#71717a', fontSize: 14, marginBottom: 40 }}>
          Each role gets a tailored experience designed for how they actually use DOT physicals.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, maxWidth: 860, margin: '0 auto' }}>
          {[
            {
              icon: '🏥',
              role: 'Clinic Admin',
              sub: 'Company Administrator',
              desc: 'Manage examiners, staff, and drivers. Review exam history, track FMCSA submissions, and monitor certification status across your entire team.',
              href: '/login', cta: 'Clinic sign-in',
            },
            {
              icon: '⚕️',
              role: 'Medical Examiner',
              sub: 'NRCME-Certified Practitioner',
              desc: 'Complete MCSA-5875 digitally. Issue certificates, track your NRCME recertification, and submit results to FMCSA without leaving the platform.',
              href: '/login', cta: 'Examiner sign-in',
            },
            {
              icon: '🚛',
              role: 'Commercial Driver',
              sub: 'CDL / DOT Driver',
              desc: 'View your DOT physical history, check certificate expiration, download your MCSA-5876 wallet card, and request corrections — from any device.',
              href: '/driver/login', cta: 'Driver sign-in',
            },
          ].map(r => (
            <div key={r.role} style={{ background: '#fff', border: '1px solid #e4e4e7', borderRadius: 12, padding: '22px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ fontSize: 28 }}>{r.icon}</div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 800, color: '#09090b' }}>{r.role}</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#16a34a', textTransform: 'uppercase', letterSpacing: '.05em', marginTop: 2 }}>{r.sub}</div>
              </div>
              <div style={{ fontSize: 13, color: '#71717a', lineHeight: 1.6, flex: 1 }}>{r.desc}</div>
              <Link href={r.href} style={{ fontSize: 12, fontWeight: 700, color: '#16a34a', textDecoration: 'none', marginTop: 4 }}>{r.cta} →</Link>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing */}
      <div id="pricing" style={{ background: '#f4f4f5', borderTop: '1px solid #e4e4e7', borderBottom: '1px solid #e4e4e7', padding: '64px 24px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, textAlign: 'center', letterSpacing: '-0.02em', marginBottom: 8 }}>
            Simple, transparent pricing
          </h2>
          <p style={{ textAlign: 'center', color: '#71717a', fontSize: 14, marginBottom: 40 }}>
            Pay only for active NRCME-certified examiners. Staff, admins, and drivers are always free.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, maxWidth: 720, margin: '0 auto' }}>

            {/* Per-examiner */}
            <div style={{ background: '#fff', border: '2px solid #16a34a', borderRadius: 16, padding: 28 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#16a34a', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 8 }}>Per-Examiner</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 4 }}>
                <span style={{ fontSize: 40, fontWeight: 900, letterSpacing: '-0.03em', color: '#09090b' }}>$50</span>
                <span style={{ fontSize: 13, color: '#71717a' }}>/mo per active examiner</span>
              </div>
              <p style={{ fontSize: 12, color: '#71717a', marginBottom: 20 }}>
                Billed monthly. No annual lock-in. Pause or cancel anytime.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
                {[
                  'Unlimited DOT physicals',
                  'FMCSA National Registry submission',
                  'MCSA-5875 + MCSA-5876 generation',
                  'Driver intake portal',
                  'Certificate history',
                  'NRCME verification',
                  'Free trial — 14 days, no card',
                ].map(item => (
                  <div key={item} style={{ display: 'flex', gap: 8, fontSize: 13, color: '#374151' }}>
                    <span style={{ color: '#16a34a', fontWeight: 700, flexShrink: 0 }}>✓</span>
                    {item}
                  </div>
                ))}
              </div>
              <Link href="/register" style={{
                display: 'block', textAlign: 'center', background: '#16a34a', color: '#fff',
                padding: '11px 0', borderRadius: 8, fontWeight: 700, fontSize: 14, textDecoration: 'none',
              }}>
                Start Free Trial
              </Link>
            </div>

            {/* Free-always */}
            <div style={{ background: '#fff', border: '1px solid #e4e4e7', borderRadius: 16, padding: 28 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#52525b', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 8 }}>Always Free</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 4 }}>
                <span style={{ fontSize: 40, fontWeight: 900, letterSpacing: '-0.03em', color: '#09090b' }}>$0</span>
                <span style={{ fontSize: 13, color: '#71717a' }}>for support staff</span>
              </div>
              <p style={{ fontSize: 12, color: '#71717a', marginBottom: 20 }}>
                Unlimited admin and front-desk accounts, always included.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
                {[
                  'Company admin accounts',
                  'Front-desk / scheduling staff',
                  'Driver portal access',
                  'Intake request management',
                  'Reports & dashboards',
                  'Support access',
                ].map(item => (
                  <div key={item} style={{ display: 'flex', gap: 8, fontSize: 13, color: '#374151' }}>
                    <span style={{ color: '#16a34a', fontWeight: 700, flexShrink: 0 }}>✓</span>
                    {item}
                  </div>
                ))}
              </div>
              <Link href="/register" style={{
                display: 'block', textAlign: 'center', background: '#f4f4f5', color: '#374151',
                padding: '11px 0', borderRadius: 8, fontWeight: 700, fontSize: 14, textDecoration: 'none',
                border: '1px solid #e4e4e7',
              }}>
                Create Account
              </Link>
            </div>
          </div>

          {/* Enterprise note */}
          <p style={{ textAlign: 'center', fontSize: 13, color: '#71717a', marginTop: 24 }}>
            Multiple clinics or high-volume practice?{' '}
            <a href="mailto:sales@workoccmed.com" style={{ color: '#16a34a', fontWeight: 600, textDecoration: 'none' }}>
              Contact us for enterprise pricing →
            </a>
          </p>
        </div>
      </div>

      {/* FAQ */}
      <div style={{ maxWidth: 700, margin: '0 auto', padding: '64px 24px' }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, textAlign: 'center', letterSpacing: '-0.02em', marginBottom: 40 }}>
          Common questions
        </h2>
        {[
          {
            q: 'Does this replace the FMCSA National Registry?',
            a: 'No — it submits to it. WorkOccMed Examiner is a FMCSA-approved Third Party Organization (TPO). After a one-time setup on the FMCSA site, your examiners\' results are submitted automatically within 24 hours of certification.',
          },
          {
            q: 'What is a TPO and why does it matter?',
            a: 'A Third Party Organization (TPO) is authorized by FMCSA to transmit exam results to the National Registry on behalf of certified medical examiners. Without a TPO, each examiner must log in to the FMCSA site manually for every exam. As your TPO, we do that automatically.',
          },
          {
            q: 'Do my examiners need to do anything special?',
            a: 'Each NRCME-certified examiner does a one-time designation on the FMCSA National Registry site — it takes about 5 minutes. We provide step-by-step instructions inside the platform. After that, submissions are fully automatic.',
          },
          {
            q: 'What if I just need the admin software, not FMCSA submission?',
            a: 'You can use WorkOccMed Examiner for digital MCSA-5875 documentation and certificate generation even before FMCSA submission is active. Submissions are queued and sent automatically once your TPO setup is complete.',
          },
          {
            q: 'How does billing work?',
            a: 'You\'re billed $50/month for each active NRCME-certified examiner. Front desk staff and company admins are always free. Your 14-day trial includes full functionality with no credit card required.',
          },
        ].map(({ q, a }) => (
          <div key={q} style={{ borderBottom: '1px solid #e4e4e7', padding: '20px 0' }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#09090b', margin: '0 0 8px' }}>{q}</h3>
            <p style={{ fontSize: 13, color: '#52525b', lineHeight: 1.7, margin: 0 }}>{a}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div style={{ background: '#14532d', padding: '64px 24px' }}>
        <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: '#fff', marginBottom: 12, letterSpacing: '-0.02em' }}>
            Ready to streamline your DOT physicals?
          </h2>
          <p style={{ color: 'rgba(255,255,255,.6)', fontSize: 15, marginBottom: 28, lineHeight: 1.6 }}>
            Join occupational health clinics using WorkOccMed Examiner to handle FMCSA compliance automatically.
          </p>
          <Link href="/register" style={{
            background: '#fff', color: '#14532d', padding: '14px 32px',
            borderRadius: 8, fontWeight: 800, fontSize: 15, textDecoration: 'none',
            display: 'inline-block', letterSpacing: '-0.01em',
          }}>
            Start Your Free Trial
          </Link>
          <p style={{ color: 'rgba(255,255,255,.4)', fontSize: 11, marginTop: 14 }}>
            14 days free · No credit card · $50/mo per examiner after trial
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #e4e4e7', padding: '20px 24px', background: '#fff' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ fontSize: 11, color: '#a1a1aa' }}>© {new Date().getFullYear()} WorkOccMed LLC · All rights reserved</div>
          <div style={{ display: 'flex', gap: 20 }}>
            <a href="mailto:support@workoccmed.com" style={{ fontSize: 11, color: '#a1a1aa', textDecoration: 'none' }}>support@workoccmed.com</a>
            <Link href="/privacy" style={{ fontSize: 11, color: '#a1a1aa', textDecoration: 'none' }}>Privacy</Link>
            <Link href="/terms" style={{ fontSize: 11, color: '#a1a1aa', textDecoration: 'none' }}>Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
