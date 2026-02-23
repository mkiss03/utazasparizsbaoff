import type { Metadata } from 'next'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import MuseumGuidePurchaseClient from '@/components/museum-guide/MuseumGuidePurchaseClient'

export const metadata: Metadata = {
  title: 'Louvre Digitalis Utikalauz - Megvasarlas | Utazas Parizsba',
  description: 'Vasarold meg az egyetlen magyar nyelvu interaktiv Louvre utikalauzt. Gondosan valogatott alkotasok, sztorik, utvonalterv.',
}

export default function MuseumGuidePurchasePage() {
  return (
    <main className="relative min-h-screen bg-parisian-cream-50">
      <Navigation />
      <div className="pt-24 pb-16">
        <MuseumGuidePurchaseClient />
      </div>
      <Footer />
    </main>
  )
}
