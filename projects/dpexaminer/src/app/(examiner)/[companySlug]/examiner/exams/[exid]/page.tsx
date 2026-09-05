import Shell from '@/components/layout/Shell'
import { Badge, BtnPrimary, BtnSecondary } from '@/components/ui/dp-table'
import FmcsaSubmitPanel from '@/components/fmcsa/FmcsaSubmitPanel'
import Link from 'next/link'

// Mock exam data — in production this would be fetched by exid
const exam = {
  exid:       '4423965',
  last:       'Bedoya Serna',
  first:      'Dorian',
  dob:        '04/12/1981',
  age:        45,
  sex:        'Male',
  address:    '142 Elm Street, Hackensack, NJ 07601',
  phone:      '(973) 836-6135',
  email:      'dorian@email.com',
  cdl:        'NJ-B4423965',
  cdlState:   'NJ',
  cdlClass:   'Class A',
  cdlExp:     '01/15/2028',
  licType:    'CDL',
  driverType: 'Interstate',
  employer:   'Walk In',
  examType:   'Annual / Renewal',
  examDate:   '05/23/2026',
  certExpiry: '05/23/2028',
  certPeriod: '24 months',
  examiner:   'Dr. Chantal Simpson-Gabriel',
  nrcme:      'NR-1182736',
  clinic:     'WorkOccMed Medical Group',
  clinicAddr: '350 Prospect Ave, Hackensack, NJ 07601',
  result:     'Medically Qualified',
  status:     'Certified',
  fmcsaId:    '67308030',
  fmcsaStatus:'ACCEPTED',
  // Vitals
  heightFt: 5, heightIn: 10, weight: 192,
  bp1s: 122, bp1d: 78, bp2s: 120, bp2d: 76, pulse: 70,
  // Vision
  odCorr: '20/20', osCorr: '20/20', ouCorr: '20/20',
  odUnCorr: '20/40', osUnCorr: '20/50',
  correctiveLenses: true, colorVisionNormal: true,
  // Hearing
  rightEar: 5, leftEar: 5, hearingAid: false,
  // Urinalysis
  protein: 'Negative', sugar: 'Negative', blood: 'Negative',
  // Restrictions: none
  restrictions: [] as string[],
  // Drug screen
  drugScreen: 'Negative', drugScreenDate: '05/23/2026',
  // Determination
  determination: 'QUALIFIED',
  intakeSigned: true,
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: 8, padding: '5px 0', borderBottom: '1px solid var(--border)' }}>
      <span style={{ fontSize: 11, color: 'var(--ink3)', width: 160, flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: 12, color: 'var(--ink)', fontWeight: 500 }}>{value}</span>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, marginBottom: 12, overflow: 'hidden' }}>
      <div style={{ background: 'var(--accent)', color: '#fff', padding: '7px 14px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em' }}>
        {title}
      </div>
      <div style={{ padding: '10px 14px' }}>{children}</div>
    </div>
  )
}

export default async function ExamDetailPage({ params }: { params: Promise<{ companySlug: string; exid: string }> }) {
  const { companySlug, exid } = await params

  return (
    <Shell
      companySlug={companySlug} companyName="WorkOccMed Medical Group"
      role="PRACTITIONER" pageTitle={`Exam #${exam.exid} — ${exam.last}, ${exam.first}`}
      nrcmeExpiry="12/14/2026"
      pageActions={
        <div style={{ display: 'flex', gap: 8 }}>
          <BtnSecondary href={`/${companySlug}/examiner/exams/${exid}/record`} small>🖨 MCSA-5870 Record</BtnSecondary>
          {exam.result.includes('Qualified') && !exam.result.includes('Not') &&
            <BtnPrimary href={`/${companySlug}/examiner/exams/${exid}/certificate`} small>🪪 MCSA-5876 Certificate</BtnPrimary>
          }
          <BtnSecondary href={`/${companySlug}/examiner/exams`} small>← Back</BtnSecondary>
        </div>
      }
    >
      {/* Status banner */}
      <div style={{
        background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10,
        padding: '12px 16px', marginBottom: 16,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 24 }}>✅</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: '#14532d' }}>{exam.result}</div>
            <div style={{ fontSize: 11, color: '#166534' }}>
              Certified for {exam.certPeriod} · Expires {exam.certExpiry} · FMCSA ID: {exam.fmcsaId}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Badge label={exam.status} color="green" />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>

        {/* Left column */}
        <div>
          <Section title="Driver Information">
            <InfoRow label="Name" value={`${exam.last}, ${exam.first}`} />
            <InfoRow label="Date of Birth" value={`${exam.dob} (Age ${exam.age})`} />
            <InfoRow label="Sex" value={exam.sex} />
            <InfoRow label="Address" value={exam.address} />
            <InfoRow label="Phone" value={exam.phone} />
            <InfoRow label="Email" value={exam.email} />
            <InfoRow label="License #" value={`${exam.cdl} (${exam.cdlState})`} />
            <InfoRow label="CDL Class" value={exam.cdlClass} />
            <InfoRow label="CDL Expires" value={exam.cdlExp} />
            <InfoRow label="Driver Type" value={exam.driverType} />
            <InfoRow label="Employer" value={exam.employer} />
            <InfoRow label="Exam Type" value={exam.examType} />
          </Section>

          <Section title="Vitals">
            <InfoRow label="Height / Weight" value={`${exam.heightFt}'${exam.heightIn}" / ${exam.weight} lbs`} />
            <InfoRow label="Blood Pressure #1" value={`${exam.bp1s}/${exam.bp1d} mmHg`} />
            <InfoRow label="Blood Pressure #2" value={`${exam.bp2s}/${exam.bp2d} mmHg`} />
            <InfoRow label="Pulse Rate" value={`${exam.pulse} bpm`} />
          </Section>

          <Section title="Vision">
            <InfoRow label="Right Eye (corrected)" value={exam.odCorr} />
            <InfoRow label="Left Eye (corrected)" value={exam.osCorr} />
            <InfoRow label="Both Eyes (corrected)" value={exam.ouCorr} />
            <InfoRow label="Right Eye (uncorrected)" value={exam.odUnCorr} />
            <InfoRow label="Left Eye (uncorrected)" value={exam.osUnCorr} />
            <InfoRow label="Corrective Lenses" value={exam.correctiveLenses ? 'Yes' : 'No'} />
            <InfoRow label="Color Vision" value={exam.colorVisionNormal ? 'Normal' : 'Abnormal'} />
          </Section>

          <Section title="Hearing">
            <InfoRow label="Right Ear (whisper)" value={`${exam.rightEar} ft`} />
            <InfoRow label="Left Ear (whisper)" value={`${exam.leftEar} ft`} />
            <InfoRow label="Hearing Aid" value={exam.hearingAid ? 'Yes' : 'No'} />
          </Section>
        </div>

        {/* Right column */}
        <div>
          <Section title="Examination Details">
            <InfoRow label="Exam Date" value={exam.examDate} />
            <InfoRow label="Examiner" value={exam.examiner} />
            <InfoRow label="NRCME #" value={exam.nrcme} />
            <InfoRow label="Clinic" value={exam.clinic} />
            <InfoRow label="Driver Intake" value={exam.intakeSigned ? <Badge label="✓ Signed" color="green" /> : <Badge label="Unsigned" color="amber" />} />
          </Section>

          <Section title="Urinalysis">
            <InfoRow label="Protein" value={exam.protein} />
            <InfoRow label="Sugar / Glucose" value={exam.sugar} />
            <InfoRow label="Blood" value={exam.blood} />
          </Section>

          <Section title="Drug Screen">
            <InfoRow label="Result" value={<Badge label={exam.drugScreen} color="green" />} />
            <InfoRow label="Test Date" value={exam.drugScreenDate} />
          </Section>

          <Section title="Determination">
            <InfoRow label="Result" value={<span style={{ color: 'var(--accent)', fontWeight: 700 }}>{exam.result}</span>} />
            <InfoRow label="Certification Period" value={exam.certPeriod} />
            <InfoRow label="Certificate Expires" value={<span style={{ fontWeight: 700 }}>{exam.certExpiry}</span>} />
            <InfoRow label="Restrictions" value={exam.restrictions.length ? exam.restrictions.join(', ') : 'None'} />
          </Section>

          {/* FMCSA Submission — live panel */}
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, marginBottom: 12, overflow: 'hidden' }}>
            <div style={{ background: 'var(--accent)', color: '#fff', padding: '7px 14px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em' }}>
              FMCSA Submission
            </div>
            <FmcsaSubmitPanel examId={exid} examStatus={exam.status} />
          </div>

          {/* Form links */}
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
            <div style={{ background: '#f8fafc', padding: '7px 14px', fontSize: 11, fontWeight: 700, color: 'var(--ink3)', textTransform: 'uppercase', letterSpacing: '.06em', borderBottom: '1px solid var(--border)' }}>
              Federal Forms
            </div>
            <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Link href={`/${companySlug}/examiner/exams/${exid}/record`} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 8, textDecoration: 'none', background: '#fff' }}>
                <span style={{ fontSize: 22 }}>📋</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--ink)' }}>MCSA-5870</div>
                  <div style={{ fontSize: 11, color: 'var(--ink3)' }}>Medical Examiner's Record — clinic retained copy · printable</div>
                </div>
              </Link>
              <Link href={`/${companySlug}/examiner/exams/${exid}/certificate`} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 8, textDecoration: 'none', background: '#fff' }}>
                <span style={{ fontSize: 22 }}>🪪</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--ink)' }}>MCSA-5876</div>
                  <div style={{ fontSize: 11, color: 'var(--ink3)' }}>Medical Examiner's Certificate — driver wallet card · print-ready</div>
                </div>
              </Link>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 8, background: '#f0fdf4' }}>
                <span style={{ fontSize: 22 }}>🏛️</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--ink)' }}>MCSA-5875</div>
                  <div style={{ fontSize: 11, color: 'var(--ink3)' }}>Medical Examination Report — submitted to FMCSA</div>
                  <div style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 600, marginTop: 2 }}>✓ Accepted by FMCSA · ID {exam.fmcsaId}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  )
}
