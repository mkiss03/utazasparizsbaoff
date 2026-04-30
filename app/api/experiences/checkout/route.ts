import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'

function getAdminSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  )
}

export async function POST(request: NextRequest) {
  try {
    const { experienceId, quantity, name, email, phone } = await request.json()

    if (!experienceId || !quantity || quantity < 1) {
      return NextResponse.json({ error: 'Hiányzó adatok.' }, { status: 400 })
    }
    if (!name || !email) {
      return NextResponse.json({ error: 'Név és email megadása kötelező.' }, { status: 400 })
    }

    const supabase = getAdminSupabase()
    const { data: experience, error } = await supabase
      .from('experiences')
      .select('id, title, price, image, is_active')
      .eq('id', experienceId)
      .eq('is_active', true)
      .maybeSingle()

    if (error || !experience) {
      return NextResponse.json({ error: 'Az élmény nem található.' }, { status: 404 })
    }

    const unitAmountCents = Math.round(experience.price * 100)
    const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || ''

    const stripe = getStripe()
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: email,
      metadata: {
        product: 'experience',
        experience_id: experience.id,
        experience_title: experience.title,
        quantity: String(quantity),
        unit_price: String(experience.price),
        total_amount: String(experience.price * quantity),
        guest_name: name,
        guest_email: email,
        guest_phone: phone || '',
      },
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: experience.title,
              description: `${quantity} fő · ${experience.price} € / fő`,
              ...(experience.image && !experience.image.startsWith('/') ? { images: [experience.image] } : {}),
            },
            unit_amount: unitAmountCents,
          },
          quantity,
        },
      ],
      success_url: `${origin}/elmenyek/koszono?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/elmenyek`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    console.error('Experience checkout error:', err)
    return NextResponse.json(
      { error: err.message || 'Hiba történt a fizetés indításakor.' },
      { status: 500 }
    )
  }
}
