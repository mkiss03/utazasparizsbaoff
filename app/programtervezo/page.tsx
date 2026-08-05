import { listPublishedTemplates } from '@/lib/actions/trip-plans'
import { getGuideContent } from '@/lib/actions/guide-content'
import { getQuizConfig } from '@/lib/actions/quiz-config'
import { mockDestinationId } from '@/lib/planner/mock-catalog'
import { emptyGuideContent } from '@/lib/planner/guide-content-types'
import { defaultQuizConfig } from '@/lib/planner/quiz-config-types'
import ProgramtervezoFlow from './_components/ProgramtervezoFlow'

export default async function ProgramtervezoPage() {
  const [templatesResult, guideResult, quizConfigResult] = await Promise.all([
    listPublishedTemplates(mockDestinationId),
    getGuideContent(mockDestinationId),
    getQuizConfig(mockDestinationId),
  ])

  return (
    <ProgramtervezoFlow
      templates={templatesResult.plans}
      error={templatesResult.error}
      guideContent={guideResult.content ?? emptyGuideContent()}
      quizConfig={quizConfigResult.config ?? defaultQuizConfig()}
    />
  )
}
