import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Programszervező -- fejlesztői playground',
  robots: {
    index: false,
    follow: false,
  },
}

const isPlannerEnabled = process.env.NEXT_PUBLIC_FEATURE_PLANNER === 'true'

export default function PlannerLabsLayout({ children }: { children: React.ReactNode }) {
  if (!isPlannerEnabled) {
    notFound()
  }

  return children
}
