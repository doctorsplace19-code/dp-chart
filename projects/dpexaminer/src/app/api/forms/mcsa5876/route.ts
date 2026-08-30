import { NextRequest, NextResponse } from 'next/server'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

async function buildPdf(data: Record<string, string>) {
  const g = (k: string) => data[k] ?? ''

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://workoccmed-examiner.vercel.app'
  const res = await fetch(`${baseUrl}/forms/MCSA-5876.pdf`)
  if (!res.ok) throw new Error(`MCSA-5876 template not found (${res.status})`)
  const pdfBytes = await res.arrayBuffer()
  const pdfDoc   = await PDFDocument.load(pdfBytes)
  const form     = pdfDoc.getForm()
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

  const isFederal = g('detType') !== 'State'
  const credential = g('credential') || 'MD'
  const credMap: Record<string, string> = { MD: 'MD', DO: 'DO', PA: 'PA', DC: 'DC', APN: 'APN', OTHER: 'Other' }

  setText('cmvLast',   g('lastName'))
  setText('cmvFirst',  g('firstName'))
  setText('driverNumber', g('dlNumber'))
  setDropdown('cmvState', g('dlState'))
  setText('cmvStreet', g('address'))
  setText('cmvCity',   g('city'))
  setText('cmvZip',    g('zip'))
  setRadio('clpButton', g('isCDL') === '1' ? 'Yes' : 'No')

  setRadio('examButton', isFederal ? 'Federal' : 'State')
  setText('expDate',  g('expiryDate'))
  setText('examDate', g('examDate'))

  setCheck('lensBox',      g('restLenses')    === '1')
  setCheck('hearBox',      g('restHearing')   === '1')
  setCheck('waiverBox',    g('restWaiver')    === '1')
  setText('waiverDescribe', g('waiverDesc'))
  setCheck('speBox',       g('restSPE')       === '1')
  setCheck('intraBox',     g('restIntracity') === '1')
  setCheck('grandBox',     g('grandfathered') === '1')

  setText('examName',     g('examinerName'))
  setText('examPhone',    g('examinerPhone'))
  setText('examNumber',   g('licenseNumber'))
  setDropdown('examState', g('licState'))
  setText('examRegistry', g('nrcme'))
  setRadio('examinerType', credMap[credential] ?? 'MD')
  if (credential === 'OTHER') setText('otherPrac', g('credOther'))

  // ── Draw examiner signature on page 0 at rect {x:24, y:271, w:360, h:13} ──
  const examSigB64 = g('examSignatureB64')
  if (examSigB64) {
    try {
      const raw = examSigB64.replace(/^data:image\/\w+;base64,/, '')
      const img = await pdfDoc.embedPng(Buffer.from(raw, 'base64'))
      pdfDoc.getPage(0).drawImage(img, { x: 24, y: 268, width: 200, height: 30 })
    } catch {}
  } else {
    const examName = g('examinerName') || 'Chantal Simpson-Gabriel'
    try {
      pdfDoc.getPage(0).drawText(examName, {
        x: 24, y: 274, size: 10,
        font: helveticaOblique, color: rgb(0, 0, 0),
      })
    } catch {}
  }

  // ── Draw driver signature on page 0 at rect {x:24, y:128, w:360, h:13} ──
  const driverSigB64 = g('driverSignatureB64')
  if (driverSigB64) {
    try {
      const raw = driverSigB64.replace(/^data:image\/\w+;base64,/, '')
      const img = await pdfDoc.embedPng(Buffer.from(raw, 'base64'))
      pdfDoc.getPage(0).drawImage(img, { x: 24, y: 124, width: 200, height: 30 })
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
        'Content-Disposition': `inline; filename="MCSA-5876-${name}.pdf"`,
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
        'Content-Disposition': `inline; filename="MCSA-5876-${name}.pdf"`,
      },
    })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
