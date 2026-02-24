import type { Metadata } from 'next'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import MuseumGuidePurchaseClient from '@/components/museum-guide/MuseumGuidePurchaseClient'

export const metadata: Metadata = {
  title: 'Louvre Digitális Útikalauz - Megvásárlás | Utazás Párizsba',
  description: 'Vásárold meg az egyetlen magyar nyelvű interaktív Louvre útikalauzt. Gondosan válogatott alkotások, sztorik, útvonalterv.',
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
