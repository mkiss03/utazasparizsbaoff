'use server'

import { createPlannerClient } from '@/lib/planner/supabase/server'
import type { ItineraryDraft } from '@/lib/planner/types'

export interface SaveDraftAsRequestInput {
  destinationSlug: string
  contactEmail: string
  contactName?: string
  draft: ItineraryDraft
}

export interface SaveDraftAsRequestResult {
  success: boolean
  requestId?: string
  itineraryId?: string
  error?: string
}

/**
 * Végigviszi az adatutat a dev DB-n: requests + itineraries insert.
 * Kizárólag a /labs/planner fejlesztői playground használja -- ez teszi
 * lehetővé, hogy az 1. fázis végén az adatmodell élesben tesztelhető legyen
 * anélkül, hogy az admin stúdió (2. fázis) elkészülne.
 */
export async function saveDraftAsRequest(
  input: SaveDraftAsRequestInput
): Promise<SaveDraftAsRequestResult> {
  const supabase = await createPlannerClient()

  const { data: destination, error: destinationError } = await supabase
    .from('destinations')
    .select('id')
    .eq('slug', input.destinationSlug)
    .single()

  if (destinationError || !destination) {
    return { success: false, error: `Desztináció nem található: ${input.destinationSlug}` }
  }

  const { data: request, error: requestError } = await supabase
    .from('requests')
    .insert({
      destination_id: destination.id,
      contact_email: input.contactEmail,
      contact_name: input.contactName,
      preferences: input.draft.preferences,
      status: 'draft_ready',
    })
    .select('id')
    .single()

  if (requestError || !request) {
    return { success: false, error: requestError?.message ?? 'Ismeretlen hiba a request mentésekor' }
  }

  const { data: itinerary, error: itineraryError } = await supabase
    .from('itineraries')
    .insert({
      request_id: request.id,
      destination_id: destination.id,
      version: 1,
      kind: 'generated',
      days: input.draft.days,
      editor_notes: {},
    })
    .select('id')
    .single()

  if (itineraryError || !itinerary) {
    return { success: false, error: itineraryError?.message ?? 'Ismeretlen hiba az itinerary mentésekor' }
  }

  return { success: true, requestId: request.id, itineraryId: itinerary.id }
}
