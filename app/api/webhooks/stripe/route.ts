import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'

// Use service role key for webhook (no user session)
function getAdminSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  )
}

export async function POST(request: NextRequest) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event
  try {
    const stripe = getStripe()
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    )
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('Webhook signature verification failed:', message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Record<string, unknown>
    const metadata = session.metadata as Record<string, string> | undefined

    if (!metadata) {
      return NextResponse.json({ received: true })
    }

    const supabase = getAdminSupabase()

    // Handle City Pass purchase
    if (metadata.product === 'city_pass') {
      const userId = metadata.user_id
      const city = metadata.city
      const durationDays = parseInt(metadata.duration_days || '7', 10)
      const price = parseFloat(metadata.price || '0')

      // Check if already processed
      const { data: existing } = await supabase
        .from('orders')
        .select('id')
        .eq('payment_method', `stripe:${session.id}`)
        .maybeSingle()

      if (!existing) {
        const purchaseDate = new Date()
        const expirationDate = new Date(purchaseDate)
        expirationDate.setDate(expirationDate.getDate() + durationDays)

        // Create order
        const { data: order, error: orderError } = await supabase
          .from('orders')
          .insert({
            user_id: userId,
            city: city,
            amount: price,
            status: 'completed',
            payment_method: `stripe:${session.id}`,
          })
          .select()
          .single()

        if (orderError) {
          console.error('Error creating order:', orderError)
          return NextResponse.json({ error: 'Order creation failed' }, { status: 500 })
        }

        // Create user purchase (City Pass)
        const { error: purchaseError } = await supabase
          .from('user_purchases')
          .insert({
            user_id: userId,
            city: city,
            order_id: order.id,
            purchased_at: purchaseDate.toISOString(),
            expires_at: expirationDate.toISOString(),
            is_active: true,
          })

        if (purchaseError) {
          console.error('Error creating user purchase:', purchaseError)
        }
      }
    }

    // Handle Experience purchase
    if (metadata.product === 'experience') {
      const { data: existing } = await supabase
        .from('experience_purchases')
        .select('id')
        .eq('notes', `stripe:${session.id}`)
        .maybeSingle()

      if (!existing) {
        await supabase.from('experience_purchases').insert({
          experience_id: metadata.experience_id,
          guest_name: metadata.guest_name,
          guest_email: metadata.guest_email,
          guest_phone: metadata.guest_phone || null,
          quantity: parseInt(metadata.quantity || '1', 10),
          unit_price: parseFloat(metadata.unit_price || '0'),
          total_amount: parseFloat(metadata.total_amount || '0'),
          payment_status: 'completed',
          notes: `stripe:${session.id}`,
        })
      }
    }

    // Handle Louvre Tour purchase
    if (metadata.product === 'louvre_tour') {
      const { data: existing } = await supabase
        .from('louvre_tour_purchases')
        .select('id')
        .eq('notes', `stripe:${session.id}`)
        .single()

      if (!existing) {
        await supabase.from('louvre_tour_purchases').insert({
          guest_name: metadata.guest_name,
          guest_email: metadata.guest_email,
          guest_phone: metadata.guest_phone || null,
          amount: ((session.amount_total as number) || 3990) / 1,
          payment_status: 'completed',
          notes: `stripe:${session.id}`,
        })
      }
    }
  }

  return NextResponse.json({ received: true })
}
