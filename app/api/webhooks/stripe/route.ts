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
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any

    // Only process louvre_tour purchases
    if (session.metadata?.product !== 'louvre_tour') {
      return NextResponse.json({ received: true })
    }

    const supabase = getAdminSupabase()

    // Check if purchase already exists for this session
    const { data: existing } = await supabase
      .from('louvre_tour_purchases')
      .select('id')
      .eq('notes', `stripe:${session.id}`)
      .single()

    if (!existing) {
      await supabase.from('louvre_tour_purchases').insert({
        guest_name: session.metadata.guest_name,
        guest_email: session.metadata.guest_email,
        guest_phone: session.metadata.guest_phone || null,
        amount: (session.amount_total || 3990) / 1, // HUF has no decimals in Stripe
        payment_status: 'completed',
        notes: `stripe:${session.id}`,
      })
    }
  }

  return NextResponse.json({ received: true })
}
