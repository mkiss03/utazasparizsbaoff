import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Programtervező -- Utazás Párizsba',
  description: 'Válaszd ki a hozzátok illő kész párizsi programtervet -- Eiffel-torony, Louvre, Montmartre, akár Disneyland-nappal.',
  robots: { index: false, follow: false },
}

const isEnabled = process.env.NEXT_PUBLIC_FEATURE_TRIP_PLANS === 'true'

export default function ProgramtervezoLayout({ children }: { children: React.ReactNode }) {
  if (!isEnabled) {
    notFound()
  }
  return children
}
