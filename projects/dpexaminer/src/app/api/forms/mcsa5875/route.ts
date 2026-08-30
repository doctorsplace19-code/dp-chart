import { NextRequest, NextResponse } from 'next/server'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

async function buildPdf(data: Record<string, string>) {
  const g = (k: string) => data[k] ?? ''

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://workoccmed-examiner.vercel.app'
  const res = await fetch(`${baseUrl}/forms/MCSA-5875.pdf`)
  if (!res.ok) throw new Error(`MCSA-5875 template not found (${res.status})`)
  const pdfBytes = await res.arrayBuffer()
  const pdfDoc   = await PDFDocument.load(pdfBytes)
  const form     = pdfDoc.getForm()
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const helveticaOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique)

  function setText(name: string, value: string) {
    try { form.getTextField(name).setText(value) } catch {}
  }
  function setCheck(name: string, value: boolean) {
    try { value ? form.getCheckBox(name).check() : form.getCheckBox(name).uncheck() } catch {}
  }
  function setRadio(name: string, value: string) {
    if (!value) return
    try { form.getRadioGroup(name).select(value) } catch {}
  }
  function setDropdown(name: string, value: string) {
    if (!value) return
    try { form.getDropdown(name).select(value) } catch {}
  }

  // ── Driver info — page 1 ────────────────────────────────────────────────
  setText('driverFirst',   g('firstName'))
  setText('driverMiddle',  g('middleName'))
  setText('driverLast',    g('lastName'))
  setText('driverDOB',     g('dob'))
  setText('driverAge',     g('age'))
  setText('driverAddress', g('address'))
  setText('driverCity',    g('city'))
  setDropdown('driverState', g('state'))
  setText('driverZip',     g('zip'))
  setText('driverPhone',   g('phone'))
  setText('driverLicense', g('dlNumber'))
  setDropdown('driverIssue', g('dlState'))
  setText('driverVerify',  g('idVerifiedBy'))
  setText('medRecordNum',  g('medRecordNum'))
  setRadio('licenseButton', g('isCDL') === '1' ? 'Yes' : 'No')

  // ── Medical history ─────────────────────────────────────────────────────
  setRadio('surgeryButton',  g('surgery'))
  setText('surgeryDescribe', g('surgeryDesc'))
  setRadio('medicineButton', g('medicine'))
  setText('medicineDescribe', g('medicineDesc'))

  for (let i = 1; i <= 32; i++) setRadio(`${i}Button`, g(`cond${i}`))
  setRadio('13aButton',     g('cond13a'))
  setRadio('otherButton',   g('condOther'))
  setText('otherDescribe',  g('condOtherDesc'))
  setRadio('commentButton', g('condSummary'))
  setText('commentDescribe', g('condSummaryDesc'))
  setText('examinerComment', g('reviewComment'))
  setText('signatureDate',   g('examDate'))

  // ── Physical exam — page 2 ──────────────────────────────────────────────
  setText('driverLast2',  g('lastName'))
  setText('driverFirst2', g('firstName'))
  setText('dateBirth2',   g('dob'))
  setText('examDate2',    g('examDate'))

  const htRaw = g('height')
  if (htRaw) {
    const totalIn = Number(htRaw)
    setText('feetHeight',  Math.floor(totalIn / 12).toString())
    setText('inchesHeight', (totalIn % 12).toString())
  }
  setText('poundsWeight', g('weight'))
  setText('pulseMeasure', g('pulse'))
  setRadio('pulseButton', g('pulseReg'))

  setText('sitSys',  g('bp1s'))
  setText('sitDias', g('bp1d'))
  setText('secSys',  g('bp2s'))
  setText('secDias', g('bp2d'))

  setText('specgravNumber 3', g('spGr'))
  setText('proteinNumber',    g('protein'))
  setText('bloodNumber',      g('blood'))
  setText('sugarNumber',      g('sugar'))
  setText('otherTesting',     g('otherTests'))
  setText('examComment',      g('physComments'))

  setText('uncorrectRight', g('odUnCorr'))
  setText('uncorrectLeft',  g('osUnCorr'))
  setText('uncorrectBoth',  g('ouUnCorr'))
  setText('correctRight',   g('odCorr'))
  setText('correctLeft',    g('osCorr'))
  setText('correcboth',     g('ouCorr'))
  setText('fieldRight',     g('fieldRight'))
  setText('fieldLeft',      g('fieldLeft'))
  setRadio('distinguishButton',   g('colorVision'))
  setRadio('monocularButton',     g('monocular'))
  setRadio('referredButton',      g('referred'))
  setRadio('documentationButton', g('docs'))

  setCheck('rightBox',   g('hearAidRight') === '1')
  setCheck('leftBox',    g('hearAidLeft')  === '1')
  setCheck('neitherBox', g('hearAidNeither') === '1')
  setText('whisperRight', g('whisperRight'))
  setText('whisperLeft',  g('whisperLeft'))
  setText('right500',  g('audioR500'))
  setText('left500',   g('audioL500'))
  setText('right1000', g('audioR1k'))
  setText('left1000',  g('audioL1k'))
  setText('right2000', g('audioR2k'))
  setText('left2000',  g('audioL2k'))

  const sysList = ['general','abdomen','skin','genito','eyes','spine','ears','joints','mouth','neuro','cardio','gait','lungs','vascular']
  for (const sys of sysList) setRadio(`${sys}Button`, g(`sys_${sys}`))

  // ── Determination — page 3/4 ────────────────────────────────────────────
  setText('driverLast3',  g('lastName'))
  setText('driverFirst3', g('firstName'))
  setText('dateBirth3',   g('dob'))
  setText('examDate3',    g('examDate'))
  setText('driverLast4',  g('lastName'))
  setText('driverFirst4', g('firstName'))
  setText('dateBirth4',   g('dob'))
  setText('examDate4',    g('examDate'))

  setRadio('qualifyButton', g('qualifyDet'))
  setText('certDate',      g('examDate'))
  setText('expireDate',    g('expiryDate'))
  setText('nationalRegister', g('nrcme'))
  setText('examName',        g('examinerName'))
  setText('medicalPhone',    g('examinerPhone'))
  setDropdown('medicalState', g('examinerState'))
  setDropdown('issueState',   g('licState'))

  setCheck('correctBox', g('restLenses')    === '1')
  setCheck('hearBox',    g('restHearing')   === '1')
  setCheck('waiverBox',  g('restWaiver')    === '1')
  setCheck('speBox',     g('restSPE')       === '1')
  setCheck('exemptBox',  g('restIntracity') === '1')

  setCheck('mdBox',      g('credential') === 'MD')
  setCheck('doBox',      g('credential') === 'DO')
  setCheck('paBox',      g('credential') === 'PA')
  setCheck('chiroBox',   g('credential') === 'DC')
  setCheck('advBox',     g('credential') === 'APN')
  setCheck('practiceBox', g('credential') === 'OTHER')

  setRadio('standardsButton', g('detType') === 'State' ? 'State' : 'Federal')

  // ── Draw signatures directly on pages ──────────────────────────────────
  // driverSignature → page 1 at rect {x:96, y:183.245, w:210, h:12}
  const driverSigB64 = g('driverSignatureB64')
  if (driverSigB64) {
    try {
      const raw = driverSigB64.replace(/^data:image\/\w+;base64,/, '')
      const img = await pdfDoc.embedPng(Buffer.from(raw, 'base64'))
      pdfDoc.getPage(1).drawImage(img, { x: 96, y: 183.245, width: 210, height: 24 })
    } catch {}
  }

  // examSignature → page 3 at rect {x:141, y:426.245, w:243, h:12}
  const examSigB64 = g('examSignatureB64')
  if (examSigB64) {
    try {
      const raw = examSigB64.replace(/^data:image\/\w+;base64,/, '')
      const img = await pdfDoc.embedPng(Buffer.from(raw, 'base64'))
      pdfDoc.getPage(3).drawImage(img, { x: 141, y: 423, width: 243, height: 30 })
    } catch {}
  } else {
    // Draw examiner name as italic text when no image signature
    const examName = g('examinerName') || 'Chantal Simpson-Gabriel'
    try {
      pdfDoc.getPage(3).drawText(examName, {
        x: 141, y: 429, size: 9,
        font: helveticaOblique, color: rgb(0, 0, 0),
      })
    } catch {}
    try {
      pdfDoc.getPage(4).drawText(examName, {
        x: 141, y: 528, size: 9,
        font: helveticaOblique, color: rgb(0, 0, 0),
      })
    } catch {}
  }

  form.flatten()

  return { pdfDoc, name: [g('lastName'), g('firstName')].filter(Boolean).join('-') || 'driver' }
}

export async function GET(req: NextRequest) {
  try {
    const params: Record<string, string> = {}
    req.nextUrl.searchParams.forEach((v, k) => { params[k] = v })
    const { pdfDoc, name } = await buildPdf(params)
    const filledBytes = await pdfDoc.save()
    return new NextResponse(Buffer.from(filledBytes), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="MCSA-5875-${name}.pdf"`,
      },
    })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { pdfDoc, name } = await buildPdf(body)
    const filledBytes = await pdfDoc.save()
    return new NextResponse(Buffer.from(filledBytes), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="MCSA-5875-${name}.pdf"`,
      },
    })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
