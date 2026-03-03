import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import StudyClient from '@/components/bundles/StudyClient'
import type { Bundle, Flashcard } from '@/lib/types/database'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function StudyPage({ params }: Props) {
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

  // Check if user has access
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect(`/bundles/${slug}`)
  }

  const { data: activePurchase } = await supabase
    .from('user_purchases')
    .select('id')
    .eq('user_id', user.id)
    .eq('city', bundle.city)
    .eq('is_active', true)
    .gte('expires_at', new Date().toISOString())
    .maybeSingle()

  if (!activePurchase) {
    redirect(`/bundles/${slug}`)
  }

  // Fetch all flashcards
  const { data: flashcards } = await supabase
    .from('flashcards')
    .select('*')
    .eq('bundle_id', bundle.id)
    .order('card_order', { ascending: true })

  return (
    <StudyClient
      bundle={bundle as Bundle}
      flashcards={(flashcards as Flashcard[]) || []}
    />
  )
}
