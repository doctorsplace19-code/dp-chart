// Edge-safe auth config — no Node.js / Prisma imports here.
// Used by middleware. Full config (with credentials provider) is in auth.ts.
import type { NextAuthConfig } from 'next-auth'

export const authConfig: NextAuthConfig = {
  pages: { signIn: '/login' },
  providers: [],
  session: { strategy: 'jwt' },
  callbacks: {
    // Propagate custom JWT claims into session.user so the authorized callback
    // (and middleware) can read role and companySlug.
    jwt({ token }) { return token },
    session({ session, token }: any) {
      if (token) {
        session.user.id          = token.id          ?? token.sub
        session.user.role        = token.role        ?? null
        session.user.companySlug = token.companySlug ?? null
      }
      return session
    },
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
        path === '/api/send-intake' ||
        path === '/api/admin/bootstrap' ||
        path === '/api/admin/reset-super-admin' ||
        path === '/api/admin/debug-login'
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
