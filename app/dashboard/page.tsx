import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { getUserChecklists, getUserProfile } from '@/lib/db'
import { DashboardClient } from '@/components/DashboardClient'
import type { Checklist, UserProfile } from '@/lib/db'

// ── Demo mock data ────────────────────────────────────────────────────────────
// Injected when bb-demo-session cookie is present (set by the login page demo
// bypass). Zero DB calls — lets the full UI render during preview testing.
const DEMO_USER = {
  id: 'demo-user',
  name: 'Demo User',
  email: 'demo@breakupbox.com',
  image: null,
}

const DEMO_PROFILE: UserProfile = {
  id: 'demo-user',
  email: 'demo@breakupbox.com',
  tier: 'subscription',
  stripe_customer_id: null,
  stripe_subscription_id: null,
  created_at: new Date().toISOString(),
}

const DEMO_CHECKLISTS: Checklist[] = [
  {
    id: 'demo-checklist-1',
    user_id: 'demo-user',
    title: 'Untangling from Alex — 2 years together',
    input_text: 'We shared Netflix, Spotify, a joint Amazon account, and Apple Family Sharing for 2 years.',
    tier_at_creation: 'subscription',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date().toISOString(),
    categories: [
      {
        id: 'streaming',
        name: 'Streaming Services',
        icon: '📺',
        priority: 1,
        items: [
          { id: 'i1', text: 'Remove Alex from Netflix profile', completed: true },
          { id: 'i2', text: 'Change Netflix password', completed: true },
          { id: 'i3', text: 'Sign out all devices on Hulu', completed: false },
          { id: 'i4', text: 'Remove from Disney+ family plan', completed: false },
        ],
      },
      {
        id: 'music',
        name: 'Music & Podcasts',
        icon: '🎵',
        priority: 2,
        items: [
          { id: 'i5', text: 'Switch Spotify to individual plan', completed: true },
          { id: 'i6', text: 'Remove Alex from Spotify Family', completed: false },
          { id: 'i7', text: 'Export shared playlists you want to keep', completed: false },
        ],
      },
      {
        id: 'financial',
        name: 'Financial & Payments',
        icon: '💳',
        priority: 3,
        items: [
          { id: 'i8', text: 'Remove Alex from Amazon household', completed: false },
          { id: 'i9', text: 'Check shared PayPal transactions', completed: false },
          { id: 'i10', text: 'Update Venmo privacy settings', completed: true },
        ],
      },
    ],
  },
]
// ─────────────────────────────────────────────────────────────────────────────

export default async function DashboardPage() {
  const cookieStore = await cookies()
  const isDemoSession = cookieStore.get('bb-demo-session')?.value === 'demo-authenticated'

  // ── Demo path: no auth(), no Supabase ────────────────────────────────────
  if (isDemoSession) {
    return (
      <DashboardClient
        user={DEMO_USER}
        checklists={DEMO_CHECKLISTS}
        profile={DEMO_PROFILE}
      />
    )
  }

  // ── Real auth path ────────────────────────────────────────────────────────
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

