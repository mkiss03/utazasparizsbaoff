import { createClient } from '@/lib/supabase/server'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import ParisFlashcardsPageClient from '@/components/paris/ParisFlashcardsPageClient'
import type { Bundle, Flashcard } from '@/lib/types/database'

// Force dynamic rendering to avoid build-time database access
export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Párizs Flashcards - Város Útmutató Flashcardok',
  description: 'Felfedezd az összes Párizs-specifikus tanulási témakört. Demo kártyák mindenki számára, teljes hozzáférés Pass után.',
}

interface BundleWithCards extends Bundle {
  flashcards?: Flashcard[]
}

export default async function ParisFlashcardsPage() {
  const supabase = await createClient()

  // Fetch all published Paris bundles
  const { data: bundles, error } = await supabase
    .from('bundles')
    .select('*')
    .eq('city', 'Paris')
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching bundles:', error)
  }

  // Fetch demo flashcards for each bundle
  const bundlesWithCards: BundleWithCards[] = []

  if (bundles && bundles.length > 0) {
    for (const bundle of bundles) {
      const { data: flashcards } = await supabase
        .from('flashcards')
        .select('*')
        .eq('bundle_id', bundle.id)
        .eq('is_demo', true)
        .order('card_order', { ascending: true })

      bundlesWithCards.push({
        ...bundle,
        flashcards: flashcards || [],
      })
    }
  }

  return (
    <main className="relative bg-parisian-cream-50">
      <Navigation />
      <ParisFlashcardsPageClient bundles={bundlesWithCards} />
      <Footer />
    </main>
  )
}
