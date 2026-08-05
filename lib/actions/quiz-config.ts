'use server'

import { createPlannerClient } from '@/lib/planner/supabase/server'
import { createPlannerAdminClient } from '@/lib/planner/supabase/admin'
import { defaultQuizConfig, mergeQuizConfig, type QuizConfig } from '@/lib/planner/quiz-config-types'

async function getDestinationId(destinationSlug: string): Promise<{ id: string | null; error?: string }> {
  const supabase = await createPlannerClient()
  const { data, error } = await supabase.from('destinations').select('id').eq('slug', destinationSlug).single()
  if (error || !data) return { id: null, error: error?.message ?? 'Nincs találat' }
  return { id: data.id as string }
}

export interface GetQuizConfigResult {
  config: QuizConfig
  error?: string
}

export async function getQuizConfig(destinationSlug: string): Promise<GetQuizConfigResult> {
  try {
    const { id: destinationId } = await getDestinationId(destinationSlug)
    if (!destinationId) return { config: defaultQuizConfig() }

    const supabase = createPlannerAdminClient()
    const { data, error } = await supabase
      .from('configs')
      .select('quiz_options')
      .eq('destination_id', destinationId)
      .maybeSingle()

    if (error || !data) return { config: defaultQuizConfig() }
    return { config: mergeQuizConfig(data.quiz_options as Partial<QuizConfig>) }
  } catch (error) {
    return { config: defaultQuizConfig(), error: error instanceof Error ? error.message : 'Ismeretlen hiba' }
  }
}

export async function saveQuizConfig(
  destinationSlug: string,
  config: QuizConfig
): Promise<{ success: boolean; error?: string }> {
  try {
    const { id: destinationId, error: destError } = await getDestinationId(destinationSlug)
    if (!destinationId) return { success: false, error: `Desztináció nem található: ${destinationSlug} (${destError})` }

    const supabase = createPlannerAdminClient()
    const { error } = await supabase
      .from('configs')
      .upsert({ destination_id: destinationId, quiz_options: config }, { onConflict: 'destination_id' })

    if (error) return { success: false, error: error.message }
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Ismeretlen hiba' }
  }
}
