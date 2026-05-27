'use client'

import { ArrowLeft } from 'lucide-react'
import { Navbar } from './Navbar'
import { ChecklistDisplay } from './ChecklistDisplay'
import type { Checklist } from '@/lib/db'
import Link from 'next/link'

interface ChecklistDetailProps {
  checklist: Checklist
  isPaid: boolean
}

export function ChecklistDetail({ checklist, isPaid }: ChecklistDetailProps) {
  const cats = checklist.categories as Array<{
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

  const checklistData = {
    title: checklist.title,
    intro: checklist.input_text,
    categories: cats,
    isPaid,
    totalCategories: cats.length,
    shownCategories: cats.length,
  }

  return (
    <div className="min-h-screen" style={{ background: '#0a0a0f' }}>
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 pt-28 pb-20">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-300 text-sm mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
        <ChecklistDisplay
          data={checklistData}
          checklistId={checklist.id}
          showExport={true}
        />
      </div>
    </div>
  )
}
