'use server'

import { createPlannerClient } from '@/lib/planner/supabase/server'
import type { FlowGraph } from '@/lib/planner/flow-types'

const FLOW_SLUG = 'programtervezo'

export interface SaveFlowResult {
  success: boolean
  error?: string
}

export interface LoadFlowResult {
  graph: FlowGraph | null
  error?: string
}

/**
 * Egyelőre egyetlen flow-t kezelünk desztinációnként ("programtervezo" slug)
 * -- a többtenant/több-flow támogatás (más desztinációk, más termékváltozatok)
 * a white-label fázis (5.) témája, ide később bővíthető ki slug szerint.
 */
export async function loadFlow(destinationSlug: string): Promise<LoadFlowResult> {
  const supabase = await createPlannerClient()

  const { data: destination, error: destinationError } = await supabase
    .from('destinations')
    .select('id')
    .eq('slug', destinationSlug)
    .single()

  if (destinationError || !destination) {
    return { graph: null, error: `Desztináció nem található: ${destinationSlug}` }
  }

  const { data: flow, error: flowError } = await supabase
    .from('flows')
    .select('graph')
    .eq('destination_id', destination.id)
    .eq('slug', FLOW_SLUG)
    .maybeSingle()

  if (flowError) {
    return { graph: null, error: flowError.message }
  }

  return { graph: (flow?.graph as FlowGraph) ?? null }
}

export async function saveFlow(destinationSlug: string, graph: FlowGraph): Promise<SaveFlowResult> {
  const supabase = await createPlannerClient()

  const { data: destination, error: destinationError } = await supabase
    .from('destinations')
    .select('id')
    .eq('slug', destinationSlug)
    .single()

  if (destinationError || !destination) {
    return { success: false, error: `Desztináció nem található: ${destinationSlug}` }
  }

  const { error: upsertError } = await supabase.from('flows').upsert(
    {
      destination_id: destination.id,
      slug: FLOW_SLUG,
      name: 'Programtervező',
      graph,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'destination_id,slug' }
  )

  if (upsertError) {
    return { success: false, error: upsertError.message }
  }

  return { success: true }
}
