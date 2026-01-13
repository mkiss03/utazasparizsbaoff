import { createClient } from '@/lib/supabase/server'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import BundlesCitiesPageClient from '@/components/bundles/BundlesCitiesPageClient'
import type { Bundle } from '@/lib/types/database'

export const metadata = {
  title: 'Összes Város - Tanulási Csomagok',
  description: 'Fedezd fel az összes város tanulási csomagjait. Párizs, Róma, Bécs és még sok más város nyelvtanulási témaköreit.',
}

export default async function BundlesCitiesPage() {
  const supabase = await createClient()

  // Fetch all published bundles
  const { data: bundles, error } = await supabase
    .from('bundles')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching bundles:', error)
  }

  // Group bundles by city
  const bundlesByCity = (bundles as Bundle[])?.reduce(
    (acc, bundle) => {
      if (!acc[bundle.city]) {
        acc[bundle.city] = {
          city: bundle.city,
          bundleCount: 0,
          bundles: [],
        }
      }
      acc[bundle.city].bundleCount += 1
      acc[bundle.city].bundles.push(bundle)
      return acc
    },
    {} as Record<string, { city: string; bundleCount: number; bundles: Bundle[] }>
  ) || {}

  const citiesData = Object.values(bundlesByCity)

  return (
    <main className="relative bg-parisian-cream-50">
      <Navigation />
      <BundlesCitiesPageClient cities={citiesData} />
      <Footer />
    </main>
  )
}
