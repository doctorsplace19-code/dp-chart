import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { authConfig } from './auth.config'
import type { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: string
      companySlug: string | null
    } & DefaultSession['user']
  }
  interface User {
    role: string
    companySlug: string | null
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: string
    companySlug: string | null
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email:    { label: 'Email',    type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        const { prisma } = await import('@/lib/prisma')
        const user = await prisma.user.findUnique({
          where: { email: (credentials.email as string).toLowerCase().trim() },
          include: {
            memberships: {
              where: { isActive: true },
              include: { company: { select: { slug: true } } },
              take: 1,
            },
          },
        })
        if (!user || !user.isActive || !user.passwordHash) return null
        const valid = await bcrypt.compare(credentials.password as string, user.passwordHash)
        if (!valid) return null
        await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } })
        return {
          id:          user.id,
          email:       user.email,
          name:        `${user.firstName} ${user.lastName}`,
          role:        user.platformRole,
          companySlug: user.memberships[0]?.company?.slug ?? null,
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id          = user.id as string
        token.role        = (user as any).role
        token.companySlug = (user as any).companySlug
      }
      return token
    },
    session({ session, token }) {
      session.user.id          = token.id
      session.user.role        = token.role
      session.user.companySlug = token.companySlug
      return session
    },
  },
})
