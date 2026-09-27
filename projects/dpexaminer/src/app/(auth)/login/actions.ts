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
    throw error // re-throw redirect (it's not an error)
  }
}
