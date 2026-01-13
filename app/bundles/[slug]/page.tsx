import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import BundleDetailClient from '@/components/bundles/BundleDetailClient'
import type { Bundle, Flashcard } from '@/lib/types/database'

// Force dynamic rendering to avoid build-time database access
export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function BundleDetailPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  // Fetch bundle
  const { data: bundle } = await supabase
    .from('bundles')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (!bundle) {
    notFound()
  }

  // Fetch flashcards for this bundle
  const { data: flashcards } = await supabase
    .from('flashcards')
    .select('*')
    .eq('bundle_id', bundle.id)
    .order('card_order', { ascending: true })

  // TODO: Check if user has city access
  // For now, assume they don't have access (demo mode)
  const hasAccess = false

  return (
    <main className="relative min-h-screen bg-slate-50">
      <Navigation />
      <BundleDetailClient
        bundle={bundle as Bundle}
        flashcards={(flashcards as Flashcard[]) || []}
        hasAccess={hasAccess}
      />
      <Footer />
    </main>
  )
}
