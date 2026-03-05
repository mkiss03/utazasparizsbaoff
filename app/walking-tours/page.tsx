import { createClient } from '@/lib/supabase/server'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import WalkingToursCalendarClient from '@/components/walking-tours/WalkingToursCalendarClient'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Sétatúrák - Utazás Párizsba',
  description: 'Fedezd fel Párizst magyar nyelvű sétatúráinkon. Nézd meg a közelgő időpontokat és foglalj helyet!',
}

export default async function WalkingToursPage() {
  const supabase = await createClient()

  const today = new Date().toISOString().split('T')[0]
  const { data: tours } = await supabase
    .from('walking_tours')
    .select('*')
    .eq('status', 'published')
    .gte('tour_date', today)
    .order('tour_date', { ascending: true })

  return (
    <main className="relative min-h-screen bg-parisian-cream-50">
      <Navigation />
      <div className="pt-24 pb-16">
        <WalkingToursCalendarClient tours={tours || []} />
      </div>
      <Footer />
    </main>
  )
}
