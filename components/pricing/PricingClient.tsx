'use client'

import Link from 'next/link'
import {
  MapPin,
  Calendar,
  Package,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Globe
} from 'lucide-react'
import type { CityPricing } from '@/lib/types/database'

interface PricingClientProps {
  cities: (CityPricing & { bundleCount: number })[]
}

export default function PricingClient({ cities }: PricingClientProps) {
  // Separate Paris from other cities
  const parisCity = cities.find((city) => city.city === 'Paris')
  const otherCities = cities.filter((city) => city.city !== 'Paris')

  return (
    <div className="py-24">
      <div className="container mx-auto px-4">
        {/* Header - Párizs Fokusz */}
        <div className="mb-16 text-center">
          <div className="mb-4 inline-block rounded-full bg-parisian-beige-100 px-4 py-2 text-sm font-semibold text-parisian-grey-700">
            <Globe className="mr-1 inline h-4 w-4" />
            Utazás Párizsba
          </div>

          <h1 className="mb-6 font-playfair text-5xl font-bold text-parisian-grey-800 md:text-6xl">
            Fedezze fel Párizst<br />a Városbérlettel
          </h1>

          <p className="mx-auto max-w-2xl text-lg text-parisian-grey-600">
            Időkorlátos hozzáférés az összes prémium tananyaghoz a Fények Városában.
            Tanuljon a saját tempójában helyi szakértők által kurált interaktív tartalommal.
          </p>
        </div>

        {/* Párizs Hero Card */}
        {parisCity ? (
          <div className="mb-24">
            <div className="mx-auto max-w-2xl">
              <CityPricingCard key={parisCity.city} city={parisCity} />
            </div>
          </div>
        ) : (
          <div className="mx-auto mb-24 max-w-2xl rounded-xl border-2 border-dashed border-parisian-beige-300 bg-parisian-cream-50 p-12 text-center">
            <Globe className="mx-auto mb-4 h-12 w-12 text-parisian-beige-300" />
            <h3 className="mb-2 font-semibold text-parisian-grey-700">Párizs árazás még nem elérhető</h3>
            <p className="text-sm text-parisian-grey-600">
              Hamarosan elérhetővé válik!
            </p>
          </div>
        )}

        {/* Other Cities Section */}
        {otherCities.length > 0 && (
          <div className="mt-24">
            <div className="mb-12 text-center">
              <h2 className="mb-4 font-playfair text-3xl font-bold text-parisian-grey-800">
                Más városok felfedezése
              </h2>
              <p className="mx-auto max-w-2xl text-parisian-grey-600">
                Kiterjesztse utazását más lenyűgöző városokra ugyanazzal a tanulási modellel.
              </p>
            </div>
            <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2 lg:grid-cols-3">
              {otherCities.map((city) => (
                <CityPricingCard key={city.city} city={city} />
              ))}
            </div>
          </div>
        )}

        {/* Features Section */}
        <div className="mx-auto mt-24 max-w-4xl">
          <h2 className="mb-12 text-center font-playfair text-3xl font-bold text-parisian-grey-800">
            Mit tartalmaz minden bérlet
          </h2>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-parisian-beige-100">
                  <CheckCircle className="h-6 w-6 text-parisian-beige-500" />
                </div>
              </div>
              <div>
                <h3 className="mb-2 font-semibold text-parisian-grey-800">Teljes hozzáférés</h3>
                <p className="text-sm text-parisian-grey-600">
                  Feloldás minden tananyaghoz a választott városban. Nincs rejtett költség vagy korlátozás.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-parisian-beige-100">
                  <Sparkles className="h-6 w-6 text-parisian-beige-500" />
                </div>
              </div>
              <div>
                <h3 className="mb-2 font-semibold text-parisian-grey-800">Interaktív tanulás</h3>
                <p className="text-sm text-parisian-grey-600">
                  3D flip animációk, tippek, haladáskövetés és még sok egyéb funkció.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-parisian-beige-100">
                  <Calendar className="h-6 w-6 text-parisian-beige-500" />
                </div>
              </div>
              <div>
                <h3 className="mb-2 font-semibold text-parisian-grey-800">Időkorlátos hozzáférés</h3>
                <p className="text-sm text-parisian-grey-600">
                  7 nap korlátlan hozzáférés. Tanuljon a saját tempójában, bármikor, bárhol.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-parisian-beige-100">
                  <Package className="h-6 w-6 text-parisian-beige-500" />
                </div>
              </div>
              <div>
                <h3 className="mb-2 font-semibold text-parisian-grey-800">Szakértői tartalom</h3>
                <p className="text-sm text-parisian-grey-600">
                  Helyi idegenvezetők, nyelvi szakértők és kulturális specialisták által készített tartalom.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ or CTA */}
        <div className="mx-auto mt-24 max-w-2xl text-center">
          <div className="rounded-2xl border-2 border-parisian-beige-200 bg-white p-8 shadow-lg">
            <h3 className="mb-4 font-playfair text-2xl font-bold text-parisian-grey-800">
              Nem tudja, melyik várost válassza?
            </h3>
            <p className="mb-6 text-parisian-grey-600">
              Fedezze fel városoldalainkat, hogy megnézze, mi található minden bérletben vásárlás előtt.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full bg-parisian-beige-400 px-6 py-3 font-semibold text-white transition-all hover:bg-parisian-beige-500"
            >
              Összes tartalom böngészése
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function CityPricingCard({ city }: { city: CityPricing & { bundleCount: number } }) {
  const currencySymbol =
    city.currency === 'EUR' ? '€'
    : city.currency === 'USD' ? '$'
    : city.currency === 'GBP' ? '£'
    : city.currency === 'HUF' ? 'Ft'
    : city.currency

  // Determine if this is a "featured" card (Paris is featured)
  const isFeatured = city.city === 'Paris'

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border-2 bg-white shadow-lg transition-all hover:shadow-2xl ${
        isFeatured ? 'border-parisian-beige-400' : 'border-parisian-beige-200'
      }`}
    >
      {/* Featured Badge */}
      {isFeatured && (
        <div className="absolute right-4 top-4 z-10 rounded-full bg-parisian-beige-500 px-3 py-1 text-xs font-bold text-white">
          NÉPSZERŰ
        </div>
      )}

      {/* Header */}
      <div
        className={`p-8 text-white ${
          isFeatured
            ? 'bg-gradient-to-r from-parisian-beige-400 to-parisian-beige-500'
            : 'bg-gradient-to-r from-parisian-beige-300 to-parisian-beige-400'
        }`}
      >
        <div className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide opacity-90">
          <MapPin className="h-4 w-4" />
          Városbérlet
        </div>
        <h3 className="mb-4 font-playfair text-3xl font-bold">{city.city}</h3>
        <div className="flex items-baseline gap-1">
          <span className="text-5xl font-bold">{currencySymbol}{city.price.toFixed(0)}</span>
          <span className="text-lg opacity-90">/{city.duration_days} nap</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        {/* What's Included */}
        <div className="mb-6 space-y-3">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 flex-shrink-0 text-parisian-beige-500" />
            <span className="text-sm text-parisian-grey-700">
              <strong>{city.bundleCount}</strong> prémium csomag
            </span>
          </div>

          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 flex-shrink-0 text-parisian-beige-500" />
            <span className="text-sm text-parisian-grey-700">
              <strong>{city.duration_days} napos</strong> teljes hozzáférés
            </span>
          </div>

          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 flex-shrink-0 text-parisian-beige-500" />
            <span className="text-sm text-parisian-grey-700">
              Minden tartalmi kategória
            </span>
          </div>

          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 flex-shrink-0 text-parisian-beige-500" />
            <span className="text-sm text-parisian-grey-700">
              Interaktív tananyagok
            </span>
          </div>
        </div>

        {/* Description */}
        {city.description && (
          <p className="mb-6 text-sm text-parisian-grey-600">
            {city.description}
          </p>
        )}

        {/* CTA Buttons */}
        <div className="space-y-3">
          <Link
            href={`/city/${city.city.toLowerCase()}`}
            className={`flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 font-semibold text-white transition-all ${
              isFeatured
                ? 'bg-parisian-beige-500 hover:bg-parisian-beige-600'
                : 'bg-parisian-beige-400 hover:bg-parisian-beige-500'
            }`}
          >
            <Sparkles className="h-4 w-4" />
            Részletek megtekintése
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            href={`/checkout?city=${city.city}`}
            className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-parisian-beige-300 px-6 py-3 font-semibold text-parisian-grey-700 transition-all hover:bg-parisian-beige-50"
          >
            Megvásárlás most
          </Link>
        </div>
      </div>
    </div>
  )
}
