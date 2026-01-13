import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import MyPassesClient from '@/components/passes/MyPassesClient'

export const dynamic = 'force-dynamic'

export default async function MyPassesPage() {
  const supabase = await createClient()

  // Get current user
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login?redirect=/my-passes')
  }

  // Fetch user's passes with bundle counts
  const { data: passes } = await supabase
    .from('user_purchases')
    .select('*')
    .eq('user_id', user.id)
    .order('purchased_at', { ascending: false })

  // For each city, get the bundle count
  const passesWithBundles = await Promise.all(
    (passes || []).map(async (pass) => {
      const { data: bundles } = await supabase
        .from('bundles')
        .select('id')
        .eq('city', pass.city)
        .eq('is_published', true)

      return {
        ...pass,
        bundleCount: bundles?.length || 0,
      }
    })
  )

  return (
    <main className="relative min-h-screen bg-slate-50">
      <Navigation />
      <MyPassesClient passes={passesWithBundles} />
      <Footer />
    </main>
  )
}
