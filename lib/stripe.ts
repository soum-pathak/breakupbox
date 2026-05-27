import Stripe from 'stripe'

let _stripe: Stripe | null = null

function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2026-04-22.dahlia',
      typescript: true,
    })
  }
  return _stripe
}

// Lazy proxy — safe to import at module level without env vars present at build time
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop, _receiver) {
    const client = getStripe()
    const val = Reflect.get(client, prop, client)
    return typeof val === 'function' ? (val as Function).bind(client) : val
  },
})

export const STRIPE_PRICES = {
  get ONE_TIME() { return process.env.STRIPE_ONE_TIME_PRICE_ID! },
  get SUBSCRIPTION() { return process.env.STRIPE_SUBSCRIPTION_PRICE_ID! },
} as const

export type StripeProductType = 'one_time' | 'subscription'

export async function createCheckoutSession(
  userId: string,
  userEmail: string,
  productType: StripeProductType,
  checklistId?: string
): Promise<string> {
  const isSubscription = productType === 'subscription'

  const session = await stripe.checkout.sessions.create({
    customer_email: userEmail,
    mode: isSubscription ? 'subscription' : 'payment',
    payment_method_types: ['card'],
    line_items: [
      {
        price: isSubscription ? STRIPE_PRICES.SUBSCRIPTION : STRIPE_PRICES.ONE_TIME,
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true&type=${productType}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?cancelled=true`,
    metadata: {
      userId,
      productType,
      checklistId: checklistId ?? '',
    },
    allow_promotion_codes: true,
  })

  return session.url!
}

export async function createCustomerPortalSession(
  customerId: string
): Promise<string> {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
  })
  return session.url
}
