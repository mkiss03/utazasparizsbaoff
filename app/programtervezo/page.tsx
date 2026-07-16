import { listPublishedTemplates } from '@/lib/actions/trip-plans'
import { mockDestinationId } from '@/lib/planner/mock-catalog'
import ProgramtervezoFlow from './_components/ProgramtervezoFlow'

export default async function ProgramtervezoPage() {
  const result = await listPublishedTemplates(mockDestinationId)

  return <ProgramtervezoFlow templates={result.plans} error={result.error} />
}
