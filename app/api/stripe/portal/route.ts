import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getUserProfile } from '@/lib/db'
import { createCustomerPortalSession } from '@/lib/stripe'

export async function POST(req: NextRequest) {
  // req is used implicitly via the auth() call — kept in signature for App Router compatibility
  void req

  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const profile = await getUserProfile(session.user.id)
  if (!profile?.stripe_customer_id) {
    return NextResponse.json(
      { error: 'No billing account found' },
      { status: 400 }
    )
  }

  try {
    const url = await createCustomerPortalSession(profile.stripe_customer_id)
    return NextResponse.json({ url })
  } catch (error) {
    console.error('Portal error:', error)
    return NextResponse.json(
      { error: 'Failed to open billing portal' },
      { status: 500 }
    )
  }
}
