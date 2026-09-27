import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export default async function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  const role = (session?.user as any)?.role
  if (!session?.user || role !== 'SUPER_ADMIN') redirect('/login')
  return <>{children}</>
}
