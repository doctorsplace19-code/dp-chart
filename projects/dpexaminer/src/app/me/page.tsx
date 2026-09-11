import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export default async function MePage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const { role, companySlug } = session.user as any

  if (role === 'SUPER_ADMIN') redirect('/admin')
  if (companySlug) redirect(`/${companySlug}/examiner`)
  redirect('/login')
}
