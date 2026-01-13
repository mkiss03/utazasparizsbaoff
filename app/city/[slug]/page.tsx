import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import CityPageClient from '@/components/city/CityPageClient'
import type { Bundle, CityPricing } from '@/lib/types/database'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function CityPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  // Normalize city name (capitalize first letter)
  const cityName = slug.charAt(0).toUpperCase() + slug.slice(1).toLowerCase()

  // Fetch city pricing
  const { data: cityPricing } = await supabase
    .from('city_pricing')
    .select('*')
    .eq('city', cityName)
    .eq('is_active', true)
    .single()

  if (!cityPricing) {
    notFound()
  }

  // Fetch all published bundles for this city
  const { data: bundles } = await supabase
    .from('bundles')
    .select('*')
    .eq('city', cityName)
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  // TODO: Check if user already has access to this city
  const hasAccess = false

  return (
    <main className="relative min-h-screen bg-slate-50">
      <Navigation />
      <CityPageClient
        cityPricing={cityPricing as CityPricing}
        bundles={(bundles as Bundle[]) || []}
        hasAccess={hasAccess}
      />
      <Footer />
    </main>
  )
}
