import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getRelevantCategories, FREE_CATEGORY_COUNT } from '@/lib/categories'
import { generateChecklist } from '@/lib/gemini'
import { getUserProfile, saveChecklist } from '@/lib/db'

interface GenerateRequestBody {
  input: string
  save?: boolean
}

export async function POST(req: NextRequest) {
  try {
    // Parse and validate request body
    let body: GenerateRequestBody
    try {
      body = (await req.json()) as GenerateRequestBody
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }

    const { input, save = false } = body

    if (!input || typeof input !== 'string') {
      return NextResponse.json(
        { error: 'Missing required field: input' },
        { status: 400 }
      )
    }

    const trimmedInput = input.trim()
    if (trimmedInput.length < 10) {
      return NextResponse.json(
        {
          error:
            'Please provide a more detailed description (at least 10 characters)',
        },
        { status: 400 }
      )
    }

    if (trimmedInput.length > 5000) {
      return NextResponse.json(
        { error: 'Input is too long (max 5000 characters)' },
        { status: 400 }
      )
    }

    // Determine user tier
    let isPaid = false
    let userId: string | undefined

    const session = await auth()
    if (session?.user?.id) {
      userId = session.user.id
      const profile = await getUserProfile(userId)
      isPaid =
        profile?.tier === 'one_time' || profile?.tier === 'subscription'
    }

    // Score and sort all categories by relevance to the user's input
    const allRelevantCategories = getRelevantCategories(trimmedInput)

    // Generate checklist via Gemini Flash
    // NOTE: generateChecklist internally enforces tier — it only sends
    // FREE_CATEGORY_COUNT categories to Gemini for free users.
    const checklist = await generateChecklist(
      trimmedInput,
      allRelevantCategories,
      isPaid
    )

    // BACKEND ENFORCEMENT: trim response categories for free users.
    // This is the security-critical gate — the frontend cannot bypass this.
    const responseCategories = isPaid
      ? checklist.categories
      : checklist.categories.slice(0, FREE_CATEGORY_COUNT)

    // Save to database if requested and the user is authenticated
    if (save && userId) {
      // Re-fetch profile to get the current tier at save time (avoid stale closure)
      const profileAtSave = await getUserProfile(userId)
      const tierAtCreation = profileAtSave?.tier ?? 'free'

      await saveChecklist({
        user_id: userId,
        title: checklist.title,
        input_text: trimmedInput,
        categories: responseCategories as Parameters<typeof saveChecklist>[0]['categories'],
        tier_at_creation: tierAtCreation,
      })
    }

    return NextResponse.json({
      title: checklist.title,
      intro: checklist.intro,
      categories: responseCategories,
      isPaid,
      totalCategories: checklist.categories.length,
      shownCategories: responseCategories.length,
    })
  } catch (error) {
    console.error('[POST /api/generate] Error:', error)

    // Surface a safe error message — never expose internal details
    return NextResponse.json(
      { error: 'Failed to generate checklist. Please try again.' },
      { status: 500 }
    )
  }
}
