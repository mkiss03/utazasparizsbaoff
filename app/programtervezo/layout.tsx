import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Programtervező -- Utazás Párizsba',
  description: 'Válaszolj néhány kérdésre, és ízelítőt kapsz a személyre szabott párizsi programtervedből.',
  robots: {
    index: false,
    follow: false,
  },
}

const isPlannerEnabled = process.env.NEXT_PUBLIC_FEATURE_PLANNER === 'true'

export default function ProgramtervezoLayout({ children }: { children: React.ReactNode }) {
  if (!isPlannerEnabled) {
    notFound()
  }

  return children
}
