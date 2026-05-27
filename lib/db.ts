import { getSupabaseAdmin } from './supabase'

export type Tier = 'free' | 'one_time' | 'subscription'

export interface UserProfile {
  id: string
  email: string
  tier: Tier
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  created_at: string
}

export interface ChecklistItem {
  id: string
  text: string
  completed: boolean
  service?: string
}

export interface ChecklistCategory {
  id: string
  name: string
  icon: string
  priority: number
  items: ChecklistItem[]
}

export interface Checklist {
  id: string
  user_id: string
  title: string
  input_text: string
  categories: ChecklistCategory[]
  tier_at_creation: Tier
  created_at: string
  updated_at: string
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await getSupabaseAdmin()
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) return null
  return data as UserProfile
}

export async function upsertUserProfile(
  profile: Partial<UserProfile> & { id: string }
): Promise<void> {
  await getSupabaseAdmin()
    .from('user_profiles')
    .upsert(profile, { onConflict: 'id' })
}

export async function getUserChecklists(userId: string): Promise<Checklist[]> {
  const { data, error } = await getSupabaseAdmin()
    .from('checklists')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) return []
  return (data as Checklist[]) ?? []
}

export async function saveChecklist(
  checklist: Omit<Checklist, 'id' | 'created_at' | 'updated_at'>
): Promise<Checklist | null> {
  const { data, error } = await getSupabaseAdmin()
    .from('checklists')
    .insert(checklist)
    .select()
    .single()

  if (error) return null
  return data as Checklist
}

export async function getChecklistById(
  id: string,
  userId: string
): Promise<Checklist | null> {
  const { data, error } = await getSupabaseAdmin()
    .from('checklists')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single()

  if (error) return null
  return data as Checklist
}

export async function updateChecklistItems(
  checklistId: string,
  userId: string,
  categories: ChecklistCategory[]
): Promise<void> {
  await getSupabaseAdmin()
    .from('checklists')
    .update({ categories, updated_at: new Date().toISOString() })
    .eq('id', checklistId)
    .eq('user_id', userId)
}

export async function getSubscribedUsers(): Promise<UserProfile[]> {
  const { data } = await getSupabaseAdmin()
    .from('user_profiles')
    .select('*')
    .eq('tier', 'subscription')

  return (data as UserProfile[]) ?? []
}
