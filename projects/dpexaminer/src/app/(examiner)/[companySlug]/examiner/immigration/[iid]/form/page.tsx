import Link from 'next/link'

// Mock data — replace with DB fetch by iid
const exam = {
  last: 'Ramirez', first: 'Maria', middle: 'Elena',
  aNumber: 'A-212345678',
  dob: '03/14/1985', sex: 'Female',
  countryBirth: 'Mexico', countryNationality: 'Mexico',
  address: '87 Main Street, Hackensack, NJ 07601',
  examDate: '09/08/2026',
  determination: 'No conditions found that would make this applicant inadmissible on medical grounds',
  tbMethod: 'TST',
  tbDatePlaced: '09/01/2026', tbDateRead: '09/03/2026',
  tbInduration: '0', tbResult: 'Negative',
  chestXray: 'Not indicated',
  height: 64, weight: 140,
  bp: '118/74', pulse: 72,
  physicalFindings: 'All systems within normal limits.',
  civilSurgeon: 'Chantal Simpson-Gabriel, MD',
  civilSurgeonDesig: 'CS-0012345',
  office: '350 Prospect Ave, Hackensack, NJ 07601',
  signDate: '09/08/2026',
}

const vaccines = [
  { name: 'COVID-19',          status: 'Up to date',             date: '01/15/2024' },
  { name: 'Tdap',              status: 'Up to date',             date: '03/22/2021' },
  { name: 'Hepatitis B',       status: 'Up to date',             date: '06/10/2010' },
  { name: 'MMR',               status: 'Previously immune (titer)', date: '09/08/2026' },
  { name: 'Varicella',         status: 'Previously immune (disease)', date: '' },
  { name: 'Influenza',         status: 'Administered today',     date: '09/08/2026' },
  { name: 'Pneumococcal',      status: 'Not age-appropriate',    date: '' },
  { name: 'Hepatitis A',       status: 'Up to date',             date: '05/01/2019' },
  { name: 'HPV',               status: 'Not age-appropriate',    date: '' },
  { name: 'Meningococcal',     status: 'Not age-appropriate',    date: '' },
  { name: 'Polio (IPV)',       status: 'Up to date',             date: '1990' },
  { name: 'Hib',               status: 'Not age-appropriate',    date: '' },
  { name: 'Rotavirus',         status: 'Not age-appropriate',    date: '' },
  { name: 'Zoster',            status: 'Not age-appropriate',    date: '' },
]

export default async function I693PrintPage({ params }: { params: Promise<{ companySlug: string; iid: string }> }) {
  const { companySlug, iid } = await params

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
        .field-row { display: flex; gap: 0; border: 1px solid #333; margin-bottom: -1px; }
        .field-cell { padding: 4px 8px; flex: 1; border-right: 1px solid #333; }
        .field-cell:last-child { border-right: none; }
        .field-label { font-size: 8pt; color: #444; }
        .field-value { font-size: 11pt; font-weight: 600; }
        .sig-line { border-bottom: 1px solid #000; height: 28px; margin-top: 8px; }
        h1 { font-size: 14pt; margin: 0 0 2px 0; }
        h2 { font-size: 11pt; margin: 0 0 8px 0; color: #444; }
        .uscis-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; }
      `}</style>

      {/* Print controls */}
      <div className="no-print" style={{ background: '#1a3a1a', padding: '10px 20px', display: 'flex', gap: 12, alignItems: 'center' }}>
        <span style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>I-693 — {exam.last}, {exam.first}</span>
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
            <div style={{ marginTop: 4 }}>Exam Date: <strong>{exam.examDate}</strong></div>
          </div>
        </div>

        {/* Part 1 */}
        <div className="section-header">Part 1. Information About You (Applicant)</div>
        <table style={{ marginBottom: 0 }}>
          <tbody>
            <tr>
              <td><div className="field-label">Family Name (Last Name)</div><div className="field-value">{exam.last}</div></td>
              <td><div className="field-label">Given Name (First Name)</div><div className="field-value">{exam.first}</div></td>
              <td><div className="field-label">Middle Name</div><div className="field-value">{exam.middle}</div></td>
            </tr>
            <tr>
              <td><div className="field-label">Alien Registration No. (A-Number)</div><div className="field-value">{exam.aNumber}</div></td>
              <td><div className="field-label">Date of Birth (MM/DD/YYYY)</div><div className="field-value">{exam.dob}</div></td>
              <td><div className="field-label">Sex</div><div className="field-value">{exam.sex}</div></td>
            </tr>
            <tr>
              <td><div className="field-label">Country of Birth</div><div className="field-value">{exam.countryBirth}</div></td>
              <td colSpan={2}><div className="field-label">Country of Citizenship/Nationality</div><div className="field-value">{exam.countryNationality}</div></td>
            </tr>
            <tr>
              <td colSpan={3}><div className="field-label">Home Address</div><div className="field-value">{exam.address}</div></td>
            </tr>
          </tbody>
        </table>

        {/* Part 2 — Physical Exam */}
        <div className="section-header">Part 2. General Medical Examination</div>
        <table style={{ marginBottom: 0 }}>
          <tbody>
            <tr>
              <td><div className="field-label">Height</div><div className="field-value">{exam.height}&quot;</div></td>
              <td><div className="field-label">Weight</div><div className="field-value">{exam.weight} lbs</div></td>
              <td><div className="field-label">Blood Pressure</div><div className="field-value">{exam.bp}</div></td>
              <td><div className="field-label">Pulse</div><div className="field-value">{exam.pulse} bpm</div></td>
            </tr>
            <tr>
              <td colSpan={4}><div className="field-label">Physical Examination Findings</div><div className="field-value">{exam.physicalFindings}</div></td>
            </tr>
            <tr>
              <td colSpan={4}>
                <div className="field-label">Medical / Mental Health History Findings</div>
                <div className="field-value">No reportable conditions identified.</div>
              </td>
            </tr>
          </tbody>
        </table>

        {/* TB Section */}
        <div className="section-header">Part 2D. Tuberculosis Evaluation</div>
        <table style={{ marginBottom: 0 }}>
          <tbody>
            <tr>
              <td><div className="field-label">Test Method</div><div className="field-value">{exam.tbMethod}</div></td>
              <td><div className="field-label">Date Placed</div><div className="field-value">{exam.tbDatePlaced}</div></td>
              <td><div className="field-label">Date Read</div><div className="field-value">{exam.tbDateRead}</div></td>
              <td><div className="field-label">Induration (mm)</div><div className="field-value">{exam.tbInduration} mm</div></td>
              <td><div className="field-label">Result</div><div className="field-value">{exam.tbResult}</div></td>
            </tr>
            <tr>
              <td colSpan={2}><div className="field-label">Chest X-Ray</div><div className="field-value">{exam.chestXray}</div></td>
              <td colSpan={3}><div className="field-label">Additional Notes</div><div className="field-value">&nbsp;</div></td>
            </tr>
          </tbody>
        </table>

        {/* Vaccination Record */}
        <div className="section-header">Part 3. Vaccination Record</div>
        <table>
          <thead>
            <tr>
              <th style={{ width: '35%' }}>Vaccine Antigen</th>
              <th style={{ width: '30%' }}>Status</th>
              <th style={{ width: '20%' }}>Date(s) Given / Verified</th>
              <th style={{ width: '15%' }}>Notes / Lot #</th>
            </tr>
          </thead>
          <tbody>
            {vaccines.map(v => (
              <tr key={v.name}>
                <td>{v.name}</td>
                <td>{v.status}</td>
                <td>{v.date || '—'}</td>
                <td>&nbsp;</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Civil Surgeon Certification */}
        <div className="section-header">Part 4. Civil Surgeon Certification</div>
        <table>
          <tbody>
            <tr>
              <td colSpan={2}>
                <div className="field-label">Determination</div>
                <div className="field-value" style={{ fontSize: 11 }}>{exam.determination}</div>
              </td>
            </tr>
            <tr>
              <td><div className="field-label">Civil Surgeon Name</div><div className="field-value">{exam.civilSurgeon}</div></td>
              <td><div className="field-label">USCIS Civil Surgeon Designation Number</div><div className="field-value">{exam.civilSurgeonDesig}</div></td>
            </tr>
            <tr>
              <td colSpan={2}><div className="field-label">Office Address</div><div className="field-value">{exam.office}</div></td>
            </tr>
            <tr>
              <td>
                <div className="field-label">Civil Surgeon Signature</div>
                <div className="sig-line" />
              </td>
              <td>
                <div className="field-label">Date of Signature (MM/DD/YYYY)</div>
                <div className="field-value">{exam.signDate}</div>
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
