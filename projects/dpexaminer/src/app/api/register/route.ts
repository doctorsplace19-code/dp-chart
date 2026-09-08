export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 40)
}

export async function POST(req: NextRequest) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      { error: 'Registration is temporarily unavailable. Please contact support@workoccmed.com.' },
      { status: 503 }
    )
  }

  try {
    const body = await req.json()
    const { firstName, lastName, companyName, industry, email, phone, password, nrcmeNumber } = body as {
      firstName: string
      lastName: string
      companyName: string
      industry: string
      email: string
      phone: string
      password: string
      nrcmeNumber?: string
    }

    // Basic validation
    if (!firstName || !lastName || !companyName || !email || !password) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
    }
    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 })
    }

    const { prisma } = await import('@/lib/prisma')
    const bcrypt = await import('bcryptjs')

    // Check for existing email
    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } })
    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 })
    }

    // Generate unique slug
    let slug = toSlug(companyName)
    const exists = await prisma.company.findUnique({ where: { slug } })
    if (exists) slug = `${slug}-${Math.random().toString(36).slice(2, 6)}`

    const passwordHash = await bcrypt.hash(password, 12)

    // Create company + user + member in one transaction
    const { user, company } = await prisma.$transaction(async (tx) => {
      const company = await tx.company.create({
        data: {
          slug,
          name: companyName,
          industry: industry || null,
          contactName: `${firstName} ${lastName}`,
          contactEmail: email.toLowerCase(),
          contactPhone: phone || null,
          status: 'ACTIVE',
          subscriptionStatus: 'TRIALING',
        },
      })

      const user = await tx.user.create({
        data: {
          firstName,
          lastName,
          email: email.toLowerCase(),
          phone: phone || null,
          passwordHash,
          platformRole: 'COMPANY_ADMIN',
          isActive: true,
        },
      })

      await tx.companyMember.create({
        data: {
          companyId: company.id,
          userId: user.id,
          role: 'COMPANY_ADMIN',
          isActive: true,
          acceptedAt: new Date(),
        },
      })

      // If NRCME provided, create practitioner record
      if (nrcmeNumber?.trim()) {
        await tx.practitioner.create({
          data: {
            userId: user.id,
            companyId: company.id,
            nrcmeNumber: nrcmeNumber.trim(),
            status: 'PENDING_APPROVAL',
          },
        })
      }

      return { user, company }
    })

    // Send notification email (non-blocking)
    try {
      const { Resend } = await import('resend')
      const resend = new Resend(process.env.RESEND_API_KEY)
      await resend.emails.send({
        from: 'WorkOccMed Examiner <noreply@workoccmed.com>',
        to: ['doctorsplace19@gmail.com'],
        subject: `New Registration: ${companyName} — ${firstName} ${lastName}`,
        html: `
          <h2 style="font-family:sans-serif">New Provider Registration</h2>
          <table style="font-family:sans-serif;font-size:14px;border-collapse:collapse">
            <tr><td style="padding:4px 12px 4px 0;color:#666">Company</td><td><strong>${companyName}</strong></td></tr>
            <tr><td style="padding:4px 12px 4px 0;color:#666">Slug</td><td><code>${slug}</code></td></tr>
            <tr><td style="padding:4px 12px 4px 0;color:#666">Contact</td><td>${firstName} ${lastName}</td></tr>
            <tr><td style="padding:4px 12px 4px 0;color:#666">Email</td><td>${email}</td></tr>
            <tr><td style="padding:4px 12px 4px 0;color:#666">Phone</td><td>${phone || '—'}</td></tr>
            <tr><td style="padding:4px 12px 4px 0;color:#666">Industry</td><td>${industry || '—'}</td></tr>
            <tr><td style="padding:4px 12px 4px 0;color:#666">NRCME #</td><td>${nrcmeNumber || '—'}</td></tr>
          </table>
          <p style="font-family:sans-serif;margin-top:16px">
            <a href="https://workoccmed-examiner.vercel.app/admin/companies/${company.id}"
               style="background:#16a34a;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;font-weight:bold">
              Review in Admin
            </a>
          </p>
        `,
      })
    } catch (emailErr) {
      console.error('[Register] Email notification failed:', emailErr)
    }

    return NextResponse.json({
      success: true,
      companySlug: slug,
      message: 'Account created. You can now sign in.',
    })
  } catch (err) {
    console.error('[Register] Error:', err)
    return NextResponse.json({ error: 'Registration failed. Please try again.' }, { status: 500 })
  }
}
