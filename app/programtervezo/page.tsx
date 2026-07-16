import { listPublishedTemplates } from '@/lib/actions/trip-plans'
import { mockDestinationId } from '@/lib/planner/mock-catalog'
import TemplateGallery from './_components/TemplateGallery'

export default async function ProgramtervezoPage() {
  const result = await listPublishedTemplates(mockDestinationId)

  return <TemplateGallery templates={result.plans} error={result.error} />
}
