'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function purchaseBundle(bundleId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: 'Bejelentkezés szükséges!' }
  }

  // Fetch bundle details
  const { data: bundle, error: bundleError } = await supabase
    .from('bundles')
    .select('id, title, author_id, city')
    .eq('id', bundleId)
    .eq('is_published', true)
    .maybeSingle()

  if (bundleError) {
    return { success: false, error: 'Adatbázis hiba: ' + bundleError.message }
  }
  if (!bundle) {
    return { success: false, error: 'A csomag nem található vagy nem elérhető.' }
  }

  // Check if user already purchased this bundle
  const { data: existing } = await supabase
    .from('user_purchases')
    .select('id')
    .eq('user_id', user.id)
    .eq('bundle_id', bundleId)
    .maybeSingle()

  if (existing) {
    return { success: false, error: 'Ezt a csomagot már megvásároltad!' }
  }

  // Get price from city_pricing table
  const { data: cityPricing } = await supabase
    .from('city_pricing')
    .select('price')
    .eq('city', bundle.city)
    .eq('is_active', true)
    .maybeSingle()

  const price = Number(cityPricing?.price) || 0
  const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`

  // Try to create order record (orders table may not exist yet)
  let orderId: string | null = null
  try {
    const commissionRate = 0.15
    const commissionAmount = +(price * commissionRate).toFixed(2)
    const vendorAmount = +(price - commissionAmount).toFixed(2)

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        user_id: user.id,
        bundle_id: bundleId,
        vendor_id: bundle.author_id,
        amount: price,
        commission_amount: commissionAmount,
        vendor_amount: vendorAmount,
        status: 'completed',
        payment_method: 'mock',
      })
      .select('id')
      .single()

    if (!orderError && order) {
      orderId = order.id
    }
  } catch {
    // orders table may not exist — continue without it
  }

  // Create user purchase record
  const purchaseData: Record<string, unknown> = {
    user_id: user.id,
    bundle_id: bundleId,
  }
  if (orderId) {
    purchaseData.order_id = orderId
  }

  const { error: purchaseError } = await supabase
    .from('user_purchases')
    .insert(purchaseData)

  if (purchaseError) {
    return { success: false, error: 'Hozzáférés aktiválása sikertelen: ' + purchaseError.message }
  }

  revalidatePath(`/bundles/${bundleId}`)
  revalidatePath(`/marketplace`)

  return { success: true }
}
