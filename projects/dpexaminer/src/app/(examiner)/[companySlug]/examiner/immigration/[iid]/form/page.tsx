import Link from 'next/link'
import { notFound } from 'next/navigation'

async function getExam(iid: string) {
  if (!process.env.DATABASE_URL) return null
  try {
    const { prisma } = await import('@/lib/prisma')
    return await prisma.immigrationExam.findUnique({ where: { id: iid } })
  } catch { return null }
}

type VaccRow = {
  received1: string; received2: string; received3: string; received4: string
  given: boolean; complete: boolean
  ageWaiver: boolean; ciWaiver: boolean; timeWaiver: boolean; seeBelow: boolean
}

const VACC_GROUPS = [
  'DT/DTaP/DTP', 'Td/Tdap', 'OPV/IPV', 'MMR', 'Hib',
  'Hep. B', 'Varicella', 'Pneumococcal', 'Influenza',
  'Rotavirus', 'Hep. A', 'Meningococcal', 'COVID-19',
]

export default async function I693PrintPage({ params }: { params: Promise<{ companySlug: string; iid: string }> }) {
  const { companySlug, iid } = await params
  const exam = await getExam(iid)
  if (!exam) notFound()

  const civilSurgeon = [exam.csFirst, exam.csMiddle, exam.csLast].filter(Boolean).join(' ') || '—'
  const csAddress = [exam.csStreet, exam.csCity, exam.csState, exam.csZip].filter(Boolean).join(', ') || '—'
  const applicantAddress = [exam.street, exam.city, exam.state, exam.zip].filter(Boolean).join(', ') || '—'

  const overallFindings: string[] = exam.overallFindings ? JSON.parse(exam.overallFindings) : []
  const determination = overallFindings.length > 0
    ? overallFindings.join('; ')
    : 'No conditions found that would make this applicant inadmissible on medical grounds'

  const vaccData: Record<string, VaccRow> = exam.vaccData ? JSON.parse(exam.vaccData) : {}

  // TB method display
  const tbMethod = exam.noIGRA ? 'TST' : exam.quantiferonDate ? 'Quantiferon Gold' : exam.tspotDate ? 'T-SPOT.TB' : 'IGRA'
  const tbDate = exam.quantiferonDate || exam.tspotDate || '—'

  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { margin: 0; }
        }
        body { font-family: Arial, Helvetica, sans-serif; font-size: 11pt; color: #000; background: #fff; }
        .page { max-width: 8.5in; margin: 0 auto; padding: 0.5in; }
        table { width: 100%; border-collapse: collapse; }
        td, th { border: 1px solid #333; padding: 4px 7px; font-size: 10pt; vertical-align: top; }
        th { background: #e8e8e8; font-weight: bold; font-size: 9pt; text-align: left; }
        .section-header { background: #1a3a1a; color: #fff; font-weight: bold; font-size: 10pt; padding: 5px 8px; margin-top: 14px; margin-bottom: 0; }
        .field-label { font-size: 8pt; color: #444; }
        .field-value { font-size: 11pt; font-weight: 600; }
        .sig-line { border-bottom: 1px solid #000; height: 28px; margin-top: 8px; }
        h1 { font-size: 14pt; margin: 0 0 2px 0; }
        h2 { font-size: 11pt; margin: 0 0 8px 0; color: #444; }
        .uscis-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; }
      `}</style>

      {/* Print controls */}
      <div className="no-print" style={{ background: '#1a3a1a', padding: '10px 20px', display: 'flex', gap: 12, alignItems: 'center' }}>
        <span style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>I-693 — {exam.lastName}, {exam.firstName}</span>
        <button onClick={() => window.print()} style={{ background: '#4ade80', color: '#14532d', border: 'none', borderRadius: 6, padding: '6px 16px', fontWeight: 700, cursor: 'pointer' }}>
          Print / Save PDF
        </button>
        <Link href={`/${companySlug}/examiner/immigration/${iid}`} style={{ color: '#86efac', textDecoration: 'none', fontSize: 12 }}>← Back to Exam</Link>
        <span style={{ color: 'rgba(255,255,255,.4)', fontSize: 11, marginLeft: 'auto' }}>
          Seal completed form in envelope — hand to applicant unopened per 8 CFR 232.2
        </span>
      </div>

      <div className="page">

        {/* Header */}
        <div className="uscis-header">
          <div>
            <h1>Form I-693</h1>
            <h2>Report of Immigration Medical Examination and Vaccination Record</h2>
            <div style={{ fontSize: 9 }}>Department of Homeland Security — U.S. Citizenship and Immigration Services</div>
          </div>
          <div style={{ textAlign: 'right', fontSize: 9 }}>
            <div>OMB No. 1615-0033</div>
            <div style={{ marginTop: 4 }}>Exam Date: <strong>{exam.examDate || '—'}</strong></div>
          </div>
        </div>

        {/* Part 1 */}
        <div className="section-header">Part 1. Information About You (Applicant)</div>
        <table style={{ marginBottom: 0 }}>
          <tbody>
            <tr>
              <td><div className="field-label">Family Name (Last Name)</div><div className="field-value">{exam.lastName}</div></td>
              <td><div className="field-label">Given Name (First Name)</div><div className="field-value">{exam.firstName}</div></td>
              <td><div className="field-label">Middle Name</div><div className="field-value">{exam.middleName || '—'}</div></td>
            </tr>
            <tr>
              <td><div className="field-label">Alien Registration No. (A-Number)</div><div className="field-value">{exam.alienReg || '—'}</div></td>
              <td><div className="field-label">Date of Birth (MM/DD/YYYY)</div><div className="field-value">{exam.dob || '—'}</div></td>
              <td><div className="field-label">Sex</div><div className="field-value">{exam.sex || '—'}</div></td>
            </tr>
            <tr>
              <td><div className="field-label">Country of Birth</div><div className="field-value">{exam.countryBirth || '—'}</div></td>
              <td colSpan={2}><div className="field-label">USCIS Account Number</div><div className="field-value">{exam.uscisAccount || '—'}</div></td>
            </tr>
            <tr>
              <td colSpan={3}><div className="field-label">Home Address</div><div className="field-value">{applicantAddress}</div></td>
            </tr>
          </tbody>
        </table>

        {/* Part 2 — Medical findings summary */}
        <div className="section-header">Part 2. Medical Examination Findings</div>
        <table style={{ marginBottom: 0 }}>
          <tbody>
            <tr>
              <td colSpan={2}>
                <div className="field-label">Syphilis Finding</div>
                <div className="field-value">{exam.syphFinding || 'No finding'}</div>
              </td>
              <td colSpan={2}>
                <div className="field-label">Gonorrhea Finding</div>
                <div className="field-value">{exam.gonFinding || 'No finding'}</div>
              </td>
            </tr>
            <tr>
              <td colSpan={2}>
                <div className="field-label">Physical / Mental Disorder Finding</div>
                <div className="field-value">{exam.disorderFinding || 'No Class A/B Disorders'}</div>
              </td>
              <td colSpan={2}>
                <div className="field-label">Drug Abuse Finding</div>
                <div className="field-value">{exam.substanceFinding || 'No finding'}</div>
              </td>
            </tr>
            {exam.otherClassB && (
              <tr>
                <td colSpan={4}>
                  <div className="field-label">Other Class B Conditions</div>
                  <div className="field-value">{exam.otherClassB}</div>
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* TB Section */}
        <div className="section-header">Part 2D. Tuberculosis Evaluation</div>
        <table style={{ marginBottom: 0 }}>
          <tbody>
            <tr>
              <td><div className="field-label">Test Method</div><div className="field-value">{tbMethod}</div></td>
              <td><div className="field-label">Test Date</div><div className="field-value">{tbDate}</div></td>
              <td><div className="field-label">IGRA Result</div><div className="field-value">{exam.igraResult || '—'}</div></td>
              <td><div className="field-label">TB Screening Result</div><div className="field-value">{exam.tbScreening || '—'}</div></td>
            </tr>
            <tr>
              <td><div className="field-label">Classification</div><div className="field-value">{exam.tbClassification || '—'}</div></td>
              <td colSpan={3}><div className="field-label">Remarks</div><div className="field-value">{exam.tbRemarks || '—'}</div></td>
            </tr>
          </tbody>
        </table>

        {/* Vaccination Record */}
        <div className="section-header">Part 3. Vaccination Record</div>
        <table>
          <thead>
            <tr>
              <th style={{ width: '30%' }}>Vaccine Antigen</th>
              <th style={{ width: '15%' }}>Date 1</th>
              <th style={{ width: '15%' }}>Date 2</th>
              <th style={{ width: '15%' }}>Date 3</th>
              <th style={{ width: '12%' }}>Given Today</th>
              <th style={{ width: '13%' }}>Series Complete</th>
            </tr>
          </thead>
          <tbody>
            {VACC_GROUPS.map(label => {
              const row: VaccRow | undefined = vaccData[label]
              return (
                <tr key={label}>
                  <td>{label}</td>
                  <td>{row?.received1 || '—'}</td>
                  <td>{row?.received2 || '—'}</td>
                  <td>{row?.received3 || '—'}</td>
                  <td style={{ textAlign: 'center' }}>{row?.given ? '✓' : ''}</td>
                  <td style={{ textAlign: 'center' }}>{row?.complete ? '✓' : ''}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {exam.vaccRemarks && (
          <div style={{ border: '1px solid #333', borderTop: 'none', padding: '4px 8px', fontSize: 10 }}>
            <strong>Vaccination Remarks:</strong> {exam.vaccRemarks}
          </div>
        )}

        {/* Civil Surgeon Certification */}
        <div className="section-header">Part 4. Civil Surgeon Certification</div>
        <table>
          <tbody>
            <tr>
              <td colSpan={2}>
                <div className="field-label">Determination</div>
                <div className="field-value" style={{ fontSize: 11 }}>{determination}</div>
              </td>
            </tr>
            <tr>
              <td><div className="field-label">Civil Surgeon Name</div><div className="field-value">{civilSurgeon}</div></td>
              <td><div className="field-label">USCIS Civil Surgeon Designation Number</div><div className="field-value">{exam.csid || '—'}</div></td>
            </tr>
            <tr>
              <td><div className="field-label">Organization</div><div className="field-value">{exam.csOrg || '—'}</div></td>
              <td><div className="field-label">Phone</div><div className="field-value">{exam.csDayPhone || exam.csCellPhone || '—'}</div></td>
            </tr>
            <tr>
              <td colSpan={2}><div className="field-label">Office Address</div><div className="field-value">{csAddress}</div></td>
            </tr>
            {exam.followup1 && (
              <tr>
                <td colSpan={2}>
                  <div className="field-label">Follow-up Appointments</div>
                  <div className="field-value">{[exam.followup1, exam.followup2, exam.followup3].filter(Boolean).join(' · ')}</div>
                </td>
              </tr>
            )}
            <tr>
              <td>
                <div className="field-label">Civil Surgeon Signature</div>
                <div className="sig-line" />
              </td>
              <td>
                <div className="field-label">Date of Signature (MM/DD/YYYY)</div>
                <div className="field-value">{exam.examDate || '—'}</div>
              </td>
            </tr>
          </tbody>
        </table>

        <div style={{ marginTop: 16, fontSize: 9, color: '#555', borderTop: '1px solid #ccc', paddingTop: 8 }}>
          <strong>Important:</strong> This form must be sealed in an envelope by the civil surgeon and given to the applicant unopened.
          The applicant must submit this form to USCIS as part of their Form I-485 application or bring it to their immigrant visa interview.
          Form I-693 is valid for 2 years from the date of the civil surgeon&apos;s signature. | Form I-693 (Rev. 04/01/24)
        </div>
      </div>
    </>
  )
}
