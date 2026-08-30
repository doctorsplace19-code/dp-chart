'use client'

import { useState, useRef, useEffect } from 'react'

type Lang = 'English' | 'Spanish'

const T = {
  driver:           { English: 'Driver',           Spanish: 'Conductor' },
  idVerifiedBy:     { English: 'Driver ID Verified By', Spanish: 'Identificación del Controlador Verificada por' },
  updateVerifiedBy: { English: 'Update Driver ID Verified By', Spanish: 'Actualizar ID verificado por' },
  firstName:  { English: "Driver's First Name",  Spanish: 'Nombre del conductor' },
  middleName: { English: "Driver's Middle Name", Spanish: 'Segundo nombre del conductor' },
  lastName:   { English: "Driver's Last Name",   Spanish: 'Apellido del conductor' },
  suffix:     { English: 'Suffix',               Spanish: 'Sufijo' },
  dob:        { English: 'Date Of Birth',        Spanish: 'Fecha de nacimiento' },
  gender:     { English: 'Gender',               Spanish: 'Género(Sexo)' },
  email:      { English: 'Email',                Spanish: 'Email' },
  address1:   { English: 'Address 1',            Spanish: 'Dirección 1' },
  city:       { English: 'City',                 Spanish: 'Ciudad' },
  stateProv:  { English: 'State/Province',       Spanish: 'Estado/Provincia' },
  zipCode:    { English: 'Zip Code',             Spanish: 'Código Postal' },
  primaryPhone:  { English: 'Primary Phone',      Spanish: 'Teléfono principal' },
  copyToCell:    { English: 'Copy To Cell Phone', Spanish: 'Copiar a teléfono celular' },
  cellPhone:     { English: 'Cell Phone',         Spanish: 'Teléfono móvil' },
  copyToPrimary: { English: 'Copy To Primary',    Spanish: 'Copiar a principal' },
  dlNumber:      { English: 'Drivers License Number', Spanish: 'Número de Licencia' },
  issuingCountry:{ English: 'Issuing Country',    Spanish: 'País emisor' },
  issuingState:  { English: 'Issuing State/Province', Spanish: 'Estado/Provincia Emisora' },
  certDenied:    { English: 'USDOT/FMCSA Med Cert ever been denied or issued for less than 2 years?', Spanish: 'USDOT / FMCSA Med Cert alguna vez ha sido negado o emitido por menos de 2 años?' },
  yes:     { English: 'Yes',      Spanish: 'Sí' },
  no:      { English: 'No',       Spanish: 'No' },
  notSure: { English: 'Not Sure', Spanish: 'No estoy seguro' },
  clpCdl:      { English: 'CLP/CDL Applicant/Holder', Spanish: 'CLP / CDL Solicitante / Titular' },
  cdlHolder:   { English: 'I am a CDL or CLP Holder',    Spanish: 'Soy titular de una licencia CDL o CLP' },
  cdlApplicant:{ English: 'I am a CDL or CLP Applicant', Spanish: 'Soy solicitante de CDL o CLP' },
  cdlNone:     { English: 'None of the above',            Spanish: 'Ninguno de los anteriores' },
  notifPref:   { English: 'How would you like to receive notifications and reminders?', Spanish: '¿Cómo le gustaría recibir notificaciones y recordatorios?' },
  healthHistory:   { English: 'Driver Health History', Spanish: 'Historial de salud' },
  lockedMsg:       { English: 'Driver responses locked. CME can edit and comment on Review Tab.', Spanish: 'Respuestas del conductor bloqueadas. CME puede editar en la pestaña Revisión.' },
  surgery:         { English: 'Have you ever had surgery? If "yes," please list and explain below.', Spanish: '¿Alguna vez ha tenido cirugía? Si "si", explique a continuación.' },
  surgeryComments: { English: 'Enter Surgery Comments ...', Spanish: 'Introducir los comentarios de la cirugia ...' },
  medications:     { English: 'Are you currently taking medications (prescription, over-the-counter, herbal remedies, diet supplements)? If "yes", please describe below.', Spanish: '¿Actualmente esta tomando medicamentos? Si "si" explique.' },
  haveEverHad:     { English: 'Do you have or have you ever had:', Spanish: 'Tiene o ha tenido alguna vez:' },
  otherCond:       { English: 'Other health condition(s) not described above:', Spanish: 'Otros problemas de salud no descritos anteriormente:' },
  summaryQuestion: { English: 'Did you answer "yes" to any of questions 1-32? If so, please comment further on those health conditions below.', Spanish: '¿Si usted Respondió "si" a alguna de las preguntas 1-32? Si es así, comente más adelante.' },
  signature:    { English: 'Signature', Spanish: 'Firma' },
  signatureCert:{ English: 'I certify that the above information is accurate and complete. I understand that inaccurate, false or missing information may invalidate the examination and my Medical Examiner\'s Certificate, that submission of fraudulent or intentionally false information is a violation of 49 CFR 390.35, and that submission of fraudulent or intentionally false information may subject me to civil or criminal penalties under 49 CFR 390.37 and 49 CFR 386 Appendices A and B.', Spanish: 'Yo certifico que la información proporcionada arriba es verdadera y correcta. Yo entiendo que la información incorrecta, falsa o insuficiente puede invalidar el examen y mi certificación otorgada por el Examinador Médico.' },
  date:         { English: 'Date:',     Spanish: 'Fecha:' },
  employee:     { English: 'Employee:', Spanish: 'Empleado:' },
  currentSig:   { English: 'Current Signature:', Spanish: 'Firma actual:' },
  reSign:       { English: 'Re-Sign:',  Spanish: 'Volver a firmar:' },
  missingIdVerified:{ English: 'Missing Driver ID Verified By field.', Spanish: 'Falta el campo de identificación del controlador verificada por.' },
}
const t = (key: keyof typeof T, lang: Lang) => T[key][lang]

const CONDITIONS: { English: string; Spanish: string }[] = [
  { English: 'Head/brain injuries or illnesses (e.g., concussion)',                            Spanish: 'Lesiones o enfermedades cerebrales (por ejemplo, conmoción cerebral)' },
  { English: 'Seizures, epilepsy',                                                             Spanish: 'Convulsiones, epilepsia' },
  { English: 'Eye problems (except glasses or contacts)',                                       Spanish: 'Problemas oculares (excepto gafas o contactos)' },
  { English: 'Ear and/or hearing problems',                                                    Spanish: 'Problemas auditivos' },
  { English: 'Heart disease, heart attack, bypass, or other heart problems',                   Spanish: 'Enfermedad cardíaca, ataque al corazón, bypass u otros problemas cardíacos' },
  { English: 'Pacemaker, stents, implantable devices, or other heart procedures',              Spanish: 'Marcapasos, stents, dispositivos implantables u otros procedimientos cardíacos' },
  { English: 'High blood pressure',                                                            Spanish: 'Presión arterial alta' },
  { English: 'High cholesterol',                                                               Spanish: 'Colesterol alto' },
  { English: 'Chronic (long-term) cough, shortness of breath, or other breathing problems',   Spanish: 'Tos crónica, dificultad para respirar u otros problemas respiratorios' },
  { English: 'Lung disease (e.g., asthma)',                                                    Spanish: 'Enfermedad pulmonar (p. ej., asma)' },
  { English: 'Kidney problems, kidney stones, or pain/problems with urination',               Spanish: 'Problemas renales, cálculos renales o problemas con la micción' },
  { English: 'Stomach, liver, or digestive problems',                                          Spanish: 'Problemas de estómago, hígado o digestivos' },
  { English: 'Diabetes or blood sugar problems',                                               Spanish: 'Diabetes o problemas de azúcar en sangre' },
  { English: 'Anxiety, depression, nervousness, other mental health problems',                 Spanish: 'Ansiedad, depresión, nerviosismo, otros problemas de salud mental' },
  { English: 'Fainting or passing out',                                                        Spanish: 'Desmayos o pérdida de conocimiento' },
  { English: 'Dizziness, headaches, numbness, tingling, or memory loss',                      Spanish: 'Mareos, dolores de cabeza, entumecimiento, hormigueo o pérdida de memoria' },
  { English: 'Unexplained weight loss',                                                        Spanish: 'Pérdida de peso inexplicable' },
  { English: 'Stroke, mini-stroke (TIA), paralysis, or weakness',                             Spanish: 'Accidente cerebrovascular, mini-derrame (AIT), parálisis o debilidad' },
  { English: 'Missing or limited use of arm, hand, finger, leg, foot, toe',                   Spanish: 'Uso limitado o ausente de brazo, mano, dedo, pierna, pie, dedo del pie' },
  { English: 'Neck or back problems',                                                          Spanish: 'Problemas de cuello o espalda' },
  { English: 'Bone, muscle, joint, or nerve problems',                                         Spanish: 'Problemas de huesos, músculos, articulaciones o nervios' },
  { English: 'Blood clots or bleeding problems',                                               Spanish: 'Coágulos de sangre o problemas de sangrado' },
  { English: 'Cancer',                                                                         Spanish: 'Cáncer' },
  { English: 'Chronic (long-term) infection or other chronic diseases',                        Spanish: 'Infección crónica u otras enfermedades crónicas' },
  { English: 'Sleep disorders, pauses in breathing while asleep, daytime sleepiness, loud snoring', Spanish: 'Trastornos del sueño, pausas en la respiración, somnolencia diurna, ronquidos fuertes' },
  { English: 'Have you ever had a sleep test (e.g., sleep apnea)?',                           Spanish: '¿Alguna vez ha tenido una prueba de sueño (por ejemplo, apnea del sueño)?' },
  { English: 'Have you ever spent a night in the hospital?',                                   Spanish: '¿Ha pasado alguna vez una noche en el hospital?' },
  { English: 'Have you ever had a broken bone?',                                               Spanish: '¿Alguna vez ha tenido un hueso roto?' },
  { English: 'Have you ever used or do you now use tobacco?',                                  Spanish: '¿Alguna vez usó o usa tabaco?' },
  { English: 'Do you currently drink alcohol?',                                                Spanish: '¿Actualmente bebe alcohol?' },
  { English: 'Have you used an illegal substance within the past two years?',                  Spanish: '¿Ha utilizado una sustancia ilegal en los últimos dos años?' },
  { English: 'Have you ever failed a drug test or been dependent on an illegal substance?',    Spanish: '¿Alguna vez ha fallado en una prueba de drogas o ha sido dependiente de una sustancia ilegal?' },
]

const SNELLEN = ['20','25','30','40','50','70','100','200','400']
const SP_GR_OPTS = ['','1.001','1.003','1.005','1.010','1.015','1.020','1.025','1.030']
const UA_OPTS    = ['','Neg','Trace','1+','2+','3+']
const HEARING_FT = ['','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16']
const AUDIO_DB   = ['','0','5','10','15','20','25','30','35','40','45','50','55','60','65','70','75','80','85','90','95','100']
const BODY_SYSTEMS = ['General','Skin','Eyes','Ears','Mouth/throat','Cardiovascular','Lungs/chest','Abdomen','Genito-urinary system','Back/spine','Extremities/joints','Neurological system','Gait','Vascular system']
const TABS = ['Driver','Health','Review','Vision','Hearing','Vitals','Sleep','Urine/Testing','Physical','Determination','Submit','Summary','Documents','Memo']
const US_STATES = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY','DC']
const FREQ_COMMENTS = ['-- Select a Frequent Medical Comment --','Hypertension well-controlled on medication','Blood pressure meets 49 CFR 391.41 criteria','Diabetes controlled by oral agents only','No evidence of end-organ damage','Referred for sleep study','OSA treated with CPAP — compliance documented']

const inp: React.CSSProperties = { width:'100%', padding:'7px 10px', border:'1px solid #d1d5db', borderRadius:4, fontSize:13, color:'#111', background:'#fff', boxSizing:'border-box', fontFamily:'inherit' }
const sel: React.CSSProperties = { ...inp, cursor:'pointer' }

function Field({ label, required, children, flex=1 }: { label?: React.ReactNode; required?: boolean; children: React.ReactNode; flex?: number }) {
  return (
    <div style={{ flex, minWidth:0 }}>
      {label && <label style={{ display:'block', fontSize:12, fontWeight:600, color:'#374151', marginBottom:4 }}>{label}{required && <span style={{ color:'#dc2626', marginLeft:2 }}>*</span>}</label>}
      {children}
    </div>
  )
}
function Row({ children, gap=8, mb=14 }: { children: React.ReactNode; gap?: number; mb?: number }) {
  return <div style={{ display:'flex', flexWrap:'wrap' as const, gap, marginBottom:mb }}>{children}</div>
}
function SectionTitle({ children }: { children: React.ReactNode }) {
  return <div style={{ fontWeight:700, fontSize:14, borderBottom:'1px solid #e5e7eb', paddingBottom:8, marginBottom:14 }}>{children}</div>
}
function SectionBox({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ border:'1px solid #e5e7eb', borderRadius:6, marginBottom:16, overflow:'hidden' }}>
      <div style={{ background:'#f9fafb', borderBottom:'1px solid #e5e7eb', padding:'8px 14px', fontWeight:700, fontSize:13 }}>{title}</div>
      <div style={{ padding:'14px' }}>{children}</div>
    </div>
  )
}

function YNS({ name, value, onChange, lang }: { name:string; value:string; onChange:(v:string)=>void; lang:Lang }) {
  const vals = ['Yes','No','Not Sure']
  const labels = [t('yes',lang), t('no',lang), t('notSure',lang)]
  return (
    <div style={{ display:'flex', gap:10, flexShrink:0, alignItems:'center' }}>
      {labels.map((lbl,i) => (
        <label key={vals[i]} style={{ display:'flex', alignItems:'center', gap:4, fontSize:12.5, cursor:'pointer', whiteSpace:'nowrap' as const,
          color: value===vals[i]?'#1d4ed8':'#6b7280', fontWeight: value===vals[i]?700:400 }}>
          <input type="radio" name={name} value={vals[i]} checked={value===vals[i]} onChange={()=>onChange(vals[i])} style={{ width:13, height:13, accentColor:'#374151' }} />
          {lbl}
        </label>
      ))}
    </div>
  )
}

function InlineYN({ name, value, onChange }: { name:string; value:string; onChange:(v:string)=>void }) {
  return (
    <div style={{ display:'flex', gap:12, alignItems:'center' }}>
      {['Yes','No'].map(v=>(
        <label key={v} style={{ display:'flex', alignItems:'center', gap:4, fontSize:12.5, cursor:'pointer',
          color: value===v?'#1d4ed8':'#6b7280', fontWeight: value===v?700:400 }}>
          <input type="radio" name={name} value={v} checked={value===v} onChange={()=>onChange(v)} style={{ width:13, height:13, accentColor:'#374151' }} />
          {v}
        </label>
      ))}
    </div>
  )
}

function FreqCommentBox({ value, onChange, placeholder='Enter Comments ...' }: { value:string; onChange:(v:string)=>void; placeholder?:string }) {
  const [freq, setFreq] = useState('')
  return (
    <div>
      <div style={{ display:'flex', gap:6, marginBottom:8 }}>
        <select style={{ ...sel, flex:1 }} value={freq} onChange={e=>setFreq(e.target.value)}>
          {FREQ_COMMENTS.map(c=><option key={c}>{c}</option>)}
        </select>
        <button type="button" onClick={()=>{ if (freq&&freq!==FREQ_COMMENTS[0]) { onChange((value?value+'\n':'')+freq); setFreq('') } }}
          style={{ background:'#16a34a', color:'#fff', border:'none', borderRadius:4, padding:'6px 14px', fontSize:12, fontWeight:700, cursor:'pointer', whiteSpace:'nowrap' as const }}>
          + Insert
        </button>
      </div>
      <textarea rows={4} style={{ ...inp, resize:'vertical', fontFamily:'inherit' } as React.CSSProperties}
        placeholder={placeholder} value={value} onChange={e=>onChange(e.target.value)} />
    </div>
  )
}

function SignaturePad() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const drawing = useRef(false)
  const [signed, setSigned] = useState(false)
  useEffect(()=>{ const c=canvasRef.current; if(!c)return; const ctx=c.getContext('2d')!; ctx.strokeStyle='#000'; ctx.lineWidth=1.5; ctx.lineCap='round'; ctx.lineJoin='round' },[])
  const pos=(e:React.MouseEvent|React.TouchEvent,c:HTMLCanvasElement)=>{ const r=c.getBoundingClientRect(); const sx=c.width/r.width; const sy=c.height/r.height; const src='touches' in e?e.touches[0]:e; return {x:(src.clientX-r.left)*sx,y:(src.clientY-r.top)*sy} }
  const start=(e:React.MouseEvent|React.TouchEvent)=>{ e.preventDefault(); const c=canvasRef.current!; const p=pos(e,c); drawing.current=true; c.getContext('2d')!.beginPath(); c.getContext('2d')!.moveTo(p.x,p.y) }
  const move=(e:React.MouseEvent|React.TouchEvent)=>{ if(!drawing.current)return; e.preventDefault(); const c=canvasRef.current!; const p=pos(e,c); const ctx=c.getContext('2d')!; ctx.lineTo(p.x,p.y); ctx.stroke(); setSigned(true) }
  const end=()=>{ drawing.current=false }
  const clear=()=>{ const c=canvasRef.current!; c.getContext('2d')!.clearRect(0,0,c.width,c.height); setSigned(false) }
  return (
    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
      <canvas ref={canvasRef} width={400} height={80}
        onMouseDown={start} onMouseMove={move} onMouseUp={end} onMouseLeave={end}
        onTouchStart={start} onTouchMove={move} onTouchEnd={end}
        style={{ border:'1px solid #d1d5db', display:'block', cursor:'crosshair', touchAction:'none', width:260, height:56, background:'#fff' }} />
      {signed ? <button type="button" onClick={clear} style={{ fontSize:11, color:'#dc2626', background:'none', border:'none', cursor:'pointer', fontWeight:600, padding:0 }}>Clear</button>
               : <span style={{ fontSize:10, color:'#9ca3af' }}>Sign above</span>}
    </div>
  )
}

export default function ExamForm({ companySlug }: { companySlug: string }) {
  const certFrameRef = useRef<HTMLIFrameElement>(null)
  const [tab, setTab]   = useState('Driver')
  const [lang, setLang] = useState<Lang>('English')
  const [warningDismissed, setWarningDismissed] = useState(false)

  /* Driver */
  const [firstName, setFirstName]     = useState('')
  const [middleName, setMiddleName]   = useState('')
  const [lastName, setLastName]       = useState('')
  const [suffix, setSuffix]           = useState('')
  const [dob, setDob]                 = useState('')
  const [gender, setGender]           = useState('')
  const [email, setEmail]             = useState('')
  const [address1, setAddress1]       = useState('')
  const [city, setCity]               = useState('')
  const [stateProv, setStateProv]     = useState('')
  const [zip, setZip]                 = useState('')
  const [primaryPhone, setPrimaryPhone] = useState('')
  const [cellPhone, setCellPhone]     = useState('')
  const [dlNumber, setDlNumber]       = useState('')
  const [dlCountry, setDlCountry]     = useState('United States')
  const [dlState, setDlState]         = useState('')
  const [idVerifiedBy, setIdVerifiedBy] = useState('')
  const [certDenied, setCertDenied]   = useState('No')
  const [cdlStatus, setCdlStatus]     = useState('')
  const [notifPref, setNotifPref]     = useState('')

  /* Health */
  const [surgery, setSurgery]                   = useState('No')
  const [surgeryComments, setSurgeryComments]   = useState('')
  const [medAnswer, setMedAnswer]               = useState('No')
  const [medications, setMedications]           = useState('')
  const [condAnswers, setCondAnswers] = useState<Record<number,string>>(Object.fromEntries(Array.from({length:32},(_,i)=>[i,'No'])))
  const [otherCondAnswer, setOtherCondAnswer]   = useState('No')
  const [otherCondComments, setOtherCondComments] = useState('')
  const [summaryAnswer, setSummaryAnswer]       = useState('No')
  const [summaryComments, setSummaryComments]   = useState('')
  const [reSign, setReSign]                     = useState(false)

  /* Review */
  const [reviewComments, setReviewComments] = useState('')

  /* Vision */
  const [odUnCorr, setOdUnCorr] = useState(''); const [osUnCorr, setOsUnCorr] = useState(''); const [ouUnCorr, setOuUnCorr] = useState('')
  const [odCorr,   setOdCorr]   = useState(''); const [osCorr,   setOsCorr]   = useState(''); const [ouCorr,   setOuCorr]   = useState('')
  const [fieldRight, setFieldRight] = useState(''); const [fieldLeft, setFieldLeft] = useState('')
  const [colorVision, setColorVision] = useState(''); const [monocular, setMonocular] = useState('')
  const [referredOphth, setReferredOphth] = useState(''); const [receivedDocs, setReceivedDocs] = useState('')

  /* Hearing */
  const [hearingTest, setHearingTest] = useState<'whisper'|'audio'>('whisper')
  const [hearAidRight, setHearAidRight] = useState(false); const [hearAidLeft, setHearAidLeft] = useState(false); const [hearAidNeither, setHearAidNeither] = useState(false)
  const [whisperRight, setWhisperRight] = useState(''); const [whisperLeft, setWhisperLeft] = useState('')
  const [audioR500, setAudioR500] = useState(''); const [audioR1k, setAudioR1k] = useState(''); const [audioR2k, setAudioR2k] = useState('')
  const [audioL500, setAudioL500] = useState(''); const [audioL1k, setAudioL1k] = useState(''); const [audioL2k, setAudioL2k] = useState('')
  const audioAvg=(a:string,b:string,c:string)=>{ const n=[a,b,c].map(Number).filter(x=>!isNaN(x)&&x>0); return n.length===3?(n.reduce((s,v)=>s+v,0)/3).toFixed(1):'' }

  /* Vitals */
  const [htIn, setHtIn]       = useState(''); const [weight, setWeight] = useState('')
  const [neckSize, setNeckSize] = useState(''); const [smoker, setSmoker] = useState(false)
  const [bp1s, setBp1s] = useState(''); const [bp1d, setBp1d] = useState('')
  const [bp2s, setBp2s] = useState(''); const [bp2d, setBp2d] = useState('')
  const [pulse, setPulse] = useState(''); const [pulseRegular, setPulseRegular] = useState('')
  const bmi = htIn&&weight ? (703*Number(weight)/(Number(htIn)**2)).toFixed(1) : ''

  /* Sleep */
  const [stopBang, setStopBang] = useState<Record<number,string>>(Object.fromEntries(Array.from({length:8},(_,i)=>[i,''])))
  const stopScore = Object.values(stopBang).filter(v=>v==='Yes').length
  const stopRisk = stopScore<=2?'Low risk of OSA':stopScore<=4?`Intermediate risk of OSA [3-4]`:'High risk of OSA [5-8]'

  /* Urine */
  const [spGr, setSpGr] = useState(''); const [protein, setProtein] = useState(''); const [blood, setBlood] = useState(''); const [sugar, setSugar] = useState('')
  const [ccfNum, setCcfNum] = useState(''); const [a1c, setA1c] = useState(''); const [glucose, setGlucose] = useState(''); const [spirometry, setSpirom] = useState('')
  const [otherTests, setOtherTests] = useState('')

  /* Physical */
  const [systems, setSystems] = useState<Record<string,string>>({})
  const [physComments, setPhysComments] = useState('')

  /* Determination */
  const [examDateRaw, setExamDateRaw]   = useState(()=>new Date().toISOString().slice(0,10))
  const [detType, setDetType]           = useState<'Federal'|'State'>('Federal')
  const [determination, setDetermination] = useState('')
  const [detReasons, setDetReasons]     = useState<Record<string,string>>({})
  const [monitorPeriod, setMonitorPeriod] = useState('')
  const [detRestrictions, setDetRestrictions] = useState<Record<string,boolean>>({})
  const [waiverType, setWaiverType]     = useState('')

  /* Submit */
  const [examinerPhone, setExaminerPhone] = useState('(201) 734-5853')
  const [examinerLicense, setExaminerLicense] = useState('NJ - 25MA07511100')

  /* Memo */
  const [memo, setMemo] = useState('')

  /* Documents tab PDF state */
  const [docUrls, setDocUrls] = useState<{ url5875: string; url5876: string } | null>(null)

  /* Save state */
  const [savedExamId, setSavedExamId] = useState<string | null>(null)
  const [saving, setSaving]           = useState(false)
  const [saveMsg, setSaveMsg]         = useState<{ ok: boolean; text: string } | null>(null)

  const driverName = [firstName,middleName,lastName].filter(Boolean).join(' ')
  const age = dob ? Math.floor((Date.now()-new Date(dob+'T00:00:00').getTime())/(365.25*24*3600000)) : null
  const dobDisplay = dob ? dob.replace(/(\d{4})-(\d{2})-(\d{2})/,'$2/$3/$1') : ''
  const tabIdx = TABS.indexOf(tab)
  const showWarning = !idVerifiedBy && !warningDismissed
  const allNormal = BODY_SYSTEMS.every(s=>systems[s]==='Normal')

  const yesAnswers = CONDITIONS.filter((_,i)=>condAnswers[i]==='Yes')
  const keyNoIdxs = [1,4,12,18,24,28,30]

  const p = { padding:'20px 24px' }

  function getExpiryDate() {
    if (!examDateRaw) return ''
    const d = new Date(examDateRaw + 'T00:00:00')
    if (monitorPeriod === '3 months') d.setMonth(d.getMonth() + 3)
    else if (monitorPeriod === '6 months') d.setMonth(d.getMonth() + 6)
    else if (monitorPeriod === '1 Year') d.setFullYear(d.getFullYear() + 1)
    else d.setFullYear(d.getFullYear() + 2)
    return d.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })
  }

  function buildPdfParams() {
    const examDate = examDateRaw
      ? new Date(examDateRaw + 'T00:00:00').toLocaleDateString('en-US', { month:'2-digit', day:'2-digit', year:'numeric' })
      : ''
    const expiryDate = getExpiryDate()
    const dobFmt = dob ? dob.replace(/(\d{4})-(\d{2})-(\d{2})/, '$2/$3/$1') : ''
    const sysMap: Record<string, string> = {
      'General':'general','Skin':'skin','Eyes':'eyes','Ears':'ears','Mouth/throat':'mouth',
      'Cardiovascular':'cardio','Lungs/chest':'lungs','Abdomen':'abdomen',
      'Genito-urinary system':'genito','Back/spine':'spine','Extremities/joints':'joints',
      'Neurological system':'neuro','Gait':'gait','Vascular system':'vascular',
    }
    const licState = examinerLicense.includes('-') ? examinerLicense.split('-')[0].trim() : 'NJ'
    const driverSigB64 = (signed && canvasRef.current) ? canvasRef.current.toDataURL('image/png') : ''

    const params: Record<string, string> = {
      firstName, middleName, lastName,
      dob: dobFmt, age: age ? String(age) : '',
      address: address1, city, state: stateProv, zip, phone: primaryPhone,
      dlNumber, dlState, isCDL: cdlStatus === 'CDL' ? '1' : '0',
      idVerifiedBy, examDate, expiryDate,
      detType,
      examinerName: 'Chantal Simpson-Gabriel',
      examinerPhone, examinerState: 'NJ',
      licState, licenseNumber: examinerLicense, nrcme: '7657080894',
      credential: 'MD',
      restLenses:    detRestrictions['lenses']    ? '1' : '0',
      restHearing:   detRestrictions['hearingAid'] ? '1' : '0',
      restWaiver:    detRestrictions['waiver']    ? '1' : '0',
      restSPE:       detRestrictions['spe']       ? '1' : '0',
      restIntracity: detRestrictions['intracity'] ? '1' : '0',
      waiverDesc: waiverType,
      // Health
      surgery, surgeryDesc: surgeryComments,
      medicine: medAnswer, medicineDesc: medications,
      condOther: otherCondAnswer, condOtherDesc: otherCondComments,
      condSummary: summaryAnswer, condSummaryDesc: summaryComments,
      reviewComment: reviewComments,
      // Vitals
      height: htIn, weight,
      pulse, pulseReg: pulseRegular || 'Regular',
      bp1s, bp1d, bp2s, bp2d,
      spGr, protein, blood, sugar, otherTests, physComments,
      // Vision
      odUnCorr, osUnCorr, ouUnCorr, odCorr, osCorr, ouCorr,
      fieldRight, fieldLeft,
      colorVision: colorVision || 'No', monocular: monocular || 'No',
      referred: referredOphth || 'No', docs: receivedDocs || 'No',
      // Hearing
      hearAidRight: hearAidRight ? '1' : '0',
      hearAidLeft:  hearAidLeft  ? '1' : '0',
      hearAidNeither: hearAidNeither ? '1' : '0',
      whisperRight, whisperLeft,
      audioR500, audioL500, audioR1k, audioL1k, audioR2k, audioL2k,
      // Signatures
      driverSignatureB64: driverSigB64,
    }
    // Conditions
    for (let i = 0; i < 32; i++) params[`cond${i + 1}`] = condAnswers[i] || 'No'
    // Systems
    for (const [sysName, sysKey] of Object.entries(sysMap)) {
      params[`sys_${sysKey}`] = systems[sysName] || 'Normal'
    }
    return params
  }

  async function saveExam() {
    if (!firstName || !lastName || !dob) {
      setSaveMsg({ ok: false, text: 'Driver first name, last name, and date of birth are required to save.' })
      return
    }
    setSaving(true)
    setSaveMsg(null)
    try {
      const res = await fetch('/api/exams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companySlug,
          examId: savedExamId,
          firstName, middleName, lastName, dob,
          gender, email, phone: primaryPhone,
          address1, city, state: stateProv, zip,
          dlNumber, dlState, cdlStatus,
          height: htIn, weight, bp1s, bp1d, pulse,
          spGr, protein, blood, sugar,
          odUnCorr, osUnCorr, ouUnCorr, odCorr, osCorr, ouCorr,
          colorVision, hearAidRight, hearAidLeft,
          whisperRight, whisperLeft,
          condAnswers, medications, surgery, surgeryDesc: surgeryComments,
          determination, examDateRaw,
          physComments, memo,
        }),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) {
        setSaveMsg({ ok: false, text: data.error ?? 'Save failed.' })
      } else {
        setSavedExamId(data.examId)
        setSaveMsg({ ok: true, text: `Saved — EXID ${data.examId.slice(0, 8).toUpperCase()}` })
        setTimeout(() => setSaveMsg(null), 4000)
      }
    } catch {
      setSaveMsg({ ok: false, text: 'Network error — please try again.' })
    }
    setSaving(false)
  }

  async function openPdf(endpoint: string) {
    const params = buildPdfParams()
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    })
    if (!res.ok) { const err = await res.text(); alert('PDF error: ' + err); return }
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    window.open(url, '_blank')
    setTimeout(() => URL.revokeObjectURL(url), 60000)
  }

  function printLongForm() {
    const w = window.open('', '_blank', 'width=900,height=700')
    if (!w) return
    const examDate = examDateRaw ? new Date(examDateRaw + 'T00:00:00').toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }) : ''
    const expiry = getExpiryDate()
    const restrictionsList = [
      detRestrictions['lenses'] && 'Wearing corrective lenses',
      detRestrictions['hearingAid'] && 'Wearing hearing aid',
      detRestrictions['waiver'] && ('Accompanied by a waiver/exemption' + (waiverType ? ' (' + waiverType + ')' : '')),
      detRestrictions['intracity'] && 'Driving within an exempt intracity zone',
      detRestrictions['spe'] && 'Accompanied by a SPE Certificate',
    ].filter(Boolean).join('; ')
    const detLabel: Record<string,string> = {
      qualifies2yr: 'Meets standards in 49 CFR 391.41; qualifies for 2-year certificate',
      doesNotMeet: 'Does not meet standards',
      monitoring: 'Meets standards, but periodic monitoring required' + (monitorPeriod ? ' — ' + monitorPeriod : ''),
      pending: 'Determination pending',
      incomplete: 'Incomplete examination',
    }
    const condRows = CONDITIONS.map((c, i) => `<tr style="background:${i % 2 === 0 ? '#fff' : '#f9f9f9'}"><td style="padding:3px 6px;border:1px solid #ccc;font-size:10px;">${i + 1}. ${c.English}</td><td style="padding:3px 6px;border:1px solid #ccc;font-size:10px;text-align:center;">${condAnswers[i] === 'Yes' ? '✓' : ''}</td><td style="padding:3px 6px;border:1px solid #ccc;font-size:10px;text-align:center;">${condAnswers[i] === 'No' ? '✓' : ''}</td></tr>`).join('')
    const sysRows = BODY_SYSTEMS.map(s => `<tr><td style="padding:3px 8px;border:1px solid #ccc;font-size:10px;">${s}</td><td style="padding:3px 8px;border:1px solid #ccc;font-size:10px;text-align:center;">${systems[s] === 'Normal' ? '✓' : ''}</td><td style="padding:3px 8px;border:1px solid #ccc;font-size:10px;text-align:center;">${systems[s] === 'Abnormal' ? '✓' : ''}</td></tr>`).join('')
    const hearingSection = hearingTest === 'whisper'
      ? `<div style="font-size:10px;">Whisper Test — Right Ear: ${whisperRight ? whisperRight + ' ft' : '—'} &nbsp;|&nbsp; Left Ear: ${whisperLeft ? whisperLeft + ' ft' : '—'}</div>`
      : `<table style="width:100%;border-collapse:collapse;"><tr><th style="padding:3px 6px;border:1px solid #ccc;background:#e8e8e8;font-size:10px;"></th><th style="padding:3px 6px;border:1px solid #ccc;background:#e8e8e8;font-size:10px;">500 Hz</th><th style="padding:3px 6px;border:1px solid #ccc;background:#e8e8e8;font-size:10px;">1000 Hz</th><th style="padding:3px 6px;border:1px solid #ccc;background:#e8e8e8;font-size:10px;">2000 Hz</th><th style="padding:3px 6px;border:1px solid #ccc;background:#e8e8e8;font-size:10px;">Average</th></tr><tr><td style="padding:3px 6px;border:1px solid #ccc;font-size:10px;">Right Ear</td><td style="padding:3px 6px;border:1px solid #ccc;font-size:10px;text-align:center;">${audioR500}</td><td style="padding:3px 6px;border:1px solid #ccc;font-size:10px;text-align:center;">${audioR1k}</td><td style="padding:3px 6px;border:1px solid #ccc;font-size:10px;text-align:center;">${audioR2k}</td><td style="padding:3px 6px;border:1px solid #ccc;font-size:10px;text-align:center;">${audioAvg(audioR500, audioR1k, audioR2k)}</td></tr><tr><td style="padding:3px 6px;border:1px solid #ccc;font-size:10px;">Left Ear</td><td style="padding:3px 6px;border:1px solid #ccc;font-size:10px;text-align:center;">${audioL500}</td><td style="padding:3px 6px;border:1px solid #ccc;font-size:10px;text-align:center;">${audioL1k}</td><td style="padding:3px 6px;border:1px solid #ccc;font-size:10px;text-align:center;">${audioL2k}</td><td style="padding:3px 6px;border:1px solid #ccc;font-size:10px;text-align:center;">${audioAvg(audioL500, audioL1k, audioL2k)}</td></tr></table>`
    w.document.write(`<!DOCTYPE html><html><head><title>MCSA-5875 — ${driverName}</title><style>
      body{font-family:Arial,sans-serif;font-size:11px;margin:0;padding:20px;color:#000;}
      h1{font-size:14px;text-align:center;margin:0 0 2px;}
      .hdr{text-align:center;border-bottom:2px solid #000;padding-bottom:8px;margin-bottom:12px;}
      .st{background:#1a3a5c;color:#fff;padding:4px 8px;font-size:11px;font-weight:bold;margin:10px 0 4px;}
      .row{display:flex;gap:0;margin-bottom:4px;}
      .f{flex:1;border:1px solid #999;padding:3px 6px;min-height:22px;margin-right:-1px;}
      .lbl{font-size:9px;color:#555;display:block;}
      .val{font-size:11px;font-weight:600;}
      table{width:100%;border-collapse:collapse;}
      th{background:#e8e8e8;padding:3px 6px;border:1px solid #ccc;font-size:10px;}
      .two{display:grid;grid-template-columns:1fr 1fr;gap:4px;}
      .three{display:grid;grid-template-columns:1fr 1fr 1fr;gap:4px;}
      .four{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:4px;}
      .sig{border-top:1px solid #000;margin-top:32px;padding-top:4px;font-size:9px;color:#555;}
      @media print{body{padding:10px;}}
    </style></head><body>
    <div style="float:right;font-size:9px;">OMB No. 2126-0006</div>
    <div class="hdr"><h1>MCSA-5875</h1><div style="font-size:12px;font-weight:bold;">Medical Examination Report for Commercial Driver Fitness Determination</div><div style="font-size:9px;">49 CFR Part 391.43 &nbsp;|&nbsp; Federal Motor Carrier Safety Administration</div></div>

    <div class="st">SECTION 1 — DRIVER INFORMATION</div>
    <div class="three" style="margin-bottom:4px;">
      <div class="f"><span class="lbl">Last Name</span><span class="val">${lastName}</span></div>
      <div class="f"><span class="lbl">First Name</span><span class="val">${firstName}</span></div>
      <div class="f"><span class="lbl">Middle Name</span><span class="val">${middleName}</span></div>
    </div>
    <div class="four" style="margin-bottom:4px;">
      <div class="f"><span class="lbl">Date of Birth</span><span class="val">${dobDisplay}</span></div>
      <div class="f"><span class="lbl">Age</span><span class="val">${age || ''}</span></div>
      <div class="f"><span class="lbl">Gender</span><span class="val">${gender}</span></div>
      <div class="f"><span class="lbl">Exam Date</span><span class="val">${examDate}</span></div>
    </div>
    <div class="two" style="margin-bottom:4px;">
      <div class="f"><span class="lbl">Street Address</span><span class="val">${address1}</span></div>
      <div class="f"><span class="lbl">City, State, ZIP</span><span class="val">${city}${stateProv ? ', ' + stateProv : ''} ${zip}</span></div>
    </div>
    <div class="three" style="margin-bottom:4px;">
      <div class="f"><span class="lbl">Driver License #</span><span class="val">${dlNumber}</span></div>
      <div class="f"><span class="lbl">Issuing State</span><span class="val">${dlState}</span></div>
      <div class="f"><span class="lbl">Phone</span><span class="val">${primaryPhone}</span></div>
    </div>
    <div class="two" style="margin-bottom:4px;">
      <div class="f"><span class="lbl">USDOT/FMCSA Med Cert denied or &lt;2 years?</span><span class="val">${certDenied}</span></div>
      <div class="f"><span class="lbl">CLP/CDL Status</span><span class="val">${cdlStatus}</span></div>
    </div>

    <div class="st">SECTION 2 — HEALTH HISTORY</div>
    <div class="two" style="margin-bottom:6px;">
      <div class="f"><span class="lbl">Surgery history?</span><span class="val">${surgery}</span>${surgeryComments ? '<br><span style="font-size:9px;">' + surgeryComments + '</span>' : ''}</div>
      <div class="f"><span class="lbl">Currently taking medications?</span><span class="val">${medAnswer}</span>${medications ? '<br><span style="font-size:9px;">' + medications + '</span>' : ''}</div>
    </div>
    <table><tr><th style="text-align:left;width:80%;">Condition</th><th>Yes</th><th>No</th></tr>${condRows}</table>

    <div class="st">SECTION 3 — URINALYSIS / TESTING</div>
    <div class="four" style="margin-bottom:4px;">
      <div class="f"><span class="lbl">Sp. Gr.</span><span class="val">${spGr}</span></div>
      <div class="f"><span class="lbl">Protein</span><span class="val">${protein}</span></div>
      <div class="f"><span class="lbl">Blood</span><span class="val">${blood}</span></div>
      <div class="f"><span class="lbl">Sugar</span><span class="val">${sugar}</span></div>
    </div>
    <div class="four" style="margin-bottom:4px;">
      <div class="f"><span class="lbl">CCF/Specimen #</span><span class="val">${ccfNum}</span></div>
      <div class="f"><span class="lbl">A1C</span><span class="val">${a1c}</span></div>
      <div class="f"><span class="lbl">Glucose</span><span class="val">${glucose}</span></div>
      <div class="f"><span class="lbl">Spirometry</span><span class="val">${spirometry}</span></div>
    </div>

    <div class="st">SECTION 4 — PHYSICAL EXAMINATION</div>
    <table><tr><th style="text-align:left;">Body System</th><th>Normal</th><th>Abnormal</th></tr>${sysRows}</table>
    ${physComments ? '<div style="margin-top:4px;border:1px solid #ccc;padding:4px;font-size:10px;"><b>Physical Exam Notes:</b><br>' + physComments + '</div>' : ''}

    <div class="st">SECTION 5 — VISION</div>
    <table style="margin-bottom:4px;">
      <tr><th></th><th>Uncorrected</th><th>Corrected</th><th>Horizontal Field</th></tr>
      <tr><td style="padding:3px 6px;border:1px solid #ccc;font-size:10px;">Right Eye (OD)</td><td style="padding:3px 6px;border:1px solid #ccc;font-size:10px;text-align:center;">${odUnCorr ? '20/' + odUnCorr : ''}</td><td style="padding:3px 6px;border:1px solid #ccc;font-size:10px;text-align:center;">${odCorr ? '20/' + odCorr : ''}</td><td style="padding:3px 6px;border:1px solid #ccc;font-size:10px;text-align:center;">${fieldRight}</td></tr>
      <tr><td style="padding:3px 6px;border:1px solid #ccc;font-size:10px;">Left Eye (OS)</td><td style="padding:3px 6px;border:1px solid #ccc;font-size:10px;text-align:center;">${osUnCorr ? '20/' + osUnCorr : ''}</td><td style="padding:3px 6px;border:1px solid #ccc;font-size:10px;text-align:center;">${osCorr ? '20/' + osCorr : ''}</td><td style="padding:3px 6px;border:1px solid #ccc;font-size:10px;text-align:center;">${fieldLeft}</td></tr>
      <tr><td style="padding:3px 6px;border:1px solid #ccc;font-size:10px;">Both Eyes (OU)</td><td style="padding:3px 6px;border:1px solid #ccc;font-size:10px;text-align:center;">${ouUnCorr ? '20/' + ouUnCorr : ''}</td><td style="padding:3px 6px;border:1px solid #ccc;font-size:10px;text-align:center;">${ouCorr ? '20/' + ouCorr : ''}</td><td style="padding:3px 6px;border:1px solid #ccc;font-size:10px;text-align:center;"></td></tr>
    </table>
    <div style="font-size:10px;">Color vision: ${colorVision || '—'} &nbsp;|&nbsp; Monocular: ${monocular || '—'}</div>

    <div class="st">SECTION 6 — HEARING</div>
    ${hearingSection}

    <div class="st">SECTION 7 — BLOOD PRESSURE / PULSE RATE / ANTHROPOMETRIC DATA</div>
    <div class="four" style="margin-bottom:4px;">
      <div class="f"><span class="lbl">BP 1st — Systolic</span><span class="val">${bp1s}</span></div>
      <div class="f"><span class="lbl">BP 1st — Diastolic</span><span class="val">${bp1d}</span></div>
      <div class="f"><span class="lbl">BP 2nd — Systolic</span><span class="val">${bp2s}</span></div>
      <div class="f"><span class="lbl">BP 2nd — Diastolic</span><span class="val">${bp2d}</span></div>
    </div>
    <div class="four" style="margin-bottom:4px;">
      <div class="f"><span class="lbl">Pulse Rate</span><span class="val">${pulse}</span></div>
      <div class="f"><span class="lbl">Pulse Rhythm Regular</span><span class="val">${pulseRegular}</span></div>
      <div class="f"><span class="lbl">Height (in)</span><span class="val">${htIn}</span></div>
      <div class="f"><span class="lbl">Weight (lbs)</span><span class="val">${weight}</span></div>
    </div>
    <div class="two" style="margin-bottom:4px;">
      <div class="f"><span class="lbl">BMI</span><span class="val">${bmi}</span></div>
      <div class="f"><span class="lbl">Neck Size (in)</span><span class="val">${neckSize}</span></div>
    </div>

    <div class="st">SECTION 8 — MEDICAL EXAMINER DETERMINATION</div>
    <div class="f" style="margin-bottom:6px;border:1px solid #999;padding:4px 6px;"><span class="lbl">Determination</span><span class="val">${detLabel[determination] || '—'}</span></div>
    ${restrictionsList ? '<div class="f" style="margin-bottom:6px;border:1px solid #999;padding:4px 6px;"><span class="lbl">Qualified Only When (Restrictions)</span><span class="val">' + restrictionsList + '</span></div>' : ''}
    <div class="three" style="margin-bottom:4px;">
      <div class="f"><span class="lbl">Examination Date</span><span class="val">${examDate}</span></div>
      <div class="f"><span class="lbl">Certificate Valid Until</span><span class="val">${expiry}</span></div>
      <div class="f"><span class="lbl">Exam Type</span><span class="val">${detType}</span></div>
    </div>
    <div class="f" style="margin-bottom:4px;border:1px solid #999;padding:4px 6px;"><span class="lbl">Medical Examiner Name</span><span class="val">Chantal Simpson-Gabriel, MD</span></div>
    <div class="three" style="margin-bottom:4px;">
      <div class="f"><span class="lbl">State License #</span><span class="val">${examinerLicense}</span></div>
      <div class="f"><span class="lbl">National Registry #</span><span class="val">7657080894</span></div>
      <div class="f"><span class="lbl">Phone</span><span class="val">${examinerPhone}</span></div>
    </div>
    <div style="font-size:10px;margin-top:10px;">I certify that the above-named driver has been examined in accordance with the applicable Federal Motor Carrier Safety Regulations and the results are accurately recorded above.</div>
    <div class="sig">Medical Examiner Signature &amp; Date</div>
    <script>window.onload=function(){window.print()}<\/script>
    </body></html>`)
    w.document.close()
  }

  function printCertificate() {
    const frame = certFrameRef.current
    if (!frame) return
    const w = frame.contentWindow
    if (!w) return
    const examDate = examDateRaw ? new Date(examDateRaw + 'T00:00:00').toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }) : ''
    const expiry = getExpiryDate()
    const isFederal = detType !== 'State'
    const chk = (val: boolean) => val ? '&#10003;' : '&nbsp;'
    const driverFirst = driverName.includes(',') ? driverName.split(',')[1]?.trim() : driverName.split(' ')[0] || ''
    const driverLast  = driverName.includes(',') ? driverName.split(',')[0]?.trim() : driverName.split(' ').slice(1).join(' ') || ''
    const doc = frame.contentDocument || w.document
    doc.open()
    doc.write(`<!DOCTYPE html><html><head><title>MCSA-5876 — Medical Examiner's Certificate</title><style>
      *{box-sizing:border-box;}
      body{font-family:Arial,Helvetica,sans-serif;margin:0;padding:18px 22px;background:#fff;font-size:9.5pt;color:#000;}
      .form-id{font-size:8pt;font-weight:bold;}
      .omb{font-size:7.5pt;text-align:right;}
      .top-bar{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:4px;}
      .dot-header{display:flex;align-items:center;gap:12px;justify-content:center;margin-bottom:3px;}
      .dot-seal{width:56px;height:56px;border:3px solid #000;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:7pt;font-weight:bold;text-align:center;line-height:1.1;letter-spacing:-.3px;flex-shrink:0;}
      .dot-title{font-size:12pt;font-weight:bold;line-height:1.2;}
      .cert-title{font-style:italic;font-size:10.5pt;text-align:center;margin:4px 0 6px;}
      .red-box{border:2px solid #cc0000;padding:8px 10px;margin-bottom:0;}
      .certify-line{font-size:8.5pt;margin-bottom:6px;}
      .radio-row{display:flex;align-items:flex-start;gap:6px;margin-bottom:4px;font-size:8.5pt;}
      .radio-btn{width:12px;height:12px;border:1px solid #000;border-radius:50%;flex-shrink:0;margin-top:1px;display:inline-flex;align-items:center;justify-content:center;font-size:9pt;}
      .radio-filled{background:#000;border-color:#000;}
      .radio-empty{}
      .check-row{display:flex;align-items:flex-start;gap:5px;margin:2px 0 2px 22px;font-size:8pt;}
      .check-box{width:11px;height:11px;border:1px solid #000;flex-shrink:0;margin-top:1px;display:inline-flex;align-items:center;justify-content:center;font-size:8pt;font-weight:bold;}
      .cert-stmt{font-size:7.5pt;margin:8px 0 6px;line-height:1.4;}
      .expiry-row{display:flex;align-items:center;gap:10px;margin-top:6px;}
      .expiry-label{font-size:8.5pt;font-weight:bold;flex-shrink:0;}
      .expiry-date{border:2px solid #cc0000;padding:4px 14px;font-size:16pt;font-weight:bold;color:#cc0000;min-width:180px;text-align:center;}
      table{width:100%;border-collapse:collapse;margin-top:0;}
      td{border:1px solid #000;padding:3px 5px;vertical-align:top;font-size:8pt;}
      .cell-label{font-size:6.5pt;font-weight:bold;display:block;margin-bottom:1px;text-transform:uppercase;letter-spacing:.03em;}
      .cell-val{font-size:9pt;font-weight:bold;display:block;min-height:16px;}
      .sig-cell{min-height:32px;vertical-align:bottom;}
      .type-row{display:flex;gap:12px;align-items:center;flex-wrap:wrap;}
      .type-opt{display:flex;align-items:center;gap:3px;font-size:7.5pt;}
      @media print{body{padding:8px 12px;}@page{margin:.4in;}}
    </style></head><body>
    <div class="top-bar">
      <div class="form-id">Form MCSA-5876<br><span style="font-weight:normal;font-size:7.5pt;">(Formerly Form MCSA-5876)</span></div>
      <div class="omb">OMB No.: 2126-0006<br>Expiration Date: 03/31/2028</div>
    </div>
    <div class="dot-header">
      <div class="dot-seal">U.S.<br>DOT<br>&#9685;</div>
      <div>
        <div class="dot-title">U.S. Department of Transportation</div>
        <div style="font-size:10pt;font-weight:bold;">Federal Motor Carrier Safety Administration</div>
      </div>
    </div>
    <div class="cert-title">Medical Examiner's Certificate<br><span style="font-size:9pt;">(for Commercial Driver Medical Certification)</span></div>

    <div class="red-box">
      <div class="certify-line">
        I certify that I have examined &nbsp;
        <strong>Last Name:</strong> <span style="border-bottom:1px solid #000;min-width:90px;display:inline-block;padding:0 4px;">${driverLast}</span>
        &nbsp;<strong>First Name:</strong> <span style="border-bottom:1px solid #000;min-width:80px;display:inline-block;padding:0 4px;">${driverFirst}</span>
        &nbsp; in accordance with <em>(please check only one):</em>
      </div>

      <div class="radio-row">
        <span class="radio-btn ${isFederal ? 'radio-filled' : 'radio-empty'}">${isFederal ? '&#9679;' : ''}</span>
        <span><strong>the Federal Motor Carrier Safety Regulations (49 CFR 391.41-391.49)</strong> and, with knowledge of the driving duties, I find this person is <strong>qualified</strong>, and, if applicable, only when <em>(check all that apply)</em> <strong>OR</strong></span>
      </div>
      <div class="check-row">
        <span class="check-box">${chk(detRestrictions['lenses'])}</span>
        <span>Wearing corrective lenses</span>
      </div>
      <div class="check-row">
        <span class="check-box">${chk(detRestrictions['waiver'])}</span>
        <span>Accompanied by ${waiverType || '________'} waiver/exemption</span>
      </div>
      <div class="check-row">
        <span class="check-box">${chk(detRestrictions['intracity'])}</span>
        <span>Driving within exempt intracity zone (49 CFR 391.62)(Federal)</span>
      </div>
      <div class="check-row">
        <span class="check-box">${chk(detRestrictions['hearingAid'])}</span>
        <span>Wearing hearing aid</span>
      </div>
      <div class="check-row">
        <span class="check-box">${chk(detRestrictions['spe'])}</span>
        <span>Accompanied by SPE Certificate</span>
      </div>

      <div class="radio-row" style="margin-top:6px;">
        <span class="radio-btn ${!isFederal ? 'radio-filled' : 'radio-empty'}">${!isFederal ? '&#9679;' : ''}</span>
        <span><strong>the applicable State variance to the Federal Motor Carrier Safety Regulations</strong> and, with knowledge of the driving duties, I find this person is <strong>qualified</strong>, and, if applicable, only when <em>(check all that apply)</em></span>
      </div>
      <div class="check-row">
        <span class="check-box">&nbsp;</span>
        <span>Grandfathered from State requirements (State)</span>
      </div>

      <div class="cert-stmt">
        The driver identified above is physically qualified to operate a commercial motor vehicle in accordance with the Federal Motor Carrier Safety Regulations. I have personally reviewed all records used to make this determination and I am able to perform and have performed the medical examination described in 49 CFR 391.43.
      </div>

      <div class="expiry-row">
        <span class="expiry-label">Medical Examiner's Certificate Expiration Date:</span>
        <span class="expiry-date">${expiry || '__ /__ /____'}</span>
      </div>
    </div>

    <table>
      <tr>
        <td style="width:40%;" class="sig-cell">
          <span class="cell-label">Medical Examiner's Signature</span>
          <span class="cell-val" style="margin-top:20px;border-top:1px solid #000;font-size:7.5pt;font-weight:normal;">X</span>
        </td>
        <td style="width:30%;">
          <span class="cell-label">Medical Examiner's Telephone Number</span>
          <span class="cell-val">${examinerPhone}</span>
        </td>
        <td style="width:30%;">
          <span class="cell-label">Date Certificate Signed</span>
          <span class="cell-val">${examDate}</span>
        </td>
      </tr>
      <tr>
        <td colspan="3">
          <span class="cell-label">Medical Examiner's Name (please print or type)</span>
          <span class="cell-val">Chantal Simpson-Gabriel</span>
        </td>
      </tr>
      <tr>
        <td colspan="3">
          <span class="cell-label">Medical Examiner's Credentials (check one)</span>
          <div class="type-row" style="margin-top:4px;">
            <label class="type-opt"><input type="radio" name="me-type" checked readonly> MD</label>
            <label class="type-opt"><input type="radio" name="me-type" readonly> DO</label>
            <label class="type-opt"><input type="radio" name="me-type" readonly> Physician Assistant</label>
            <label class="type-opt"><input type="radio" name="me-type" readonly> Chiropractor</label>
            <label class="type-opt"><input type="radio" name="me-type" readonly> Advanced Practice Nurse</label>
            <label class="type-opt"><input type="radio" name="me-type" readonly> Other</label>
          </div>
        </td>
      </tr>
      <tr>
        <td>
          <span class="cell-label">ME State License Number</span>
          <span class="cell-val">${examinerLicense}</span>
        </td>
        <td>
          <span class="cell-label">Issuing State</span>
          <span class="cell-val">NJ</span>
        </td>
        <td>
          <span class="cell-label">National Registry Number</span>
          <span class="cell-val">7657080894</span>
        </td>
      </tr>
      <tr>
        <td class="sig-cell">
          <span class="cell-label">Driver's Signature</span>
          <span class="cell-val" style="margin-top:20px;border-top:1px solid #000;font-size:7.5pt;font-weight:normal;">X</span>
        </td>
        <td>
          <span class="cell-label">Driver's License Number</span>
          <span class="cell-val">${dlNumber}</span>
        </td>
        <td>
          <span class="cell-label">Issuing State/Province</span>
          <span class="cell-val">${dlState}</span>
        </td>
      </tr>
    </table>
    <div style="font-size:7pt;color:#555;margin-top:6px;line-height:1.4;">
      Public Burden Statement: A Federal agency may not conduct or sponsor, and a person is not required to respond to, nor shall a person be subject to a penalty for failure to comply with a collection of information subject to the requirements of the Paperwork Reduction Act unless that collection of information displays a current valid OMB Control Number. The OMB Control Number for this information collection is 2126-0006.
    </div>
    </body></html>`)
    doc.close()
    setTimeout(() => w.print(), 400)
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%', fontFamily:"Arial, Helvetica, sans-serif", background:'#f3f4f6', fontSize:13, color:'#111' }}>

      {/* Form type bar */}
      <div style={{ display:'flex', gap:4, padding:'8px 14px 0', background:'#18181b', flexShrink:0 }}>
        {[{id:'MCSA-5875',label:'MCSA-5875',sub:'DOT Medical Exam Report',ok:true},{id:'MCSA-5872',label:'MCSA-5872',sub:'Diabetes Exemption',ok:false},{id:'MCSA-5870',label:'MCSA-5870',sub:'Insulin Waiver',ok:false},{id:'MCSA-5871',label:'MCSA-5871',sub:'Vision Exemption',ok:false}].map(f=>(
          <div key={f.id} style={{ display:'flex', flexDirection:'column', alignItems:'flex-start', padding:'6px 14px 8px', borderRadius:'6px 6px 0 0',
            background: f.id==='MCSA-5875'?'#fff':'rgba(255,255,255,.05)', opacity:f.ok?1:0.45,
            borderBottom: f.id==='MCSA-5875'?'3px solid #16a34a':'3px solid transparent', minWidth:110 }}>
            <span style={{ fontSize:12, fontWeight:700, color:f.id==='MCSA-5875'?'#16a34a':'rgba(255,255,255,.6)' }}>{f.label}</span>
            <span style={{ fontSize:9.5, marginTop:1, color:f.id==='MCSA-5875'?'#6b7280':'rgba(255,255,255,.3)' }}>{f.sub}</span>
          </div>
        ))}
      </div>

      {/* Page header */}
      <div style={{ background:'#fff', borderBottom:'1px solid #e5e7eb', padding:'6px 16px', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0, gap:8 }}>
        <div style={{ fontWeight:700, fontSize:13.5, color:'#111', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' as const }}>
          DOT - {tab}{driverName?` - ${driverName}`:''}{ age!==null?` - Age ${age}`:''}{ dobDisplay?` - DOB ${dobDisplay}`:''}
        </div>
        <div style={{ display:'flex', gap:6, flexShrink:0 }}>
          {[['FMCSA Standards','#111','#fff','https://www.ecfr.gov/current/title-49/subtitle-B/chapter-III/subchapter-B/part-391/subpart-E#p-391.41(b)'],['Advisory Criteria','#5e7a89','#fff',''],['Instructions','#f59e0b','#fff',''],['Exam Index','#0ea5e9','#fff',''],['Last Exam','#fff','#374151','']].map(([lbl,bg,color,href])=>(
            href
              ? <a key={lbl as string} href={href as string} target="_blank" rel="noopener noreferrer" style={{ background:bg as string, color:color as string, border:'none', padding:'4px 11px', borderRadius:4, fontSize:11.5, fontWeight:600, cursor:'pointer', textDecoration:'none', display:'inline-flex', alignItems:'center' }}>{lbl as string}</a>
              : <button key={lbl as string} style={{ background:bg as string, color:color as string, border:bg==='#fff'?'1px solid #d1d5db':'none', padding:'4px 11px', borderRadius:4, fontSize:11.5, fontWeight:600, cursor:'pointer' }}>{lbl as string}</button>
          ))}
        </div>
      </div>

      {/* Status bar + language toggle */}
      <div style={{ background:'#fff', borderBottom:'1px solid #e5e7eb', padding:'4px 16px', fontSize:12, color:'#6b7280', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <span>Exam Status: <strong style={{ color:'#16a34a' }}>{savedExamId ? 'Saved' : 'New'}</strong> | EXID: <span style={{ color:'#0ea5e9' }}>{savedExamId ? savedExamId.slice(0,8).toUpperCase() : '—'}</span> | Company: <span style={{ color:'#0ea5e9', textTransform:'capitalize' as const }}>{companySlug.replace(/-/g,' ')}</span></span>
        <div style={{ display:'flex', gap:12, alignItems:'center' }}>
          <span style={{ fontSize:11, color:'#9ca3af' }}>Language:</span>
          {(['English','Spanish'] as const).map(l=>(
            <label key={l} style={{ display:'flex', alignItems:'center', gap:4, cursor:'pointer', fontSize:12 }}>
              <input type="radio" name="exam-lang" value={l} checked={lang===l} onChange={()=>setLang(l)} style={{ width:13, height:13, accentColor:'#16a34a', cursor:'pointer' }} />
              <span style={{ fontWeight:lang===l?700:400, color:lang===l?'#16a34a':'#6b7280' }}>{l}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Warning */}
      {showWarning && (
        <div style={{ background:'#fed7aa', padding:'8px 16px', fontSize:12.5, color:'#92400e', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
          <span>⚠ {t('missingIdVerified',lang)}</span>
          <button type="button" onClick={()=>setWarningDismissed(true)} style={{ background:'none', border:'none', cursor:'pointer', color:'#92400e', fontSize:18, lineHeight:1, padding:0 }}>×</button>
        </div>
      )}

      {/* Tab bar */}
      <div style={{ display:'flex', overflowX:'auto', background:'#fff', borderBottom:'2px solid #e5e7eb', flexShrink:0, scrollbarWidth:'none' as const }}>
        {TABS.map(tb=>(
          <button key={tb} type="button" onClick={()=>{ setTab(tb); setWarningDismissed(false) }} style={{
            padding:'10px 14px', border:'none', cursor:'pointer', fontSize:12, fontWeight:600, whiteSpace:'nowrap' as const,
            background:'transparent', color:tab===tb?'#16a34a':'#6b7280',
            borderBottom:tab===tb?'2px solid #16a34a':'2px solid transparent', marginBottom:-2 }}>{tb}</button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex:1, overflowY:'auto', background:'#fff' }}>

        {/* DRIVER */}
        {tab==='Driver' && (
          <div style={p}>
            <div style={{ marginBottom:16 }}>
              <h2 style={{ fontSize:15, fontWeight:700, margin:0 }}>{lang==='English'?'Driver':'Conductor'}</h2>
            </div>
            <Row>
              <Field label={t('idVerifiedBy',lang)} required flex={2}>
                <select style={sel} value={idVerifiedBy} onChange={e=>{ setIdVerifiedBy(e.target.value); setWarningDismissed(false) }}>
                  <option value="">Select Verified By ...</option>
                  <option>Driver&apos;s License</option><option>State ID</option><option>Passport</option><option>Military ID</option><option>Other Government ID</option>
                </select>
              </Field>
              <div style={{ flex:1, display:'flex', alignItems:'flex-end' }}>
                <button type="button" style={{ background:'#16a34a', color:'#fff', border:'none', borderRadius:4, padding:'8px 14px', fontSize:12, fontWeight:600, cursor:'pointer' }}>✓ {t('updateVerifiedBy',lang)}</button>
              </div>
            </Row>
            <div style={{ display:'flex', gap:8, marginBottom:14 }}>
              {[{l:t('firstName',lang),v:firstName,s:setFirstName,req:true,flex:2},{l:t('middleName',lang),v:middleName,s:setMiddleName,req:false,flex:2},{l:t('lastName',lang),v:lastName,s:setLastName,req:true,flex:2}].map(f=>(
                <div key={f.l} style={{ flex:f.flex, minWidth:0 }}>
                  <label style={{ display:'block', fontSize:12, fontWeight:600, color:'#374151', marginBottom:4 }}>{f.l}{f.req&&<span style={{ color:'#dc2626', marginLeft:2 }}>*</span>}</label>
                  <input style={inp} value={f.v} onChange={e=>f.s(e.target.value)} />
                </div>
              ))}
              <div style={{ flex:1, minWidth:0 }}>
                <label style={{ display:'block', fontSize:12, fontWeight:600, color:'#374151', marginBottom:4 }}>{t('suffix',lang)}</label>
                <select style={sel} value={suffix} onChange={e=>setSuffix(e.target.value)}><option value=""></option><option>Jr.</option><option>Sr.</option><option>II</option><option>III</option></select>
              </div>
            </div>
            <Row>
              <Field label={t('dob',lang)} required><input type="date" style={inp} value={dob} onChange={e=>setDob(e.target.value)} /></Field>
              <Field label={t('gender',lang)}>
                <select style={sel} value={gender} onChange={e=>setGender(e.target.value)}><option value=""></option><option>Male</option><option>Female</option><option>Other</option></select>
              </Field>
              <Field label={t('email',lang)}><input type="email" style={inp} value={email} onChange={e=>setEmail(e.target.value)} /></Field>
            </Row>
            <Row>
              <Field label={t('address1',lang)} required><input style={inp} value={address1} onChange={e=>setAddress1(e.target.value)} /></Field>
              <Field label={t('city',lang)} required><input style={inp} value={city} onChange={e=>setCity(e.target.value)} /></Field>
              <Field label={t('stateProv',lang)} required><select style={sel} value={stateProv} onChange={e=>setStateProv(e.target.value)}><option value=""></option>{US_STATES.map(s=><option key={s}>{s}</option>)}</select></Field>
            </Row>
            <Row>
              <Field label={t('zipCode',lang)} required><input style={inp} value={zip} onChange={e=>setZip(e.target.value)} maxLength={10} /></Field>
              <Field label={<>{t('primaryPhone',lang)} <span style={{ color:'#0ea5e9', cursor:'pointer', fontSize:11 }} onClick={()=>setCellPhone(primaryPhone)}>{t('copyToCell',lang)}</span></>} required><input type="tel" style={inp} value={primaryPhone} onChange={e=>setPrimaryPhone(e.target.value)} placeholder="(___) ___-____" /></Field>
              <Field label={<>{t('cellPhone',lang)} <span style={{ color:'#0ea5e9', cursor:'pointer', fontSize:11 }} onClick={()=>setPrimaryPhone(cellPhone)}>{t('copyToPrimary',lang)}</span></>}><input type="tel" style={inp} value={cellPhone} onChange={e=>setCellPhone(e.target.value)} placeholder="(___) ___-____" /></Field>
            </Row>
            <Row>
              <Field label={t('dlNumber',lang)} required><input style={inp} value={dlNumber} onChange={e=>setDlNumber(e.target.value)} /></Field>
              <Field label={t('issuingCountry',lang)} required><select style={sel} value={dlCountry} onChange={e=>setDlCountry(e.target.value)}><option>United States</option><option>Canada</option><option>Mexico</option></select></Field>
              <Field label={t('issuingState',lang)} required><select style={sel} value={dlState} onChange={e=>setDlState(e.target.value)}><option value=""></option>{US_STATES.map(s=><option key={s}>{s}</option>)}</select></Field>
            </Row>
            <div style={{ display:'flex', gap:24, marginBottom:14 }}>
              <div style={{ flex:2 }}>
                <div style={{ fontSize:12, fontWeight:600, color:'#374151', marginBottom:8 }}>{t('certDenied',lang)}<span style={{ color:'#dc2626', marginLeft:2 }}>*</span></div>
                <div style={{ display:'flex', gap:16 }}>
                  {['Yes','No','Not Sure'].map(v=>(
                    <label key={v} style={{ display:'flex', alignItems:'center', gap:5, fontSize:13, cursor:'pointer', color:certDenied===v?'#1d4ed8':'#374151', fontWeight:certDenied===v?700:400 }}>
                      <input type="radio" name="certDenied" value={v} checked={certDenied===v} onChange={()=>setCertDenied(v)} style={{ width:14, height:14, accentColor:'#374151' }} />
                      {v==='Yes'?t('yes',lang):v==='No'?t('no',lang):t('notSure',lang)}
                    </label>
                  ))}
                </div>
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:12, fontWeight:600, color:'#374151', marginBottom:8 }}>{t('clpCdl',lang)}<span style={{ color:'#dc2626', marginLeft:2 }}>*</span></div>
                {[['holder',t('cdlHolder',lang)],['applicant',t('cdlApplicant',lang)],['none',t('cdlNone',lang)]].map(([val,lbl])=>(
                  <label key={val} style={{ display:'flex', alignItems:'center', gap:6, fontSize:12.5, cursor:'pointer', marginBottom:6, color:cdlStatus===val?'#1d4ed8':'#374151', fontWeight:cdlStatus===val?700:400 }}>
                    <input type="radio" name="cdlStatus" value={val} checked={cdlStatus===val} onChange={()=>setCdlStatus(val)} style={{ width:13, height:13, accentColor:'#374151' }} />
                    {lbl}
                  </label>
                ))}
              </div>
            </div>
            <div style={{ marginBottom:14 }}>
              <label style={{ display:'block', fontSize:12, fontWeight:600, color:'#374151', marginBottom:4 }}>{t('notifPref',lang)}<span style={{ color:'#dc2626', marginLeft:2 }}>*</span></label>
              <select style={{ ...sel, maxWidth:320 }} value={notifPref} onChange={e=>setNotifPref(e.target.value)}>
                <option value="">Select a Reminder Method ...</option>
                <option>Email Only</option><option>Text Only</option><option>Email and Text</option><option>None</option>
              </select>
            </div>
          </div>
        )}

        {/* HEALTH */}
        {tab==='Health' && (
          <div>
            <div style={{ padding:'14px 20px 10px' }}>
              <h2 style={{ fontSize:15, fontWeight:700, margin:'0 0 4px' }}>{t('healthHistory',lang)}</h2>
              <div style={{ fontSize:11.5, color:'#6b7280' }}>🔒 {t('lockedMsg',lang)}</div>
            </div>
            <div style={{ padding:'0 20px 20px' }}>
              <div style={{ marginBottom:16 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
                  <div style={{ fontSize:12.5, color:'#374151', flex:1, marginRight:16 }}>{t('surgery',lang)}<span style={{ color:'#dc2626', marginLeft:3 }}>*</span></div>
                  <YNS name="surgery" value={surgery} onChange={setSurgery} lang={lang} />
                </div>
                <textarea rows={3} style={{ ...inp, resize:'vertical', fontFamily:'inherit' } as React.CSSProperties} placeholder={t('surgeryComments',lang)} value={surgeryComments} onChange={e=>setSurgeryComments(e.target.value)} />
              </div>
              <div style={{ marginBottom:16 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
                  <div style={{ fontSize:12.5, color:'#374151', flex:1, marginRight:16 }}>{t('medications',lang)}<span style={{ color:'#dc2626', marginLeft:3 }}>*</span></div>
                  <YNS name="meds" value={medAnswer} onChange={setMedAnswer} lang={lang} />
                </div>
                <textarea rows={3} style={{ ...inp, resize:'vertical', fontFamily:'inherit' } as React.CSSProperties} placeholder={lang==='English'?'Enter Medications Comments ...':'Ingrese medicamentos ...'} value={medications} onChange={e=>setMedications(e.target.value)} />
              </div>
              <div style={{ fontSize:12.5, fontWeight:600, color:'#374151', marginBottom:6 }}>{t('haveEverHad',lang)}</div>
              <div style={{ border:'1px solid #e5e7eb', borderRadius:4, overflow:'hidden', marginBottom:16 }}>
                {CONDITIONS.map((cond,i)=>(
                  <div key={i} style={{ display:'flex', alignItems:'center', padding:'9px 14px', background:i%2===0?'#fff':'#f9fafb', borderBottom:'1px solid #f3f4f6' }}>
                    <span style={{ fontSize:12.5, color:condAnswers[i]==='Yes'?'#1d4ed8':'#374151', flex:1, marginRight:12 }}>
                      <span style={{ color:'#6b7280', marginRight:6, fontSize:12 }}>{i+1}.</span>
                      {cond[lang]}<span style={{ color:'#dc2626', marginLeft:3 }}>*</span>
                    </span>
                    <YNS name={`c${i}`} value={condAnswers[i]??'No'} onChange={v=>setCondAnswers(p=>({...p,[i]:v}))} lang={lang} />
                  </div>
                ))}
                <div style={{ padding:'9px 14px', background:'#fff', borderTop:'1px solid #e5e7eb' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
                    <span style={{ fontSize:12.5, flex:1, marginRight:12 }}>{t('otherCond',lang)}<span style={{ color:'#dc2626', marginLeft:3 }}>*</span></span>
                    <YNS name="otherCond" value={otherCondAnswer} onChange={setOtherCondAnswer} lang={lang} />
                  </div>
                  <textarea rows={3} style={{ ...inp, resize:'vertical', fontFamily:'inherit' } as React.CSSProperties} value={otherCondComments} onChange={e=>setOtherCondComments(e.target.value)} />
                </div>
                <div style={{ padding:'9px 14px', background:'#f9fafb', borderTop:'1px solid #e5e7eb' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8, gap:8 }}>
                    <span style={{ fontSize:12.5, color:'#1d4ed8', flex:1 }}>{t('summaryQuestion',lang)}<span style={{ color:'#dc2626', marginLeft:3 }}>*</span></span>
                    <YNS name="summary" value={summaryAnswer} onChange={setSummaryAnswer} lang={lang} />
                  </div>
                  <textarea rows={3} style={{ ...inp, resize:'vertical', fontFamily:'inherit' } as React.CSSProperties} value={summaryComments} onChange={e=>setSummaryComments(e.target.value)} />
                </div>
              </div>
              <div style={{ borderTop:'1px solid #e5e7eb', paddingTop:16 }}>
                <h3 style={{ fontSize:14, fontWeight:700, marginBottom:12 }}>{t('signature',lang)}</h3>
                <p style={{ fontSize:11.5, lineHeight:1.7, color:'#0e7490', marginBottom:14 }}>{t('signatureCert',lang)}</p>
                <div style={{ display:'grid', gridTemplateColumns:'160px 1fr', rowGap:10, columnGap:16, alignItems:'center', fontSize:12.5, fontWeight:600 }}>
                  <span>{t('date',lang)}</span>
                  <div style={{ border:'1px solid #d1d5db', borderRadius:4, padding:'6px 10px', background:'#f3f4f6', fontSize:12, color:'#374151' }}>{new Date().toLocaleDateString('en-US',{month:'2-digit',day:'2-digit',year:'numeric'})}</div>
                  <span>{t('employee',lang)}</span>
                  <span style={{ fontWeight:400, color:'#374151' }}>{driverName||'—'}</span>
                  <span>{t('currentSig',lang)}</span>
                  <SignaturePad />
                  <span>{t('reSign',lang)}</span>
                  <label style={{ display:'flex', alignItems:'center', gap:6, cursor:'pointer', fontWeight:400 }}>
                    <input type="checkbox" checked={reSign} onChange={e=>setReSign(e.target.checked)} style={{ width:14, height:14 }} />
                    {reSign && <span style={{ fontSize:11.5, color:'#6b7280' }}>{lang==='English'?'Re-signing enabled':'Re-firma habilitada'}</span>}
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* REVIEW */}
        {tab==='Review' && (
          <div style={p}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:4 }}>
              <div style={{ fontWeight:700, fontSize:15 }}>Driver Health History Review</div>
              <button type="button" style={{ background:'#f59e0b', color:'#fff', border:'none', borderRadius:20, padding:'3px 12px', fontSize:11, fontWeight:700, cursor:'pointer' }}>⬆ Updates</button>
            </div>
            <p style={{ fontSize:12, color:'#6b7280', marginBottom:16, lineHeight:1.6 }}>Review and discuss pertinent driver answers and any available medical records. Comment on the driver&apos;s responses to the &quot;health history&quot; questions that may affect the driver&apos;s safe operation of a commercial motor vehicle (CMV).</p>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom:20 }}>
              <div>
                <div style={{ fontWeight:700, fontSize:13, marginBottom:10 }}>Current Exam</div>
                {yesAnswers.length>0&&<div style={{ marginBottom:10 }}>
                  <div style={{ fontSize:12, fontWeight:700, marginBottom:4 }}>Yes Answers</div>
                  {CONDITIONS.map((cond,i)=>condAnswers[i]==='Yes'&&<div key={i} style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, marginBottom:3 }}><span style={{ color:'#16a34a' }}>✏️ 🏔</span><span style={{ color:'#0ea5e9' }}>{i+1}. {cond.English}</span></div>)}
                  {summaryComments&&<><div style={{ fontSize:11.5, fontWeight:700, marginTop:6, marginBottom:2 }}>Driver Comments</div>{summaryComments.split('\n').map((l,i)=>l&&<div key={i} style={{ fontSize:12, color:'#0ea5e9' }}>{l}</div>)}<div style={{ fontSize:12, fontWeight:700, marginTop:4 }}>Examiner:<br/>Examiner Alert:</div></>}
                </div>}
                <div style={{ marginBottom:8 }}>
                  <div style={{ fontSize:12, fontWeight:700, marginBottom:3 }}>Not Sure Answers</div>
                  {CONDITIONS.filter((_,i)=>condAnswers[i]==='Not Sure').length===0?<div style={{ fontSize:12, color:'#6b7280' }}>None</div>:CONDITIONS.map((cond,i)=>condAnswers[i]==='Not Sure'&&<div key={i} style={{ fontSize:12, color:'#0ea5e9' }}>{i+1}. {cond.English}</div>)}
                </div>
                <div style={{ marginBottom:8 }}>
                  <div style={{ fontSize:12, fontWeight:700, marginBottom:3 }}>Key No Answers</div>
                  {keyNoIdxs.filter(i=>condAnswers[i]==='No').map(i=><div key={i} style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, marginBottom:3 }}><span style={{ color:'#6b7280' }}>✏️ ✂</span><span style={{ color:'#0ea5e9' }}>{i+1}. {CONDITIONS[i].English}</span></div>)}
                </div>
                <div style={{ fontSize:12, marginBottom:6 }}><span style={{ fontWeight:700 }}>✏️ ✂ Surgeries</span><br /><span style={{ color:surgeryComments?'#0ea5e9':'#374151' }}>{surgeryComments||'None'}</span><br/><span style={{ fontWeight:700 }}>Examiner:<br/>Examiner Alert:</span></div>
                {medications&&<div style={{ fontSize:12, marginBottom:6 }}><span style={{ fontWeight:700 }}>✏️ ✂ Medications</span><br/>{medications.split('\n').map((l,i)=>l&&<div key={i} style={{ color:'#0ea5e9' }}>{l}</div>)}<span style={{ fontWeight:700 }}>Examiner Alert:</span></div>}
                <div style={{ fontSize:12 }}><span style={{ fontWeight:700 }}>✏️ ✂ Other Health Conditions</span><br/><span style={{ color:otherCondComments?'#0ea5e9':'#374151' }}>{otherCondComments||'None'}</span><br/><span style={{ fontWeight:700 }}>Examiner:<br/>Examiner Alert:</span></div>
              </div>
              <div>
                <div style={{ fontWeight:700, fontSize:13, marginBottom:10 }}>Previous Exam</div>
                <div style={{ fontSize:12, color:'#6b7280' }}>No Previous Exam found.</div>
              </div>
            </div>
            <p style={{ fontSize:12, color:'#6b7280', marginBottom:4 }}>Comment on the driver&apos;s responses to the &quot;health history&quot; questions that may affect the driver&apos;s safe operation of a commercial motor vehicle (CMV).</p>
            <div style={{ fontSize:12, fontWeight:700, marginBottom:6 }}>Comments<span style={{ color:'#dc2626', marginLeft:2 }}>*</span></div>
            <FreqCommentBox value={reviewComments} onChange={setReviewComments} />
          </div>
        )}

        {/* VISION */}
        {tab==='Vision' && (
          <div style={p}>
            <SectionTitle>Vision</SectionTitle>
            <p style={{ fontSize:12, color:'#374151', marginBottom:4, lineHeight:1.6 }}>Standard is at least 20/40 acuity (Snellen) in each eye with or without correction. At least 70° field of vision in horizontal meridian measured in each eye. The use of corrective lenses should be noted on the Medical Examiner&apos;s Certificate.</p>
            <p style={{ fontSize:12, color:'#0ea5e9', marginBottom:16 }}>Please select from list or type in values.</p>
            <div style={{ marginBottom:20 }}>
              <div style={{ display:'grid', gridTemplateColumns:'180px 1fr 70px 1fr 1fr', gap:8, alignItems:'center', marginBottom:8, fontSize:11, fontWeight:700, color:'#374151' }}>
                <div>Acuity</div><div style={{ textAlign:'center' as const }}>Uncorrected</div><div/><div style={{ textAlign:'center' as const }}>Corrected</div><div style={{ textAlign:'center' as const }}>Horizontal Field of Vision</div>
              </div>
              {[
                {label:'Right Eye',unc:odUnCorr,setUnc:setOdUnCorr,cor:odCorr,setCor:setOdCorr,fld:'Right',fldV:fieldRight,setFld:setFieldRight,showSwap:true},
                {label:'Left Eye', unc:osUnCorr,setUnc:setOsUnCorr,cor:osCorr,setCor:setOsCorr,fld:'Left', fldV:fieldLeft,setFld:setFieldLeft,showSwap:false},
                {label:'Both Eyes',unc:ouUnCorr,setUnc:setOuUnCorr,cor:ouCorr,setCor:setOuCorr,fld:null,  fldV:'',setFld:()=>{},showSwap:false},
              ].map(row=>(
                <div key={row.label} style={{ display:'grid', gridTemplateColumns:'180px 1fr 70px 1fr 1fr', gap:8, alignItems:'center', marginBottom:8 }}>
                  <div style={{ fontSize:12.5, fontWeight:600 }}>{row.label}<span style={{ color:'#dc2626', marginLeft:2 }}>*</span></div>
                  <div style={{ display:'flex', alignItems:'center', gap:4 }}>
                    <span style={{ fontSize:12, color:'#6b7280' }}>20/</span>
                    <select style={{ ...sel, padding:'5px 6px' }} value={row.unc} onChange={e=>row.setUnc(e.target.value)}><option value=""></option>{SNELLEN.map(v=><option key={v}>{v}</option>)}</select>
                  </div>
                  <div style={{ display:'flex', justifyContent:'center' }}>
                    {row.showSwap&&<button type="button" onClick={()=>{ setOdCorr(odUnCorr); setOsCorr(osUnCorr); setOuCorr(ouUnCorr) }} style={{ background:'#16a34a', color:'#fff', border:'none', borderRadius:4, padding:'4px 8px', fontSize:10.5, fontWeight:700, cursor:'pointer' }}>⇄ Swap</button>}
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:4 }}>
                    <span style={{ fontSize:12, color:'#6b7280' }}>20/</span>
                    <select style={{ ...sel, padding:'5px 6px' }} value={row.cor} onChange={e=>row.setCor(e.target.value)}><option value=""></option>{SNELLEN.map(v=><option key={v}>{v}</option>)}</select>
                  </div>
                  <div>
                    {row.fld&&<div style={{ display:'flex', alignItems:'center', gap:6 }}><span style={{ fontSize:12 }}>{row.fld}</span><select style={{ ...sel, padding:'5px 6px', flex:1 }} value={row.fldV} onChange={e=>row.setFld(e.target.value)}><option value=""></option><option>≥70</option><option>60-69</option><option>50-59</option><option>40-49</option><option>&lt;40</option></select></div>}
                  </div>
                </div>
              ))}
              <div style={{ display:'flex', justifyContent:'flex-end', marginTop:8 }}>
                <button type="button" style={{ background:'#16a34a', color:'#fff', border:'none', borderRadius:4, padding:'5px 14px', fontSize:11.5, fontWeight:700, cursor:'pointer' }}>→ Preset</button>
              </div>
            </div>
            {[{q:'Applicant can recognize and distinguish among traffic control signals and devices showing red, green, and amber colors?',k:'colorVision',v:colorVision,s:setColorVision},{q:'Monocular vision?',k:'monocular',v:monocular,s:setMonocular},{q:'Referred to ophthalmologist or optometrist?',k:'refOphth',v:referredOphth,s:setReferredOphth},{q:'Received documentation from ophthalmologist or optometrist?',k:'recDocs',v:receivedDocs,s:setReceivedDocs}].map(row=>(
              <div key={row.k} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid #f3f4f6' }}>
                <span style={{ fontSize:12.5, flex:1, marginRight:16 }}>{row.q}<span style={{ color:'#dc2626', marginLeft:3 }}>*</span></span>
                <InlineYN name={row.k} value={row.v} onChange={row.s} />
              </div>
            ))}
          </div>
        )}

        {/* HEARING */}
        {tab==='Hearing' && (
          <div style={p}>
            <SectionTitle>Hearing</SectionTitle>
            <p style={{ fontSize:12, lineHeight:1.6, marginBottom:14 }}>Standard: <span style={{ color:'#0ea5e9' }}>Must first perceive whispered voice at not less than 5 feet</span> <strong>OR</strong> average hearing loss of less than or equal to 40 dB, in better ear (with or without hearing aid).</p>
            <div style={{ marginBottom:14 }}>
              <div style={{ fontSize:12, fontWeight:600, marginBottom:8 }}>Check if hearing aid used for test:</div>
              <div style={{ display:'flex', gap:20 }}>
                {[['Right Ear',hearAidRight,(v:boolean)=>setHearAidRight(v)],['Left Ear',hearAidLeft,(v:boolean)=>setHearAidLeft(v)],['Neither',hearAidNeither,(v:boolean)=>setHearAidNeither(v)]].map(([label,val,setFn])=>(
                  <label key={label as string} style={{ display:'flex', alignItems:'center', gap:6, fontSize:13, cursor:'pointer' }}>
                    <input type="checkbox" checked={val as boolean} onChange={e=>(setFn as (v:boolean)=>void)(e.target.checked)} style={{ width:14, height:14 }} />{label as string}
                  </label>
                ))}
              </div>
            </div>
            {[{type:'whisper',label:'Whisper Test Results',desc:'Record distance (feet) from individual at which forced whispered voice can first be heard.'},{type:'audio',label:'Audiometric Test Results',desc:'If audiometer is used, record hearing loss in decibels. (acc. to ANSI Z24.5-1951).'}].map(opt=>(
              <div key={opt.type} style={{ border:'1px solid #e5e7eb', borderRadius:4, overflow:'hidden', marginBottom:10 }}>
                <div style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 14px', background:hearingTest===opt.type?'#f0f9ff':'#f9fafb', borderBottom: hearingTest===opt.type?'1px solid #e5e7eb':'none', cursor:'pointer' }} onClick={()=>setHearingTest(opt.type as 'whisper'|'audio')}>
                  <input type="radio" checked={hearingTest===opt.type} onChange={()=>setHearingTest(opt.type as 'whisper'|'audio')} style={{ width:14, height:14, accentColor:'#0ea5e9' }} />
                  <span style={{ fontWeight:700, fontSize:12.5, color:hearingTest===opt.type?'#0ea5e9':'#374151' }}>{opt.label}</span>
                  <span style={{ fontSize:12, color:'#0ea5e9', flex:1 }}>{opt.desc}</span>
                </div>
                {hearingTest===opt.type && opt.type==='whisper' && (
                  <div style={{ padding:'12px 14px', display:'flex', gap:24 }}>
                    {[['Right Ear',whisperRight,setWhisperRight],['Left Ear',whisperLeft,setWhisperLeft]].map(([ear,val,setFn])=>(
                      <div key={ear as string} style={{ display:'flex', alignItems:'center', gap:8 }}>
                        <span style={{ fontSize:12.5, fontWeight:600 }}>{ear as string}</span>
                        <select style={{ ...sel, width:100 }} value={val as string} onChange={e=>(setFn as (v:string)=>void)(e.target.value)}>{HEARING_FT.map(v=><option key={v}>{v}</option>)}</select>
                      </div>
                    ))}
                  </div>
                )}
                {hearingTest===opt.type && opt.type==='audio' && (
                  <div style={{ padding:'12px 14px' }}>
                    {[{ear:'Right Ear',v:[audioR500,audioR1k,audioR2k],s:[setAudioR500,setAudioR1k,setAudioR2k]},{ear:'Left Ear',v:[audioL500,audioL1k,audioL2k],s:[setAudioL500,setAudioL1k,setAudioL2k]}].map(row=>(
                      <div key={row.ear} style={{ display:'flex', alignItems:'center', gap:14, marginBottom:8 }}>
                        <span style={{ fontSize:12.5, fontWeight:600, width:70 }}>{row.ear}</span>
                        {[['500Hz',0],['1000Hz',1],['2000Hz',2]].map(([hz,idx])=>(
                          <div key={hz as string} style={{ display:'flex', alignItems:'center', gap:6 }}>
                            <span style={{ fontSize:12, color:'#6b7280' }}>{hz as string}</span>
                            <select style={{ ...sel, width:80 }} value={row.v[idx as number]} onChange={e=>row.s[idx as number](e.target.value)}>{AUDIO_DB.map(v=><option key={v}>{v}</option>)}</select>
                          </div>
                        ))}
                        <span style={{ fontSize:12 }}>Average</span>
                        <div style={{ ...inp, width:55, padding:'5px 8px', background:'#f3f4f6', textAlign:'center' as const }}>{audioAvg(row.v[0],row.v[1],row.v[2])}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* VITALS */}
        {tab==='Vitals' && (
          <div style={p}>
            <SectionBox title="Measurements">
              <Row>
                <Field label="Height (in)" required flex={1}><input style={inp} value={htIn} onChange={e=>setHtIn(e.target.value)} placeholder="e.g. 70" /></Field>
                <Field label="Weight (lb)" required flex={1}><input style={inp} value={weight} onChange={e=>setWeight(e.target.value)} /></Field>
                <Field label="BMI" flex={1}><div style={{ ...inp, background:'#f3f4f6' }}>{bmi}</div></Field>
              </Row>
              <Row mb={10}>
                <Field label="Neck Size (in)" flex={1}><input style={inp} value={neckSize} onChange={e=>setNeckSize(e.target.value)} /></Field>
                <Field label="Smoker" flex={2}>
                  <div style={{ display:'flex', gap:16, marginTop:8 }}>
                    {['No','Yes'].map(v=><label key={v} style={{ display:'flex', alignItems:'center', gap:5, fontSize:13, cursor:'pointer' }}><input type="checkbox" checked={smoker===(v==='Yes')} onChange={()=>setSmoker(v==='Yes')} style={{ width:14, height:14 }} />{v}</label>)}
                  </div>
                </Field>
              </Row>
              <button type="button" style={{ background:'#16a34a', color:'#fff', border:'none', borderRadius:4, padding:'7px 14px', fontSize:12, fontWeight:600, cursor:'pointer' }}>↻ Copy BMI / Neck Size / Smoker to Physical Exam Notes</button>
            </SectionBox>
            <SectionBox title="Blood Pressure">
              <div style={{ display:'flex', gap:20, alignItems:'center', flexWrap:'wrap' as const }}>
                <span style={{ fontSize:12.5, fontWeight:600 }}>Sitting<span style={{ color:'#dc2626', marginLeft:2 }}>*</span></span>
                {[['Systolic',bp1s,setBp1s],['Diastolic',bp1d,setBp1d]].map(([label,val,setFn])=>(
                  <div key={label as string} style={{ display:'flex', alignItems:'center', gap:8 }}><span style={{ fontSize:12, color:'#6b7280' }}>{label as string}</span><input style={{ ...inp, width:70 }} value={val as string} onChange={e=>(setFn as (v:string)=>void)(e.target.value)} /></div>
                ))}
                <span style={{ fontSize:12.5, fontWeight:600 }}>Second Reading</span>
                {[['Systolic',bp2s,setBp2s,'#0ea5e9'],['Diastolic',bp2d,setBp2d,'#0ea5e9']].map(([label,val,setFn,color])=>(
                  <div key={label as string} style={{ display:'flex', alignItems:'center', gap:8 }}><span style={{ fontSize:12, color:color as string }}>{label as string}</span><input style={{ ...inp, width:70 }} value={val as string} onChange={e=>(setFn as (v:string)=>void)(e.target.value)} /></div>
                ))}
              </div>
            </SectionBox>
            <SectionBox title="Pulse">
              <div style={{ display:'flex', gap:24, alignItems:'center' }}>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <span style={{ fontSize:12.5, fontWeight:600 }}>Rate<span style={{ color:'#dc2626', marginLeft:2 }}>*</span></span>
                  <input style={{ ...inp, width:80 }} value={pulse} onChange={e=>setPulse(e.target.value)} />
                </div>
                <div>
                  <span style={{ fontSize:12.5, fontWeight:600, marginRight:12 }}>Pulse rhythm regular<span style={{ color:'#dc2626', marginLeft:2 }}>*</span></span>
                  {['Yes','No'].map(v=><label key={v} style={{ display:'inline-flex', alignItems:'center', gap:5, fontSize:13, cursor:'pointer', marginRight:12, color:pulseRegular===v?'#1d4ed8':'#374151', fontWeight:pulseRegular===v?700:400 }}><input type="radio" name="pulseReg" value={v} checked={pulseRegular===v} onChange={()=>setPulseRegular(v)} style={{ width:13, height:13, accentColor:'#374151' }} />{v}</label>)}
                </div>
              </div>
            </SectionBox>
          </div>
        )}

        {/* SLEEP */}
        {tab==='Sleep' && (
          <div style={p}>
            <SectionTitle>Sleep Screening (STOP BANG)</SectionTitle>
            <p style={{ fontSize:12, lineHeight:1.6, marginBottom:18 }}><strong>Note:</strong> This section is not a required part of the DOT Medical Exam. Information collected should be used at your discretion as part of your overall assessment of driver fitness.</p>
            {(() => {
              const yn = (v: string | undefined) => v === 'Yes' ? 'Yes' : v === 'No' ? 'No' : ''
              const bmiNum = parseFloat(bmi)
              const neckNum = parseFloat(neckSize)
              const isMale = gender === 'Male'
              const sbDerived: string[] = [
                yn(condAnswers[24]),                        // 0 SNORE — sleep disorder hx
                yn(condAnswers[24]),                        // 1 TIRED
                yn(condAnswers[24]),                        // 2 OBSERVED
                yn(condAnswers[6]),                         // 3 PRESSURE — hypertension hx
                bmiNum ? (bmiNum > 35 ? 'Yes' : 'No') : '',// 4 OBESE
                age !== null ? (age > 50 ? 'Yes' : 'No') : '',// 5 AGE
                neckNum ? ((isMale ? neckNum >= 17 : neckNum >= 16) ? 'Yes' : 'No') : '',// 6 NECK
                gender ? (isMale ? 'Yes' : 'No') : '',     // 7 MALE
              ]
              const sbHints = [
                condAnswers[24] ? `Auto from Health Hx 25 (${condAnswers[24]})` : undefined,
                condAnswers[24] ? `Auto from Health Hx 25 (${condAnswers[24]})` : undefined,
                condAnswers[24] ? `Auto from Health Hx 25 (${condAnswers[24]})` : undefined,
                condAnswers[6]  ? `Auto from Health Hx 7 (${condAnswers[6]})`  : undefined,
                bmi             ? `BMI: ${bmi}` : undefined,
                age !== null    ? `Age: ${age}` : undefined,
                neckSize        ? `Neck: ${neckSize} in` : undefined,
                gender          ? `Gender: ${gender}` : undefined,
              ]
              return [
                'Do you SNORE loudly?',
                'Do you often feel TIRED, fatigued, or sleepy during the daytime?',
                'Has anyone OBSERVED you stop breathing during your sleep?',
                'Do you have or are you being treated for high blood PRESSURE?',
                'Are you obese/ very overweight – BMI more than 35 kg/m2?',
                'AGE over 50 years old?',
                'NECK Circumference (Measured around Adams apple)\nMale ≥ 17 in, Female ≥ 16 in?',
                'GENDER: Male?',
              ].map((q, i) => {
                const derived = sbDerived[i]
                const current = stopBang[i] || derived
                const isAuto  = !stopBang[i] && !!derived
                return (
                  <div key={i} style={{ display:'flex', alignItems:'flex-start', padding:'10px 14px', background:i%2===0?'#fff':'#f9fafb', borderBottom:'1px solid #f3f4f6' }}>
                    <span style={{ fontSize:12.5, flex:1, whiteSpace:'pre-line' as const }}>{i+1}. {q}</span>
                    <div style={{ display:'flex', alignItems:'center', gap:10, flexShrink:0, marginLeft:12 }}>
                      <InlineYN name={`sb${i}`} value={current} onChange={v=>setStopBang(prev=>({...prev,[i]:v}))} />
                      {sbHints[i] && (
                        <span style={{ fontSize:10.5, color: isAuto ? '#2563eb' : '#9ca3af', whiteSpace:'nowrap' as const, background: isAuto ? '#eff6ff' : 'transparent', borderRadius:3, padding: isAuto ? '1px 5px' : 0 }}>
                          {isAuto ? '⚡ ' : ''}{sbHints[i]}
                        </span>
                      )}
                    </div>
                  </div>
                )
              })
            })()}
            </div>
            {stopScore>0&&<div style={{ fontSize:12.5, color:'#dc2626', fontWeight:700, marginBottom:12 }}>Total Score: {stopScore} ({stopRisk})</div>}
            <button type="button" style={{ background:'#16a34a', color:'#fff', border:'none', borderRadius:4, padding:'7px 16px', fontSize:12, fontWeight:600, cursor:'pointer' }}>↻ Copy OSA Risk Score to Physical Exam Notes</button>
          </div>
        )}

        {/* URINE/TESTING */}
        {tab==='Urine/Testing' && (
          <div style={p}>
            <SectionTitle>Urine/Testing</SectionTitle>
            <p style={{ fontSize:12, lineHeight:1.6, marginBottom:4 }}>Urine/Testing is required. <span style={{ color:'#0ea5e9' }}>Protein, blood or sugar in the urine may be an indication for further testing to rule out any underlying medical problem.</span></p>
            <p style={{ fontSize:12, color:'#0ea5e9', marginBottom:14 }}>Please select from list or type in values.</p>
            <Row>
              {[['Sp. Gr.',spGr,setSpGr,SP_GR_OPTS,'--Sp. Gr. Options--'],['Protein',protein,setProtein,UA_OPTS,'--Protein Options--'],['Blood',blood,setBlood,UA_OPTS,'--Blood Options--'],['Sugar',sugar,setSugar,UA_OPTS,'--Sugar Options--']].map(([label,val,setFn,opts,placeholder])=>(
                <Field key={label as string} label={label as string} required>
                  <select style={sel} value={val as string} onChange={e=>(setFn as (v:string)=>void)(e.target.value)}>
                    <option value="">{placeholder as string}</option>
                    {(opts as string[]).filter(Boolean).map(v=><option key={v}>{v}</option>)}
                  </select>
                </Field>
              ))}
            </Row>
            <Row mb={10}>
              {[['CCF / Specimen #',ccfNum,setCcfNum,'Enter CCF / Specimen #'],['A1C',a1c,setA1c,'Enter A1C'],['Glucose',glucose,setGlucose,'Enter Glucose'],['Spirometry',spirometry,setSpirom,'Enter Spirometry']].map(([label,val,setFn,ph])=>(
                <Field key={label as string} label={label as string}><input style={inp} value={val as string} onChange={e=>(setFn as (v:string)=>void)(e.target.value)} placeholder={ph as string} /></Field>
              ))}
            </Row>
            <button type="button" style={{ background:'#16a34a', color:'#fff', border:'none', borderRadius:4, padding:'7px 14px', fontSize:12, fontWeight:600, cursor:'pointer', marginBottom:20 }}>↻ Copy CCF &amp; A1CF &amp; Glucose &amp; Spirometry To Physical Exam Notes</button>
            <SectionTitle>Other testing if indicated</SectionTitle>
            <div style={{ display:'flex', gap:6, marginBottom:8 }}>
              <select style={{ ...sel, flex:1 }}><option>-- Add Other Tests --</option><option>EKG/ECG</option><option>Chest X-Ray</option><option>Pulmonary Function Test</option></select>
              <button type="button" style={{ background:'#16a34a', color:'#fff', border:'none', borderRadius:4, padding:'6px 14px', fontSize:12, fontWeight:700, cursor:'pointer', whiteSpace:'nowrap' as const }}>+ Insert</button>
            </div>
            <textarea rows={4} style={{ ...inp, resize:'vertical', fontFamily:'inherit' } as React.CSSProperties} value={otherTests} onChange={e=>setOtherTests(e.target.value)} />
          </div>
        )}

        {/* PHYSICAL */}
        {tab==='Physical' && (
          <div style={p}>
            <SectionTitle>Physical</SectionTitle>
            <p style={{ fontSize:12, lineHeight:1.6, marginBottom:12 }}>The presence of a certain condition may not necessarily disqualify a driver, particularly if the condition is controlled adequately, is not likely to worsen, or is readily amenable to treatment. Even if a condition does not disqualify a driver, the Medical Examiner may consider deferring the driver temporarily. Also, the driver should be advised to take the necessary steps to correct the condition as soon as possible, particularly if neglecting the condition could result in a more serious illness that might affect <span style={{ color:'#0ea5e9' }}>driving</span>.</p>
            <p style={{ fontSize:12, marginBottom:14 }}>Check the body systems for abnormalities.</p>
            <label style={{ display:'flex', alignItems:'center', gap:6, fontSize:13, cursor:'pointer', marginBottom:12 }}>
              All <input type="radio" checked={allNormal} onChange={()=>setSystems(Object.fromEntries(BODY_SYSTEMS.map(s=>[s,'Normal'])))} style={{ width:14, height:14, accentColor:'#16a34a' }} /> Normal
            </label>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:0, border:'1px solid #e5e7eb', borderRadius:4, overflow:'hidden', marginBottom:14 }}>
              {BODY_SYSTEMS.map((sys,i)=>(
                <div key={sys} style={{ display:'grid', gridTemplateColumns:'1fr 90px 100px', alignItems:'center', padding:'9px 14px', background:i%2===0?'#fff':'#f3f4f6', borderBottom:'1px solid #f3f4f6', borderRight:i%2===0?'1px solid #e5e7eb':'none' }}>
                  <span style={{ fontSize:12.5 }}>{i+1}. {sys}<span style={{ color:'#dc2626', marginLeft:2 }}>*</span></span>
                  <label style={{ display:'flex', alignItems:'center', gap:5, fontSize:12.5, cursor:'pointer' }}><input type="radio" name={`sys-${sys}`} checked={systems[sys]==='Normal'} onChange={()=>setSystems(p=>({...p,[sys]:'Normal'}))} style={{ width:13, height:13, accentColor:'#374151' }} />Normal</label>
                  <label style={{ display:'flex', alignItems:'center', gap:5, fontSize:12.5, cursor:'pointer' }}><input type="radio" name={`sys-${sys}`} checked={systems[sys]==='Abnormal'} onChange={()=>setSystems(p=>({...p,[sys]:'Abnormal'}))} style={{ width:13, height:13, accentColor:'#dc2626' }} />Abnormal</label>
                </div>
              ))}
            </div>
            <p style={{ fontSize:12, lineHeight:1.6, marginBottom:8 }}>Discuss any abnormal answers in detail in the space below and indicate whether it would affect the driver&apos;s ability to operate a CMV. Enter applicable item number before each comment.</p>
            <FreqCommentBox value={physComments} onChange={setPhysComments} />
          </div>
        )}

        {/* DETERMINATION */}
        {tab==='Determination' && (
          <div style={p}>
            <SectionTitle>Medical Examiner Determination ({detType})</SectionTitle>
            <div style={{ display:'grid', gridTemplateColumns:'220px 1fr', rowGap:12, columnGap:16, alignItems:'center', marginBottom:20 }}>
              <span style={{ fontSize:12.5, fontWeight:600 }}>Exam Date<span style={{ color:'#dc2626', marginLeft:2 }}>*</span></span>
              <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                <input type="date" style={{ ...inp, maxWidth:200 }} value={examDateRaw} onChange={e=>setExamDateRaw(e.target.value)} />
                <button type="button" onClick={()=>setExamDateRaw(new Date().toISOString().slice(0,10))} style={{ background:'#16a34a', color:'#fff', border:'none', borderRadius:4, padding:'6px 14px', fontSize:12, fontWeight:600, cursor:'pointer', whiteSpace:'nowrap' as const }}>↻ Refresh Dates</button>
              </div>
              <span style={{ fontSize:12.5, fontWeight:600 }}>Result Determined Date<span style={{ color:'#dc2626', marginLeft:2 }}>*</span></span>
              <div style={{ ...inp, maxWidth:200, background:'#f3f4f6' }}>{new Date().toLocaleDateString('en-US',{month:'2-digit',day:'2-digit',year:'numeric'})}</div>
              <span style={{ fontSize:12.5, fontWeight:600 }}>Type<span style={{ color:'#dc2626', marginLeft:2 }}>*</span></span>
              <div style={{ display:'flex', gap:20 }}>
                {(['Federal','State'] as const).map(v=><label key={v} style={{ display:'flex', alignItems:'center', gap:6, fontSize:13, cursor:'pointer', color:detType===v?'#1d4ed8':'#374151', fontWeight:detType===v?700:400 }}><input type="radio" name="detType" value={v} checked={detType===v} onChange={()=>setDetType(v)} style={{ width:14, height:14, accentColor:'#374151' }} />{v}</label>)}
              </div>
            </div>
            {[{val:'qualifies2yr',label:'Meets standards in 49 CFR 391.41; qualifies for 2-year certificate',hasReason:false},{val:'doesNotMeet',label:'Does not meet standards',italic:'(specify reason)',hasReason:true},{val:'monitoring',label:'Meets standards, but periodic monitoring required',italic:'(specify reason)',hasReason:true,hasPeriod:true},{val:'pending',label:'Determination pending',italic:'(specify reason)',hasReason:true},{val:'incomplete',label:'Incomplete examination',italic:'(specify reason)',hasReason:true}].map(opt=>(
              <div key={opt.val} style={{ marginBottom:10 }}>
                <div style={{ display:'flex', alignItems:'center', gap:10, flexWrap:'wrap' as const }}>
                  <label style={{ display:'flex', alignItems:'center', gap:6, fontSize:12.5, cursor:'pointer', minWidth:280, color:determination===opt.val?'#1d4ed8':'#374151', fontWeight:determination===opt.val?700:400 }}>
                    <input type="radio" name="det" value={opt.val} checked={determination===opt.val} onChange={()=>setDetermination(opt.val)} style={{ width:13, height:13, accentColor:'#374151' }} />
                    {opt.label} {opt.italic&&<em style={{ fontWeight:400, color:'#6b7280' }}>{opt.italic}</em>}
                  </label>
                  {opt.hasReason&&determination===opt.val&&(
                    <>
                      <input style={{ ...inp, flex:1, maxWidth:220 }} placeholder="Enter Reason ..." value={detReasons[opt.val]??''} onChange={e=>setDetReasons(p=>({...p,[opt.val]:e.target.value}))} />
                      <select style={{ ...sel, flex:1, maxWidth:220 }}>{FREQ_COMMENTS.map(c=><option key={c}>{c}</option>)}</select>
                      <button type="button" style={{ background:'#16a34a', color:'#fff', border:'none', borderRadius:4, padding:'6px 12px', fontSize:12, fontWeight:700, cursor:'pointer', whiteSpace:'nowrap' as const }}>+ Insert</button>
                    </>
                  )}
                </div>
                {(opt as any).hasPeriod&&determination===opt.val&&(
                  <div style={{ marginLeft:22, marginTop:8, display:'flex', alignItems:'center', gap:14 }}>
                    <span style={{ fontSize:12.5 }}>Driver qualified only for</span>
                    {['3 months','6 months','1 Year','Other'].map(period=><label key={period} style={{ display:'flex', alignItems:'center', gap:5, fontSize:12.5, cursor:'pointer', color:monitorPeriod===period?'#1d4ed8':'#374151', fontWeight:monitorPeriod===period?700:400 }}><input type="radio" name="monPeriod" checked={monitorPeriod===period} onChange={()=>setMonitorPeriod(period)} style={{ width:13, height:13, accentColor:'#374151' }} />{period}</label>)}
                    <button type="button" onClick={()=>setMonitorPeriod('')} style={{ fontSize:11.5, color:'#0ea5e9', background:'none', border:'none', cursor:'pointer', padding:0 }}>Clear</button>
                  </div>
                )}
              </div>
            ))}
            <div style={{ marginTop:20 }}>
              <div style={{ fontWeight:700, fontSize:14, marginBottom:12 }}>Qualified Only When</div>
              {[{key:'lenses',label:'Wearing corrective lenses'},{key:'hearingAid',label:'Wearing hearing aid'},{key:'waiver',label:'Accompanied by a waiver/exemption',hasType:true},{key:'intracity',label:'Driving within an exempt intracity zone 46 CFR 391.62'},{key:'spe',label:'Accompanied by a Skill Performance Evaluation Certificate (SPE)'}].map(r=>(
                <div key={r.key} style={{ marginBottom:10 }}>
                  <label style={{ display:'flex', alignItems:'center', gap:8, fontSize:13, cursor:'pointer' }}>
                    <input type="checkbox" checked={!!detRestrictions[r.key]} onChange={e=>setDetRestrictions(p=>({...p,[r.key]:e.target.checked}))} style={{ width:14, height:14 }} />
                    <span style={{ color:detRestrictions[r.key]?'#0ea5e9':'#374151' }}>{r.label}</span>
                  </label>
                  {(r as any).hasType&&detRestrictions[r.key]&&(
                    <select style={{ ...sel, maxWidth:240, marginLeft:22, marginTop:6 }} value={waiverType} onChange={e=>setWaiverType(e.target.value)}>
                      <option value=""></option><option>Diabetes Exemption</option><option>Vision Exemption</option><option>Hearing Exemption</option><option>Skill Performance Evaluation</option>
                    </select>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUBMIT */}
        {tab==='Submit' && (
          <div style={p}>
            <p style={{ fontSize:12, lineHeight:1.6, marginBottom:16, color:'#374151' }}>
              If the driver meets the standards outlined in 49 CFR 391.41, then complete a Medical Examiner&apos;s Certificate as stated in 49 CFR 391.43(h), as appropriate.
            </p>
            <p style={{ fontSize:12, color:'#374151', marginBottom:20 }}>This exam must be reported to the FMCSA. Please review information and click &quot;SUBMIT&quot; button below.</p>

            <SectionBox title="Examiner">
              <div style={{ display:'grid', gridTemplateColumns:'160px 1fr', rowGap:12, columnGap:20, alignItems:'center', maxWidth:500 }}>
                <span style={{ fontSize:12.5, fontWeight:600, textAlign:'right' as const, color:'#374151' }}>Name</span>
                <span style={{ fontSize:12.5, color:'#374151' }}>Chantal Simpson-Gabriel</span>
                <span style={{ fontSize:12.5, fontWeight:600, textAlign:'right' as const, color:'var(--accent, #0ea5e9)' }}>State / License #<span style={{ color:'#dc2626', marginLeft:2 }}>*</span></span>
                <select style={{ ...sel, maxWidth:260 }} value={examinerLicense} onChange={e=>setExaminerLicense(e.target.value)}>
                  <option>NJ - 25MA07511100</option><option>NY - 12345678</option>
                </select>
                <span style={{ fontSize:12.5, fontWeight:600, textAlign:'right' as const, color:'var(--accent, #0ea5e9)' }}>Phone<span style={{ color:'#dc2626', marginLeft:2 }}>*</span></span>
                <input type="tel" style={{ ...inp, maxWidth:200 }} value={examinerPhone} onChange={e=>setExaminerPhone(e.target.value)} />
                <span style={{ fontSize:12.5, fontWeight:600, textAlign:'right' as const, color:'var(--accent, #0ea5e9)' }}>National Registry #</span>
                <span style={{ fontSize:12.5, color:'#374151' }}>7657080894</span>
                <span style={{ fontSize:12.5, fontWeight:600, textAlign:'right' as const, color:'var(--accent, #0ea5e9)' }}>Type</span>
                <span style={{ fontSize:12.5, color:'var(--accent, #0ea5e9)' }}>Medical Doctor</span>
              </div>
            </SectionBox>

            <SectionBox title="Signature *">
              <div style={{ display:'grid', gridTemplateColumns:'140px 1fr', rowGap:12, columnGap:16, alignItems:'center' }}>
                <span style={{ fontSize:12.5, fontWeight:600 }}>Current Signature:</span>
                <SignaturePad />
              </div>
            </SectionBox>

            <div style={{ background:'#fef3c7', border:'1px solid #fde68a', borderRadius:6, padding:'10px 14px', fontSize:12.5, color:'#92400e', marginBottom:16 }}>
              ⚠ Review all sections before submitting. Once submitted, the exam record will be transmitted to the FMCSA National Registry.
            </div>
            <div style={{ display:'flex', gap:10, flexWrap:'wrap' as const }}>
              <button type="button" style={{ background:'#16a34a', color:'#fff', border:'none', borderRadius:6, padding:'10px 28px', fontSize:14, fontWeight:700, cursor:'pointer' }}>Submit to FMCSA</button>
              <button type="button" onClick={() => openPdf('/api/forms/mcsa5875')} style={{ background:'#1a3a5c', color:'#fff', border:'none', borderRadius:6, padding:'10px 20px', fontSize:13, fontWeight:700, cursor:'pointer' }}>🖨 Print Long Form (MCSA-5875)</button>
              <button type="button" onClick={() => openPdf('/api/forms/mcsa5876')} style={{ background:'#0ea5e9', color:'#fff', border:'none', borderRadius:6, padding:'10px 20px', fontSize:13, fontWeight:700, cursor:'pointer' }}>🪪 Print Certificate (MCSA-5876)</button>
            </div>
          </div>
        )}

        {/* SUMMARY */}
        {tab==='Summary' && (
          <div style={p}>
            <SectionTitle>Exam Summary</SectionTitle>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
              {[
                {title:'Driver',items:[['Name',driverName||'—'],['DOB',dobDisplay||'—'],['License',dlNumber?`${dlNumber} (${dlState})`:'—'],['Phone',primaryPhone||'—']]},
                {title:'Exam',  items:[['Determination',determination||'—'],['Type',detType],['BP 1st',bp1s&&bp1d?`${bp1s}/${bp1d}`:'—']]},
                {title:'Vitals',items:[['Height',htIn?`${htIn} in`:'—'],['Weight',weight?`${weight} lbs`:'—'],['BMI',bmi||'—'],['Pulse',pulse?`${pulse} bpm`:'—']]},
                {title:'Testing',items:[['OD Corr',odCorr?`20/${odCorr}`:'—'],['OS Corr',osCorr?`20/${osCorr}`:'—'],['Whisper R',whisperRight?`${whisperRight} ft`:'—'],['Whisper L',whisperLeft?`${whisperLeft} ft`:'—']]},
              ].map(section=>(
                <div key={section.title} style={{ border:'1px solid #e5e7eb', borderRadius:6, overflow:'hidden' }}>
                  <div style={{ background:'#f3f4f6', padding:'8px 12px', fontWeight:700, fontSize:12, borderBottom:'1px solid #e5e7eb' }}>{section.title}</div>
                  {section.items.map(([l,v])=><div key={l} style={{ display:'flex', padding:'6px 12px', borderBottom:'1px solid #f3f4f6' }}><span style={{ fontSize:11, color:'#6b7280', width:110, flexShrink:0 }}>{l}</span><span style={{ fontSize:12, color:'#111', fontWeight:500 }}>{v}</span></div>)}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DOCUMENTS */}
        {tab==='Documents' && (
          <div style={p}>
            <SectionTitle>Official FMCSA Forms</SectionTitle>
            <p style={{ fontSize:12, color:'#6b7280', marginBottom:14 }}>
              Generate filled MCSA-5875 and MCSA-5876 PDFs from the current exam data. Save the exam first to preserve a permanent record.
            </p>

            {!docUrls ? (
              <button
                type="button"
                onClick={async () => {
                  const params = buildPdfParams()
                  const body = JSON.stringify(params)
                  const [r5875, r5876] = await Promise.all([
                    fetch('/api/forms/mcsa5875', { method:'POST', headers:{'Content-Type':'application/json'}, body }),
                    fetch('/api/forms/mcsa5876', { method:'POST', headers:{'Content-Type':'application/json'}, body }),
                  ])
                  if (!r5875.ok || !r5876.ok) {
                    const err = await (r5875.ok ? r5876 : r5875).text()
                    alert('PDF error: ' + err); return
                  }
                  const [b5875, b5876] = await Promise.all([r5875.blob(), r5876.blob()])
                  setDocUrls({
                    url5875: URL.createObjectURL(b5875),
                    url5876: URL.createObjectURL(b5876),
                  })
                }}
                style={{ background:'#1e40af', color:'#fff', border:'none', borderRadius:6, padding:'10px 22px', fontSize:13, fontWeight:700, cursor:'pointer', marginBottom:16 }}
              >
                Generate Official PDFs
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setDocUrls(null)}
                style={{ background:'#6b7280', color:'#fff', border:'none', borderRadius:6, padding:'7px 16px', fontSize:12, fontWeight:600, cursor:'pointer', marginBottom:16 }}
              >
                Regenerate
              </button>
            )}

            {docUrls && (
              <div style={{ display:'flex', flexDirection:'column' as const, gap:20 }}>
                {/* MCSA-5875 */}
                <div style={{ border:'1px solid #e5e7eb', borderRadius:8, overflow:'hidden' }}>
                  <div style={{ background:'#1e3a5f', color:'#fff', padding:'8px 14px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                    <span style={{ fontWeight:700, fontSize:13 }}>MCSA-5875 — Medical Examination Report</span>
                    <a href={docUrls.url5875} download={`MCSA-5875-${lastName}.pdf`} style={{ color:'#93c5fd', fontSize:12, textDecoration:'none', fontWeight:600 }}>
                      ⬇ Download
                    </a>
                  </div>
                  <iframe src={docUrls.url5875} style={{ width:'100%', height:600, border:'none', display:'block' }} title="MCSA-5875" />
                </div>

                {/* MCSA-5876 */}
                <div style={{ border:'1px solid #e5e7eb', borderRadius:8, overflow:'hidden' }}>
                  <div style={{ background:'#1e3a5f', color:'#fff', padding:'8px 14px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                    <span style={{ fontWeight:700, fontSize:13 }}>MCSA-5876 — Medical Examiner's Certificate</span>
                    <a href={docUrls.url5876} download={`MCSA-5876-${lastName}.pdf`} style={{ color:'#93c5fd', fontSize:12, textDecoration:'none', fontWeight:600 }}>
                      ⬇ Download
                    </a>
                  </div>
                  <iframe src={docUrls.url5876} style={{ width:'100%', height:380, border:'none', display:'block' }} title="MCSA-5876" />
                </div>
              </div>
            )}
          </div>
        )}

        {/* MEMO */}
        {tab==='Memo' && (
          <div style={p}>
            <SectionTitle>Internal Memo / Notes</SectionTitle>
            <p style={{ fontSize:12, color:'#6b7280', marginBottom:12 }}>For internal use only — will not appear on printed forms.</p>
            <textarea rows={8} style={{ ...inp, resize:'vertical', fontFamily:'inherit' } as React.CSSProperties} placeholder="Internal notes, follow-up reminders..." value={memo} onChange={e=>setMemo(e.target.value)} />
          </div>
        )}

      </div>

      {/* Bottom nav */}
      <div style={{ borderTop:'1px solid #e5e7eb', background:'#f9fafb', padding:'10px 20px', display:'flex', alignItems:'center', gap:10, flexShrink:0, flexWrap:'wrap' as const }}>
        <button type="button" onClick={saveExam} disabled={saving} style={{ background: saving ? '#9ca3af' : '#16a34a', color:'#fff', border:'none', borderRadius:4, padding:'8px 20px', fontSize:13, fontWeight:700, cursor: saving ? 'not-allowed' : 'pointer' }}>
          {saving ? '…' : (lang==='English'?'✓ Save':'✓ Salvar')}
        </button>
        <button type="button" onClick={()=>tabIdx<TABS.length-1&&setTab(TABS[tabIdx+1])} style={{ background:'#16a34a', color:'#fff', border:'none', borderRadius:4, padding:'8px 20px', fontSize:13, fontWeight:700, cursor:'pointer' }}>
          {tabIdx<TABS.length-1?(lang==='English'?'→ Save and Next':'→ Guardar y Siguiente'):(lang==='English'?'✓ Complete':'✓ Completo')}
        </button>
        {saveMsg && (
          <span style={{ fontSize:12, fontWeight:600, color: saveMsg.ok ? '#16a34a' : '#dc2626', background: saveMsg.ok ? '#f0fdf4' : '#fef2f2', border: `1px solid ${saveMsg.ok ? '#86efac' : '#fecaca'}`, borderRadius:4, padding:'5px 10px' }}>
            {saveMsg.text}
          </span>
        )}
        <button type="button" style={{ background:'#fff', color:'#374151', border:'1px solid #d1d5db', borderRadius:4, padding:'8px 16px', fontSize:13, fontWeight:600, cursor:'pointer', marginLeft:'auto' }}>✂ Clear</button>
        <span style={{ fontSize:11.5, color:'#9ca3af' }}>{tabIdx+1} / {TABS.length} — {tab}</span>
      </div>
      <iframe ref={certFrameRef} title="cert-print" style={{ display:'none' }} />
    </div>
  )
}
