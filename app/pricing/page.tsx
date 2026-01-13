import { createClient } from '@/lib/supabase/server'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import PricingClient from '@/components/pricing/PricingClient'
import type { CityPricing } from '@/lib/types/database'

export const revalidate = 60 // Revalidate every 60 seconds

export default async function PricingPage() {
  const supabase = await createClient()

  // Fetch all active city pricing
  const { data: cityPricing } = await supabase
    .from('city_pricing')
    .select('*')
    .eq('is_active', true)
    .order('price', { ascending: true })

  // For each city, get bundle count
  // Handle both 'Paris' and 'Párizs' spellings for city names
  const citiesWithBundles = await Promise.all(
    (cityPricing || []).map(async (city) => {
      // Try exact match first, then ilike for flexibility
      let { data: bundles } = await supabase
        .from('bundles')
        .select('id')
        .eq('city', city.city)
        .eq('is_published', true)

      // If no results, try case-insensitive search
      if (!bundles || bundles.length === 0) {
        const { data: bundlesAlt } = await supabase
          .from('bundles')
          .select('id')
          .ilike('city', city.city)
          .eq('is_published', true)
        bundles = bundlesAlt
      }

      return {
        ...city,
        bundleCount: bundles?.length || 0,
      }
    })
  )

  return (
    <main className="relative min-h-screen bg-parisian-cream-50">
      <Navigation />
      <PricingClient cities={citiesWithBundles as (CityPricing & { bundleCount: number })[]} />
      <Footer />
    </main>
  )
}
