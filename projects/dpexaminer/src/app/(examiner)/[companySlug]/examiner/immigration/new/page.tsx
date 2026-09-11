'use client'
import { useState } from 'react'
import Shell from '@/components/layout/Shell'
import { BtnPrimary, BtnSecondary } from '@/components/ui/dp-table'
import { useParams } from 'next/navigation'

const VACCINES = [
  'COVID-19', 'DTaP / Td / Tdap', 'Hepatitis A', 'Hepatitis B',
  'Hib (Haemophilus influenzae type b)', 'HPV', 'Influenza (seasonal)',
  'MCV4 / MPSV4 (Meningococcal)', 'MMR (Measles, Mumps, Rubella)',
  'Pneumococcal (PCV13 / PPSV23)', 'Polio (IPV)', 'Rotavirus',
  'Varicella (Chickenpox)', 'Zoster (Shingles)',
]

const MENTAL_HISTORY = [
  'Intellectual disability', 'Autism spectrum disorder',
  'Attention-deficit disorder / ADHD', 'Learning disability',
  'Schizophrenia or other psychotic disorders',
  'Bipolar disorder', 'Depressive disorder / anxiety disorder',
  'Conduct disorder (juvenile applicants only)',
  'Any history of behavior harmful to self or others',
]

const MED_HISTORY = [
  'Communicable diseases (TB, Hansen\'s disease, gonorrhea, syphilis)',
  'Parasitic diseases (malaria, filariasis)',
  'Sexually transmitted infections',
  'Cardiovascular disease', 'Respiratory disease',
  'Gastrointestinal / liver disease', 'Neurological disorder',
  'Diabetes mellitus', 'Cancer / malignancy',
  'Blood disorder', 'Renal / urological disorder',
  'Musculoskeletal disorder', 'Endocrine disorder',
  'Surgery / hospitalization in past 5 years',
]

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink3)' }}>{label}</label>
      {children}
    </div>
  )
}

const inp: React.CSSProperties = {
  border: '1px solid var(--border)', borderRadius: 6,
  padding: '7px 10px', fontSize: 12, color: 'var(--ink)',
  background: 'var(--card)', width: '100%', boxSizing: 'border-box',
}

const sel: React.CSSProperties = { ...inp }

function SectionHeader({ title }: { title: string }) {
  return (
    <div style={{
      background: 'var(--accent)', color: '#fff',
      padding: '7px 14px', fontSize: 11, fontWeight: 700,
      textTransform: 'uppercase', letterSpacing: '.06em',
      borderRadius: '8px 8px 0 0', marginTop: 20,
    }}>
      {title}
    </div>
  )
}

export default function NewI693Page() {
  const params = useParams<{ companySlug: string }>()
  const slug = params?.companySlug ?? ''

  const [vaccineStatus, setVaccineStatus] = useState<Record<string, string>>(
    Object.fromEntries(VACCINES.map(v => [v, '']))
  )
  const [tbMethod, setTbMethod] = useState<'TST' | 'IGRA' | 'none'>('TST')

  return (
    <Shell
      companySlug={slug} companyName="WorkOccMed Medical Group"
      role="PRACTITIONER" pageTitle="New Immigration Medical Exam — I-693"
      nrcmeExpiry="12/14/2026"
      pageActions={
        <BtnSecondary href={`/${slug}/examiner/immigration`} small>← Back</BtnSecondary>
      }
    >
      <form style={{ maxWidth: 900, display: 'flex', flexDirection: 'column', gap: 0 }}>

        {/* PART 1 — Applicant Information */}
        <SectionHeader title="Part 1 — Applicant Information" />
        <div style={{ border: '1px solid var(--border)', borderTop: 'none', borderRadius: '0 0 8px 8px', padding: 16, marginBottom: 4, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          <Field label="Last Name (Family Name)">
            <input style={inp} placeholder="Last name" />
          </Field>
          <Field label="First Name (Given Name)">
            <input style={inp} placeholder="First name" />
          </Field>
          <Field label="Middle Name">
            <input style={inp} placeholder="Middle name" />
          </Field>
          <Field label="Other Names Used (including maiden name)">
            <input style={inp} placeholder="Other names" />
          </Field>
          <Field label="Alien Registration Number (A-Number)">
            <input style={inp} placeholder="A-" />
          </Field>
          <Field label="Date of Birth (MM/DD/YYYY)">
            <input style={inp} type="date" />
          </Field>
          <Field label="Sex">
            <select style={sel}>
              <option value="">Select</option>
              <option>Male</option>
              <option>Female</option>
            </select>
          </Field>
          <Field label="Country of Birth">
            <input style={inp} placeholder="Country" />
          </Field>
          <Field label="Country of Citizenship/Nationality">
            <input style={inp} placeholder="Country" />
          </Field>
          <div style={{ gridColumn: '1 / -1' }}>
            <Field label="Home Address (Street, City, State, ZIP)">
              <input style={inp} placeholder="Street address" />
            </Field>
          </div>
          <Field label="Applying for Immigrant Visa?">
            <select style={sel}>
              <option value="">Select</option>
              <option>Yes — applying abroad</option>
              <option>No — adjustment of status (I-485)</option>
            </select>
          </Field>
          <Field label="Exam Date">
            <input style={inp} type="date" />
          </Field>
          <Field label="Exam Location">
            <input style={inp} defaultValue="WorkOccMed Medical Group — Hackensack, NJ" />
          </Field>
        </div>

        {/* PART 2A — Medical History */}
        <SectionHeader title="Part 2A — Medical History" />
        <div style={{ border: '1px solid var(--border)', borderTop: 'none', borderRadius: '0 0 8px 8px', padding: 16, marginBottom: 4 }}>
          <p style={{ fontSize: 11, color: 'var(--ink3)', marginBottom: 12 }}>
            Check all conditions the applicant has had or currently has. For each marked condition, note in the findings section.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {MED_HISTORY.map(cond => (
              <label key={cond} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, cursor: 'pointer' }}>
                <input type="checkbox" style={{ width: 14, height: 14, accentColor: 'var(--accent)' }} />
                {cond}
              </label>
            ))}
          </div>
          <div style={{ marginTop: 14 }}>
            <Field label="Findings / Notes">
              <textarea style={{ ...inp, height: 80, resize: 'vertical' }} placeholder="Note any positive history here" />
            </Field>
          </div>
        </div>

        {/* PART 2B — Mental Health */}
        <SectionHeader title="Part 2B — Mental Health History" />
        <div style={{ border: '1px solid var(--border)', borderTop: 'none', borderRadius: '0 0 8px 8px', padding: 16, marginBottom: 4 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {MENTAL_HISTORY.map(cond => (
              <label key={cond} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, cursor: 'pointer' }}>
                <input type="checkbox" style={{ width: 14, height: 14, accentColor: 'var(--accent)' }} />
                {cond}
              </label>
            ))}
          </div>
          <div style={{ marginTop: 14 }}>
            <Field label="Mental Health Findings / Notes">
              <textarea style={{ ...inp, height: 80, resize: 'vertical' }} placeholder="Note any findings, including history of harmful behavior" />
            </Field>
          </div>
        </div>

        {/* PART 2C — Physical Exam */}
        <SectionHeader title="Part 2C — Physical Examination" />
        <div style={{ border: '1px solid var(--border)', borderTop: 'none', borderRadius: '0 0 8px 8px', padding: 16, marginBottom: 4 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12, marginBottom: 14 }}>
            <Field label="Height (in)"><input style={inp} placeholder="inches" type="number" /></Field>
            <Field label="Weight (lbs)"><input style={inp} placeholder="lbs" type="number" /></Field>
            <Field label="BMI"><input style={inp} placeholder="auto-calc" readOnly /></Field>
            <Field label="Blood Pressure"><input style={inp} placeholder="120/80" /></Field>
            <Field label="Pulse (bpm)"><input style={inp} placeholder="bpm" type="number" /></Field>
            <Field label="Temperature (°F)"><input style={inp} placeholder="98.6" /></Field>
            <Field label="Respiratory Rate"><input style={inp} placeholder="/min" type="number" /></Field>
            <Field label="O2 Saturation (%)"><input style={inp} placeholder="%" type="number" /></Field>
          </div>

          {/* Systems review */}
          <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink3)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.05em' }}>Systems Review — mark abnormal findings</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 14 }}>
            {['Eyes / EENT', 'Cardiovascular', 'Respiratory / Lungs', 'Abdomen / GI', 'Skin / Lymph nodes', 'Musculoskeletal', 'Neurological', 'Genitourinary', 'Psychiatric'].map(sys => (
              <label key={sys} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, cursor: 'pointer' }}>
                <input type="checkbox" style={{ width: 14, height: 14, accentColor: '#ef4444' }} />
                {sys}
              </label>
            ))}
          </div>

          <Field label="Physical Exam Findings (describe any abnormals)">
            <textarea style={{ ...inp, height: 80, resize: 'vertical' }} placeholder="Describe abnormal findings. Write 'WNL' if all systems normal." />
          </Field>
        </div>

        {/* PART 2D — TB Evaluation */}
        <SectionHeader title="Part 2D — Tuberculosis (TB) Evaluation" />
        <div style={{ border: '1px solid var(--border)', borderTop: 'none', borderRadius: '0 0 8px 8px', padding: 16, marginBottom: 4 }}>
          <div style={{ display: 'flex', gap: 20, marginBottom: 14 }}>
            {(['TST', 'IGRA', 'none'] as const).map(m => (
              <label key={m} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, cursor: 'pointer' }}>
                <input type="radio" name="tbMethod" checked={tbMethod === m} onChange={() => setTbMethod(m)} />
                {m === 'TST' ? 'Tuberculin Skin Test (TST / Mantoux)' : m === 'IGRA' ? 'IGRA (blood test)' : 'Not required (prior positive / completed treatment)'}
              </label>
            ))}
          </div>

          {tbMethod === 'TST' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12, background: '#f8fafc', padding: 12, borderRadius: 8 }}>
              <Field label="Date Placed"><input style={inp} type="date" /></Field>
              <Field label="Date Read"><input style={inp} type="date" /></Field>
              <Field label="Induration (mm)"><input style={inp} placeholder="mm" type="number" min="0" /></Field>
              <Field label="Result">
                <select style={sel}>
                  <option value="">Select</option>
                  <option>Negative</option>
                  <option>Positive (≥ 10mm or ≥ 5mm if high risk)</option>
                </select>
              </Field>
            </div>
          )}

          {tbMethod === 'IGRA' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, background: '#f8fafc', padding: 12, borderRadius: 8 }}>
              <Field label="Test Type">
                <select style={sel}><option>QuantiFERON-TB Gold Plus</option><option>T-SPOT.TB</option></select>
              </Field>
              <Field label="Date Drawn"><input style={inp} type="date" /></Field>
              <Field label="Result">
                <select style={sel}>
                  <option value="">Select</option>
                  <option>Negative</option>
                  <option>Positive</option>
                  <option>Indeterminate</option>
                </select>
              </Field>
            </div>
          )}

          <div style={{ marginTop: 12 }}>
            <Field label="Chest X-Ray (if TB positive or symptomatic)">
              <select style={sel}>
                <option value="">Not indicated</option>
                <option>Normal</option>
                <option>Abnormal — see findings</option>
                <option>Old granulomatous disease — no active TB</option>
              </select>
            </Field>
          </div>

          <div style={{ marginTop: 12 }}>
            <Field label="Sputum Smear / Culture (if chest X-ray abnormal)">
              <select style={sel}>
                <option value="">Not indicated</option>
                <option>Negative</option>
                <option>Positive — treatment initiated</option>
              </select>
            </Field>
          </div>
        </div>

        {/* PART 3 — Vaccination Record */}
        <SectionHeader title="Part 3 — Vaccination Record" />
        <div style={{ border: '1px solid var(--border)', borderTop: 'none', borderRadius: '0 0 8px 8px', padding: 16, marginBottom: 4 }}>
          <p style={{ fontSize: 11, color: 'var(--ink3)', marginBottom: 12 }}>
            Enter vaccination status for each antigen per the CDC Immunization Schedule for adults and adolescents.
          </p>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', background: '#f8fafc' }}>
                <th style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 700, color: 'var(--ink3)', fontSize: 10, textTransform: 'uppercase' }}>Vaccine</th>
                <th style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 700, color: 'var(--ink3)', fontSize: 10, textTransform: 'uppercase' }}>Status</th>
                <th style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 700, color: 'var(--ink3)', fontSize: 10, textTransform: 'uppercase' }}>Date(s) Given / Verified</th>
                <th style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 700, color: 'var(--ink3)', fontSize: 10, textTransform: 'uppercase' }}>Notes</th>
              </tr>
            </thead>
            <tbody>
              {VACCINES.map((v, i) => (
                <tr key={v} style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                  <td style={{ padding: '7px 12px', fontWeight: 500, color: 'var(--ink)' }}>{v}</td>
                  <td style={{ padding: '7px 12px' }}>
                    <select
                      style={{ ...sel, width: 'auto', minWidth: 160 }}
                      value={vaccineStatus[v]}
                      onChange={e => setVaccineStatus(prev => ({ ...prev, [v]: e.target.value }))}
                    >
                      <option value="">Select</option>
                      <option>Up to date</option>
                      <option>Not age-appropriate</option>
                      <option>Medically contraindicated</option>
                      <option>Previously immune (titer / disease)</option>
                      <option>Refused</option>
                      <option>Administered today</option>
                    </select>
                  </td>
                  <td style={{ padding: '7px 12px' }}>
                    <input style={{ ...inp, width: 180 }} placeholder="MM/DD/YYYY" />
                  </td>
                  <td style={{ padding: '7px 12px' }}>
                    <input style={{ ...inp, width: '100%' }} placeholder="Lot #, site, etc." />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PART 4 — Civil Surgeon Determination */}
        <SectionHeader title="Part 4 — Civil Surgeon Determination" />
        <div style={{ border: '1px solid var(--border)', borderTop: 'none', borderRadius: '0 0 8px 8px', padding: 16, marginBottom: 24 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
            <Field label="Overall Determination">
              <select style={sel}>
                <option value="">Select</option>
                <option>No conditions found that would make this applicant inadmissible on medical grounds</option>
                <option>Class A condition identified — see below</option>
                <option>Class B condition identified — see below</option>
              </select>
            </Field>
            <Field label="Date of Signature">
              <input style={inp} type="date" />
            </Field>
          </div>

          <Field label="Class A / Class B Condition (if applicable)">
            <textarea style={{ ...inp, height: 60, resize: 'vertical' }}
              placeholder="Describe condition and ICD-10 code if applicable (e.g., A15.0 Pulmonary TB — Class A)" />
          </Field>

          <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Field label="Civil Surgeon Name">
              <input style={inp} defaultValue="Chantal Simpson-Gabriel, MD" />
            </Field>
            <Field label="USCIS Civil Surgeon Designation #">
              <input style={inp} placeholder="CS-XXXXXXX" />
            </Field>
          </div>

          <div style={{ marginTop: 12 }}>
            <Field label="Office Address">
              <input style={inp} defaultValue="350 Prospect Ave, Hackensack, NJ 07601" />
            </Field>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            type="button"
            style={{
              background: 'var(--accent)', color: '#fff',
              border: 'none', borderRadius: 8,
              padding: '10px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer',
            }}
          >
            Save I-693 Exam
          </button>
          <button
            type="button"
            style={{
              background: 'var(--card)', color: 'var(--ink)',
              border: '1px solid var(--border)', borderRadius: 8,
              padding: '10px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer',
            }}
          >
            Save &amp; Print Form
          </button>
          <BtnSecondary href={`/${slug}/examiner/immigration`} small>Cancel</BtnSecondary>
        </div>
      </form>
    </Shell>
  )
}
