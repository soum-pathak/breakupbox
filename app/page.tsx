'use client'

import { useState, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import {
  Heart,
  Sparkles,
  ArrowRight,
  Lock,
  ChevronDown,
  Shield,
  Zap,
  Clock,
} from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { ChecklistDisplay } from '@/components/ChecklistDisplay'
import Link from 'next/link'

const EXAMPLE_PLACEHOLDERS = [
  'We dated for 2 years. We shared Netflix, Spotify Family, Google Photos, and had a joint Splitwise account for rent...',
  'Together 4 years. Shared iCloud family, Amazon household, same WiFi, Alexa routines, and he had access to my location...',
  '6 months. We shared Disney+, had a joint Venmo for food, followed each other\'s Spotify, and I was on her phone plan...',
]

const FEATURES = [
  {
    icon: Sparkles,
    title: 'AI-Powered',
    desc: 'Gemini generates personalized, empathetic copy for your exact situation',
  },
  {
    icon: Shield,
    title: 'Truly Private',
    desc: 'Your situation stays yours. We never store personal details unencrypted',
  },
  {
    icon: Zap,
    title: '80+ Categories',
    desc: 'From streaming to smart home, location sharing to password managers',
  },
  {
    icon: Clock,
    title: 'Weekly Sweeps',
    desc: 'Healing Mode sends Sunday reminders to catch any new shared accounts',
  },
]

const STATS = [
  { value: '80+', label: 'Digital categories' },
  { value: '15', label: 'Service types' },
  { value: '< 30s', label: 'To generate' },
]

const CATEGORIES = [
  { label: '📺 Streaming', locked: false },
  { label: '🎵 Music', locked: false },
  { label: '📱 Social Media', locked: false },
  { label: '💳 Financial', locked: false },
  { label: '☁️ Cloud Storage', locked: false },
  { label: '📍 Location Sharing', locked: true },
  { label: '🏠 Smart Home', locked: true },
  { label: '🎮 Gaming', locked: true },
  { label: '❤️‍🩹 Health', locked: true },
  { label: '💔 Sentimental', locked: true },
  { label: '📋 Subscriptions', locked: true },
  { label: '✉️ Communication', locked: true },
  { label: '✈️ Travel', locked: true },
  { label: '🔐 Passwords', locked: true },
  { label: '🍕 Food Delivery', locked: true },
  { label: '🪪 Identity', locked: true },
]

interface GeneratedChecklist {
  title: string
  intro: string
  categories: Array<{
    id: string
    name: string
    icon: string
    priority: number
    intro?: string
    items: Array<{
      id: string
      text: string
      completed: boolean
      service?: string
      tip?: string
    }>
  }>
  isPaid: boolean
  totalCategories: number
  shownCategories: number
}

export default function HomePage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [checklist, setChecklist] = useState<GeneratedChecklist | null>(null)
  const [error, setError] = useState('')
  const checklistRef = useRef<HTMLDivElement>(null)
  const [placeholderIndex] = useState(
    () => Math.floor(Math.random() * EXAMPLE_PLACEHOLDERS.length)
  )

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || input.length < 10) {
      setError('Please tell us a bit more about your situation (at least 10 characters)')
      return
    }
    setError('')
    setLoading(true)
    setChecklist(null)

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: input.trim(), save: !!session?.user }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Generation failed')
      }

      const data = await res.json()
      setChecklist(data)

      setTimeout(() => {
        checklistRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong. Please try again.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen" style={{ background: '#0a0a0f' }}>
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="pt-32 pb-20 px-4 text-center relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full opacity-20"
            style={{
              background: 'radial-gradient(circle, #f43f5e 0%, transparent 70%)',
              filter: 'blur(60px)',
            }}
          />
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 text-rose-400 text-sm font-medium rounded-full px-4 py-1.5 mb-8 border"
            style={{ background: 'rgba(244,63,94,0.1)', borderColor: 'rgba(244,63,94,0.2)' }}
          >
            <Heart className="w-3.5 h-3.5" fill="currentColor" />
            <span>AI-powered digital untangling</span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white leading-tight mb-6">
            Untangle your
            <span
              className="block"
              style={{
                background: 'linear-gradient(135deg, #f43f5e, #ec4899)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              digital life
            </span>
          </h1>

          <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            Tell us about your relationship and we'll generate a personalized checklist of every
            shared account, service, and digital connection to untangle.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mb-16">
            {STATS.map(stat => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-zinc-500 text-sm mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Input Form */}
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleGenerate} className="space-y-4">
              <div className="relative">
                <textarea
                  id="situation-input"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder={EXAMPLE_PLACEHOLDERS[placeholderIndex]}
                  rows={5}
                  className="w-full rounded-2xl px-5 py-4 text-sm text-white placeholder-zinc-600 resize-none focus:outline-none transition-all"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                  onFocus={e => {
                    e.target.style.borderColor = 'rgba(244,63,94,0.4)'
                    e.target.style.boxShadow = '0 0 0 1px rgba(244,63,94,0.2)'
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = 'rgba(255,255,255,0.08)'
                    e.target.style.boxShadow = 'none'
                  }}
                />
                <div className="absolute bottom-3 right-3 text-zinc-600 text-xs">
                  {input.length} chars
                </div>
              </div>

              {error && <p className="text-rose-400 text-sm text-left">{error}</p>}

              <button
                id="generate-btn"
                type="submit"
                disabled={loading || input.length < 10}
                className="w-full py-4 px-6 rounded-2xl font-semibold text-white text-base flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background:
                    loading || input.length < 10
                      ? '#3f3f46'
                      : 'linear-gradient(135deg, #f43f5e, #ec4899)',
                  boxShadow:
                    input.length >= 10 && !loading
                      ? '0 0 30px rgba(244,63,94,0.3)'
                      : 'none',
                }}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Generating your checklist...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate My Checklist
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            {!session?.user && (
              <p className="text-zinc-600 text-xs text-center mt-4">
                <Link
                  href="/login"
                  className="text-zinc-500 hover:text-zinc-300 transition-colors underline underline-offset-2"
                >
                  Sign in
                </Link>{' '}
                to save your checklist and access it later
              </p>
            )}
          </div>

          {/* Scroll indicator */}
          {!checklist && (
            <div className="mt-20 flex justify-center animate-bounce">
              <ChevronDown className="w-5 h-5 text-zinc-600" />
            </div>
          )}
        </div>
      </section>

      {/* ── Checklist Output ─────────────────────────────────── */}
      {checklist && (
        <section ref={checklistRef} className="px-4 pb-20">
          <ChecklistDisplay data={checklist} />
        </section>
      )}

      {/* ── Features & Marketing (hidden once checklist shown) ─ */}
      {!checklist && (
        <>
          {/* Features grid */}
          <section
            className="px-4 py-20 border-t"
            style={{ borderColor: 'rgba(255,255,255,0.05)' }}
          >
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold text-white text-center mb-4">
                Built for the messy in-between
              </h2>
              <p className="text-zinc-500 text-center mb-16">
                When your relationship ends, your digital life doesn't automatically untangle itself.
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {FEATURES.map(f => (
                  <div
                    key={f.title}
                    className="p-6 rounded-2xl"
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.06)',
                    }}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                      style={{ background: 'rgba(244,63,94,0.1)' }}
                    >
                      <f.icon className="w-5 h-5 text-rose-400" />
                    </div>
                    <h3 className="font-semibold text-white mb-2">{f.title}</h3>
                    <p className="text-zinc-500 text-sm leading-relaxed">{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Categories preview */}
          <section className="px-4 py-20">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                Every corner of your digital life
              </h2>
              <p className="text-zinc-500 mb-12">
                We cover 80+ items across 16 categories so nothing slips through the cracks.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                {CATEGORIES.map(({ label, locked }, i) => (
                  <span
                    key={label}
                    className="px-4 py-2 rounded-full text-sm font-medium"
                    style={{
                      background: !locked
                        ? 'rgba(244,63,94,0.1)'
                        : 'rgba(255,255,255,0.04)',
                      border: !locked
                        ? '1px solid rgba(244,63,94,0.2)'
                        : '1px solid rgba(255,255,255,0.06)',
                      color: !locked ? '#fb7185' : '#71717a',
                    }}
                  >
                    {label}
                    {locked && <Lock className="inline w-3 h-3 ml-1.5 mb-0.5" />}
                  </span>
                ))}
              </div>
              <p className="text-zinc-600 text-sm mt-6">
                <Lock className="inline w-3 h-3 mr-1" />
                Locked categories unlock with the{' '}
                <Link href="/pricing" className="text-rose-400 hover:text-rose-300 transition-colors">
                  Full Checklist
                </Link>
              </p>
            </div>
          </section>

          {/* CTA */}
          <section className="px-4 py-20 text-center">
            <div
              className="max-w-2xl mx-auto p-12 rounded-3xl"
              style={{
                background:
                  'linear-gradient(135deg, rgba(244,63,94,0.1), rgba(236,72,153,0.05))',
                border: '1px solid rgba(244,63,94,0.2)',
              }}
            >
              <Heart className="w-12 h-12 mx-auto mb-6 text-rose-400" fill="currentColor" />
              <h2 className="text-3xl font-bold text-white mb-4">Ready to start untangling?</h2>
              <p className="text-zinc-400 mb-8">It takes less than 30 seconds. No sign-up required to try.</p>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="px-8 py-4 rounded-xl font-semibold text-white transition-all hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #f43f5e, #ec4899)',
                  boxShadow: '0 0 30px rgba(244,63,94,0.3)',
                }}
              >
                Generate My Checklist — Free
              </button>
            </div>
          </section>
        </>
      )}

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer className="border-t px-4 py-8" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-500" fill="currentColor" />
            <span className="text-zinc-500 text-sm">BreakupBox — Untangle with care</span>
          </div>
          <div className="flex gap-6">
            <Link
              href="/pricing"
              className="text-zinc-600 hover:text-zinc-400 text-sm transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/login"
              className="text-zinc-600 hover:text-zinc-400 text-sm transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
