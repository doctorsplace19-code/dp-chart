export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
  }
  try {
    const { prisma } = await import('@/lib/prisma')
    const body = await req.json()
    const { companySlug, examId, ...fields } = body as Record<string, any>

    const company = await prisma.company.findFirst({ where: { slug: companySlug } })
    if (!company) return NextResponse.json({ error: `Company not found: ${companySlug}` }, { status: 404 })

    const practitioner = await prisma.practitioner.findFirst({ where: { companyId: company.id } })
    if (!practitioner) return NextResponse.json({ error: 'No practitioner found' }, { status: 404 })

    if (!fields.firstName || !fields.lastName) {
      return NextResponse.json({ error: 'First and last name are required' }, { status: 400 })
    }

    const data = {
      companyId:      company.id,
      practitionerId: practitioner.id,
      firstName:      fields.firstName?.trim() ?? '',
      lastName:       fields.lastName?.trim() ?? '',
      middleName:     fields.middleName || null,
      sex:            fields.sex || null,
      dob:            fields.dob || null,
      cityBirth:      fields.cityBirth || null,
      countryBirth:   fields.countryBirth || null,
      idNumber:       fields.idNumber || null,
      idType:         fields.idType || null,
      uscisAccount:   fields.uscisAccount || null,
      alienReg:       fields.alienReg || null,
      overseasExam:   !!fields.overseasExam,
      careOf:         fields.careOf || null,
      street:         fields.street || null,
      addrType:       fields.addrType || null,
      aptNum:         fields.aptNum || null,
      city:           fields.city || null,
      state:          fields.state || null,
      zip:            fields.zip || null,
      country:        fields.country || null,
      notes:          fields.notes || null,
      noIGRA:             !!fields.noIGRA,
      quantiferonDate:    fields.quantiferonDate || null,
      tspotDate:          fields.tspotDate || null,
      igraResult:         fields.igraResult || null,
      tbScreening:        fields.tbScreening || null,
      sputumSmears:       fields.sputumSmears ? JSON.stringify(fields.sputumSmears) : null,
      tbClassification:   fields.tbClassification || null,
      tbRemarks:          fields.tbRemarks || null,
      syphCollectionDate: fields.syphCollectionDate || null,
      syphReactive:       fields.syphReactive || null,
      syphFinding:        fields.syphFinding || null,
      syphRemarks:        fields.syphRemarks || null,
      syphDrugs:          fields.syphDrugs || null,
      syphDosage:         fields.syphDosage || null,
      syphStart:          fields.syphStart || null,
      syphEnd:            fields.syphEnd || null,
      gonDate:            fields.gonDate || null,
      gonResult:          fields.gonResult || null,
      gonFinding:         fields.gonFinding || null,
      gonRemarks:         fields.gonRemarks || null,
      gonDrugs:           fields.gonDrugs || null,
      gonDosage:          fields.gonDosage || null,
      gonStart:           fields.gonStart || null,
      gonEnd:             fields.gonEnd || null,
      disorderFinding:    fields.disorderFinding || null,
      disorderRemarks:    fields.disorderRemarks || null,
      commFinding:        fields.commFinding || null,
      commRemarks:        fields.commRemarks || null,
      substanceFinding:   fields.substanceFinding || null,
      substanceRemarks:   fields.substanceRemarks || null,
      vaccData:           fields.vaccData ? JSON.stringify(fields.vaccData) : null,
      vaccOverall:        fields.vaccOverall ? JSON.stringify(fields.vaccOverall) : null,
      vaccRemarks:        fields.vaccRemarks || null,
      otherClassB:        fields.otherClassB || null,
      addlItems:          fields.addlItems ? JSON.stringify(fields.addlItems) : null,
      overallFindings:    fields.overallFindings ? JSON.stringify(fields.overallFindings) : null,
      examDate:           fields.examDate || null,
      followup1:          fields.followup1 || null,
      followup2:          fields.followup2 || null,
      followup3:          fields.followup3 || null,
      preparer:           fields.preparer ? JSON.stringify(fields.preparer) : null,
      physician:          fields.physician || null,
      csFirst:            fields.csFirst || null,
      csMiddle:           fields.csMiddle || null,
      csLast:             fields.csLast || null,
      csDayPhone:         fields.csDayPhone || null,
      csCellPhone:        fields.csCellPhone || null,
      csEmail:            fields.csEmail || null,
      csOrg:              fields.csOrg || null,
      csid:               fields.csid || null,
      csStreet:           fields.csStreet || null,
      csAddrType:         fields.csAddrType || null,
      csAptNum:           fields.csAptNum || null,
      csCity:             fields.csCity || null,
      csState:            fields.csState || null,
      csZip:              fields.csZip || null,
      csMailStreet:       fields.csMailStreet || null,
      csMailAddrType:     fields.csMailAddrType || null,
      csMailAptNum:       fields.csMailAptNum || null,
      csMailCity:         fields.csMailCity || null,
      csMailState:        fields.csMailState || null,
      csMailZip:          fields.csMailZip || null,
      status:             fields.status || 'draft',
    }

    let exam
    if (examId) {
      exam = await prisma.immigrationExam.update({ where: { id: examId }, data })
    } else {
      exam = await prisma.immigrationExam.create({ data })
    }

    return NextResponse.json({ ok: true, examId: exam.id })
  } catch (e: any) {
    console.error('[POST /api/immigration]', e)
    return NextResponse.json({ error: e.message ?? 'Save failed' }, { status: 500 })
  }
}
