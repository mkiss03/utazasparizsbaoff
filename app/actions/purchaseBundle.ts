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
  const { data: bundle } = await supabase
    .from('bundles')
    .select('id, title, price, author_id')
    .eq('id', bundleId)
    .eq('is_published', true)
    .single()

  if (!bundle) {
    return { success: false, error: 'A csomag nem található.' }
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

  const price = Number(bundle.price) || 0
  const commissionRate = 0.15
  const commissionAmount = +(price * commissionRate).toFixed(2)
  const vendorAmount = +(price - commissionAmount).toFixed(2)
  const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`

  // Create order
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

  if (orderError || !order) {
    return { success: false, error: 'Rendelés rögzítése sikertelen: ' + orderError?.message }
  }

  // Create user purchase record
  const { error: purchaseError } = await supabase
    .from('user_purchases')
    .insert({
      user_id: user.id,
      bundle_id: bundleId,
      order_id: order.id,
    })

  if (purchaseError) {
    return { success: false, error: 'Hozzáférés aktiválása sikertelen: ' + purchaseError.message }
  }

  revalidatePath(`/bundles`)
  revalidatePath(`/marketplace`)

  return { success: true }
}
