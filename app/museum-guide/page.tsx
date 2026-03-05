import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import MobileMuseumGuide from '@/components/MobileMuseumGuide'

export const dynamic = 'force-dynamic'
export const revalidate = 60

export const metadata: Metadata = {
  title: 'Louvre Múzeum – Magyar Digitális Útikalauz | Utazás Párizsba',
  description:
    'Interaktív magyar nyelvű Louvre útikalauz. Fedezd fel a világ legnagyobb múzeumának kincseit logikus útvonaltervvel és felejthetetlen sztorikkal.',
  openGraph: {
    title: 'Louvre Múzeum – Magyar Digitális Útikalauz',
    description:
      'Az első magyar nyelvű interaktív Louvre-kalauz. 12–15 gondosan válogatott alkotás, sztorikkal és útvonaltervvel.',
    type: 'website',
  },
}

export default async function MuseumGuidePage() {
  const supabase = await createClient()

  const { data: dbArtworks } = await supabase
    .from('museum_guide_artworks')
    .select('*')
    .eq('is_published', true)
    .order('display_order', { ascending: true })

  return <MobileMuseumGuide dbArtworks={dbArtworks} />
}
