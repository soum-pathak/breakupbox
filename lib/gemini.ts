import { GoogleGenerativeAI } from '@google/generative-ai'
import type { Category } from './categories'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export interface GeneratedChecklist {
  title: string
  intro: string
  categories: GeneratedCategory[]
}

export interface GeneratedCategory {
  id: string
  name: string
  icon: string
  priority: number
  intro: string
  items: GeneratedItem[]
}

export interface GeneratedItem {
  id: string
  text: string
  completed: boolean
  service?: string
  tip?: string
}

/**
 * Build the Gemini prompt for checklist generation.
 * Keeps the prompt deterministic so we can test it separately.
 */
function buildPrompt(userInput: string, categories: Category[]): string {
  const categoryList = categories
    .map(
      (cat) =>
        `- ${cat.name} (id: ${cat.id}, icon: ${cat.icon}): ${cat.services.map((s) => s.name).join(', ')}`
    )
    .join('\n')

  return `You are a compassionate digital wellness assistant helping someone navigate a breakup. They've shared this situation:

"${userInput}"

Generate a warm, empathetic, personalized "Digital Untangling Checklist" for them. Be kind, understanding, and use gentle, supportive language. Avoid being clinical or robotic.

For EACH of the following categories, generate specific, actionable checklist items tailored to their situation:
${categoryList}

RULES:
- Use "you" language throughout (e.g., "Change your password" not "User changes password")
- Generate 3–7 items per category
- Each item should reference a specific service from the category's service list
- Include a short, warm "tip" for items where helpful context would comfort the user
- The intro should feel personal and acknowledge their specific situation in 2–3 sentences
- Category intros should be one warm, encouraging sentence

Respond ONLY with valid JSON in this exact format (no markdown code fences, no extra text):
{
  "title": "Your Digital Untangling Checklist",
  "intro": "A warm 2-3 sentence personalized intro acknowledging their situation",
  "categories": [
    {
      "id": "category_id_matching_the_list_above",
      "name": "Category Name",
      "icon": "emoji",
      "priority": 1,
      "intro": "One warm sentence about why this category matters right now",
      "items": [
        {
          "id": "unique_snake_case_id",
          "text": "Specific action item written in second person",
          "completed": false,
          "service": "Exact Service Name",
          "tip": "Optional helpful tip or reassurance (omit if not useful)"
        }
      ]
    }
  ]
}`
}

/**
 * Sanitize and validate the raw Gemini text response into a GeneratedChecklist.
 * Throws if the response cannot be parsed.
 */
function parseGeminiResponse(rawText: string): GeneratedChecklist {
  // Strip possible markdown fences if model adds them
  const stripped = rawText
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```\s*$/, '')
    .trim()

  // Extract the outermost JSON object
  const jsonMatch = stripped.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    throw new Error(
      `Failed to extract JSON from Gemini response. Raw: ${rawText.slice(0, 200)}`
    )
  }

  let parsed: GeneratedChecklist
  try {
    parsed = JSON.parse(jsonMatch[0]) as GeneratedChecklist
  } catch (err) {
    throw new Error(
      `Failed to parse Gemini JSON: ${err instanceof Error ? err.message : String(err)}`
    )
  }

  // Validate top-level shape
  if (!parsed.title || !parsed.intro || !Array.isArray(parsed.categories)) {
    throw new Error('Gemini response missing required fields: title, intro, categories')
  }

  return parsed
}

/**
 * Normalise and sanitize category items after parsing.
 * Ensures IDs are set and completed is always false on first generation.
 */
function normalizeChecklist(
  parsed: GeneratedChecklist,
  categories: Category[]
): GeneratedChecklist {
  // Build a lookup map so we can fill in missing icons / names if Gemini drops them
  const catMap = new Map(categories.map((c) => [c.id, c]))

  const normalizedCategories: GeneratedCategory[] = parsed.categories.map(
    (cat, catIndex) => {
      const source = catMap.get(cat.id)

      const normalizedItems: GeneratedItem[] = (cat.items ?? []).map(
        (item, itemIndex) => ({
          ...item,
          id: item.id && item.id.length > 0 ? item.id : `${cat.id}-item-${itemIndex}`,
          completed: false,
          text: item.text ?? '',
          service: item.service ?? undefined,
          tip: item.tip ?? undefined,
        })
      )

      return {
        ...cat,
        id: cat.id ?? source?.id ?? `category-${catIndex}`,
        name: cat.name ?? source?.name ?? 'Uncategorized',
        icon: cat.icon ?? source?.icon ?? '📋',
        priority: catIndex + 1,
        intro: cat.intro ?? '',
        items: normalizedItems,
      }
    }
  )

  return {
    ...parsed,
    categories: normalizedCategories,
  }
}

/**
 * Generate a personalized digital untangling checklist using Gemini Flash.
 *
 * @param userInput   - Raw text the user entered describing their situation
 * @param relevantCategories - Sorted/relevant categories to generate items for
 * @param isPaid      - Whether the user is on a paid tier (controls how many categories are sent to Gemini)
 */
export async function generateChecklist(
  userInput: string,
  relevantCategories: Category[],
  isPaid: boolean
): Promise<GeneratedChecklist> {
  // Backend tier enforcement: only send paid categories to Gemini for paid users
  const FREE_LIMIT = 5
  const categoriesToProcess = isPaid
    ? relevantCategories
    : relevantCategories.slice(0, FREE_LIMIT)

  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: {
      temperature: 0.8,
      topP: 0.95,
      maxOutputTokens: 8192,
    },
  })

  const prompt = buildPrompt(userInput, categoriesToProcess)

  let rawText: string
  try {
    const result = await model.generateContent(prompt)
    rawText = result.response.text()
  } catch (err) {
    throw new Error(
      `Gemini API call failed: ${err instanceof Error ? err.message : String(err)}`
    )
  }

  if (!rawText || rawText.trim().length === 0) {
    throw new Error('Gemini returned an empty response')
  }

  const parsed = parseGeminiResponse(rawText)
  const normalized = normalizeChecklist(parsed, categoriesToProcess)

  return normalized
}
