'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Lock, MapPin, Layers, Clock } from 'lucide-react'
import type { Bundle } from '@/lib/types/database'

interface BundlesSectionProps {
  bundles: Bundle[]
}

export default function BundlesSection({ bundles }: BundlesSectionProps) {
  if (!bundles || bundles.length === 0) return null

  return (
    <section id="bundles" className="bg-parisian-cream-50 py-24">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="mb-4 font-playfair text-4xl font-bold text-parisian-grey-800 md:text-5xl">
            Város Útmutató Flashcardok
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-parisian-grey-600">
            Sajátítsd el bármelyik várost az interaktív flashcard csomagjainkkal. Tanulj helyi kifejezéseket, metrótérképeket, kulturális tippeket és még sok mást!
          </p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-parisian-beige-100 px-6 py-3 text-sm font-semibold text-parisian-grey-700">
            <Lock className="h-4 w-4" />
            Nyisd fel a teljes város hozzáférést egy Város Pass-sal
          </div>
        </div>

        {/* Bundles Grid - Responsive */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {bundles.map((bundle) => (
            <BundleCard key={bundle.id} bundle={bundle} />
          ))}
        </div>

        {/* CTA to Purchase */}
        <div className="mt-16 text-center">
          <Link
            href="/pricing"
            className="inline-block rounded-full bg-parisian-beige-400 px-8 py-4 font-semibold text-white shadow-lg transition-all hover:bg-parisian-beige-500 hover:shadow-xl"
          >
            Városbérleteket és árakat megtekinteni
          </Link>
        </div>
      </div>
    </section>
  )
}

function BundleCard({ bundle }: { bundle: Bundle }) {
  // For now, assume user doesn't have access (show lock)
  // TODO: Check user's city passes when auth is implemented
  const hasAccess = false

  return (
    <Link href={`/bundles/${bundle.slug}`}>
      <div className="group relative h-full overflow-hidden rounded-2xl border-2 border-parisian-beige-200 bg-white shadow-md transition-all hover:shadow-xl hover:border-parisian-beige-300">
        {/* Cover Image with Lock Overlay */}
        <div className="relative h-48 w-full overflow-hidden bg-parisian-beige-50">
          <Image
            src={bundle.cover_image || '/images/bundle-fallback.jpg'}
            alt={bundle.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />

          {/* Lock Overlay */}
          {!hasAccess && (
            <div className="absolute inset-0 flex items-center justify-center bg-parisian-grey-900/30 backdrop-blur-[2px]">
              <div className="flex flex-col items-center gap-2 text-white">
                <div className="rounded-full bg-parisian-grey-800/90 p-3">
                  <Lock className="h-6 w-6" />
                </div>
                <span className="text-sm font-semibold">Város Pass szükséges</span>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Title */}
          <h3 className="mb-2 font-playfair text-xl font-bold text-parisian-grey-800 transition-colors group-hover:text-parisian-beige-600">
            {bundle.title}
          </h3>

          {/* Description */}
          {bundle.short_description && (
            <p className="mb-4 line-clamp-2 text-sm text-parisian-grey-600">
              {bundle.short_description}
            </p>
          )}

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-parisian-grey-500">
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {bundle.city}
            </span>
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

          {/* Difficulty Badge */}
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

          {/* Category */}
          {bundle.category && (
            <div className="mt-3 text-xs font-medium uppercase tracking-wide text-parisian-beige-600">
              {bundle.category}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
