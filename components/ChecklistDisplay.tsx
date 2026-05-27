'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import {
  CheckCircle2,
  Circle,
  Lock,
  Download,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ArrowRight,
} from 'lucide-react'
import Link from 'next/link'

interface ChecklistItem {
  id: string
  text: string
  completed: boolean
  service?: string
  tip?: string
}

interface ChecklistCategory {
  id: string
  name: string
  icon: string
  priority: number
  intro?: string
  items: ChecklistItem[]
}

interface ChecklistData {
  title: string
  intro: string
  categories: ChecklistCategory[]
  isPaid: boolean
  totalCategories: number
  shownCategories: number
}

interface ChecklistDisplayProps {
  data: ChecklistData
  checklistId?: string
  showExport?: boolean
}

export function ChecklistDisplay({ data, checklistId, showExport }: ChecklistDisplayProps) {
  const { data: session } = useSession()
  const [items, setItems] = useState<ChecklistData>(data)
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set())
  const [downloading, setDownloading] = useState(false)

  const toggleItem = (catId: string, itemId: string) => {
    setItems(prev => ({
      ...prev,
      categories: prev.categories.map(cat =>
        cat.id === catId
          ? {
              ...cat,
              items: cat.items.map(item =>
                item.id === itemId ? { ...item, completed: !item.completed } : item
              ),
            }
          : cat
      ),
    }))
  }

  const toggleCollapse = (catId: string) => {
    setCollapsed(prev => {
      const next = new Set(prev)
      if (next.has(catId)) next.delete(catId)
      else next.add(catId)
      return next
    })
  }

  const totalItems = items.categories.reduce((sum, cat) => sum + cat.items.length, 0)
  const completedItems = items.categories.reduce(
    (sum, cat) => sum + cat.items.filter(i => i.completed).length,
    0
  )
  const progress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0

  const handleExport = async () => {
    if (!checklistId) return
    setDownloading(true)
    try {
      const res = await fetch(`/api/export/pdf?id=${checklistId}`)
      if (!res.ok) throw new Error('Export failed')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'breakupbox-checklist.pdf'
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      alert('Export failed. Please try again.')
    } finally {
      setDownloading(false)
    }
  }

  const lockedCount = items.totalCategories - items.shownCategories

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="text-center mb-10">
        <div
          className="inline-flex items-center gap-2 text-rose-400 text-sm mb-4 px-3 py-1 rounded-full"
          style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)' }}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Your personalized checklist</span>
        </div>
        <h2 className="text-3xl font-bold text-white mb-3">{items.title}</h2>
        <p className="text-zinc-400 leading-relaxed max-w-xl mx-auto">{items.intro}</p>
      </div>

      {/* Progress bar */}
      <div
        className="p-5 rounded-2xl mb-8"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-zinc-400 text-sm">
            {completedItems} of {totalItems} items completed
          </span>
          <span className="text-rose-400 text-sm font-semibold">{Math.round(progress)}%</span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${progress}%`,
              background: 'linear-gradient(to right, #f43f5e, #ec4899)',
            }}
          />
        </div>
        {showExport && items.isPaid && checklistId && (
          <button
            id="export-pdf-btn"
            onClick={handleExport}
            disabled={downloading}
            className="mt-4 flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            {downloading ? 'Generating PDF...' : 'Export as PDF'}
          </button>
        )}
      </div>

      {/* Categories */}
      <div className="space-y-4">
        {items.categories.map((cat, i) => {
          const isCollapsed = collapsed.has(cat.id)
          const catCompleted = cat.items.filter(item => item.completed).length
          const catTotal = cat.items.length

          return (
            <div
              key={cat.id}
              className="rounded-2xl overflow-hidden animate-slide-up"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
                animationDelay: `${i * 0.05}s`,
              }}
            >
              {/* Category header — collapsible */}
              <button
                onClick={() => toggleCollapse(cat.id)}
                className="w-full flex items-center justify-between p-5 hover:bg-white/5 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl" role="img" aria-label={cat.name}>
                    {cat.icon}
                  </span>
                  <div>
                    <h3 className="font-semibold text-white">{cat.name}</h3>
                    {cat.intro && (
                      <p className="text-zinc-500 text-xs mt-0.5">{cat.intro}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-zinc-600 text-xs">
                    {catCompleted}/{catTotal}
                  </span>
                  {isCollapsed ? (
                    <ChevronDown className="w-4 h-4 text-zinc-500" />
                  ) : (
                    <ChevronUp className="w-4 h-4 text-zinc-500" />
                  )}
                </div>
              </button>

              {/* Category items */}
              {!isCollapsed && (
                <div className="px-5 pb-5 space-y-2">
                  {cat.items.map(item => (
                    <button
                      key={item.id}
                      onClick={() => toggleItem(cat.id, item.id)}
                      className="w-full flex items-start gap-3 p-3 rounded-xl text-left transition-all hover:bg-white/5 cursor-pointer"
                      style={{
                        background: item.completed ? 'rgba(244,63,94,0.05)' : 'transparent',
                      }}
                    >
                      {item.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                      ) : (
                        <Circle className="w-5 h-5 text-zinc-600 shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm leading-relaxed transition-colors ${
                            item.completed ? 'text-zinc-500 line-through' : 'text-zinc-200'
                          }`}
                        >
                          {item.service && (
                            <span className="text-rose-400 font-medium mr-1">
                              {item.service}:
                            </span>
                          )}
                          {item.text}
                        </p>
                        {item.tip && !item.completed && (
                          <p className="text-zinc-600 text-xs mt-1 italic">💡 {item.tip}</p>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )
        })}

        {/* Locked categories upsell */}
        {!items.isPaid && lockedCount > 0 && (
          <div
            className="rounded-2xl p-8 text-center"
            style={{
              background: 'linear-gradient(135deg, rgba(244,63,94,0.08), rgba(236,72,153,0.04))',
              border: '1px solid rgba(244,63,94,0.2)',
            }}
          >
            <Lock className="w-10 h-10 mx-auto mb-4 text-rose-400" />
            <h3 className="text-white font-bold text-xl mb-2">
              {lockedCount} more {lockedCount === 1 ? 'category' : 'categories'} waiting
            </h3>
            <p className="text-zinc-400 text-sm mb-6 max-w-sm mx-auto">
              Unlock location sharing, smart home, gaming, health accounts, sentimental triggers,
              and more — all personalized for your situation.
            </p>
            <Link
              href="/pricing"
              id="unlock-checklist-btn"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white text-sm transition-all hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #f43f5e, #ec4899)',
                boxShadow: '0 0 20px rgba(244,63,94,0.3)',
              }}
            >
              Unlock Full Checklist — $9 <ArrowRight className="w-4 h-4" />
            </Link>
            <p className="text-zinc-600 text-xs mt-4">One-time payment. PDF export included.</p>
          </div>
        )}
      </div>
    </div>
  )
}
