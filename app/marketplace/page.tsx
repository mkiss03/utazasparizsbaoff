import { createClient } from '@/lib/supabase/server'
import MarketplaceShopClient from '@/components/marketplace/MarketplaceShopClient'
import type { Bundle, CityPricing } from '@/lib/types/database'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Kártyacsomagok — Piactér',
  description: 'Fedezd fel a városfelfedező flashcard csomagokat. Válassz témakört és kezdj el tanulni!',
}

export default async function MarketplacePage() {
  const supabase = await createClient()

  // Fetch published bundles
  const { data: bundles } = await supabase
    .from('bundles')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  // Fetch active city pricing for price display
  const { data: cityPricing } = await supabase
    .from('city_pricing')
    .select('*')
    .eq('is_active', true)

  return (
    <MarketplaceShopClient
      bundles={(bundles as Bundle[]) || []}
      cityPricing={(cityPricing as CityPricing[]) || []}
    />
  )
}
