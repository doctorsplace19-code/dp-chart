'use server'

import { signIn } from '@/auth'
import { AuthError } from 'next-auth'
import { redirect } from 'next/navigation'

export async function loginAction(formData: FormData) {
  try {
    await signIn('credentials', {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      redirectTo: '/me',
    })
  } catch (error) {
    if (error instanceof AuthError) {
      redirect('/login?error=CredentialsSignin')
    }
    throw error
  }
}
