import Shell from '@/components/layout/Shell'
import { TableCard } from '@/components/ui/dp-table'
import { FMCSA_READY, FMCSA_API_URL } from '@/lib/fmcsa'
import { getTpoAccount } from '@/lib/tpo-account'
import { prisma } from '@/lib/prisma'
import TpoAccountForm, { type TpoAccountFields } from './TpoAccountForm'
import SubmitAllButton from './SubmitAllButton'
import TestConnectionButton from './TestConnectionButton'

function toDateInput(d: Date | null | undefined): string {
  return d ? d.toISOString().slice(0, 10) : ''
}

async function getQueuedExams() {
  if (!process.env.DATABASE_URL) return { rows: [], dbUnavailable: true }
  try {
    const exams = await prisma.exam.findMany({
      where: { status: 'CERTIFIED' },
      include: { driver: true, company: true },
      orderBy: { examDate: 'asc' },
    })
    return { rows: exams, dbUnavailable: false }
  } catch (err) {
    console.error('[FMCSA Settings] Could not load queued exams:', err)
    return { rows: [], dbUnavailable: true }
  }
}

export default async function FMCSASettingsPage() {
  const [tpoAccount, { rows: queuedExams, dbUnavailable }] = await Promise.all([
    getTpoAccount(),
    getQueuedExams(),
  ])

  const initial: TpoAccountFields = {
    status: tpoAccount?.status ?? 'NOT_REGISTERED',
    tpoId: tpoAccount?.tpoId ?? '',
    agreementSignedAt: toDateInput(tpoAccount?.agreementSignedAt),
    pointOfContactName: tpoAccount?.pointOfContactName ?? '',
    pointOfContactEmail: tpoAccount?.pointOfContactEmail ?? '',
    pointOfContactPhone: tpoAccount?.pointOfContactPhone ?? '',
    authorizedRepName: tpoAccount?.authorizedRepName ?? '',
    authorizedRepTitle: tpoAccount?.authorizedRepTitle ?? '',
    authorizedRepEmail: tpoAccount?.authorizedRepEmail ?? '',
  }

  const isApproved = initial.status === 'APPROVED'

  let bannerTone: 'green' | 'amber' = 'amber'
  let bannerIcon = '⏳'
  let bannerTitle = 'FMCSA TPO Registration Not Started'
  let bannerBody =
    'WorkOccMed has not yet registered as a Third Party Organization with FMCSA. Complete registration below to begin.'

  if (initial.status === 'PENDING_APPROVAL') {
    bannerTitle = 'FMCSA TPO Application Submitted — Pending Approval'
    bannerBody =
      'Registration has been submitted to FMCSA and is awaiting review. Exam results are queued and will submit automatically once approved and API credentials are configured.'
  } else if (isApproved && !FMCSA_READY) {
    bannerTitle = 'TPO Approved — API Credentials Not Yet Configured'
    bannerBody = `FMCSA approved this organization as a Third Party Organization${initial.tpoId ? ` (TPO ID ${initial.tpoId})` : ''}. Set FMCSA_API_KEY in the server environment to begin submitting.`
  } else if (isApproved && FMCSA_READY) {
    bannerTone = 'green'
    bannerIcon = '✅'
    bannerTitle = 'FMCSA API Connected & Active'
    bannerBody = `Connected to ${FMCSA_API_URL} under TPO ID ${initial.tpoId || '—'}. Exam submissions are being sent to the National Registry in real time.`
  }

  const companiesQueued = new Set(queuedExams.map((e) => e.companyId)).size

  return (
    <Shell
      companySlug="" companyName="WorkOccMed LLC"
      role="SUPER_ADMIN" pageTitle="FMCSA National Registry — Setup"
      userSub="Super Administrator"
      pageActions={
        <div style={{ display: 'flex', gap: 8 }}>
          <a href="/admin/fmcsa/apply" style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink3)', textDecoration: 'none', padding: '6px 12px', border: '1px solid var(--border)', borderRadius: 6, background: 'var(--card)' }}>
            📋 TPO Application Guide
          </a>
          <a href="/admin/fmcsa/designations" style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink3)', textDecoration: 'none', padding: '6px 12px', border: '1px solid var(--border)', borderRadius: 6, background: 'var(--card)' }}>
            👤 Examiner Designations
          </a>
        </div>
      }
    >
      {/* Status Banner */}
      <div style={{
        background: bannerTone === 'green' ? '#f0fdf4' : '#fef3c7',
        border: `1px solid ${bannerTone === 'green' ? '#bbf7d0' : '#fcd34d'}`,
        borderRadius: 10, padding: '14px 16px', marginBottom: 20,
        display: 'flex', alignItems: 'flex-start', gap: 12,
      }}>
        <span style={{ fontSize: 22 }}>{bannerIcon}</span>
        <div>
          <div style={{ fontWeight: 700, fontSize: 13, color: bannerTone === 'green' ? '#14532d' : '#78350f', marginBottom: 4 }}>
            {bannerTitle}
          </div>
          <div style={{ fontSize: 12, color: bannerTone === 'green' ? '#166534' : '#92400e', lineHeight: 1.6 }}>
            {bannerBody}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>

        {/* TPO Registration — mirrors FMCSA's Third Party Organization Agreement */}
        <TableCard title="TPO Registration (FMCSA Third Party Organization Agreement)">
          <TpoAccountForm initial={initial} />
        </TableCard>

        {/* API Credentials — server-side secrets, not editable from this form */}
        <TableCard title="API Credentials" action={<TestConnectionButton />}>
          <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ fontSize: 11, color: 'var(--ink4)', lineHeight: 1.6 }}>
              Managed via server environment variables for security, not this form. Once FMCSA
              approves the registration and issues API credentials, set{' '}
              <code style={{ fontFamily: 'monospace' }}>FMCSA_API_KEY</code> and{' '}
              <code style={{ fontFamily: 'monospace' }}>FMCSA_API_URL</code> in the deployment
              environment.
            </div>
            {[
              { label: 'FMCSA API Key', value: FMCSA_READY ? '••••••••••••••••' : 'Not configured' },
              { label: 'FMCSA API Endpoint', value: FMCSA_API_URL },
            ].map((f) => (
              <div key={f.label}>
                <label style={{ display: 'block', fontWeight: 600, fontSize: 12, color: 'var(--ink)', marginBottom: 4 }}>{f.label}</label>
                <div style={{
                  width: '100%', border: '1px solid var(--border)', borderRadius: 6, padding: '7px 10px',
                  fontSize: 12, fontFamily: 'monospace', color: 'var(--ink3)', background: '#fafafa', boxSizing: 'border-box',
                }}>
                  {f.value}
                </div>
              </div>
            ))}
          </div>
        </TableCard>

        {/* Queued Submissions */}
        <TableCard title="Queued Submissions">
          <div style={{ padding: '0 16px 14px' }}>
            <div style={{
              background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8,
              padding: '10px 14px', marginTop: 14, marginBottom: 14,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--ink)' }}>
                  {dbUnavailable ? '—' : queuedExams.length} exams queued
                </div>
                <div style={{ fontSize: 11, color: 'var(--ink3)', marginTop: 2 }}>
                  {dbUnavailable
                    ? 'Database unreachable — cannot load queue'
                    : `Across ${companiesQueued} ${companiesQueued === 1 ? 'company' : 'companies'} · waiting for submission`}
                </div>
              </div>
              <SubmitAllButton examIds={queuedExams.map((e) => e.id)} disabled={!FMCSA_READY} />
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#fafafa', borderBottom: '1px solid var(--border)' }}>
                  {['Company', 'Driver', 'Exam Date', 'Queued'].map((h) => (
                    <th key={h} style={{ padding: '6px 10px', textAlign: 'left', fontSize: 10, fontWeight: 700, color: 'var(--ink3)', textTransform: 'uppercase', letterSpacing: '.06em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {queuedExams.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ padding: '20px 10px', textAlign: 'center', fontSize: 12, color: 'var(--ink4)' }}>
                      {dbUnavailable ? 'Could not load queue.' : 'Nothing queued.'}
                    </td>
                  </tr>
                ) : (
                  queuedExams.map((e, i) => {
                    const days = Math.max(0, Math.floor((Date.now() - e.examDate.getTime()) / 86400000))
                    return (
                      <tr key={e.id} style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                        <td style={{ padding: '7px 10px', fontSize: 12, color: 'var(--ink3)' }}>{e.company.name}</td>
                        <td style={{ padding: '7px 10px', fontSize: 12, fontWeight: 500, color: 'var(--ink)' }}>{e.driver.lastName}, {e.driver.firstName}</td>
                        <td style={{ padding: '7px 10px', fontSize: 12, color: 'var(--ink3)' }}>{e.examDate.toLocaleDateString()}</td>
                        <td style={{ padding: '7px 10px', fontSize: 12, color: 'var(--amber)', fontWeight: 600 }}>{days} {days === 1 ? 'day' : 'days'}</td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </TableCard>
      </div>
    </Shell>
  )
}
