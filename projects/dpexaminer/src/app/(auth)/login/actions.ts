'use server'

import { signIn } from '@/auth'
import { AuthError } from 'next-auth'

export async function loginAction(_: unknown, formData: FormData) {
  try {
    await signIn('credentials', {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      redirectTo: '/me',
    })
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: 'Invalid email or password.' }
    }
    // NextAuth throws NEXT_REDIRECT on success; catch it and signal the client
    // to navigate (useActionState can't follow server-thrown redirects)
    if ((error as any)?.digest?.startsWith?.('NEXT_REDIRECT')) {
      return { success: true as const }
    }
    throw error
  }
}
