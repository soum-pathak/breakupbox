import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { createCheckoutSession } from '@/lib/stripe'
import type { StripeProductType } from '@/lib/stripe'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id || !session.user.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { productType, checklistId } = body as {
    productType: StripeProductType
    checklistId?: string
  }

  if (!productType || !['one_time', 'subscription'].includes(productType)) {
    return NextResponse.json({ error: 'Invalid product type' }, { status: 400 })
  }

  try {
    const url = await createCheckoutSession(
      session.user.id,
      session.user.email,
      productType,
      checklistId
    )
    return NextResponse.json({ url })
  } catch (error) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
