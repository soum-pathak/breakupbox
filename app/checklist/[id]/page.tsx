import { auth } from '@/auth'
import { redirect, notFound } from 'next/navigation'
import { getChecklistById, getUserProfile } from '@/lib/db'
import { ChecklistDetail } from '@/components/ChecklistDetail'

export default async function ChecklistPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const { id } = await params

  const [checklist, profile] = await Promise.all([
    getChecklistById(id, session.user.id),
    getUserProfile(session.user.id),
  ])

  if (!checklist) notFound()

  return (
    <ChecklistDetail
      checklist={checklist}
      isPaid={profile?.tier !== 'free'}
    />
  )
}
