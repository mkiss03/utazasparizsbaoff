import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import CheckoutClient from '@/components/checkout/CheckoutClient'
import type { CityPricing } from '@/lib/types/database'

interface Props {
  searchParams: Promise<{ city?: string }>
}

export default async function CheckoutPage({ searchParams }: Props) {
  const { city } = await searchParams

  if (!city) {
    redirect('/pricing')
  }

  const supabase = await createClient()

  // Get current user
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    // Redirect to login if not authenticated
    redirect(`/admin/login?redirect=/checkout?city=${city}`)
  }

  // Fetch city pricing
  const { data: cityPricing } = await supabase
    .from('city_pricing')
    .select('*')
    .eq('city', city)
    .eq('is_active', true)
    .single()

  if (!cityPricing) {
    redirect('/pricing')
  }

  // Check if user already has an active pass for this city
  const { data: existingPass } = await supabase
    .from('user_purchases')
    .select('*')
    .eq('user_id', user.id)
    .eq('city', city)
    .eq('is_active', true)
    .gte('expires_at', new Date().toISOString())
    .single()

  if (existingPass) {
    // User already has access, redirect to my-passes
    redirect('/my-passes')
  }

  return (
    <main className="relative min-h-screen bg-slate-50">
      <Navigation />
      <CheckoutClient
        cityPricing={cityPricing as CityPricing}
        userId={user.id}
      />
      <Footer />
    </main>
  )
}
