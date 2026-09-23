export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

// Temporary password-reset for the super admin.
// Requires RESET_SECRET env var to be set. Remove this file after use.
export async function POST(req: NextRequest) {
  const secret = process.env.RESET_SECRET
  if (!secret) {
    return NextResponse.json({ error: 'RESET_SECRET not configured' }, { status: 403 })
  }

  const { resetSecret, email, newPassword } = await req.json()
  if (resetSecret !== secret) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 403 })
  }
  if (!email || !newPassword || newPassword.length < 10) {
    return NextResponse.json({ error: 'email and newPassword (min 10 chars) required' }, { status: 400 })
  }

  const { prisma } = await import('@/lib/prisma')
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } })
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  const passwordHash = await bcrypt.hash(newPassword, 12)
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash, isActive: true },
  })

  return NextResponse.json({ ok: true, message: 'Password updated. Delete RESET_SECRET from Vercel env after login.' })
}
