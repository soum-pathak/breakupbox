import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getUserProfile } from '@/lib/db'

export async function GET(req: NextRequest) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ tier: 'free', isLoggedIn: false })
  }

  const profile = await getUserProfile(session.user.id)

  return NextResponse.json({
    tier: profile?.tier ?? 'free',
    isLoggedIn: true,
    userId: session.user.id,
  })
}
