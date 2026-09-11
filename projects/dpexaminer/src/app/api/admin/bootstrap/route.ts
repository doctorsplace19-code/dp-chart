export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

// One-time bootstrap: creates the SUPER_ADMIN account if no users exist.
// Disable this route after first use by setting BOOTSTRAP_DISABLED=true in env.
export async function POST(req: NextRequest) {
  if (process.env.BOOTSTRAP_DISABLED === 'true') {
    return NextResponse.json({ error: 'Bootstrap disabled' }, { status: 403 })
  }
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
  }

  const { email, password, firstName, lastName } = await req.json()
  if (!email || !password || !firstName || !lastName) {
    return NextResponse.json({ error: 'All fields required' }, { status: 400 })
  }
  if (password.length < 10) {
    return NextResponse.json({ error: 'Password must be at least 10 characters' }, { status: 400 })
  }

  const { prisma } = await import('@/lib/prisma')
  const userCount = await prisma.user.count()
  if (userCount > 0) {
    return NextResponse.json({ error: 'Users already exist — bootstrap disabled' }, { status: 403 })
  }

  const passwordHash = await bcrypt.hash(password, 12)
  const user = await prisma.user.create({
    data: {
      email:        email.toLowerCase().trim(),
      passwordHash,
      firstName,
      lastName,
      platformRole: 'SUPER_ADMIN',
      isActive:     true,
    },
  })

  return NextResponse.json({ ok: true, userId: user.id, message: 'Super admin created. Set BOOTSTRAP_DISABLED=true in your environment.' })
}
