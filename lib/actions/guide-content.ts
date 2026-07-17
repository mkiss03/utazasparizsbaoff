'use server'

import { createPlannerClient } from '@/lib/planner/supabase/server'
import { createPlannerAdminClient } from '@/lib/planner/supabase/admin'
import { emptyGuideContent, type GuideContent } from '@/lib/planner/guide-content-types'

async function getDestinationId(destinationSlug: string): Promise<{ id: string | null; error?: string }> {
  const supabase = await createPlannerClient()
  const { data, error } = await supabase.from('destinations').select('id').eq('slug', destinationSlug).single()
  if (error || !data) return { id: null, error: error?.message ?? 'Nincs találat' }
  return { id: data.id as string }
}

export interface GetGuideContentResult {
  content: GuideContent
  error?: string
}

// Publikus, guest-oldali olvasás -- anon kulccsal is elérhető, mert a
// configs tábla admin-only RLS-e mellett ez csak informatív tartalom,
// amit a /programtervezo szerver oldali render-je tölt be (nem a
// böngészőben fut anon kulccsal), ezért service-role klienssel olvasunk,
// hogy publikálatlan desztinációra se hasaljon el.
export async function getGuideContent(destinationSlug: string): Promise<GetGuideContentResult> {
  try {
    const { id: destinationId } = await getDestinationId(destinationSlug)
    if (!destinationId) return { content: emptyGuideContent() }

    const supabase = createPlannerAdminClient()
    const { data, error } = await supabase
      .from('configs')
      .select('guide_content')
      .eq('destination_id', destinationId)
      .maybeSingle()

    if (error || !data) return { content: emptyGuideContent() }
    return { content: (data.guide_content as GuideContent) ?? emptyGuideContent() }
  } catch (error) {
    return { content: emptyGuideContent(), error: error instanceof Error ? error.message : 'Ismeretlen hiba' }
  }
}

export async function saveGuideContent(
  destinationSlug: string,
  content: GuideContent
): Promise<{ success: boolean; error?: string }> {
  try {
    const { id: destinationId, error: destError } = await getDestinationId(destinationSlug)
    if (!destinationId) return { success: false, error: `Desztináció nem található: ${destinationSlug} (${destError})` }

    const supabase = createPlannerAdminClient()
    const { error } = await supabase
      .from('configs')
      .upsert({ destination_id: destinationId, guide_content: content }, { onConflict: 'destination_id' })

    if (error) return { success: false, error: error.message }
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Ismeretlen hiba' }
  }
}
