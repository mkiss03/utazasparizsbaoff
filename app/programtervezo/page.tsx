import { listPublishedTemplates } from '@/lib/actions/trip-plans'
import { getGuideContent } from '@/lib/actions/guide-content'
import { mockDestinationId } from '@/lib/planner/mock-catalog'
import { emptyGuideContent } from '@/lib/planner/guide-content-types'
import ProgramtervezoFlow from './_components/ProgramtervezoFlow'

export default async function ProgramtervezoPage() {
  const [templatesResult, guideResult] = await Promise.all([
    listPublishedTemplates(mockDestinationId),
    getGuideContent(mockDestinationId),
  ])

  return (
    <ProgramtervezoFlow
      templates={templatesResult.plans}
      error={templatesResult.error}
      guideContent={guideResult.content ?? emptyGuideContent()}
    />
  )
}
