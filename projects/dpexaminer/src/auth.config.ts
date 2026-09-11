// Edge-safe auth config — no Node.js / Prisma imports here.
// Used by middleware. Full config (with credentials provider) is in auth.ts.
import type { NextAuthConfig } from 'next-auth'

export const authConfig: NextAuthConfig = {
  pages: { signIn: '/login' },
  providers: [],
  session: { strategy: 'jwt' },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const path = nextUrl.pathname

      // Always public
      if (
        path === '/login' ||
        path === '/register' ||
        path === '/setup' ||
        path.startsWith('/driver') ||
        path.startsWith('/api/auth') ||
        path === '/api/register' ||
        path === '/api/send-intake'
      ) return true

      // API routes: return 401 JSON instead of redirecting
      if (path.startsWith('/api/')) {
        if (!isLoggedIn) return Response.json({ error: 'Unauthorized' }, { status: 401 })
        return true
      }

      // All other pages require login
      if (!isLoggedIn) return false

      // /admin requires SUPER_ADMIN
      if (path.startsWith('/admin')) {
        return (auth?.user as any)?.role === 'SUPER_ADMIN'
      }

      return true
    },
  },
}
