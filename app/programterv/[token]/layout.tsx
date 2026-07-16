import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Programterv -- Utazás Párizsba',
  robots: { index: false, follow: false },
}

const isEnabled = process.env.NEXT_PUBLIC_FEATURE_TRIP_PLANS === 'true'

export default function TripPlanLayout({ children }: { children: React.ReactNode }) {
  if (!isEnabled) {
    notFound()
  }
  return children
}
