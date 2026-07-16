'use server'

import { createPlannerClient } from '@/lib/planner/supabase/server'
import type { TemplateBudget, TripPlan, TripPlanDraft } from '@/lib/planner/trip-plan-types'

interface TripPlanRow {
  id: string
  destination_id: string
  guest_name: string | null
  date_range_label: string
  accommodation: string | null
  headcount: number | null
  days: TripPlan['days']
  curator_message: string | null
  is_published: boolean
  share_token: string
  is_template: boolean
  template_title: string | null
  template_teaser: string | null
  template_image: string | null
  sort_order: number
  template_budget: TemplateBudget | null
  template_disney_day: boolean | null
  template_extra_night: boolean | null
  created_at: string
  updated_at: string
}

function rowToTripPlan(row: TripPlanRow): TripPlan {
  return {
    id: row.id,
    destinationId: row.destination_id,
    guestName: row.guest_name ?? '',
    dateRangeLabel: row.date_range_label,
    accommodation: row.accommodation ?? '',
    headcount: row.headcount,
    days: row.days ?? [],
    curatorMessage: row.curator_message ?? '',
    isPublished: row.is_published,
    shareToken: row.share_token,
    isTemplate: row.is_template,
    templateTitle: row.template_title ?? '',
    templateTeaser: row.template_teaser ?? '',
    templateImage: row.template_image ?? '',
    sortOrder: row.sort_order,
    templateBudget: row.template_budget,
    templateDisneyDay: row.template_disney_day,
    templateExtraNight: row.template_extra_night,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

async function getDestinationId(
  destinationSlug: string
): Promise<{ id: string | null; error?: string }> {
  const supabase = await createPlannerClient()
  const { data, error } = await supabase.from('destinations').select('id').eq('slug', destinationSlug).single()
  if (error || !data) return { id: null, error: error?.message ?? 'Nincs találat' }
  return { id: data.id as string }
}

export interface ListTripPlansResult {
  plans: TripPlan[]
  error?: string
}

export async function listTripPlans(destinationSlug: string): Promise<ListTripPlansResult> {
  try {
    const { id: destinationId, error: destError } = await getDestinationId(destinationSlug)
    if (!destinationId) {
      return { plans: [], error: `Desztináció nem található: ${destinationSlug} (${destError})` }
    }

    const supabase = await createPlannerClient()
    const { data, error } = await supabase
      .from('trip_plans')
      .select('*')
      .eq('destination_id', destinationId)
      .order('updated_at', { ascending: false })

    if (error) return { plans: [], error: error.message }
    return { plans: (data as TripPlanRow[]).map(rowToTripPlan) }
  } catch (error) {
    return { plans: [], error: error instanceof Error ? error.message : 'Ismeretlen hiba' }
  }
}

// A vendégoldali /programtervezo kártyaválasztóhoz -- csak a publikált
// sablonokat adja vissza, sorrend szerint. Az anon kulcs ehhez elég, mert
// a "public read published trip plans" RLS policy már úgyis csak az
// is_published=true sorokat engedi.
export async function listPublishedTemplates(destinationSlug: string): Promise<ListTripPlansResult> {
  try {
    const { id: destinationId, error: destError } = await getDestinationId(destinationSlug)
    if (!destinationId) {
      return { plans: [], error: `Desztináció nem található: ${destinationSlug} (${destError})` }
    }

    const supabase = await createPlannerClient()
    const { data, error } = await supabase
      .from('trip_plans')
      .select('*')
      .eq('destination_id', destinationId)
      .eq('is_template', true)
      .eq('is_published', true)
      .order('sort_order', { ascending: true })

    if (error) return { plans: [], error: error.message }
    return { plans: (data as TripPlanRow[]).map(rowToTripPlan) }
  } catch (error) {
    return { plans: [], error: error instanceof Error ? error.message : 'Ismeretlen hiba' }
  }
}

export interface GetTripPlanResult {
  plan: TripPlan | null
  error?: string
}

export async function getTripPlan(id: string): Promise<GetTripPlanResult> {
  try {
    const supabase = await createPlannerClient()
    const { data, error } = await supabase.from('trip_plans').select('*').eq('id', id).single()
    if (error || !data) return { plan: null, error: error?.message ?? 'Nem található' }
    return { plan: rowToTripPlan(data as TripPlanRow) }
  } catch (error) {
    return { plan: null, error: error instanceof Error ? error.message : 'Ismeretlen hiba' }
  }
}

export async function getTripPlanByShareToken(token: string): Promise<GetTripPlanResult> {
  try {
    const supabase = await createPlannerClient()
    const { data, error } = await supabase
      .from('trip_plans')
      .select('*')
      .eq('share_token', token)
      .eq('is_published', true)
      .single()
    if (error || !data) return { plan: null, error: error?.message ?? 'Nem található' }
    return { plan: rowToTripPlan(data as TripPlanRow) }
  } catch (error) {
    return { plan: null, error: error instanceof Error ? error.message : 'Ismeretlen hiba' }
  }
}

export interface SaveTripPlanResult {
  success: boolean
  id?: string
  shareToken?: string
  error?: string
}

export async function createTripPlan(
  destinationSlug: string,
  draft: TripPlanDraft
): Promise<SaveTripPlanResult> {
  try {
    const { id: destinationId, error: destError } = await getDestinationId(destinationSlug)
    if (!destinationId) {
      return { success: false, error: `Desztináció nem található: ${destinationSlug} (${destError})` }
    }

    const supabase = await createPlannerClient()
    const { data, error } = await supabase
      .from('trip_plans')
      .insert({
        destination_id: destinationId,
        guest_name: draft.guestName || null,
        date_range_label: draft.dateRangeLabel,
        accommodation: draft.accommodation || null,
        headcount: draft.headcount,
        days: draft.days,
        curator_message: draft.curatorMessage || null,
        is_published: draft.isPublished,
        is_template: draft.isTemplate,
        template_title: draft.templateTitle || null,
        template_teaser: draft.templateTeaser || null,
        template_image: draft.templateImage || null,
        sort_order: draft.sortOrder,
        template_budget: draft.templateBudget,
        template_disney_day: draft.templateDisneyDay,
        template_extra_night: draft.templateExtraNight,
      })
      .select('id, share_token')
      .single()

    if (error || !data) return { success: false, error: error?.message ?? 'Ismeretlen hiba' }
    return { success: true, id: data.id, shareToken: data.share_token }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Ismeretlen hiba' }
  }
}

export async function updateTripPlan(id: string, draft: TripPlanDraft): Promise<SaveTripPlanResult> {
  try {
    const supabase = await createPlannerClient()
    const { data, error } = await supabase
      .from('trip_plans')
      .update({
        guest_name: draft.guestName || null,
        date_range_label: draft.dateRangeLabel,
        accommodation: draft.accommodation || null,
        headcount: draft.headcount,
        days: draft.days,
        curator_message: draft.curatorMessage || null,
        is_published: draft.isPublished,
        is_template: draft.isTemplate,
        template_title: draft.templateTitle || null,
        template_teaser: draft.templateTeaser || null,
        template_image: draft.templateImage || null,
        sort_order: draft.sortOrder,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select('id, share_token')
      .single()

    if (error || !data) return { success: false, error: error?.message ?? 'Ismeretlen hiba' }
    return { success: true, id: data.id, shareToken: data.share_token }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Ismeretlen hiba' }
  }
}

export async function deleteTripPlan(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createPlannerClient()
    const { error } = await supabase.from('trip_plans').delete().eq('id', id)
    if (error) return { success: false, error: error.message }
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Ismeretlen hiba' }
  }
}
