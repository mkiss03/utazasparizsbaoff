import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import NavigationWrapper as Navigation from '@/components/NavigationWrapper'
import Footer from '@/components/Footer'
import BundleDetailClient from '@/components/bundles/BundleDetailClient'
import type { Bundle, BundleTopic, Flashcard } from '@/lib/types/database'

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
    .maybeSingle()

  if (!bundle) {
    notFound()
  }

  // Fetch published topics for this bundle
  const { data: topics } = await supabase
    .from('bundle_topics')
    .select('*')
    .eq('bundle_id', bundle.id)
    .eq('is_published', true)
    .order('created_at', { ascending: true })

  // Fetch flashcards for this bundle (for demo cards and backward compat)
  const { data: flashcards } = await supabase
    .from('flashcards')
    .select('*')
    .eq('bundle_id', bundle.id)
    .order('card_order', { ascending: true })

  // Check if user purchased this bundle
  let hasAccess = false
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    const { data: activePurchase } = await supabase
      .from('user_purchases')
      .select('id')
      .eq('user_id', user.id)
      .eq('bundle_id', bundle.id)
      .maybeSingle()
    hasAccess = !!activePurchase
  }

  return (
    <main className="relative min-h-screen bg-slate-50">
      <Navigation />
      <BundleDetailClient
        bundle={bundle as Bundle}
        topics={(topics as BundleTopic[]) || []}
        flashcards={(flashcards as Flashcard[]) || []}
        hasAccess={hasAccess}
        userId={user?.id}
      />
      <Footer />
    </main>
  )
}
