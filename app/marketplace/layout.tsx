import MarketplaceNav from '@/components/marketplace/MarketplaceNav'
import MarketplaceFooter from '@/components/marketplace/MarketplaceFooter'

export const metadata = {
  title: 'Piactér — Utazás Párizsba',
  description: 'Fedezd fel a városfelfedező kártyacsomagokat különböző városokhoz',
}

export default function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <MarketplaceNav />
      <main className="flex-1">{children}</main>
      <MarketplaceFooter />
    </div>
  )
}
