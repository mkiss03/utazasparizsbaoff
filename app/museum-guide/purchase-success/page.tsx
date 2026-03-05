import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { CheckCircle, Landmark, Mail, ArrowRight } from 'lucide-react'

export const dynamic = 'force-dynamic'

interface Props {
  searchParams: Promise<{ order?: string }>
}

export default async function PurchaseSuccessPage({ searchParams }: Props) {
  const { order } = await searchParams
  const supabase = await createClient()

  let purchase = null

  if (order) {
    const { data } = await supabase
      .from('museum_guide_purchases')
      .select('*')
      .eq('order_number', order)
      .single()

    purchase = data
  }

  return (
    <main className="relative min-h-screen bg-parisian-cream-50">
      <Navigation />

      <div className="py-24">
        <div className="container mx-auto max-w-2xl px-4">
          <div className="rounded-2xl border border-green-200 bg-white p-8 text-center shadow-2xl md:p-12">
            {/* Success Icon */}
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>

            <h1 className="mb-4 font-playfair text-3xl font-bold text-parisian-grey-800 md:text-4xl">
              Sikeres vasarlas!
            </h1>

            {purchase ? (
              <>
                <p className="mb-8 text-lg text-parisian-grey-600">
                  Koszonjuk a vasarlasod! Az utikalauz mostantol elerheto.
                </p>

                {/* Purchase Details */}
                <div className="mb-8 rounded-xl bg-gradient-to-br from-parisian-beige-50 to-parisian-cream-50 border border-parisian-beige-200 p-6 text-left">
                  <div className="mb-4 text-center">
                    <span className="text-sm text-parisian-grey-500">Rendelésszam</span>
                    <p className="text-xl font-bold text-parisian-grey-800">#{purchase.order_number}</p>
                  </div>

                  <div className="space-y-3 text-sm text-parisian-grey-600">
                    <div className="flex items-center gap-2">
                      <Landmark className="h-4 w-4 text-parisian-beige-500" />
                      <span>Louvre Digitalis Utikalauz</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-parisian-beige-500" />
                      <span>{purchase.guest_email}</span>
                    </div>
                  </div>
                </div>

                {/* Info notice */}
                <div className="mb-8 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700">
                  Az utikalauz linkjet elmentettuk. Barmelyik eszkozon megnyithatod, barmikor visszaterhetsz hozza.
                </div>
              </>
            ) : (
              <p className="mb-8 text-lg text-parisian-grey-600">
                A vasarlasod sikeresen rogzitettuk!
              </p>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <Link
                href="/museum-guide"
                className="flex w-full items-center justify-center gap-2 rounded-full bg-parisian-grey-800 px-8 py-4 font-semibold text-white transition-all hover:bg-parisian-grey-700"
              >
                Utikalauz megnyitasa
                <ArrowRight className="h-5 w-5" />
              </Link>

              <Link
                href="/"
                className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-parisian-grey-800 px-8 py-4 font-semibold text-parisian-grey-800 transition-all hover:bg-parisian-beige-50"
              >
                Vissza a fooldara
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
