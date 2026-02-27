import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'

const PRICE_HUF = 3990

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone } = await request.json()

    if (!name || !email) {
      return NextResponse.json(
        { error: 'Név és email megadása kötelező.' },
        { status: 400 }
      )
    }

    const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || ''

    const stripe = getStripe()
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: email,
      metadata: {
        product: 'louvre_tour',
        guest_name: name,
        guest_email: email,
        guest_phone: phone || '',
      },
      line_items: [
        {
          price_data: {
            currency: 'huf',
            product_data: {
              name: 'Louvre Interaktív Túra',
              description: '10 megálló · 3 szárny · ~3 óra — Korlátlan hozzáférés',
            },
            unit_amount: PRICE_HUF,
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/louvre-tour/purchase/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/louvre-tour/purchase`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    console.error('Stripe checkout error:', err)
    return NextResponse.json(
      { error: err.message || 'Hiba történt a fizetés indításakor.' },
      { status: 500 }
    )
  }
}
