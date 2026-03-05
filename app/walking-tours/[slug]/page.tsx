import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import WalkingTourBookingClient from '@/components/walking-tours/WalkingTourBookingClient'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function WalkingTourDetailPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: tour } = await supabase
    .from('walking_tours')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (!tour) redirect('/walking-tours')

  return (
    <main className="relative min-h-screen bg-parisian-cream-50">
      <Navigation />
      <div className="pt-24 pb-16">
        <WalkingTourBookingClient tour={tour} />
      </div>
      <Footer />
    </main>
  )
}
