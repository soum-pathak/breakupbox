'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, Zap, Heart, Sparkles } from 'lucide-react'

const FREE_FEATURES = [
  'Top 5 digital entanglement categories',
  'AI-personalized checklist copy',
  'Basic streaming & social checklist',
  'Save one checklist',
]

const ONE_TIME_FEATURES = [
  'All 16+ digital categories (80+ items)',
  'Full AI-personalized checklist',
  'Location sharing, smart home, gaming',
  'Health & wellness accounts',
  'Password & security audit',
  'PDF export — print or share',
  'Unlimited checklist saves',
  'One-time payment, lifetime access',
]

const SUBSCRIPTION_FEATURES = [
  'Everything in Full Checklist',
  'Weekly Digital Ghost Check emails',
  'Sunday morning emotional re-check',
  'Monthly digital sweep reminders',
  'Priority support',
  'Cancel anytime',
]

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null)
  const router = useRouter()

  const handleCheckout = async (type: 'one_time' | 'subscription') => {
    setLoading(type)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productType: type }),
      })
      const data = await res.json() as { url?: string }
      if (data.url) {
        window.location.href = data.url
      } else if (res.status === 401) {
        router.push('/login?next=/pricing')
      }
    } catch {
      alert('Something went wrong. Please try again.')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] py-20 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 text-rose-400 text-sm font-medium bg-rose-500/10 border border-rose-500/20 rounded-full px-4 py-1.5 mb-6">
            <Sparkles className="w-4 h-4" /> Simple pricing
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Untangle your digital life
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Start for free. Unlock everything when you&apos;re ready.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Free tier */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col">
            <div className="mb-6">
              <h2 className="text-white font-bold text-xl mb-1">Free</h2>
              <div className="flex items-end gap-1">
                <span className="text-4xl font-bold text-white">$0</span>
              </div>
              <p className="text-zinc-500 text-sm mt-2">Start untangling today</p>
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              {FREE_FEATURES.map((f) => (
                <li
                  key={f}
                  className="flex items-start gap-2 text-zinc-400 text-sm"
                >
                  <Check className="w-4 h-4 text-zinc-500 mt-0.5 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <button
              id="free-plan-btn"
              onClick={() => router.push('/')}
              className="w-full py-3 rounded-xl border border-white/10 text-zinc-400 hover:text-white hover:border-white/20 transition-all text-sm font-medium"
            >
              Get started free
            </button>
          </div>

          {/* One-time purchase */}
          <div className="bg-gradient-to-b from-rose-500/10 to-pink-600/5 border border-rose-500/30 rounded-2xl p-6 relative flex flex-col">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="bg-gradient-to-r from-rose-500 to-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                MOST POPULAR
              </span>
            </div>
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-4 h-4 text-rose-400" />
                <h2 className="text-white font-bold text-xl">Full Checklist</h2>
              </div>
              <div className="flex items-end gap-1">
                <span className="text-4xl font-bold text-white">$9</span>
                <span className="text-zinc-400 mb-1">one-time</span>
              </div>
              <p className="text-zinc-500 text-sm mt-2">
                Unlock everything, forever
              </p>
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              {ONE_TIME_FEATURES.map((f) => (
                <li
                  key={f}
                  className="flex items-start gap-2 text-zinc-300 text-sm"
                >
                  <Check className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <button
              id="one-time-plan-btn"
              onClick={() => handleCheckout('one_time')}
              disabled={loading === 'one_time'}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-semibold hover:from-rose-600 hover:to-pink-700 transition-all disabled:opacity-50 text-sm"
            >
              {loading === 'one_time'
                ? 'Redirecting...'
                : 'Unlock Full Checklist — $9'}
            </button>
          </div>

          {/* Subscription */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-1">
                <Heart className="w-4 h-4 text-pink-400" fill="currentColor" />
                <h2 className="text-white font-bold text-xl">Healing Mode</h2>
              </div>
              <div className="flex items-end gap-1">
                <span className="text-4xl font-bold text-white">$14</span>
                <span className="text-zinc-400 mb-1">/month</span>
              </div>
              <p className="text-zinc-500 text-sm mt-2">Ongoing healing support</p>
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              {SUBSCRIPTION_FEATURES.map((f) => (
                <li
                  key={f}
                  className="flex items-start gap-2 text-zinc-400 text-sm"
                >
                  <Check className="w-4 h-4 text-pink-400 mt-0.5 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <button
              id="healing-mode-btn"
              onClick={() => handleCheckout('subscription')}
              disabled={loading === 'subscription'}
              className="w-full py-3 rounded-xl border border-pink-500/40 text-pink-300 hover:bg-pink-500/10 transition-all disabled:opacity-50 text-sm font-medium"
            >
              {loading === 'subscription'
                ? 'Redirecting...'
                : 'Start Healing Mode — $14/mo'}
            </button>
          </div>
        </div>

        {/* Trust badges */}
        <div className="mt-12 text-center">
          <p className="text-zinc-600 text-sm">
            Secure payments by Stripe · No hidden fees · Cancel anytime
          </p>
        </div>
      </div>
    </div>
  )
}
