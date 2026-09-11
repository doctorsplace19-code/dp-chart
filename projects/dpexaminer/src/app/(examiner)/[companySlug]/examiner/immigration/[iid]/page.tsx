import Shell from '@/components/layout/Shell'
import { Badge, BtnPrimary, BtnSecondary } from '@/components/ui/dp-table'
import Link from 'next/link'

// Mock — replace with DB fetch by iid
const exam = {
  id: 'i001',
  last: 'Ramirez', first: 'Maria', middle: 'Elena',
  aNumber: 'A-212345678',
  dob: '03/14/1985', sex: 'Female',
  countryBirth: 'Mexico', countryNationality: 'Mexico',
  address: '87 Main Street, Hackensack, NJ 07601',
  examDate: '09/08/2026',
  height: '5\'4"', weight: '140 lbs',
  bp: '118/74', pulse: '72 bpm',
  tbMethod: 'TST (Mantoux)', tbResult: 'Negative', tbInduration: '0 mm',
  chestXray: 'Not indicated',
  physicalFindings: 'All systems within normal limits.',
  determination: 'No conditions found',
  status: 'Completed',
  civilSurgeon: 'Chantal Simpson-Gabriel, MD',
  civilSurgeonDesig: 'CS-0012345',
  signDate: '09/08/2026',
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: 8, padding: '5px 0', borderBottom: '1px solid var(--border)' }}>
      <span style={{ fontSize: 11, color: 'var(--ink3)', width: 180, flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: 12, color: 'var(--ink)', fontWeight: 500 }}>{value}</span>
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

  return (
    <Shell
      companySlug={companySlug} companyName="WorkOccMed Medical Group"
      role="PRACTITIONER" pageTitle={`I-693 — ${exam.last}, ${exam.first} (${exam.aNumber})`}
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
        background: exam.status === 'Completed' ? '#f0fdf4' : '#fef3c7',
        border: `1px solid ${exam.status === 'Completed' ? '#bbf7d0' : '#fcd34d'}`,
        borderRadius: 10, padding: '12px 16px', marginBottom: 16,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 14, color: exam.status === 'Completed' ? '#14532d' : '#78350f' }}>
            {exam.determination}
          </div>
          <div style={{ fontSize: 11, color: exam.status === 'Completed' ? '#166534' : '#92400e', marginTop: 2 }}>
            Signed by {exam.civilSurgeon} · {exam.signDate}
          </div>
        </div>
        <Badge label={exam.status} color={exam.status === 'Completed' ? 'green' : 'amber'} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <Section title="Applicant Information">
            <InfoRow label="Name" value={`${exam.last}, ${exam.first} ${exam.middle}`} />
            <InfoRow label="A-Number" value={<span style={{ fontFamily: 'monospace' }}>{exam.aNumber}</span>} />
            <InfoRow label="Date of Birth" value={exam.dob} />
            <InfoRow label="Sex" value={exam.sex} />
            <InfoRow label="Country of Birth" value={exam.countryBirth} />
            <InfoRow label="Nationality" value={exam.countryNationality} />
            <InfoRow label="Address" value={exam.address} />
            <InfoRow label="Exam Date" value={exam.examDate} />
          </Section>

          <Section title="Physical Exam">
            <InfoRow label="Height / Weight" value={`${exam.height} / ${exam.weight}`} />
            <InfoRow label="Blood Pressure" value={exam.bp} />
            <InfoRow label="Pulse" value={exam.pulse} />
            <InfoRow label="Findings" value={exam.physicalFindings} />
          </Section>
        </div>

        <div>
          <Section title="Tuberculosis Evaluation">
            <InfoRow label="Method" value={exam.tbMethod} />
            <InfoRow label="Induration" value={exam.tbInduration} />
            <InfoRow label="Result" value={<Badge label={exam.tbResult} color={exam.tbResult === 'Negative' ? 'green' : 'red'} />} />
            <InfoRow label="Chest X-Ray" value={exam.chestXray} />
          </Section>

          <Section title="Civil Surgeon Certification">
            <InfoRow label="Civil Surgeon" value={exam.civilSurgeon} />
            <InfoRow label="Designation #" value={exam.civilSurgeonDesig} />
            <InfoRow label="Date Signed" value={exam.signDate} />
            <InfoRow label="Determination" value={exam.determination} />
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
