import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import StudyClient from '@/components/bundles/StudyClient'
import type { Bundle, Flashcard } from '@/lib/types/database'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ topic?: string }>
}

export default async function StudyPage({ params, searchParams }: Props) {
  const { slug } = await params
  const { topic: topicSlug } = await searchParams
  const supabase = await createClient()

  // Fetch bundle
  const { data: bundle } = await supabase
    .from('bundles')
    .select('*')
    .eq('slug', slug)
    .or('is_published.eq.true,status.eq.published')
    .maybeSingle()

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
    .eq('bundle_id', bundle.id)
    .maybeSingle()

  if (!activePurchase) {
    redirect(`/bundles/${slug}`)
  }

  // Determine study title and fetch cards
  let studyTitle = bundle.title

  // If studying a specific topic, filter by topic
  if (topicSlug) {
    const { data: topic } = await supabase
      .from('bundle_topics')
      .select('*')
      .eq('bundle_id', bundle.id)
      .eq('slug', topicSlug)
      .single()

    if (topic) {
      studyTitle = `${bundle.title} — ${topic.title}`
      const { data: topicCards } = await supabase
        .from('flashcards')
        .select('*')
        .eq('topic_id', topic.id)
        .order('card_order', { ascending: true })

      return (
        <StudyClient
          bundle={{ ...bundle, title: studyTitle } as Bundle}
          flashcards={(topicCards as Flashcard[]) || []}
        />
      )
    }
  }

  // No topic filter: fetch all cards for the bundle
  const { data: flashcards } = await supabase
    .from('flashcards')
    .select('*')
    .eq('bundle_id', bundle.id)
    .order('card_order', { ascending: true })

  return (
    <StudyClient
      bundle={{ ...bundle, title: studyTitle } as Bundle}
      flashcards={(flashcards as Flashcard[]) || []}
    />
  )
}
