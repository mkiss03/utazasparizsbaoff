import { notFound } from 'next/navigation'
import { getTripPlanByShareToken } from '@/lib/actions/trip-plans'
import TripPlanView from './_components/TripPlanView'

export default async function TripPlanPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const result = await getTripPlanByShareToken(token)

  if (!result.plan) {
    notFound()
  }

  return <TripPlanView plan={result.plan} />
}
