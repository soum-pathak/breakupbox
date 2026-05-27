import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getUserProfile, getChecklistById } from '@/lib/db'
import { renderToBuffer } from '@react-pdf/renderer'
import { ChecklistPDF } from '@/components/ChecklistPDF'
import React from 'react'

// @react-pdf/renderer requires Node.js runtime (uses canvas, fs, etc.)
export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const profile = await getUserProfile(session.user.id)
  if (!profile || profile.tier === 'free') {
    return NextResponse.json(
      { error: 'PDF export requires a paid plan' },
      { status: 403 }
    )
  }

  const checklistId = req.nextUrl.searchParams.get('id')
  if (!checklistId) {
    return NextResponse.json({ error: 'Checklist ID required' }, { status: 400 })
  }

  const checklist = await getChecklistById(checklistId, session.user.id)
  if (!checklist) {
    return NextResponse.json({ error: 'Checklist not found' }, { status: 404 })
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const buffer = await renderToBuffer(
      React.createElement(ChecklistPDF, { checklist }) as React.ReactElement<any>
    )

    // Convert Node.js Buffer to Uint8Array — required for NextResponse BodyInit typing
    const uint8 = new Uint8Array(buffer)

    return new NextResponse(uint8, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="breakupbox-checklist-${checklistId}.pdf"`,
        'Content-Length': uint8.byteLength.toString(),
      },
    })
  } catch (error) {
    console.error('PDF generation error:', error)
    return NextResponse.json({ error: 'PDF generation failed' }, { status: 500 })
  }
}

