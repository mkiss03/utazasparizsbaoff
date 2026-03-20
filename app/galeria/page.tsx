import Navigation from '@/components/NavigationWrapper'
import Footer from '@/components/Footer'
import GaleriaClient from '@/components/galeria/GaleriaClient'

export default function GaleriaPage() {
  return (
    <main className="relative bg-parisian-cream-50">
      <Navigation />
      <GaleriaClient />
      <Footer staticTexts={{}} />
    </main>
  )
}
