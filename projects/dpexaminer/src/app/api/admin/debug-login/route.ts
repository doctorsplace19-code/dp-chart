export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  const secret = process.env.RESET_SECRET
  if (!secret) return NextResponse.json({ error: 'Not configured' }, { status: 403 })

  const { resetSecret, email, password } = await req.json()
  if (resetSecret !== secret) return NextResponse.json({ error: 'Invalid secret' }, { status: 403 })

  try {
    const { prisma } = await import('@/lib/prisma')

    const user = await prisma.user.findUnique({
      where: { email: (email as string).toLowerCase().trim() },
    })

    if (!user) return NextResponse.json({ step: 'user_not_found', email })

    const hashValid = await bcrypt.compare(password as string, user.passwordHash ?? '')

    return NextResponse.json({
      step: 'found',
      isActive: user.isActive,
      hasPasswordHash: !!user.passwordHash,
      hashLength: user.passwordHash?.length,
      platformRole: user.platformRole,
      passwordMatch: hashValid,
    })
  } catch (err) {
    return NextResponse.json({ step: 'db_error', error: String(err) })
  }
}
