import Shell from '@/components/layout/Shell'
import Link from 'next/link'

const STEPS = [
  {
    step: 1,
    title: 'Register WorkOccMed LLC as a TPO',
    time: '30–60 min',
    status: 'ACTION REQUIRED',
    statusColor: '#dc2626',
    body: `Go to the FMCSA National Registry at nationalregistry.fmcsa.dot.gov, sign in with the organization's account (or create one), and complete the Third Party Organization (TPO) registration form.

You will need:
• WorkOccMed LLC legal name and EIN
• Authorized Representative: name, title, email, phone
• Point of Contact (technical): name, email, phone
• Platform description — describe WorkOccMed Examiner as a HIPAA-compliant SaaS platform for NRCME-certified medical examiners that submits exam results via system-to-system API

After submission, FMCSA reviews the application and issues a TPO ID. This typically takes 2–6 weeks.`,
    link: 'https://nationalregistry.fmcsa.dot.gov',
    linkLabel: 'Open FMCSA National Registry →',
  },
  {
    step: 2,
    title: 'Sign the FMCSA Data Exchange Agreement',
    time: '15 min',
    status: 'AFTER STEP 1',
    statusColor: '#92400e',
    body: `FMCSA will issue a Third Party Organization Agreement (data exchange agreement) after reviewing your application. The Authorized Representative must sign it electronically on the FMCSA site.

The agreement covers:
• Section 1 — System-to-system data exchange protocol (MER XML format)
• Section 3 — Authorized Representative signature binding the organization to FMCSA's terms
• Data retention and security obligations (HIPAA, SOC 2)

Once signed, FMCSA issues your TPO ID and grants access to the test (sandbox) API environment.`,
    link: null,
    linkLabel: null,
  },
  {
    step: 3,
    title: 'Configure API Credentials in Vercel',
    time: '10 min',
    status: 'AFTER STEP 2',
    statusColor: '#92400e',
    body: `After FMCSA approves WorkOccMed as a TPO and issues API credentials, set these environment variables in Vercel:

  FMCSA_API_KEY   →  your TPO API key from FMCSA
  FMCSA_API_URL   →  https://nationalregistry.fmcsa.dot.gov/api/v1 (production)

Once FMCSA_API_KEY is set and non-empty, the FMCSA_READY flag becomes true and all queued submissions will transmit automatically.

Test in sandbox first:
  FMCSA_API_URL   →  https://nationalregistry-sandbox.fmcsa.dot.gov/api/v1
  FMCSA_API_KEY   →  [sandbox key from FMCSA]`,
    link: 'https://vercel.com/doctorsplace19-code/workoccmed-examiner/settings/environment-variables',
    linkLabel: 'Open Vercel Environment Variables →',
  },
  {
    step: 4,
    title: 'Each Examiner Designates WorkOccMed as Their TPO',
    time: '5 min per examiner',
    status: 'ONGOING',
    statusColor: '#1d4ed8',
    body: `Each NRCME-certified medical examiner must log in to the FMCSA National Registry with their personal ME account and designate WorkOccMed LLC as their Third Party Organization.

Instructions to send to each examiner:
  1. Go to nationalregistry.fmcsa.dot.gov
  2. Sign in with your NRCME personal account
  3. Click "My Profile" → "TPO Designation"
  4. Search for WorkOccMed LLC and click "Designate"
  5. Confirm the designation

After designation, WorkOccMed Examiner can submit exam results under that examiner's NRCME number. Track designation status in the TPO Designation Tracker.`,
    link: null,
    linkLabel: null,
  },
  {
    step: 5,
    title: 'Validate XML Schema with FMCSA',
    time: '1–2 weeks',
    status: 'AFTER STEPS 1–3',
    statusColor: '#92400e',
    body: `FMCSA provides the official MER (Medical Examination Results) XML schema to approved TPOs. The current WorkOccMed Examiner XML generator uses a draft schema that must be updated to match FMCSA's certified XSD before production submissions are accepted.

Steps:
  1. Request the official MER XML schema from your FMCSA TPO liaison
  2. Update src/lib/fmcsa-xml.ts to match the certified XSD
  3. Change FMCSA_XML_SCHEMA_VERSION from "unofficial-draft-v1" to the official version
  4. Submit 5–10 test cases through the FMCSA sandbox environment
  5. Receive sandbox acceptance confirmation from FMCSA
  6. Switch FMCSA_API_URL to the production endpoint

This is the final gate before real exam data can be submitted.`,
    link: null,
    linkLabel: null,
  },
]

const CONTACTS = [
  { label: 'FMCSA National Registry Help Desk', value: '1-800-832-5660' },
  { label: 'FMCSA TPO Program Email', value: 'nationalregistry@dot.gov' },
  { label: 'WorkOccMed Authorized Rep', value: 'doctorsplace19@gmail.com' },
]

export default function FmcsaApplyPage() {
  return (
    <Shell
      companySlug="" companyName="WorkOccMed LLC"
      role="SUPER_ADMIN" pageTitle="FMCSA TPO Application Guide"
      userSub="Super Administrator"
      pageActions={
        <Link href="/admin/fmcsa" style={{
          fontSize: 12, fontWeight: 600, color: 'var(--ink3)',
          textDecoration: 'none', padding: '6px 12px', border: '1px solid var(--border)',
          borderRadius: 6, background: 'var(--card)',
        }}>
          ← Back to FMCSA Dashboard
        </Link>
      }
    >
      {/* Banner */}
      <div style={{
        background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 10,
        padding: '14px 18px', marginBottom: 20,
        display: 'flex', alignItems: 'flex-start', gap: 12,
      }}>
        <span style={{ fontSize: 22, flexShrink: 0 }}>📋</span>
        <div>
          <div style={{ fontWeight: 700, fontSize: 14, color: '#1e40af', marginBottom: 4 }}>
            FMCSA Third Party Organization (TPO) Registration Roadmap
          </div>
          <div style={{ fontSize: 12, color: '#1d4ed8', lineHeight: 1.6 }}>
            Complete these steps to enable automatic submission of DOT physical exam results to the FMCSA National Registry under 49 CFR 391.43(g).
            Steps 1–3 require action from WorkOccMed LLC. Step 4 is an ongoing process for each new examiner.
          </div>
        </div>
      </div>

      {/* Steps */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
        {STEPS.map((s) => (
          <div key={s.step} style={{
            background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '12px 16px', borderBottom: '1px solid var(--border)',
              background: 'var(--bg)',
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%', background: 'var(--accent)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontWeight: 900, fontSize: 12, flexShrink: 0,
              }}>
                {s.step}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--ink)' }}>{s.title}</div>
                <div style={{ fontSize: 11, color: 'var(--ink3)' }}>Est. {s.time}</div>
              </div>
              <span style={{
                fontSize: 10, fontWeight: 700, letterSpacing: '.06em',
                padding: '3px 8px', borderRadius: 99,
                background: `${s.statusColor}15`,
                color: s.statusColor,
                border: `1px solid ${s.statusColor}40`,
              }}>
                {s.status}
              </span>
            </div>
            <div style={{ padding: '14px 18px' }}>
              <pre style={{
                fontFamily: 'inherit', fontSize: 12, color: 'var(--ink2)',
                lineHeight: 1.7, whiteSpace: 'pre-wrap', margin: 0,
              }}>
                {s.body}
              </pre>
              {s.link && (
                <a
                  href={s.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-block', marginTop: 12,
                    fontSize: 12, fontWeight: 600, color: 'var(--accent)',
                    textDecoration: 'none', padding: '6px 12px',
                    border: '1px solid var(--accent)', borderRadius: 6,
                  }}
                >
                  {s.linkLabel}
                </a>
              )}
              {s.step === 4 && (
                <Link href="/admin/fmcsa/designations" style={{
                  display: 'inline-block', marginTop: 12,
                  fontSize: 12, fontWeight: 600, color: 'var(--accent)',
                  textDecoration: 'none', padding: '6px 12px',
                  border: '1px solid var(--accent)', borderRadius: 6,
                }}>
                  Open TPO Designation Tracker →
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Document checklist */}
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden', marginBottom: 20 }}>
        <div style={{ background: '#f8fafc', borderBottom: '1px solid var(--border)', padding: '10px 16px', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--ink3)' }}>
          Documents to Have Ready
        </div>
        <div style={{ padding: '14px 18px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {[
            'WorkOccMed LLC EIN (Employer ID Number)',
            'Legal business name and address',
            'Authorized Representative — name, title, email, phone',
            'Technical Point of Contact — name, email, phone',
            'Platform description (see FMCSA TPO registration form)',
            'Data security attestation (HIPAA compliance)',
            'System-to-system API capability statement',
            'Signed TPO Agreement (issued by FMCSA post-review)',
          ].map(item => (
            <div key={item} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 12, color: 'var(--ink2)' }}>
              <span style={{ color: 'var(--accent)', fontWeight: 700, flexShrink: 0 }}>☐</span>
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* Contacts */}
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
        <div style={{ background: '#f8fafc', borderBottom: '1px solid var(--border)', padding: '10px 16px', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--ink3)' }}>
          Key Contacts
        </div>
        <div style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {CONTACTS.map(c => (
            <div key={c.label} style={{ display: 'flex', gap: 8, fontSize: 12 }}>
              <span style={{ color: 'var(--ink3)', width: 220, flexShrink: 0 }}>{c.label}</span>
              <span style={{ color: 'var(--ink)', fontWeight: 600, fontFamily: 'monospace' }}>{c.value}</span>
            </div>
          ))}
        </div>
      </div>
    </Shell>
  )
}
