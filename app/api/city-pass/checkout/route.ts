import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { city, userId } = await request.json()

    if (!city || !userId) {
      return NextResponse.json(
        { error: 'Város és felhasználó megadása kötelező.' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Fetch city pricing
    const { data: cityPricing } = await supabase
      .from('city_pricing')
      .select('*')
      .eq('city', city)
      .eq('is_active', true)
      .single()

    if (!cityPricing) {
      return NextResponse.json(
        { error: 'A város árazása nem található.' },
        { status: 404 }
      )
    }

    // Check if user already has an active pass
    const { data: existingPass } = await supabase
      .from('user_purchases')
      .select('id')
      .eq('user_id', userId)
      .eq('city', city)
      .eq('is_active', true)
      .gte('expires_at', new Date().toISOString())
      .maybeSingle()

    if (existingPass) {
      return NextResponse.json(
        { error: 'Már rendelkezel aktív bérlettel ehhez a városhoz.' },
        { status: 400 }
      )
    }

    const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || ''

    // Determine amount in smallest currency unit
    const currency = cityPricing.currency.toLowerCase()
    // HUF: Stripe expects amount in fillér (x100), EUR/USD/GBP: in cents (x100)
    const unitAmount = Math.round(cityPricing.price * 100)

    const stripe = getStripe()
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      metadata: {
        product: 'city_pass',
        city: city,
        user_id: userId,
        duration_days: String(cityPricing.duration_days),
        price: String(cityPricing.price),
      },
      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name: `${city} City Pass`,
              description: `Teljes hozzáférés ${city} összes kártyacsomagjához ${cityPricing.duration_days} napig`,
            },
            unit_amount: unitAmount,
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}&city=${encodeURIComponent(city)}`,
      cancel_url: `${origin}/pricing?city=${encodeURIComponent(city)}`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err: unknown) {
    console.error('City Pass checkout error:', err)
    const message = err instanceof Error ? err.message : 'Hiba történt a fizetés indításakor.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
