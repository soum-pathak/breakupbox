import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { upsertUserProfile, getUserProfile } from '@/lib/db'
import { sendUpgradeEmail } from '@/lib/resend'
import type Stripe from 'stripe'

// Note: bodyParser: false config is handled differently in Next.js App Router.
// In App Router, the raw body is read directly via req.arrayBuffer().

async function getRawBody(req: NextRequest): Promise<Buffer> {
  const buf = await req.arrayBuffer()
  return Buffer.from(buf)
}

export async function POST(req: NextRequest) {
  const rawBody = await getRawBody(req)
  const sig = req.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const { userId, productType } = session.metadata ?? {}

        if (!userId) break

        const tier = productType === 'subscription' ? 'subscription' : 'one_time'

        // Extract Stripe customer and subscription IDs
        const stripeCustomerId =
          typeof session.customer === 'string'
            ? session.customer
            : (session.customer as Stripe.Customer | null)?.id ?? null

        const stripeSubscriptionId =
          typeof session.subscription === 'string'
            ? session.subscription
            : (session.subscription as Stripe.Subscription | null)?.id ?? null

        await upsertUserProfile({
          id: userId,
          tier,
          stripe_customer_id: stripeCustomerId,
          stripe_subscription_id: stripeSubscriptionId,
        })

        // Send upgrade confirmation email
        const profile = await getUserProfile(userId)
        if (profile?.email) {
          await sendUpgradeEmail(
            profile.email,
            tier as 'one_time' | 'subscription'
          )
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId =
          typeof subscription.customer === 'string'
            ? subscription.customer
            : (subscription.customer as Stripe.Customer).id

        // Lookup user by Stripe customer ID and downgrade to free
        const { supabaseAdmin } = await import('@/lib/supabase')
        const { data } = await supabaseAdmin
          .from('user_profiles')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single()

        if (data?.id) {
          await upsertUserProfile({ id: data.id, tier: 'free' })
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const isActive = subscription.status === 'active'
        const customerId =
          typeof subscription.customer === 'string'
            ? subscription.customer
            : (subscription.customer as Stripe.Customer).id

        const { supabaseAdmin } = await import('@/lib/supabase')
        const { data } = await supabaseAdmin
          .from('user_profiles')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single()

        if (data?.id) {
          await upsertUserProfile({
            id: data.id,
            tier: isActive ? 'subscription' : 'free',
          })
        }
        break
      }

      default:
        // Unhandled event types — acknowledged but no action taken
        break
    }
  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }

  return NextResponse.json({ received: true })
}
