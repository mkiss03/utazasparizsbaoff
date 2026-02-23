import type { Metadata } from 'next'
import MobileMuseumGuide from '@/components/MobileMuseumGuide'

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

export default function MuseumGuidePage() {
  return <MobileMuseumGuide />
}
