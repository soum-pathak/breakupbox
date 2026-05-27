import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { getUserChecklists, getUserProfile } from '@/lib/db'
import { DashboardClient } from '@/components/DashboardClient'

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const [checklists, profile] = await Promise.all([
    getUserChecklists(session.user.id),
    getUserProfile(session.user.id),
  ])

  return (
    <DashboardClient
      user={session.user as { id: string; name?: string | null; email?: string | null; image?: string | null }}
      checklists={checklists}
      profile={profile}
    />
  )
}
