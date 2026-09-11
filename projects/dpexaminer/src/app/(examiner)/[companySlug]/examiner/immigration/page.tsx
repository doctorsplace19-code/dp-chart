import Shell from '@/components/layout/Shell'
import { BtnPrimary, BtnSecondary, Badge } from '@/components/ui/dp-table'
import Link from 'next/link'

async function getExams(companySlug: string) {
  if (!process.env.DATABASE_URL) return []
  try {
    const { prisma } = await import('@/lib/prisma')
    const company = await prisma.company.findFirst({ where: { slug: companySlug } })
    if (!company) return []
    return await prisma.immigrationExam.findMany({
      where: { companyId: company.id },
      orderBy: { createdAt: 'desc' },
    })
  } catch { return [] }
}

export default async function ImmigrationExamsPage({ params }: { params: Promise<{ companySlug: string }> }) {
  const { companySlug } = await params
  const exams = await getExams(companySlug)

  return (
    <Shell
      companySlug={companySlug} companyName="WorkOccMed Medical Group"
      role="PRACTITIONER" pageTitle="Immigration Medical Exams (I-693)"
      nrcmeExpiry="12/14/2026"
      pageActions={
        <BtnPrimary href={`/${companySlug}/examiner/immigration/new`} small>+ New I-693</BtnPrimary>
      }
    >
      <div style={{
        background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 10,
        padding: '12px 16px', marginBottom: 16, fontSize: 12, color: '#1e40af', lineHeight: 1.6,
      }}>
        <strong>USCIS Form I-693</strong> — Report of Immigration Medical Examination and Vaccination Record.
        Complete for applicants filing Form I-485. As a designated civil surgeon, seal the completed
        form in an envelope and give it to the applicant unopened. I-693 is valid for 2 years from the date of the civil surgeon&apos;s signature.
      </div>

      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--border)' }}>
              {['Applicant', 'A-Number', 'DOB', 'Exam Date', 'Status', ''].map(h => (
                <th key={h} style={{ padding: '9px 14px', textAlign: 'left', fontSize: 10, fontWeight: 700, color: 'var(--ink3)', textTransform: 'uppercase', letterSpacing: '.06em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {exams.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '32px 14px', textAlign: 'center', color: 'var(--ink4)', fontSize: 13 }}>
                  No I-693 exams yet. <Link href={`/${companySlug}/examiner/immigration/new`} style={{ color: 'var(--accent)' }}>Add the first one.</Link>
                </td>
              </tr>
            ) : exams.map((e, i) => (
              <tr key={e.id} style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                <td style={{ padding: '9px 14px', fontWeight: 600, color: 'var(--ink)' }}>{e.lastName}, {e.firstName}</td>
                <td style={{ padding: '9px 14px', color: 'var(--ink3)', fontFamily: 'monospace', fontSize: 11 }}>{e.alienReg || '—'}</td>
                <td style={{ padding: '9px 14px', color: 'var(--ink3)' }}>{e.dob || '—'}</td>
                <td style={{ padding: '9px 14px', color: 'var(--ink3)' }}>{e.examDate || '—'}</td>
                <td style={{ padding: '9px 14px' }}>
                  <Badge label={e.status === 'completed' ? 'Completed' : 'Draft'} color={e.status === 'completed' ? 'green' : 'amber'} />
                </td>
                <td style={{ padding: '9px 14px', textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                    <BtnSecondary href={`/${companySlug}/examiner/immigration/${e.id}`} small>View</BtnSecondary>
                    <BtnSecondary href={`/${companySlug}/examiner/immigration/${e.id}/form`} small>Print I-693</BtnSecondary>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Shell>
  )
}
