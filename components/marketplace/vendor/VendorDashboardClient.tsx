'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useUserRole } from '@/lib/hooks/useUserRole'
import OnboardingWizard from './OnboardingWizard'
import { Loader2, Package, ShoppingCart, CreditCard, TrendingUp } from 'lucide-react'
import type { VendorProfile, Bundle } from '@/lib/types/database'

export default function VendorDashboardClient() {
  const { userId } = useUserRole()
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<VendorProfile | null>(null)
  const [bundles, setBundles] = useState<Bundle[]>([])
  const [totalCards, setTotalCards] = useState(0)
  const [totalOrders, setTotalOrders] = useState(0)
  const [totalRevenue, setTotalRevenue] = useState(0)

  useEffect(() => {
    if (!userId) return

    const fetchData = async () => {
      const supabase = createClient()

      // Fetch vendor profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (profileData) {
        setProfile(profileData as unknown as VendorProfile)
      }

      // Fetch bundles
      const { data: bundlesData } = await supabase
        .from('bundles')
        .select('*')
        .eq('author_id', userId)
        .order('created_at', { ascending: false })

      if (bundlesData) {
        setBundles(bundlesData as Bundle[])
        setTotalCards(bundlesData.reduce((sum, b) => sum + (b.total_cards || 0), 0))
      }

      // Fetch orders
      const { data: ordersData } = await supabase
        .from('orders')
        .select('amount, vendor_amount')
        .eq('vendor_id', userId)
        .eq('status', 'completed')

      if (ordersData) {
        setTotalOrders(ordersData.length)
        setTotalRevenue(ordersData.reduce((sum, o) => sum + Number(o.vendor_amount || 0), 0))
      }

      setLoading(false)
    }

    fetchData()
  }, [userId])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="text-center py-20 text-slate-500">
        Profil nem található.
      </div>
    )
  }

  // Show onboarding wizard if not finished (step < 4 or no approved bundle)
  const hasApprovedBundle = bundles.some((b) => b.status === 'approved' || b.status === 'published')
  const showOnboarding = !hasApprovedBundle && (profile.onboarding_step < 4 || !profile.is_approved)

  if (showOnboarding) {
    return (
      <OnboardingWizard
        profile={profile}
        bundleCount={bundles.length}
        cardCount={totalCards}
      />
    )
  }

  // Full dashboard with stats
  return (
    <div>
      <h1 className="text-xl font-bold text-slate-900">
        Szia, {profile.vendor_display_name || 'Eladó'}!
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        Áttekintés az eladói tevékenységedről.
      </p>

      {/* Stat cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Package}
          label="Csomagok"
          value={bundles.length}
          sub={`${bundles.filter((b) => b.status === 'published').length} publikált`}
        />
        <StatCard
          icon={CreditCard}
          label="Kártyák"
          value={totalCards}
        />
        <StatCard
          icon={ShoppingCart}
          label="Rendelések"
          value={totalOrders}
        />
        <StatCard
          icon={TrendingUp}
          label="Bevétel"
          value={`€${totalRevenue.toFixed(2)}`}
        />
      </div>

      {/* Recent bundles */}
      {bundles.length > 0 && (
        <div className="mt-8">
          <h2 className="text-sm font-semibold text-slate-700 mb-3">Legutóbbi csomagok</h2>
          <div className="space-y-2">
            {bundles.slice(0, 5).map((bundle) => (
              <div
                key={bundle.id}
                className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-slate-800">{bundle.title}</p>
                  <p className="text-xs text-slate-400">{bundle.city} — {bundle.total_cards} kártya</p>
                </div>
                <BundleStatusBadge status={bundle.status} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: React.ElementType
  label: string
  value: string | number
  sub?: string
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center gap-2 text-slate-500">
        <Icon className="h-4 w-4" />
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
      {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
    </div>
  )
}

function BundleStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    draft: 'bg-slate-100 text-slate-600',
    submitted_for_review: 'bg-amber-50 text-amber-700',
    approved: 'bg-green-50 text-green-700',
    rejected: 'bg-red-50 text-red-700',
    published: 'bg-blue-50 text-blue-700',
  }
  const labels: Record<string, string> = {
    draft: 'Piszkozat',
    submitted_for_review: 'Elbírálás alatt',
    approved: 'Jóváhagyva',
    rejected: 'Elutasítva',
    published: 'Publikálva',
  }

  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status] || styles.draft}`}>
      {labels[status] || status}
    </span>
  )
}
