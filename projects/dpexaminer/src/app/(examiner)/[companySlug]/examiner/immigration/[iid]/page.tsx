import Shell from '@/components/layout/Shell'
import { Badge, BtnPrimary, BtnSecondary } from '@/components/ui/dp-table'
import Link from 'next/link'
import { notFound } from 'next/navigation'

async function getExam(iid: string) {
  if (!process.env.DATABASE_URL) return null
  try {
    const { prisma } = await import('@/lib/prisma')
    return await prisma.immigrationExam.findUnique({ where: { id: iid } })
  } catch { return null }
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: 8, padding: '5px 0', borderBottom: '1px solid var(--border)' }}>
      <span style={{ fontSize: 11, color: 'var(--ink3)', width: 180, flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: 12, color: 'var(--ink)', fontWeight: 500 }}>{value || '—'}</span>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, marginBottom: 12, overflow: 'hidden' }}>
      <div style={{ background: '#1a3a1a', color: '#fff', padding: '7px 14px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em' }}>
        {title}
      </div>
      <div style={{ padding: '10px 14px' }}>{children}</div>
    </div>
  )
}

export default async function ImmigrationExamDetailPage({ params }: { params: Promise<{ companySlug: string; iid: string }> }) {
  const { companySlug, iid } = await params
  const exam = await getExam(iid)
  if (!exam) notFound()

  const status = exam.status === 'completed' ? 'Completed' : 'Draft'
  const civilSurgeon = [exam.csFirst, exam.csMiddle, exam.csLast].filter(Boolean).join(' ') || '—'

  return (
    <Shell
      companySlug={companySlug} companyName="WorkOccMed Medical Group"
      role="PRACTITIONER" pageTitle={`I-693 — ${exam.lastName}, ${exam.firstName}${exam.alienReg ? ` (${exam.alienReg})` : ''}`}
      nrcmeExpiry="12/14/2026"
      pageActions={
        <div style={{ display: 'flex', gap: 8 }}>
          <BtnPrimary href={`/${companySlug}/examiner/immigration/${iid}/form`} small>Print I-693 Form</BtnPrimary>
          <BtnSecondary href={`/${companySlug}/examiner/immigration`} small>← Back</BtnSecondary>
        </div>
      }
    >
      {/* Status banner */}
      <div style={{
        background: status === 'Completed' ? '#f0fdf4' : '#fef3c7',
        border: `1px solid ${status === 'Completed' ? '#bbf7d0' : '#fcd34d'}`,
        borderRadius: 10, padding: '12px 16px', marginBottom: 16,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 14, color: status === 'Completed' ? '#14532d' : '#78350f' }}>
            {exam.igraResult ? `TB IGRA: ${exam.igraResult}` : 'Immigration Medical Examination'}
          </div>
          <div style={{ fontSize: 11, color: status === 'Completed' ? '#166534' : '#92400e', marginTop: 2 }}>
            {civilSurgeon !== '—' ? `Civil Surgeon: ${civilSurgeon}` : 'Civil surgeon not yet assigned'}{exam.examDate ? ` · ${exam.examDate}` : ''}
          </div>
        </div>
        <Badge label={status} color={status === 'Completed' ? 'green' : 'amber'} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <Section title="Applicant Information">
            <InfoRow label="Name" value={`${exam.lastName}, ${exam.firstName}${exam.middleName ? ' ' + exam.middleName : ''}`} />
            <InfoRow label="A-Number" value={exam.alienReg ? <span style={{ fontFamily: 'monospace' }}>{exam.alienReg}</span> : null} />
            <InfoRow label="Date of Birth" value={exam.dob} />
            <InfoRow label="Sex" value={exam.sex} />
            <InfoRow label="Country of Birth" value={exam.countryBirth} />
            <InfoRow label="Address" value={[exam.street, exam.city, exam.state, exam.zip].filter(Boolean).join(', ')} />
            <InfoRow label="Exam Date" value={exam.examDate} />
          </Section>

          <Section title="Tuberculosis Evaluation">
            <InfoRow label="IGRA Result" value={exam.igraResult} />
            <InfoRow label="Quantiferon Date" value={exam.quantiferonDate} />
            <InfoRow label="T-Spot Date" value={exam.tspotDate} />
            <InfoRow label="TB Screening" value={exam.tbScreening} />
            <InfoRow label="Classification" value={exam.tbClassification} />
          </Section>
        </div>

        <div>
          <Section title="Civil Surgeon Certification">
            <InfoRow label="Civil Surgeon" value={civilSurgeon} />
            <InfoRow label="CSID" value={exam.csid} />
            <InfoRow label="Organization" value={exam.csOrg} />
            <InfoRow label="Phone" value={exam.csDayPhone || exam.csCellPhone} />
          </Section>

          <Section title="Overall Findings">
            <InfoRow label="Findings" value={exam.overallFindings ? (JSON.parse(exam.overallFindings) as string[]).join('; ') : null} />
            <InfoRow label="Date of First Exam" value={exam.examDate} />
            <InfoRow label="Status" value={status} />
          </Section>

          {/* Print link */}
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
            <div style={{ background: '#f8fafc', padding: '7px 14px', fontSize: 11, fontWeight: 700, color: 'var(--ink3)', textTransform: 'uppercase', letterSpacing: '.06em', borderBottom: '1px solid var(--border)' }}>
              USCIS Form
            </div>
            <div style={{ padding: 14 }}>
              <Link href={`/${companySlug}/examiner/immigration/${iid}/form`} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 8, textDecoration: 'none', background: '#fff' }}>
                <span style={{ fontSize: 22 }}>📋</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--ink)' }}>Form I-693</div>
                  <div style={{ fontSize: 11, color: 'var(--ink3)' }}>Printable — seal in envelope and give to applicant</div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  )
}
