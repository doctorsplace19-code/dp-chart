'use client'
import { useState } from 'react'
import Shell from '@/components/layout/Shell'
import { useParams } from 'next/navigation'

const US_STATES = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY','DC']

const COUNTRIES = ['United States of America','Mexico','Guatemala','El Salvador','Honduras','Dominican Republic','Cuba','Haiti','Colombia','Ecuador','Peru','Brazil','China','Philippines','India','Vietnam','Korea','Jamaica','Trinidad and Tobago','Guyana','Other']

const TOP_TABS = ['Patient','Admin','Medical Tests & History','Results','Preview','Finalize & Print']
const MED_SUBTABS = ['Tuberculosis','Syphilis & Gonorrhea','Disorders & Drug Abuse','Vaccinations','Other Class B Conditions','Additional Information']

type VaccRow = { received1:string; received2:string; received3:string; received4:string; given:string; complete:string; ageWaiver:boolean; ciWaiver:boolean; timeWaiver:boolean; seeBelow:boolean }
function emptyVacc(): VaccRow { return { received1:'',received2:'',received3:'',received4:'',given:'',complete:'',ageWaiver:false,ciWaiver:false,timeWaiver:false,seeBelow:false } }

const VACC_GROUPS: { label: string; vaccines: string[]; gray?: boolean; showTiter?: boolean; showVaricella?: boolean }[] = [
  { label: 'DT / DTaP / DTP', vaccines: ['DT','DTaP','DTP'] },
  { label: 'Td / Tdap', vaccines: ['Td','Tdap'], gray: true },
  { label: 'OPV / IPV', vaccines: ['OPV','IPV'] },
  { label: 'MMR', vaccines: ['MMR'], gray: true, showTiter: true },
  { label: 'Hib', vaccines: ['Hib'] },
  { label: 'Hep. B', vaccines: ['Hep. B'], gray: true, showTiter: true },
  { label: 'Varicella', vaccines: ['Varicella'], showTiter: true, showVaricella: true },
  { label: 'Pneumococcal', vaccines: ['Pneumococcal'], gray: true },
  { label: 'Influenza', vaccines: ['Influenza'] },
  { label: 'Rotavirus', vaccines: ['Rotavirus'], gray: true },
  { label: 'Hep. A', vaccines: ['Hep. A'], showTiter: true },
  { label: 'Meningococcal', vaccines: ['Meningococcal'], gray: true },
  { label: 'COVID-19\n(specify vaccine brand in remarks)', vaccines: ['COVID-19'] },
]

export default function NewI693Page() {
  const params = useParams()
  const companySlug = params?.companySlug as string ?? ''

  const [tab, setTab] = useState(0)
  const [medSub, setMedSub] = useState(0)
  const [adminSub, setAdminSub] = useState(0)
  const [resultsSub, setResultsSub] = useState(0)

  // Patient fields
  const [firstName, setFirstName] = useState('')
  const [middleName, setMiddleName] = useState('')
  const [lastName, setLastName] = useState('')
  const [sex, setSex] = useState('')
  const [dob, setDob] = useState('')
  const [cityBirth, setCityBirth] = useState('')
  const [countryBirth, setCountryBirth] = useState('')
  const [idNumber, setIdNumber] = useState('')
  const [idType, setIdType] = useState('')
  const [uscisAccount, setUscisAccount] = useState('')
  const [alienReg, setAlienReg] = useState('')
  const [overseasExam, setOverseasExam] = useState(false)
  const [careOf, setCareOf] = useState('')
  const [street, setStreet] = useState('')
  const [addrType, setAddrType] = useState('')
  const [aptNum, setAptNum] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('New Jersey')
  const [zip, setZip] = useState('')
  const [country, setCountry] = useState('United States of America')

  // Admin fields
  const [notes, setNotes] = useState('')

  // TB fields
  const [noIGRA, setNoIGRA] = useState(false)
  const [quantiferonDate, setQuantiferonDate] = useState('')
  const [tspotDate, setTspotDate] = useState('')
  const [igraResult, setIgraResult] = useState('')
  const [tbScreening, setTbScreening] = useState('')
  const [sputumSmears, setSputumSmears] = useState<string[]>([])
  const [tbClassification, setTbClassification] = useState('')
  const [tbRemarks, setTbRemarks] = useState('')

  // Syphilis
  const [syphCollectionDate, setSyphCollectionDate] = useState('')
  const [syphReactive, setSyphReactive] = useState('')
  const [syphFinding, setSyphFinding] = useState('')
  const [syphRemarks, setSyphRemarks] = useState('')
  const [syphDrugs, setSyphDrugs] = useState('')
  const [syphDosage, setSyphDosage] = useState('')
  const [syphStart, setSyphStart] = useState('')
  const [syphEnd, setSyphEnd] = useState('')
  // Gonorrhea
  const [gonDate, setGonDate] = useState('')
  const [gonResult, setGonResult] = useState('')
  const [gonFinding, setGonFinding] = useState('')
  const [gonRemarks, setGonRemarks] = useState('')
  const [gonDrugs, setGonDrugs] = useState('')
  const [gonDosage, setGonDosage] = useState('')
  const [gonStart, setGonStart] = useState('')
  const [gonEnd, setGonEnd] = useState('')

  // Disorders
  const [disorderFinding, setDisorderFinding] = useState('No Class A/B Disorders')
  const [disorderRemarks, setDisorderRemarks] = useState('')
  const [commFinding, setCommFinding] = useState('No Class A/B Conditions')
  const [commRemarks, setCommRemarks] = useState('')
  const [substanceFinding, setSubstanceFinding] = useState('No Class A/B Substance Abuse Conditions')
  const [substanceRemarks, setSubstanceRemarks] = useState('')

  // Vaccinations
  const [vaccData, setVaccData] = useState<Record<string, VaccRow>>(() => {
    const d: Record<string, VaccRow> = {}
    VACC_GROUPS.forEach(g => { d[g.label] = emptyVacc() })
    return d
  })
  const [vaccComplete, setVaccComplete] = useState('')
  const [vaccRemarks, setVaccRemarks] = useState('')
  const [vaccOverall, setVaccOverall] = useState<string[]>([])

  function updateVacc(label: string, field: keyof VaccRow, val: string | boolean) {
    setVaccData(prev => ({ ...prev, [label]: { ...prev[label], [field]: val } }))
  }

  // Other Class B
  const [otherClassB, setOtherClassB] = useState('')

  // Additional Info
  const [addlItems, setAddlItems] = useState([
    {page:'',part:'',item:'',text:''},
    {page:'',part:'',item:'',text:''},
    {page:'',part:'',item:'',text:''},
    {page:'',part:'',item:'',text:''},
  ])

  // Results
  const [overallFindings, setOverallFindings] = useState<string[]>([])
  const [examDate, setExamDate] = useState('')
  const [followup1, setFollowup1] = useState('')
  const [followup2, setFollowup2] = useState('')
  const [followup3, setFollowup3] = useState('')
  const [preparer, setPreparer] = useState<string[]>([])
  const [physician, setPhysician] = useState('Civil Surgeon')
  const [csFirst, setCsFirst] = useState('')
  const [csMiddle, setCsMiddle] = useState('')
  const [csLast, setCsLast] = useState('')
  const [csDayPhone, setCsDayPhone] = useState('')
  const [csCellPhone, setCsCellPhone] = useState('')
  const [csEmail, setCsEmail] = useState('')
  const [csOrg, setCsOrg] = useState('')
  const [csid, setCsid] = useState('')
  const [csStreet, setCsStreet] = useState('')
  const [csAddrType, setCsAddrType] = useState('')
  const [csAptNum, setCsAptNum] = useState('')
  const [csCity, setCsCity] = useState('')
  const [csState, setCsState] = useState('')
  const [csZip, setCsZip] = useState('')
  const [csMailStreet, setCsMailStreet] = useState('')
  const [csMailAddrType, setCsMailAddrType] = useState('')
  const [csMailAptNum, setCsMailAptNum] = useState('')
  const [csMailCity, setCsMailCity] = useState('')
  const [csMailState, setCsMailState] = useState('')
  const [csMailZip, setCsMailZip] = useState('')

  const inp: React.CSSProperties = { width:'100%', padding:'7px 10px', border:'1px solid #ccc', borderRadius:5, fontSize:13, boxSizing:'border-box' }
  const lbl: React.CSSProperties = { fontSize:11, color:'#555', display:'block', marginBottom:3 }
  const section: React.CSSProperties = { marginBottom:20 }
  const sHead: React.CSSProperties = { fontSize:16, fontWeight:700, color:'var(--ink)', marginBottom:12, paddingBottom:6, borderBottom:'2px solid var(--border)' }
  const row2: React.CSSProperties = { display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:12 }
  const row3: React.CSSProperties = { display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12, marginBottom:12 }
  const row4: React.CSSProperties = { display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:12, marginBottom:12 }

  function Inp({ value, onChange, placeholder }: { value:string; onChange:(v:string)=>void; placeholder?:string }) {
    return <input style={inp} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder??''} />
  }
  function Sel({ value, onChange, opts }: { value:string; onChange:(v:string)=>void; opts:string[] }) {
    return <select style={inp} value={value} onChange={e=>onChange(e.target.value)}>{opts.map(o=><option key={o}>{o}</option>)}</select>
  }
  function DateInp({ value, onChange }: { value:string; onChange:(v:string)=>void }) {
    return <input type="text" style={inp} value={value} onChange={e=>onChange(e.target.value)} placeholder="mm/dd/yyyy" />
  }
  function Chk({ checked, onChange, label: lbl2 }: { checked:boolean; onChange:(v:boolean)=>void; label:string }) {
    return <label style={{ display:'flex', alignItems:'center', gap:6, fontSize:13, cursor:'pointer', userSelect:'none' }}>
      <input type="checkbox" checked={checked} onChange={e=>onChange(e.target.checked)} style={{ width:14, height:14 }} />
      {lbl2}
    </label>
  }
  function MultiChk({ options, selected, onChange }: { options:string[]; selected:string[]; onChange:(v:string[])=>void }) {
    return <div style={{ display:'flex', flexWrap:'wrap', gap:'8px 20px', marginTop:6 }}>
      {options.map(o => <Chk key={o} checked={selected.includes(o)} label={o}
        onChange={c => onChange(c ? [...selected,o] : selected.filter(x=>x!==o))} />)}
    </div>
  }
  function RadioGroup({ options, value, onChange }: { options:string[]; value:string; onChange:(v:string)=>void }) {
    return <div style={{ display:'flex', gap:16, flexWrap:'wrap', marginTop:6 }}>
      {options.map(o => <label key={o} style={{ display:'flex', alignItems:'center', gap:5, fontSize:13, cursor:'pointer' }}>
        <input type="radio" checked={value===o} onChange={()=>onChange(o)} style={{ width:13, height:13 }} /> {o}
      </label>)}
    </div>
  }

  // ── TAB CONTENT ──────────────────────────────────────────────────

  function PatientTab() {
    return <div>
      <div style={section}>
        <div style={sHead}>Patient Information &amp; Identification</div>
        <div style={row3}>
          <div><label style={lbl}>First Name</label><Inp value={firstName} onChange={setFirstName} placeholder="First Name" /></div>
          <div><label style={lbl}>Middle Name</label><Inp value={middleName} onChange={setMiddleName} placeholder="Middle Name" /></div>
          <div><label style={lbl}>Last Name</label><Inp value={lastName} onChange={setLastName} placeholder="Last Name" /></div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'auto 1fr 1fr 1fr', gap:12, marginBottom:12, alignItems:'start' }}>
          <div>
            <label style={lbl}>Sex:</label>
            <RadioGroup options={['Male','Female']} value={sex} onChange={setSex} />
          </div>
          <div><label style={lbl}>Date of Birth (mm/dd/yyyy)</label><DateInp value={dob} onChange={setDob} /></div>
          <div><label style={lbl}>City/Town/Village of Birth</label><Inp value={cityBirth} onChange={setCityBirth} placeholder="City/Town/Village of Birth" /></div>
          <div><label style={lbl}>Country of Birth:</label><Sel value={countryBirth} onChange={setCountryBirth} opts={['',  ...COUNTRIES]} /></div>
        </div>
        <div style={row4}>
          <div><label style={lbl}>Identification/Document Number</label><Inp value={idNumber} onChange={setIdNumber} placeholder="Identification/Document Number" /></div>
          <div><label style={lbl}>ID Document Type</label><Inp value={idType} onChange={setIdType} placeholder="ID Document Type" /></div>
          <div><label style={lbl}>USCIS Online Account # (if any)</label><Inp value={uscisAccount} onChange={setUscisAccount} placeholder="USCIS Online Account # (if any)" /></div>
          <div><label style={lbl}>Alien Registration # (if any)</label><Inp value={alienReg} onChange={setAlienReg} placeholder="Alien Registration # (if any)" /></div>
        </div>
      </div>

      <div style={section}>
        <div style={sHead}>Patient Contact Information</div>
        <div style={{ marginBottom:12 }}>
          <Chk checked={overseasExam} onChange={setOverseasExam} label="Eligible for completion of the vaccination record portion only, because of previously completed overseas immigration medical exam" />
        </div>
        <div style={{ marginBottom:12 }}>
          <label style={lbl}>Care of Name</label>
          <Inp value={careOf} onChange={setCareOf} placeholder="Care of Name" />
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'2fr auto auto 1fr', gap:12, marginBottom:12, alignItems:'end' }}>
          <div><label style={lbl}>Street Number and Name</label><Inp value={street} onChange={setStreet} placeholder="Street Number and Name" /></div>
          <div>
            <label style={lbl}>Address Type:</label>
            <RadioGroup options={['Apt','Suite','Floor']} value={addrType} onChange={setAddrType} />
          </div>
          <div><label style={lbl}>#</label><Inp value={aptNum} onChange={setAptNum} placeholder="Apt/Suite/Floor #" /></div>
          <div style={{ display:'none' }} />
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:12 }}>
          <div><label style={lbl}>City</label><Inp value={city} onChange={setCity} placeholder="City" /></div>
          <div>
            <label style={lbl}>State</label>
            <Sel value={state} onChange={setState} opts={US_STATES} />
          </div>
          <div><label style={lbl}>Zip Code</label><Inp value={zip} onChange={setZip} placeholder="Zip Code" /></div>
          <div>
            <label style={lbl}>Country</label>
            <Sel value={country} onChange={setCountry} opts={COUNTRIES} />
          </div>
        </div>
      </div>
    </div>
  }

  function AdminTab() {
    const subTabs = ['Notes','Attached Files']
    return <div>
      <div style={{ display:'flex', gap:0, borderBottom:'2px solid var(--border)', marginBottom:16 }}>
        {subTabs.map((t,i) => <button key={t} onClick={()=>setAdminSub(i)} style={{
          padding:'8px 16px', border:'none', background:'none', cursor:'pointer', fontSize:13,
          fontWeight:adminSub===i?700:400, color:adminSub===i?'#c0392b':'var(--ink3)',
          borderBottom:adminSub===i?'2px solid #c0392b':'none', marginBottom:-2,
        }}>{t}</button>)}
      </div>
      {adminSub === 0 && <div>
        <div style={sHead}>Notes</div>
        <p style={{ fontSize:13, color:'var(--ink3)', marginBottom:10 }}>
          Use this section to put any notes for your own internal use. You can use these notes as a TODO list, reminders or anything important you do not want to forget when you refer to this form later. These notes are not entered anywhere else and will not have any impact on the I-693 form.
        </p>
        <textarea style={{ ...inp, height:200, resize:'vertical' }} value={notes} onChange={e=>setNotes(e.target.value)} />
      </div>}
      {adminSub === 1 && <div>
        <div style={sHead}>Attached Files</div>
        <p style={{ fontSize:13, color:'var(--ink3)' }}>No files attached. (File upload will be available once the exam is saved.)</p>
      </div>}
    </div>
  }

  function TBSection() {
    const sputumOptions = [
      'No, not indicated',
      'Yes, indicated due to signs or symptoms of TB',
      'Yes, indicated due to chest X-ray suggestive of TB',
      'Yes, indicated due to known HIV infection or extrapulmonary TB',
      'Yes, indicated for end of treatment cultures',
    ]
    const screeningOpts = ['','Negative - No disease','Positive - pulmonary TB','Positive - extrapulmonary TB','Class B1 TB (Active)','Class B2 TB (Inactive)','No TB disease - no further evaluation needed']
    const classOpts = ['','Class A TB','Class B1 Pulmonary TB','Class B2 Extrapulmonary TB','Class B2 Pulmonary TB - No Disease','Class B2 Extrapulmonary TB - No Disease']
    return <div>
      <div style={{ marginBottom:12 }}>
        <Chk checked={noIGRA} onChange={setNoIGRA} label="No IGRA Performed (Mention IGRA Exception & Reasons in Remarks below)" />
      </div>
      <div style={row2}>
        <div><label style={lbl}>Quantiferon Date:</label><DateInp value={quantiferonDate} onChange={setQuantiferonDate} /></div>
        <div><label style={lbl}>T-Spot Date:</label><DateInp value={tspotDate} onChange={setTspotDate} /></div>
      </div>
      <div style={{ marginBottom:12 }}>
        <label style={lbl}>IGRA Results:</label>
        <RadioGroup options={['Negative (No X-Ray Required)','Positive (X-Ray Required)','Indeterminate / Borderline (No X-Ray Required)']} value={igraResult} onChange={setIgraResult} />
      </div>
      <div style={{ marginBottom:12 }}>
        <label style={lbl}>Initial Screening Results &amp; X-Ray Determination:</label>
        <Sel value={tbScreening} onChange={setTbScreening} opts={screeningOpts} />
      </div>
      <div style={{ marginBottom:12 }}>
        <label style={lbl}>Sputum Smears and Cultures Decision:</label>
        <MultiChk options={sputumOptions} selected={sputumSmears} onChange={setSputumSmears} />
      </div>
      <div style={{ marginBottom:12 }}>
        <label style={lbl}>Tuberculosis Classification and Findings</label>
        <p style={{ fontSize:11, color:'#888', margin:'2px 0 6px' }}>Note: Form instructions currently state that you should select this field only if a chest X-ray was performed.</p>
        <Sel value={tbClassification} onChange={setTbClassification} opts={classOpts} />
      </div>
      <div>
        <label style={lbl}>Remarks (include signs &amp; symptoms, therapy given with start/stop dates and any changes. Mention IGRA exemptions if any.)</label>
        <textarea style={{ ...inp, height:100, resize:'vertical' }} value={tbRemarks} onChange={e=>setTbRemarks(e.target.value)} />
      </div>
    </div>
  }

  function SyphGonSection() {
    return <div>
      <div style={{ ...section, borderBottom:'1px solid var(--border)', paddingBottom:16 }}>
        <div style={sHead}>Syphilis</div>
        <div style={row3}>
          <div><label style={lbl}>Name of Nontreponemal Test</label><input style={{ ...inp, background:'#f5f5f5' }} value="RPR WITH REFLEX TO TITER" readOnly /></div>
          <div><label style={lbl}>Collection Date (mm/dd/yyyy)</label><DateInp value={syphCollectionDate} onChange={setSyphCollectionDate} /></div>
          <div>
            <label style={lbl}>Reactive or Non-reactive?</label>
            <RadioGroup options={['Non-Reactive','Reactive']} value={syphReactive} onChange={setSyphReactive} />
          </div>
        </div>
        <div style={{ marginBottom:12 }}>
          <RadioGroup options={['No Class A or B Syphilis','Syphilis, Class A (untreated)','Syphilis, Class B (treated in the last year)']} value={syphFinding} onChange={setSyphFinding} />
        </div>
        <div style={row2}>
          <div>
            <label style={lbl}>Remarks: (include any therapy and doses)</label>
            <textarea style={{ ...inp, height:80, resize:'vertical' }} value={syphRemarks} onChange={e=>setSyphRemarks(e.target.value)} />
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
            <div><label style={lbl}>Drugs</label><input style={{ ...inp, background:'#f5f5f5' }} value={syphDrugs} onChange={e=>setSyphDrugs(e.target.value)} /></div>
            <div><label style={lbl}>Start Date (mm/dd/yyyy)</label><DateInp value={syphStart} onChange={setSyphStart} /></div>
            <div><label style={lbl}>Dosage</label><input style={{ ...inp, background:'#f5f5f5' }} value={syphDosage} onChange={e=>setSyphDosage(e.target.value)} /></div>
            <div><label style={lbl}>End Date (mm/dd/yyyy)</label><DateInp value={syphEnd} onChange={setSyphEnd} /></div>
          </div>
        </div>
      </div>

      <div style={section}>
        <div style={sHead}>Gonorrhea</div>
        <div style={row3}>
          <div><label style={lbl}>Name of Screening Test (NAAT)</label><input style={{ ...inp, background:'#f5f5f5' }} value="NEISSERIA GONORRHOEAE" readOnly /></div>
          <div><label style={lbl}>Date Specimen Reported (mm/dd/yyyy)</label><DateInp value={gonDate} onChange={setGonDate} /></div>
          <div>
            <label style={lbl}>Test Results:</label>
            <RadioGroup options={['Negative','Positive']} value={gonResult} onChange={setGonResult} />
          </div>
        </div>
        <div style={{ marginBottom:12 }}>
          <label style={{ fontSize:12, fontWeight:600 }}>Findings</label>
          <RadioGroup options={['No Class A or B Gonorrhea','Gonorrhea, Class A (untreated)','Gonorrhea, Class B (treated in the last year)']} value={gonFinding} onChange={setGonFinding} />
        </div>
        <div style={row2}>
          <div>
            <label style={lbl}>Remarks: (include any therapy and doses)</label>
            <textarea style={{ ...inp, height:80, resize:'vertical' }} value={gonRemarks} onChange={e=>setGonRemarks(e.target.value)} />
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
            <div><label style={lbl}>Drugs</label><input style={{ ...inp, background:'#f5f5f5' }} value={gonDrugs} onChange={e=>setGonDrugs(e.target.value)} /></div>
            <div><label style={lbl}>Start Date (mm/dd/yyyy)</label><DateInp value={gonStart} onChange={setGonStart} /></div>
            <div><label style={lbl}>Dosage</label><input style={{ ...inp, background:'#f5f5f5' }} value={gonDosage} onChange={e=>setGonDosage(e.target.value)} /></div>
            <div><label style={lbl}>End Date (mm/dd/yyyy)</label><DateInp value={gonEnd} onChange={setGonEnd} /></div>
          </div>
        </div>
      </div>
    </div>
  }

  function DisordersSection() {
    const disorderOpts = ['No Class A/B Disorders','Class A Physical/Mental Disorder with Harmful Behavior','Class B Physical/Mental Disorder with Harmful Behavior']
    const commOpts = ['No Class A/B Conditions','Class A Communicable Disease','Class B Communicable Disease']
    const substanceOpts = ['No Class A/B Substance Abuse Conditions','Class A Substance Abuse/Addiction','Class B Substance Abuse/Addiction']
    return <div>
      <div style={{ ...section, padding:16, border:'1px solid var(--border)', borderRadius:8, marginBottom:12 }}>
        <div style={sHead}>Physical &amp; Mental Disorders Associated with Harmful Behavior</div>
        <div style={row2}>
          <div>
            <label style={lbl}>Findings (Physical/Mental Disorders Associated with Harmful Behavior)</label>
            <Sel value={disorderFinding} onChange={setDisorderFinding} opts={disorderOpts} />
            <p style={{ fontSize:11, color:'#666', marginTop:5 }}>Notes: Remarks required for Class A or B findings. Consult with client/attorney in case of abnormal findings on the immigration file. Use additional notes if necessary.</p>
          </div>
          <div>
            <label style={lbl}>Remarks:</label>
            <textarea style={{ ...inp, height:100, resize:'vertical' }} value={disorderRemarks} onChange={e=>setDisorderRemarks(e.target.value)} />
          </div>
        </div>
      </div>

      <div style={{ ...section, padding:16, border:'1px solid var(--border)', borderRadius:8, marginBottom:12 }}>
        <div style={sHead}>Communicable Diseases of Public Health Significance (Hansen&apos;s Disease etc.)</div>
        <div style={row2}>
          <div>
            <label style={lbl}>Findings (Communicable Diseases)</label>
            <Sel value={commFinding} onChange={setCommFinding} opts={commOpts} />
            <p style={{ fontSize:11, color:'#666', marginTop:5 }}>Note: Rare to have findings, consult I-693 Civil Surgeons manual. Remarks required for abnormal (Class A/B) findings.</p>
          </div>
          <div>
            <label style={lbl}>Remarks:</label>
            <textarea style={{ ...inp, height:100, resize:'vertical' }} value={commRemarks} onChange={e=>setCommRemarks(e.target.value)} />
          </div>
        </div>
      </div>

      <div style={{ padding:16, border:'1px solid var(--border)', borderRadius:8 }}>
        <div style={sHead}>Substance Abuse &amp; Addiction History</div>
        <div style={row2}>
          <div>
            <label style={lbl}>Findings (According to the Section 202 of the Controlled Substances Act)</label>
            <Sel value={substanceFinding} onChange={setSubstanceFinding} opts={substanceOpts} />
            <p style={{ fontSize:11, color:'#666', marginTop:5 }}>Notes: Remarks required for Class A or B findings. Include therapy, rehabilitation and referrals.</p>
          </div>
          <div>
            <label style={lbl}>Remarks:</label>
            <textarea style={{ ...inp, height:100, resize:'vertical' }} value={substanceRemarks} onChange={e=>setSubstanceRemarks(e.target.value)} />
          </div>
        </div>
      </div>
    </div>
  }

  function VaccinationsSection() {
    const overallOpts = ['Vaccine History Complete (all requirements met or eligible for blanket waivers)','Applicant will request waiver(s) based on his/her convictions','Applicant does not meet immunization requirements']
    const thStyle: React.CSSProperties = { background:'#e8e8e8', fontWeight:700, fontSize:10, textAlign:'center', padding:'4px 6px', border:'1px solid #bbb' }
    const tdStyle: React.CSSProperties = { border:'1px solid #bbb', padding:'3px 4px', fontSize:11, verticalAlign:'middle' }
    const tdinpStyle: React.CSSProperties = { width:'100%', border:'none', background:'transparent', fontSize:11, padding:'1px 2px', outline:'none' }
    const grayCell: React.CSSProperties = { background:'#f0f0f0' }
    return <div>
      <div style={row2}>
        <div>
          <label style={lbl}>Vaccination History</label>
          <div style={{ display:'flex', flexDirection:'column', gap:6, marginBottom:12 }}>
            {overallOpts.map(o => <Chk key={o} checked={vaccOverall.includes(o)} onChange={c => setVaccOverall(p => c ? [...p,o] : p.filter(x=>x!==o))} label={o} />)}
          </div>
        </div>
        <div>
          <label style={lbl}>Remarks (provide comments such as reasons for contraindications and COVID-19 vaccine brand)</label>
          <textarea style={{ ...inp, height:90, resize:'vertical' }} value={vaccRemarks} onChange={e=>setVaccRemarks(e.target.value)} />
        </div>
      </div>

      <div style={{ overflowX:'auto' }}>
        <table style={{ borderCollapse:'collapse', width:'100%', minWidth:900 }}>
          <thead>
            <tr>
              <th rowSpan={2} style={{ ...thStyle, width:120 }}>Vaccine</th>
              <th colSpan={4} style={thStyle}>Vaccine History Transferred from a written record</th>
              <th rowSpan={2} style={{ ...thStyle, width:90 }}>Vaccine Given<br/>Date Given</th>
              <th rowSpan={2} style={{ ...thStyle, width:120 }}>Complete Series<br/>Complete (X), Titer date or VH</th>
              <th colSpan={4} style={thStyle}>Waivers (Age, Contraindication(s), Insufficient Time Interval, Not Flu Season)</th>
            </tr>
            <tr>
              <th style={{ ...thStyle, width:80 }}>Date Received</th>
              <th style={{ ...thStyle, width:80 }}>Date Received</th>
              <th style={{ ...thStyle, width:80 }}>Date Received</th>
              <th style={{ ...thStyle, width:80 }}>Date Received</th>
              <th style={{ ...thStyle, width:40 }}>Age</th>
              <th style={{ ...thStyle, width:40 }}>CI</th>
              <th style={{ ...thStyle, width:40 }}>Time</th>
              <th style={{ ...thStyle, width:55 }}>*See Below</th>
            </tr>
          </thead>
          <tbody>
            {VACC_GROUPS.map(group => {
              const v = vaccData[group.label]
              const bg = group.gray ? '#f0f0f0' : '#fff'
              const cellBg: React.CSSProperties = { background: bg }
              return <tr key={group.label}>
                <td style={{ ...tdStyle, ...cellBg, fontSize:11, whiteSpace:'pre-line', fontWeight:500 }}>
                  {group.vaccines.length > 1
                    ? <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
                        {group.vaccines.map(vax => <label key={vax} style={{ display:'flex', alignItems:'center', gap:4, fontSize:11 }}>
                          <input type="checkbox" style={{ width:12, height:12 }} /> {vax}
                        </label>)}
                      </div>
                    : group.label
                  }
                </td>
                <td style={{ ...tdStyle, ...cellBg }}>
                  <input style={tdinpStyle} value={v.received1} onChange={e=>updateVacc(group.label,'received1',e.target.value)} placeholder="mm/dd/yyyy" />
                </td>
                <td style={{ ...tdStyle, ...grayCell }}>
                  <input style={{ ...tdinpStyle, background:'#f0f0f0' }} value={v.received2} onChange={e=>updateVacc(group.label,'received2',e.target.value)} placeholder="mm/dd/yyyy" />
                </td>
                <td style={{ ...tdStyle, ...cellBg }}>
                  <input style={tdinpStyle} value={v.received3} onChange={e=>updateVacc(group.label,'received3',e.target.value)} placeholder="mm/dd/yyyy" />
                </td>
                <td style={{ ...tdStyle, ...grayCell }}>
                  <input style={{ ...tdinpStyle, background:'#f0f0f0' }} value={v.received4} onChange={e=>updateVacc(group.label,'received4',e.target.value)} placeholder="mm/dd/yyyy" />
                </td>
                <td style={{ ...tdStyle, ...cellBg }}>
                  <input style={tdinpStyle} value={v.given} onChange={e=>updateVacc(group.label,'given',e.target.value)} placeholder="mm/dd/yyyy" />
                </td>
                <td style={{ ...tdStyle, ...grayCell, textAlign:'center' }}>
                  <div style={{ fontSize:10, color:'#2563eb', marginBottom:2 }}>
                    {group.showVaricella ? 'Complete? Varicella History? Titer Date?' : group.showTiter ? 'Complete? Titer Date?' : 'Complete?'}
                  </div>
                  <input style={{ ...tdinpStyle, background:'#f0f0f0', border:'1px solid #ccc', borderRadius:3, padding:'2px 4px' }} value={v.complete} onChange={e=>updateVacc(group.label,'complete',e.target.value)} />
                </td>
                <td style={{ ...tdStyle, ...cellBg, textAlign:'center' }}>
                  <input type="checkbox" checked={v.ageWaiver} onChange={e=>updateVacc(group.label,'ageWaiver',e.target.checked)} style={{ width:14, height:14 }} />
                </td>
                <td style={{ ...tdStyle, ...grayCell, textAlign:'center' }}>
                  <input type="checkbox" checked={v.ciWaiver} onChange={e=>updateVacc(group.label,'ciWaiver',e.target.checked)} style={{ width:14, height:14 }} />
                </td>
                <td style={{ ...tdStyle, ...cellBg, textAlign:'center' }}>
                  <input type="checkbox" checked={v.timeWaiver} onChange={e=>updateVacc(group.label,'timeWaiver',e.target.checked)} style={{ width:14, height:14 }} />
                </td>
                <td style={{ ...tdStyle, background:'#111', textAlign:'center' }}>
                  {group.label === 'Influenza' || group.label === 'COVID-19\n(specify vaccine brand in remarks)'
                    ? <input type="checkbox" checked={v.seeBelow} onChange={e=>updateVacc(group.label,'seeBelow',e.target.checked)} style={{ width:14, height:14, filter:'invert(1)' }} />
                    : null}
                </td>
              </tr>
            })}
          </tbody>
        </table>
      </div>
      <div style={{ fontSize:10, color:'#555', marginTop:8, lineHeight:1.7 }}>
        <div>*For Influenza, check the box in this column only if vaccine is not available in the location where the civil surgeon practices.</div>
        <div>*For COVID-19, check the box in this column only if vaccine is not routinely available in the state where the civil surgeon practices according to the Technical Instructions blanket waivers for this vaccine.</div>
      </div>
    </div>
  }

  function MedTab() {
    return <div>
      <div style={{ display:'flex', gap:0, borderBottom:'2px solid var(--border)', marginBottom:16, flexWrap:'wrap' }}>
        {MED_SUBTABS.map((t,i) => <button key={t} onClick={()=>setMedSub(i)} style={{
          padding:'8px 14px', border:'none', background:'none', cursor:'pointer', fontSize:12.5,
          fontWeight:medSub===i?700:400, color:medSub===i?'#c0392b':'var(--ink3)',
          borderBottom:medSub===i?'2px solid #c0392b':'none', marginBottom:-2, whiteSpace:'nowrap',
        }}>{t}</button>)}
      </div>
      {medSub === 0 && <TBSection />}
      {medSub === 1 && <SyphGonSection />}
      {medSub === 2 && <DisordersSection />}
      {medSub === 3 && <VaccinationsSection />}
      {medSub === 4 && <div>
        <div style={sHead}>Other Class B Conditions</div>
        <p style={{ fontSize:13, color:'var(--ink3)', marginBottom:10 }}>
          List any other Class B conditions, such as hypertension or diabetes, and all required evaluation components as found in HHS&apos;s Technical Instructions for Medical Examinations of Aliens in the United States
        </p>
        <textarea style={{ ...inp, height:200, resize:'vertical' }} value={otherClassB} onChange={e=>setOtherClassB(e.target.value)} />
      </div>}
      {medSub === 5 && <div>
        <div style={sHead}>Part 11: Additional Information</div>
        <p style={{ fontSize:13, color:'var(--ink3)', marginBottom:16 }}>
          If the applicant or the civil surgeon need extra space to provide any additional information within this form use the space below. If more space is needed you may make copies of this page (last page of the I-693) to complete and file with this form or attach a separate sheet of paper. Type or print the applicant&apos;s name and A-Number (if any) at the top of each sheet; indicate the Page Number, Part Number, and Item Number to which your answer refers; and sign and date each sheet.
        </p>
        {addlItems.map((item, idx) => <div key={idx} style={{ marginBottom:20 }}>
          <div style={{ fontWeight:700, fontSize:13, marginBottom:8 }}>Additional Item {idx+1}</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12, marginBottom:8 }}>
            <input style={inp} placeholder="Page Number" value={item.page} onChange={e=>{const a=[...addlItems];a[idx]={...a[idx],page:e.target.value};setAddlItems(a)}} />
            <input style={inp} placeholder="Part Number" value={item.part} onChange={e=>{const a=[...addlItems];a[idx]={...a[idx],part:e.target.value};setAddlItems(a)}} />
            <input style={inp} placeholder="Item Number" value={item.item} onChange={e=>{const a=[...addlItems];a[idx]={...a[idx],item:e.target.value};setAddlItems(a)}} />
          </div>
          <textarea style={{ ...inp, height:100, resize:'vertical' }} value={item.text} onChange={e=>{const a=[...addlItems];a[idx]={...a[idx],text:e.target.value};setAddlItems(a)}} />
        </div>)}
      </div>}
    </div>
  }

  function ResultsTab() {
    const subTabs = ['Summary','Civil Surgeon']
    const findingOpts = ['No Class A/B Conditions','Class B Findings','Class A Findings']
    const preparerOpts = ['Using Preparer','Using Interpreter','Patient was referred to another physician (complex case)']
    function AddrBlock({ prefix, fields }: { prefix: string; fields: { street:string; addrType:string; aptNum:string; city:string; state:string; zip:string; setStreet:(v:string)=>void; setAddrType:(v:string)=>void; setAptNum:(v:string)=>void; setCity:(v:string)=>void; setState:(v:string)=>void; setZip:(v:string)=>void } }) {
      return <div>
        <div style={{ display:'grid', gridTemplateColumns:'2fr auto auto', gap:10, marginBottom:8, alignItems:'end' }}>
          <div><label style={lbl}>Street Number and Name</label><input style={inp} value={fields.street} onChange={e=>fields.setStreet(e.target.value)} placeholder="Street Number and Name" /></div>
          <div>
            <label style={lbl}>Address Type:</label>
            <RadioGroup options={['Apt','Suite','Floor']} value={fields.addrType} onChange={fields.setAddrType} />
          </div>
          <div><label style={lbl}>#</label><input style={inp} value={fields.aptNum} onChange={e=>fields.setAptNum(e.target.value)} placeholder="Apt/Suite/Floor #" /></div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr auto 1fr', gap:10, alignItems:'end' }}>
          <div><label style={lbl}>City</label><input style={inp} value={fields.city} onChange={e=>fields.setCity(e.target.value)} placeholder="City" /></div>
          <div>
            <label style={lbl}>State:</label>
            <Sel value={fields.state} onChange={fields.setState} opts={['', ...US_STATES]} />
          </div>
          <div><label style={lbl}>Zip Code</label><input style={inp} value={fields.zip} onChange={e=>fields.setZip(e.target.value)} placeholder="Zip Code" /></div>
        </div>
      </div>
    }
    return <div>
      <div style={{ display:'flex', gap:0, borderBottom:'2px solid var(--border)', marginBottom:16 }}>
        {subTabs.map((t,i) => <button key={t} onClick={()=>setResultsSub(i)} style={{
          padding:'8px 16px', border:'none', background:'none', cursor:'pointer', fontSize:13,
          fontWeight:resultsSub===i?700:400, color:resultsSub===i?'#c0392b':'var(--ink3)',
          borderBottom:resultsSub===i?'2px solid #c0392b':'none', marginBottom:-2,
        }}>{t}</button>)}
      </div>
      {resultsSub === 0 && <div>
        <div style={{ padding:16, border:'1px solid var(--border)', borderRadius:8 }}>
          <div style={sHead}>Form Setup and Administrative Details</div>
          <div style={{ marginBottom:14 }}>
            <label style={{ fontSize:12, fontWeight:700 }}>Summary of Overall Findings</label>
            <MultiChk options={findingOpts} selected={overallFindings} onChange={setOverallFindings} />
          </div>
          <div style={row4}>
            <div><label style={lbl}>Date of First Exam (mm/dd/yyyy)</label><DateInp value={examDate} onChange={setExamDate} /></div>
            <div><label style={lbl}>1st Followup (mm/dd/yyyy)</label><input style={{ ...inp, background:'#f5f5f5' }} value={followup1} onChange={e=>setFollowup1(e.target.value)} placeholder="mm/dd/yyyy" /></div>
            <div><label style={lbl}>2nd Followup (mm/dd/yyyy)</label><input style={{ ...inp, background:'#f5f5f5' }} value={followup2} onChange={e=>setFollowup2(e.target.value)} placeholder="mm/dd/yyyy" /></div>
            <div><label style={lbl}>3rd Followup (mm/dd/yyyy)</label><input style={{ ...inp, background:'#f5f5f5' }} value={followup3} onChange={e=>setFollowup3(e.target.value)} placeholder="mm/dd/yyyy" /></div>
          </div>
          <div>
            <label style={{ fontSize:12, fontWeight:700 }}>Preparer, Interpreter &amp; Referral</label>
            <MultiChk options={preparerOpts} selected={preparer} onChange={setPreparer} />
          </div>
        </div>
      </div>}
      {resultsSub === 1 && <div>
        <div style={{ padding:16, border:'1px solid var(--border)', borderRadius:8, marginBottom:16 }}>
          <div style={sHead}>Physician</div>
          <Sel value={physician} onChange={setPhysician} opts={['Civil Surgeon','Other Physician']} />
        </div>
        <div style={{ padding:16, border:'1px solid var(--border)', borderRadius:8, marginBottom:16 }}>
          <div style={sHead}>Details</div>
          <div style={row3}>
            <div><label style={lbl}>First Name</label><Inp value={csFirst} onChange={setCsFirst} placeholder="First Name" /></div>
            <div><label style={lbl}>Middle Name</label><Inp value={csMiddle} onChange={setCsMiddle} placeholder="Middle Name" /></div>
            <div><label style={lbl}>Last Name</label><Inp value={csLast} onChange={setCsLast} placeholder="Last Name" /></div>
          </div>
          <div style={row3}>
            <div><label style={lbl}>Day Time Phone</label><Inp value={csDayPhone} onChange={setCsDayPhone} placeholder="Day Time Phone" /></div>
            <div><label style={lbl}>Cell Phone</label><Inp value={csCellPhone} onChange={setCsCellPhone} placeholder="Cell Phone" /></div>
            <div><label style={lbl}>Email Address</label><Inp value={csEmail} onChange={setCsEmail} placeholder="Email Address" /></div>
          </div>
          <div style={row2}>
            <div><label style={lbl}>Organization</label><Inp value={csOrg} onChange={setCsOrg} placeholder="Organization" /></div>
            <div><label style={lbl}>Civil Surgeon ID (CSID)</label><Inp value={csid} onChange={setCsid} placeholder="Civil Surgeon ID (CSID)" /></div>
          </div>
        </div>
        <div style={{ padding:16, border:'1px solid var(--border)', borderRadius:8, marginBottom:16 }}>
          <div style={sHead}>Physical Address</div>
          <AddrBlock prefix="cs" fields={{ street:csStreet, addrType:csAddrType, aptNum:csAptNum, city:csCity, state:csState, zip:csZip, setStreet:setCsStreet, setAddrType:setCsAddrType, setAptNum:setCsAptNum, setCity:setCsCity, setState:setCsState, setZip:setCsZip }} />
        </div>
        <div style={{ padding:16, border:'1px solid var(--border)', borderRadius:8 }}>
          <div style={sHead}>Mailing Address</div>
          <AddrBlock prefix="csm" fields={{ street:csMailStreet, addrType:csMailAddrType, aptNum:csMailAptNum, city:csMailCity, state:csMailState, zip:csMailZip, setStreet:setCsMailStreet, setAddrType:setCsMailAddrType, setAptNum:setCsMailAptNum, setCity:setCsMailCity, setState:setCsMailState, setZip:setCsMailZip }} />
        </div>
      </div>}
    </div>
  }

  function PreviewTab() {
    return <div style={{ background:'#e5e7eb', padding:24, minHeight:400, display:'flex', justifyContent:'center' }}>
      <div style={{ background:'#fff', maxWidth:760, width:'100%', padding:'1in 0.75in', boxShadow:'0 2px 8px rgba(0,0,0,.15)', fontFamily:'Arial,sans-serif', fontSize:11 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', borderBottom:'3px solid #000', paddingBottom:8, marginBottom:12 }}>
          <div>
            <div style={{ fontWeight:700, fontSize:14 }}>Report of Immigration Medical Examination</div>
            <div style={{ fontWeight:700, fontSize:14 }}>and Vaccination Record</div>
            <div style={{ fontSize:10, marginTop:3 }}>Department of Homeland Security</div>
            <div style={{ fontSize:10 }}>U.S. Citizenship and Immigration Services</div>
          </div>
          <div style={{ textAlign:'right', fontSize:10 }}>
            <div style={{ fontWeight:700 }}>USCIS</div>
            <div>Form I-693</div>
            <div>OMB No. 1615-0033</div>
            <div>Expires 09/30/2027</div>
          </div>
        </div>
        <div style={{ background:'#000', color:'#fff', padding:'4px 8px', marginBottom:10, fontSize:11, fontWeight:700 }}>
          ▶ START HERE - Type or print in black ink.
        </div>
        <div style={{ border:'2px solid #000', padding:'6px 10px', marginBottom:10 }}>
          <strong>Part 1. Information About You</strong> (To be completed by the person requesting a medical examination, <strong>NOT</strong> the civil surgeon.)
        </div>
        <div style={{ marginBottom:6, fontWeight:700 }}>1. Your Full Legal Name (Do not provide a nickname)</div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8, marginBottom:10 }}>
          {[['Family Name (Last Name)', lastName],['Given Name (First Name)', firstName],['Middle Name (if applicable)', middleName]].map(([l,v]) => <div key={l} style={{ border:'1px solid #888', padding:'3px 6px' }}>
            <div style={{ fontSize:8, color:'#555' }}>{l}</div>
            <div style={{ fontSize:12, fontWeight:600, minHeight:18 }}>{v}</div>
          </div>)}
        </div>
        <div style={{ color:'#555', fontSize:10, textAlign:'center', marginTop:20 }}>
          [Full form preview — save the exam to generate the complete I-693]
        </div>
      </div>
    </div>
  }

  function FinalizeTab() {
    return <div style={{ textAlign:'center', padding:40 }}>
      <div style={{ fontSize:18, fontWeight:700, marginBottom:12 }}>Finalize &amp; Print</div>
      <p style={{ fontSize:13, color:'var(--ink3)', maxWidth:500, margin:'0 auto 20px' }}>
        Save the exam first, then use the Print I-693 button on the exam detail page to generate the official sealed form.
      </p>
      <button style={{ background:'#1a3a1a', color:'#fff', border:'none', padding:'10px 24px', borderRadius:6, fontSize:13, fontWeight:700, cursor:'pointer' }}>
        Save &amp; Go to Exam
      </button>
    </div>
  }

  return (
    <Shell
      companySlug={companySlug} companyName="WorkOccMed Medical Group"
      role="PRACTITIONER" pageTitle="New I-693"
      nrcmeExpiry="12/14/2026"
      pageActions={
        <div style={{ display:'flex', gap:8 }}>
          <button style={{ background:'#1a73e8', color:'#fff', border:'none', padding:'7px 18px', borderRadius:6, fontSize:13, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', gap:6 }}>
            💾 Save
          </button>
          <button style={{ background:'#1a73e8', color:'#fff', border:'1px solid rgba(255,255,255,.3)', padding:'7px 14px', borderRadius:6, fontSize:13, fontWeight:700, cursor:'pointer' }}>
            ⊕ More Options ▾
          </button>
        </div>
      }
    >
      {/* Tab bar */}
      <div style={{ display:'flex', gap:0, borderBottom:'2px solid var(--border)', marginBottom:20, overflowX:'auto' }}>
        {TOP_TABS.map((t,i) => {
          const icons = ['👤','🏥','🔬','📊','📄','🖨️']
          const active = tab === i
          return <button key={t} onClick={()=>setTab(i)} style={{
            padding:'9px 16px', border:'none', background:'none', cursor:'pointer',
            fontSize:12.5, fontWeight:active?700:400,
            color:active?'#1a73e8':'var(--ink3)',
            borderBottom:active?'2px solid #1a73e8':'none', marginBottom:-2,
            display:'flex', alignItems:'center', gap:6, whiteSpace:'nowrap',
          }}>
            <span style={{ fontSize:13 }}>{icons[i]}</span>
            {t}
          </button>
        })}
      </div>

      {/* Tab content */}
      <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:10, padding:20 }}>
        {tab === 0 && <PatientTab />}
        {tab === 1 && <AdminTab />}
        {tab === 2 && <MedTab />}
        {tab === 3 && <ResultsTab />}
        {tab === 4 && <PreviewTab />}
        {tab === 5 && <FinalizeTab />}
      </div>
    </Shell>
  )
}
