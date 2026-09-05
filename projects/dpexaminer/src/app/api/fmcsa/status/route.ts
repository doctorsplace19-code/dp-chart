export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/fmcsa/status?examId=xxx
 * Returns the current FMCSASubmission record for the given exam, or null.
 */
export async function GET(req: NextRequest) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ submission: null, dbReady: false })
  }

  const examId = req.nextUrl.searchParams.get('examId')
  if (!examId) {
    return NextResponse.json({ error: 'examId is required' }, { status: 400 })
  }

  try {
    const { prisma } = await import('@/lib/prisma')

    const submission = await prisma.fMCSASubmission.findUnique({
      where: { examId },
      include: {
        transmissionLogs: {
          orderBy: { createdAt: 'desc' },
          take: 5,
          select: { event: true, status: true, message: true, createdAt: true, httpStatus: true },
        },
      },
    })

    return NextResponse.json({ submission, dbReady: true })
  } catch (err) {
    console.error('[FMCSA Status] Error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
