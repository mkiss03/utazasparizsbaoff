import Link from 'next/link'
import NavigationWrapper as Navigation from '@/components/NavigationWrapper'
import Footer from '@/components/Footer'
import { CheckCircle, Sparkles, ArrowRight, MapPin } from 'lucide-react'

interface Props {
  searchParams: Promise<{ city?: string }>
}

export default async function CheckoutSuccessPage({ searchParams }: Props) {
  const { city } = await searchParams

  return (
    <main className="relative min-h-screen bg-slate-50">
      <Navigation />

      <div className="py-24">
        <div className="container mx-auto max-w-2xl px-4">
          <div className="rounded-2xl border border-green-200 bg-white p-12 text-center shadow-2xl">
            {/* Success Icon */}
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>

            {/* Heading */}
            <h1 className="mb-4 font-playfair text-4xl font-bold text-french-blue-500">
              Fizetés sikeres!
            </h1>

            <p className="mb-8 text-lg text-slate-600">
              Üdvözlünk a(z) {city || 'Város'} Pass-od közösségében! Most már teljes hozzáféréssel rendelkezel az összes prémium tartalomhoz.
            </p>

            {/* Pass Details */}
            <div className="mb-8 rounded-xl bg-gradient-to-r from-french-blue-50 to-french-blue-100 p-6">
              <div className="mb-2 flex items-center justify-center gap-2 text-french-blue-600">
                <MapPin className="h-5 w-5" />
                <span className="font-semibold">{city} Város Pass</span>
              </div>
              <div className="text-3xl font-bold text-french-blue-700">
                7 napos teljes hozzáférés
              </div>
              <p className="mt-2 text-sm text-french-blue-600">
                Most aktiválva • 7 nap múlva lejár
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <Link
                href="/my-passes"
                className="flex w-full items-center justify-center gap-2 rounded-full bg-french-blue-500 px-8 py-4 font-semibold text-white transition-all hover:bg-french-blue-600"
              >
                <Sparkles className="h-5 w-5" />
                Az én bérleteim megtekintése
                <ArrowRight className="h-5 w-5" />
              </Link>

              <Link
                href={city ? `/city/${city.toLowerCase()}` : '/'}
                className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-french-blue-500 px-8 py-4 font-semibold text-french-blue-500 transition-all hover:bg-french-blue-50"
              >
                Tanulás megkezdése
              </Link>
            </div>

            {/* Additional Info */}
            <div className="mt-8 border-t border-slate-200 pt-6 text-sm text-slate-600">
              <p>
                📧 Megerősítő e-mail lett elküldve az e-mail postafiókodba.
              </p>
              <p className="mt-2">
                Segítségre van szükséged? <Link href="/#contact" className="font-medium text-french-blue-500 hover:underline">Kapcsolódj velünk</Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
