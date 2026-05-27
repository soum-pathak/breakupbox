import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getChecklistById, updateChecklistItems } from '@/lib/db'
import type { ChecklistCategory } from '@/lib/db'

interface RouteContext {
  params: Promise<{ id: string }>
}

/**
 * GET /api/checklist/[id]
 * Fetch a single saved checklist by ID.
 * Requires authentication; users can only access their own checklists.
 */
export async function GET(
  _req: NextRequest,
  { params }: RouteContext
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  if (!id || typeof id !== 'string') {
    return NextResponse.json({ error: 'Invalid checklist ID' }, { status: 400 })
  }

  const checklist = await getChecklistById(id, session.user.id)
  if (!checklist) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json(checklist)
}

/**
 * PATCH /api/checklist/[id]
 * Update the item completion states of a saved checklist.
 * Requires authentication; users can only modify their own checklists.
 *
 * Body: { categories: ChecklistCategory[] }
 */
export async function PATCH(
  req: NextRequest,
  { params }: RouteContext
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  if (!id || typeof id !== 'string') {
    return NextResponse.json({ error: 'Invalid checklist ID' }, { status: 400 })
  }

  let body: { categories?: ChecklistCategory[] }
  try {
    body = (await req.json()) as { categories?: ChecklistCategory[] }
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON in request body' },
      { status: 400 }
    )
  }

  const { categories } = body

  if (!Array.isArray(categories)) {
    return NextResponse.json(
      { error: 'Missing or invalid field: categories must be an array' },
      { status: 400 }
    )
  }

  // Validate the checklist exists and belongs to this user before writing
  const existing = await getChecklistById(id, session.user.id)
  if (!existing) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  // Strip any unexpected fields from items to prevent data injection
  const sanitizedCategories: ChecklistCategory[] = categories.map((cat) => ({
    id: String(cat.id ?? ''),
    name: String(cat.name ?? ''),
    icon: String(cat.icon ?? ''),
    priority: Number(cat.priority ?? 0),
    items: (cat.items ?? []).map((item) => ({
      id: String(item.id ?? ''),
      text: String(item.text ?? ''),
      completed: Boolean(item.completed),
      service: item.service !== undefined ? String(item.service) : undefined,
    })),
  }))

  try {
    await updateChecklistItems(id, session.user.id, sanitizedCategories)
  } catch (error) {
    console.error('[PATCH /api/checklist/[id]] DB update error:', error)
    return NextResponse.json(
      { error: 'Failed to update checklist. Please try again.' },
      { status: 500 }
    )
  }

  return NextResponse.json({ success: true })
}

/**
 * DELETE /api/checklist/[id]
 * Soft/hard delete a saved checklist.
 * Requires authentication; users can only delete their own checklists.
 */
export async function DELETE(
  _req: NextRequest,
  { params }: RouteContext
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  if (!id || typeof id !== 'string') {
    return NextResponse.json({ error: 'Invalid checklist ID' }, { status: 400 })
  }

  // Verify ownership before deletion
  const existing = await getChecklistById(id, session.user.id)
  if (!existing) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  // Import deleteChecklist lazily to avoid circular deps if not yet defined
  // Use the supabaseAdmin directly via the db module pattern
  const { supabaseAdmin } = await import('@/lib/supabase')
  const { error } = await supabaseAdmin
    .from('checklists')
    .delete()
    .eq('id', id)
    .eq('user_id', session.user.id)

  if (error) {
    console.error('[DELETE /api/checklist/[id]] DB delete error:', error)
    return NextResponse.json(
      { error: 'Failed to delete checklist. Please try again.' },
      { status: 500 }
    )
  }

  return NextResponse.json({ success: true })
}
