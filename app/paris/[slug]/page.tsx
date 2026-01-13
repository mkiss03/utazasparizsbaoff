import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import ParisTopicDetailClient from '@/components/paris/ParisTopicDetailClient'
import type { Bundle, Flashcard } from '@/lib/types/database'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function ParisTopicPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  // Fetch bundle by slug
  const { data: bundle } = await supabase
    .from('bundles')
    .select('*')
    .eq('slug', slug)
    .eq('city', 'Paris')
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

  // TODO: Check if user has access to Paris pass
  // For now, assume they don't have access (demo mode)
  const hasAccess = false

  return (
    <main className="relative min-h-screen bg-parisian-cream-50">
      <Navigation />
      <ParisTopicDetailClient
        bundle={bundle as Bundle}
        flashcards={(flashcards as Flashcard[]) || []}
        hasAccess={hasAccess}
      />
      <Footer />
    </main>
  )
}
