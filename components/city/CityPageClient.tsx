'use client'

import Image from 'next/image'
import Link from 'next/link'
import {
  Sparkles,
  Clock,
  CheckCircle,
  MapPin,
  Layers,
  Lock,
  ArrowRight,
  Calendar
} from 'lucide-react'
import type { Bundle, CityPricing } from '@/lib/types/database'

interface CityPageClientProps {
  cityPricing: CityPricing
  bundles: Bundle[]
  hasAccess: boolean
}

export default function CityPageClient({
  cityPricing,
  bundles,
  hasAccess,
}: CityPageClientProps) {
  const totalCards = bundles.reduce((sum, bundle) => sum + (bundle.total_cards || 0), 0)

  const currencySymbol = cityPricing.currency === 'EUR' ? '€'
    : cityPricing.currency === 'USD' ? '$'
    : cityPricing.currency === 'GBP' ? '£'
    : cityPricing.currency === 'HUF' ? 'Ft'
    : cityPricing.currency

  return (
    <div className="min-h-screen bg-parisian-cream-50 py-24">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="mb-16 text-center">
          <div className="mb-4 inline-block rounded-full bg-parisian-beige-100 px-5 py-2 text-sm font-semibold text-parisian-grey-700">
            <MapPin className="mr-1.5 inline h-4 w-4" />
            {cityPricing.city} City Pass
          </div>

          <h1 className="mb-6 font-playfair text-5xl font-bold text-parisian-grey-800 md:text-6xl">
            {cityPricing.city} elsajátítása<br />teljes városbérlettel
          </h1>

          <p className="mx-auto mb-8 max-w-2xl text-lg text-parisian-grey-600">
            {cityPricing.description || `Korlátlan hozzáférés az összes ${cityPricing.city} flashcard csomaghoz ${cityPricing.duration_days} napig. Tanulj a saját tempódban interaktív tartalommal.`}
          </p>
        </div>

        {/* Pricing Card - Prominent */}
        <div className="mx-auto mb-16 max-w-3xl">
          <div className="overflow-hidden rounded-3xl border-2 border-parisian-beige-200 bg-white shadow-xl">
            <div className="bg-parisian-beige-200 p-8 text-center">
              <div className="mb-2 text-sm font-semibold uppercase tracking-wide text-parisian-grey-700">
                Limitált időre szóló ajánlat
              </div>
              <div className="mb-4 font-playfair text-6xl font-bold text-parisian-grey-800">
                {currencySymbol}{cityPricing.price.toFixed(2)}
              </div>
              <div className="flex items-center justify-center gap-2 text-lg text-parisian-grey-700">
                <Calendar className="h-5 w-5" />
                {cityPricing.duration_days} napos teljes hozzáférés
              </div>
            </div>

            <div className="p-8">
              {/* What's Included */}
              <h3 className="mb-6 text-center text-xl font-bold text-parisian-grey-800">
                Mit tartalmaz?
              </h3>

              <div className="mb-8 space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-parisian-beige-500" />
                  <div>
                    <div className="font-semibold text-parisian-grey-800">
                      {bundles.length} prémium csomag
                    </div>
                    <div className="text-sm text-parisian-grey-600">
                      Hozzáférés az összes flashcard gyűjteményhez
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-parisian-beige-500" />
                  <div>
                    <div className="font-semibold text-parisian-grey-800">
                      {totalCards}+ interaktív flashcard
                    </div>
                    <div className="text-sm text-parisian-grey-600">
                      3D flip animációk, tippek és még sok más
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-parisian-beige-500" />
                  <div>
                    <div className="font-semibold text-parisian-grey-800">
                      {cityPricing.duration_days} napos korlátlan hozzáférés
                    </div>
                    <div className="text-sm text-parisian-grey-600">
                      Tanulj bármikor, bárhol
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-parisian-beige-500" />
                  <div>
                    <div className="font-semibold text-parisian-grey-800">
                      Szakértők által összeállított tartalom
                    </div>
                    <div className="text-sm text-parisian-grey-600">
                      Helyi idegenvezetők és szakértők által készítve
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              {!hasAccess ? (
                <Link
                  href={`/checkout?city=${cityPricing.city}`}
                  className="group flex w-full items-center justify-center gap-2 rounded-full bg-parisian-beige-400 px-8 py-4 text-lg font-bold text-white shadow-lg transition-all hover:bg-parisian-beige-500 hover:shadow-xl"
                >
                  <Sparkles className="h-5 w-5" />
                  {cityPricing.city} Pass feloldása
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              ) : (
                <div className="rounded-2xl bg-parisian-beige-50 p-6 text-center">
                  <CheckCircle className="mx-auto mb-2 h-12 w-12 text-parisian-beige-500" />
                  <div className="font-semibold text-parisian-grey-700">
                    Már van hozzáférésed {cityPricing.city}-hez!
                  </div>
                  <Link
                    href="/my-passes"
                    className="mt-4 inline-block text-sm font-medium text-parisian-beige-600 hover:text-parisian-beige-700"
                  >
                    Az én bérleteim megtekintése →
                  </Link>
                </div>
              )}

              <p className="mt-4 text-center text-xs text-parisian-grey-500">
                🔒 Biztonságos fizetés • ⚡ Azonnali hozzáférés • 💯 Visszatérítési garancia
              </p>
            </div>
          </div>
        </div>

        {/* Included Bundles - Responsive Grid */}
        <div className="mb-16">
          <div className="mb-8 text-center">
            <h2 className="mb-4 font-playfair text-3xl font-bold text-parisian-grey-800">
              Mind a(z) {bundles.length} csomag benne van
            </h2>
            <p className="text-parisian-grey-600">
              Minden, amire szükséged van {cityPricing.city} elsajátításához
            </p>
          </div>

          {bundles.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {bundles.map((bundle) => (
                <BundleCard key={bundle.id} bundle={bundle} hasAccess={hasAccess} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border-2 border-dashed border-parisian-beige-200 bg-parisian-cream-100 p-12 text-center">
              <Layers className="mx-auto mb-4 h-12 w-12 text-parisian-beige-300" />
              <p className="text-parisian-grey-600">
                Még nincsenek csomagok erre a városra. Nézz vissza később!
              </p>
            </div>
          )}
        </div>

        {/* Bottom CTA */}
        {!hasAccess && bundles.length > 0 && (
          <div className="rounded-3xl bg-parisian-beige-300 p-12 text-center text-white">
            <h3 className="mb-4 font-playfair text-3xl font-bold">
              Készen állsz a tanulásra?
            </h3>
            <p className="mb-6 text-lg opacity-95">
              Azonnal hozzáférés az összes {bundles.length} csomaghoz csak {currencySymbol}{cityPricing.price.toFixed(2)} értékben
            </p>
            <Link
              href={`/checkout?city=${cityPricing.city}`}
              className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-lg font-bold text-parisian-grey-800 shadow-lg transition-all hover:shadow-xl"
            >
              <Sparkles className="h-5 w-5" />
              Nyisd fel
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

function BundleCard({ bundle, hasAccess }: { bundle: Bundle; hasAccess: boolean }) {
  return (
    <Link href={`/bundles/${bundle.slug}`}>
      <div className="group h-full overflow-hidden rounded-2xl border-2 border-parisian-beige-200 bg-white shadow-md transition-all hover:shadow-xl hover:border-parisian-beige-300">
        {/* Cover Image */}
        <div className="relative h-48 w-full overflow-hidden bg-parisian-beige-50">
          <Image
            src={bundle.cover_image || '/images/bundle-fallback.jpg'}
            alt={bundle.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
          {!hasAccess && (
            <div className="absolute right-3 top-3 rounded-full bg-parisian-grey-800/80 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
              <Lock className="mr-1 inline h-3 w-3" />
              Zárolva
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="mb-2 font-playfair text-xl font-bold text-parisian-grey-800 transition-colors group-hover:text-parisian-beige-600">
            {bundle.title}
          </h3>

          {bundle.short_description && (
            <p className="mb-4 line-clamp-2 text-sm text-parisian-grey-600">
              {bundle.short_description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3 text-xs text-parisian-grey-500">
            <span className="flex items-center gap-1">
              <Layers className="h-3.5 w-3.5" />
              {bundle.total_cards || 0} kártya
            </span>
            {bundle.estimated_time_minutes && (
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                ~{bundle.estimated_time_minutes} perc
              </span>
            )}
          </div>

          {bundle.difficulty_level && (
            <div className="mt-4">
              <span
                className={`inline-block rounded-full px-4 py-1.5 text-xs font-semibold ${
                  bundle.difficulty_level === 'beginner'
                    ? 'bg-parisian-beige-100 text-parisian-grey-700'
                    : bundle.difficulty_level === 'intermediate'
                    ? 'bg-parisian-beige-200 text-parisian-grey-700'
                    : 'bg-parisian-beige-300 text-white'
                }`}
              >
                {bundle.difficulty_level === 'beginner' && 'Kezdő'}
                {bundle.difficulty_level === 'intermediate' && 'Közép'}
                {bundle.difficulty_level === 'advanced' && 'Haladó'}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
