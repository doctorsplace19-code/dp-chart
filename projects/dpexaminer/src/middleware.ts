// Auth middleware temporarily disabled — re-enable before going live with real patient data
// To re-enable: restore the NextAuth middleware below and remove this export
import { NextResponse } from 'next/server'
export default function middleware() { return NextResponse.next() }
export const config = { matcher: [] }
