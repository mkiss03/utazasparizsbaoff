import { Store, ArrowRight, Globe, CreditCard, Users } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default function MarketplacePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Hero */}
      <div className="text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800 text-white">
          <Store className="h-8 w-8" />
        </div>
        <h1 className="text-4xl font-bold text-slate-900 sm:text-5xl">
          Városfelfedező Kártyacsomagok
        </h1>
        <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
          Fedezd fel a világot interaktív flashcard csomagokkal! Helyi szakértők által készített
          kártyákkal tanulhatsz meg mindent, amit tudnod kell egy-egy városról.
        </p>
      </div>

      {/* Features */}
      <div className="mt-16 grid gap-8 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-center">
          <Globe className="mx-auto h-8 w-8 text-slate-700" />
          <h3 className="mt-4 font-semibold text-slate-800">Több város</h3>
          <p className="mt-2 text-sm text-slate-500">
            Párizs, Róma, Budapest és még sok más — mindig bővülő kínálat.
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-center">
          <CreditCard className="mx-auto h-8 w-8 text-slate-700" />
          <h3 className="mt-4 font-semibold text-slate-800">Egyszerű vásárlás</h3>
          <p className="mt-2 text-sm text-slate-500">
            Fizess egyszer, és azonnal hozzáférsz a kártyacsomaghoz.
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-center">
          <Users className="mx-auto h-8 w-8 text-slate-700" />
          <h3 className="mt-4 font-semibold text-slate-800">Helyi szakértők</h3>
          <p className="mt-2 text-sm text-slate-500">
            Minden csomag helyi ismeretekkel rendelkező eladóktól származik.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-16 text-center">
        <p className="text-slate-500 mb-4">Hamarosan érkeznek az első csomagok!</p>
        <Link
          href="/marketplace/vendor/register"
          className="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-6 py-3 font-medium text-white hover:bg-slate-700 transition-colors"
        >
          Légy te az első eladó
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}
