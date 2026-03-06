import { createClient } from '@/lib/supabase/server'
import MarketplaceShopClient from '@/components/marketplace/MarketplaceShopClient'
import type { Bundle } from '@/lib/types/database'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Kártyacsomagok — Piactér',
  description: 'Fedezd fel a városfelfedező flashcard csomagokat. Válassz témakört és kezdj el tanulni!',
}

interface Props {
  searchParams: Promise<{ city?: string }>
}

export default async function MarketplacePage({ searchParams }: Props) {
  const { city } = await searchParams
  const supabase = await createClient()

  // Fetch published bundles
  const { data: bundles } = await supabase
    .from('bundles')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  return (
    <MarketplaceShopClient
      bundles={(bundles as Bundle[]) || []}
      initialCity={city || undefined}
    />
  )
}
