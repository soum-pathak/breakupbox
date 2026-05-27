'use client'

import { useState } from 'react'
import { Heart, Plus, Clock, Download, Crown, Zap, ExternalLink } from 'lucide-react'
import { Navbar } from './Navbar'
import type { Checklist, UserProfile } from '@/lib/db'
import Link from 'next/link'
import Image from 'next/image'

interface DashboardUser {
  id: string
  name?: string | null
  email?: string | null
  image?: string | null
}

interface DashboardClientProps {
  user: DashboardUser
  checklists: Checklist[]
  profile: UserProfile | null
}

const TIER_LABELS: Record<string, { label: string; color: string; Icon: React.ElementType | null }> = {
  free: { label: 'Free Plan', color: '#71717a', Icon: null },
  one_time: { label: 'Full Checklist', color: '#f43f5e', Icon: Zap },
  subscription: { label: 'Healing Mode', color: '#ec4899', Icon: Crown },
}

export function DashboardClient({ user, checklists, profile }: DashboardClientProps) {
  const [manageLoading, setManageLoading] = useState(false)

  const tier = profile?.tier ?? 'free'
  const isPaid = tier !== 'free'
  const tierInfo = TIER_LABELS[tier] ?? TIER_LABELS.free

  const handleManageBilling = async () => {
    setManageLoading(true)
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } catch {
      alert('Could not open billing portal. Please try again.')
    } finally {
      setManageLoading(false)
    }
  }

  const firstName = user.name?.split(' ')[0] ?? null

  return (
    <div className="min-h-screen" style={{ background: '#0a0a0f' }}>
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 pt-28 pb-20">
        {/* ── Header ──────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
          <div className="flex items-center gap-4">
            {user.image ? (
              <Image
                src={user.image}
                alt="Avatar"
                width={48}
                height={48}
                className="rounded-full"
              />
            ) : (
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(244,63,94,0.2)' }}
              >
                <Heart className="w-5 h-5 text-rose-400" fill="currentColor" />
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-white">
                Welcome back{firstName ? `, ${firstName}` : ''}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                {tierInfo.Icon && (
                  <tierInfo.Icon className="w-3.5 h-3.5" style={{ color: tierInfo.color }} />
                )}
                <span className="text-sm" style={{ color: tierInfo.color }}>
                  {tierInfo.label}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 flex-wrap">
            {!isPaid && (
              <Link
                href="/pricing"
                id="dashboard-upgrade-btn"
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white transition-all hover:scale-105"
                style={{ background: 'linear-gradient(135deg, #f43f5e, #ec4899)' }}
              >
                <Zap className="w-4 h-4" />
                Upgrade
              </Link>
            )}
            {isPaid && tier === 'subscription' && (
              <button
                onClick={handleManageBilling}
                disabled={manageLoading}
                id="manage-billing-btn"
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all disabled:opacity-50"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  color: '#a1a1aa',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <ExternalLink className="w-4 h-4" />
                {manageLoading ? 'Loading...' : 'Manage Billing'}
              </button>
            )}
            <Link
              href="/"
              id="new-checklist-btn"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:bg-white/10"
              style={{
                background: 'rgba(255,255,255,0.06)',
                color: '#a1a1aa',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <Plus className="w-4 h-4" />
              New Checklist
            </Link>
          </div>
        </div>

        {/* ── Checklist Grid ───────────────────────────────────── */}
        {checklists.length === 0 ? (
          <div className="text-center py-20">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: 'rgba(244,63,94,0.1)' }}
            >
              <Heart className="w-8 h-8 text-rose-400" fill="currentColor" />
            </div>
            <h2 className="text-white font-bold text-xl mb-2">No checklists yet</h2>
            <p className="text-zinc-500 text-sm mb-6">
              Generate your first digital untangling checklist to get started.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white hover:scale-105 transition-transform"
              style={{ background: 'linear-gradient(135deg, #f43f5e, #ec4899)' }}
            >
              <Plus className="w-4 h-4" /> Create My First Checklist
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {checklists.map(checklist => {
              const cats = checklist.categories as Array<{
                items?: Array<{ completed?: boolean }>
              }>
              const totalItems = cats.reduce((sum, c) => sum + (c.items?.length ?? 0), 0)
              const completedItems = cats.reduce(
                (sum, c) => sum + (c.items?.filter(i => i.completed).length ?? 0),
                0
              )
              const progress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0

              return (
                <Link
                  key={checklist.id}
                  href={`/checklist/${checklist.id}`}
                  className="block p-5 rounded-2xl transition-all hover:scale-[1.02] group"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.07)',
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-white font-medium text-sm leading-tight line-clamp-2 group-hover:text-rose-100 transition-colors">
                      {checklist.title}
                    </h3>
                    {isPaid && (
                      <a
                        href={`/api/export/pdf?id=${checklist.id}`}
                        onClick={e => e.stopPropagation()}
                        className="shrink-0 ml-2 text-zinc-600 hover:text-zinc-300 transition-colors"
                        title="Export as PDF"
                        aria-label="Export as PDF"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                  <p className="text-zinc-600 text-xs mb-4 line-clamp-2">{checklist.input_text}</p>

                  {/* Progress bar */}
                  <div
                    className="h-1.5 rounded-full overflow-hidden mb-2"
                    style={{ background: 'rgba(255,255,255,0.06)' }}
                  >
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${progress}%`,
                        background: 'linear-gradient(to right, #f43f5e, #ec4899)',
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-zinc-600 text-xs">{completedItems}/{totalItems} done</span>
                    <div className="flex items-center gap-1 text-zinc-600 text-xs">
                      <Clock className="w-3 h-3" />
                      {new Date(checklist.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}

        {/* ── Upgrade banner ───────────────────────────────────── */}
        {!isPaid && checklists.length > 0 && (
          <div
            className="mt-8 p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4"
            style={{
              background:
                'linear-gradient(135deg, rgba(244,63,94,0.08), rgba(236,72,153,0.04))',
              border: '1px solid rgba(244,63,94,0.2)',
            }}
          >
            <div>
              <p className="text-white font-semibold mb-1">Unlock 11 more categories</p>
              <p className="text-zinc-400 text-sm">
                Location sharing, smart home, gaming, health, and more — personalized for you.
              </p>
            </div>
            <Link
              href="/pricing"
              className="shrink-0 px-5 py-2.5 rounded-xl text-sm font-semibold text-white hover:scale-105 transition-transform"
              style={{ background: 'linear-gradient(135deg, #f43f5e, #ec4899)' }}
            >
              Upgrade — $9
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
