'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import FlipCard from '@/components/FlipCard'
import { Lock, MapPin, Layers, Clock, ChevronLeft, Sparkles } from 'lucide-react'
import type { Bundle, Flashcard } from '@/lib/types/database'

interface BundleDetailClientProps {
  bundle: Bundle
  flashcards: Flashcard[]
  hasAccess: boolean
}

export default function BundleDetailClient({
  bundle,
  flashcards,
  hasAccess,
}: BundleDetailClientProps) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0)

  // Demo cards: First 3 are unlocked for preview
  const demoCardsCount = 3
  const demoCards = flashcards.slice(0, demoCardsCount)
  const lockedCardsCount = Math.max(0, flashcards.length - demoCardsCount)

  const currentCard = hasAccess
    ? flashcards[currentCardIndex]
    : demoCards[currentCardIndex]

  const totalCards = hasAccess ? flashcards.length : demoCardsCount

  const handleNext = () => {
    if (currentCardIndex < totalCards - 1) {
      setCurrentCardIndex(currentCardIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1)
    }
  }

  return (
    <div className="py-24">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <Link
          href="/#bundles"
          className="mb-8 inline-flex items-center gap-2 text-french-blue-500 transition-colors hover:text-french-red-500"
        >
          <ChevronLeft className="h-5 w-5" />
          Vissza a csomagokhoz
        </Link>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left Column: Bundle Info */}
          <div>
            {/* Cover Image */}
            <div className="relative mb-6 h-64 overflow-hidden rounded-xl">
              <Image
                src={bundle.cover_image || '/images/bundle-fallback.jpg'}
                alt={bundle.title}
                fill
                className="object-cover"
              />
            </div>

            {/* Title & Description */}
            <h1 className="mb-4 font-playfair text-4xl font-bold text-french-blue-500">
              {bundle.title}
            </h1>

            {/* Meta Info */}
            <div className="mb-6 flex flex-wrap gap-4 text-sm text-slate-600">
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-french-blue-400" />
                {bundle.city}
              </span>
              <span className="flex items-center gap-1.5">
                <Layers className="h-4 w-4 text-french-blue-400" />
                {bundle.total_cards || flashcards.length} kártya
              </span>
              {bundle.estimated_time_minutes && (
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-french-blue-400" />
                  ~{bundle.estimated_time_minutes} min
                </span>
              )}
            </div>

            {/* Difficulty Badge */}
            {bundle.difficulty_level && (
              <div className="mb-6">
                <span
                  className={`inline-block rounded-full px-4 py-2 text-sm font-semibold ${
                    bundle.difficulty_level === 'beginner'
                      ? 'bg-green-100 text-green-700'
                      : bundle.difficulty_level === 'intermediate'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {bundle.difficulty_level === 'beginner' && 'Kezdő szint'}
                  {bundle.difficulty_level === 'intermediate' && 'Közép szint'}
                  {bundle.difficulty_level === 'advanced' && 'Haladó szint'}
                </span>
              </div>
            )}

            {/* Description */}
            {bundle.description && (
              <div className="mb-6">
                <h3 className="mb-2 font-semibold text-slate-800">Erről a csomagról</h3>
                <p className="text-slate-600">{bundle.description}</p>
              </div>
            )}

            {/* Access Status */}
            {!hasAccess && (
              <div className="rounded-xl border-2 border-french-red-200 bg-french-red-50 p-6">
                <div className="mb-3 flex items-center gap-2 text-french-red-600">
                  <Lock className="h-5 w-5" />
                  <h3 className="font-semibold">Korlátozott előnézet</h3>
                </div>
                <p className="mb-4 text-sm text-slate-700">
                  {demoCardsCount} a {flashcards.length} flashcard közül tekinthető meg. Nyisd fel az összes tartalmat egy {bundle.city} Város Pass vásárlásával!
                </p>
                <Link
                  href="/pricing"
                  className="inline-flex items-center gap-2 rounded-full bg-french-red-500 px-6 py-3 font-semibold text-white transition-all hover:bg-french-red-600"
                >
                  <Sparkles className="h-4 w-4" />
                  Teljes hozzáférés feloldása
                </Link>
              </div>
            )}

            {hasAccess && (
              <div className="rounded-xl border-2 border-green-200 bg-green-50 p-6">
                <div className="flex items-center gap-2 text-green-600">
                  <Sparkles className="h-5 w-5" />
                  <h3 className="font-semibold">Teljes hozzáférés feloldva!</h3>
                </div>
                <p className="mt-2 text-sm text-slate-700">
                  Teljes hozzáféréssel rendelkezel az összes {flashcards.length} flashcard-hoz ebben a csomagban.
                </p>
              </div>
            )}
          </div>

          {/* Right Column: Flashcard Viewer */}
          <div>
            <div className="sticky top-8">
              {/* Progress */}
              <div className="mb-4 flex items-center justify-between text-sm text-slate-600">
                <span>
                  {currentCardIndex + 1}. kártya a {totalCards} közül
                </span>
                <span>{Math.round(((currentCardIndex + 1) / totalCards) * 100)}% kész</span>
              </div>

              {/* Progress Bar */}
              <div className="mb-6 h-2 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full bg-french-blue-500 transition-all duration-300"
                  style={{
                    width: `${((currentCardIndex + 1) / totalCards) * 100}%`,
                  }}
                />
              </div>

              {/* Flashcard */}
              {currentCard ? (
                <FlipCard flashcard={currentCard} isLocked={false} />
              ) : (
                <div className="flex h-96 items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50">
                  <p className="text-slate-400">Nincsenek elérhető kártyák</p>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="mt-6 flex gap-4">
                <button
                  onClick={handlePrevious}
                  disabled={currentCardIndex === 0}
                  className="flex-1 rounded-lg border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition-all hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Előző
                </button>
                <button
                  onClick={handleNext}
                  disabled={currentCardIndex >= totalCards - 1}
                  className="flex-1 rounded-lg bg-french-blue-500 px-6 py-3 font-semibold text-white transition-all hover:bg-french-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Következő
                </button>
              </div>

              {/* Locked Cards Preview */}
              {!hasAccess && lockedCardsCount > 0 && (
                <div className="mt-8 rounded-xl bg-slate-100 p-6">
                  <div className="mb-3 flex items-center gap-2 text-slate-700">
                    <Lock className="h-5 w-5" />
                    <h4 className="font-semibold">
                      {lockedCardsCount} További kártya zárolva
                    </h4>
                  </div>
                  <p className="mb-4 text-sm text-slate-600">
                    Teljes hozzáférést szerezhetsz az összes flashcard-hoz egy {bundle.city} Város Pass-sal.
                  </p>
                  <Link
                    href="/pricing"
                    className="inline-block w-full rounded-lg bg-french-red-500 py-3 text-center font-semibold text-white transition-all hover:bg-french-red-600"
                  >
                    Árak megtekintése
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
