'use client'

import { useState, useTransition } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import FlipCard from '@/components/FlipCard'
import {
  Lock,
  MapPin,
  Layers,
  Clock,
  ChevronLeft,
  Sparkles,
  GraduationCap,
  BookOpen,
  ChevronRight,
  ShoppingCart,
} from 'lucide-react'
import type { Bundle, BundleTopic, Flashcard } from '@/lib/types/database'
import { purchaseBundle } from '@/app/actions/purchaseBundle'

interface BundleDetailClientProps {
  bundle: Bundle
  topics: BundleTopic[]
  flashcards: Flashcard[]
  hasAccess: boolean
  userId?: string
}

const difficultyLabels: Record<string, string> = {
  beginner: 'Kezdő',
  intermediate: 'Közép',
  advanced: 'Haladó',
}

const difficultyColors: Record<string, string> = {
  beginner: 'bg-green-100 text-green-700',
  intermediate: 'bg-yellow-100 text-yellow-700',
  advanced: 'bg-red-100 text-red-700',
}

export default function BundleDetailClient({
  bundle,
  topics,
  flashcards,
  hasAccess,
  userId,
}: BundleDetailClientProps) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [isPending, startTransition] = useTransition()
  const [purchaseError, setPurchaseError] = useState<string | null>(null)
  const router = useRouter()

  const handlePurchase = () => {
    setPurchaseError(null)
    startTransition(async () => {
      const result = await purchaseBundle(bundle.id)
      if (result.success) {
        router.refresh()
      } else {
        setPurchaseError(result.error || 'Hiba történt a vásárlás során.')
      }
    })
  }
  const hasTopics = topics.length > 0

  // Demo cards: use is_demo flag, fallback to first 3
  const demoCards = flashcards.filter((c) => c.is_demo)
  const effectiveDemoCards = demoCards.length > 0 ? demoCards : flashcards.slice(0, 3)
  const lockedCardsCount = Math.max(0, flashcards.length - effectiveDemoCards.length)

  const visibleCards = hasAccess ? flashcards : effectiveDemoCards
  const currentCard = visibleCards[currentCardIndex]
  const totalCards = visibleCards.length

  const totalTopicCards = topics.reduce((sum, t) => sum + t.total_cards, 0)

  return (
    <div className="py-24">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <Link
          href="/marketplace"
          className="mb-8 inline-flex items-center gap-2 text-french-blue-500 transition-colors hover:text-french-red-500"
        >
          <ChevronLeft className="h-5 w-5" />
          Vissza a piactérre
        </Link>

        {/* Bundle Header */}
        <div className="mb-10 grid gap-8 lg:grid-cols-2">
          {/* Left: Info */}
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

            <h1 className="mb-4 font-playfair text-4xl font-bold text-french-blue-500">
              {bundle.title}
            </h1>

            {/* Meta */}
            <div className="mb-6 flex flex-wrap gap-4 text-sm text-slate-600">
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-french-blue-400" />
                {bundle.city}
              </span>
              <span className="flex items-center gap-1.5">
                <Layers className="h-4 w-4 text-french-blue-400" />
                {hasTopics ? `${topics.length} témakör, ${totalTopicCards} kártya` : `${bundle.total_cards || flashcards.length} kártya`}
              </span>
              {bundle.estimated_time_minutes > 0 && (
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-french-blue-400" />
                  ~{bundle.estimated_time_minutes} min
                </span>
              )}
            </div>

            {bundle.difficulty_level && (
              <div className="mb-6">
                <span className={`inline-block rounded-full px-4 py-2 text-sm font-semibold ${difficultyColors[bundle.difficulty_level]}`}>
                  {difficultyLabels[bundle.difficulty_level]} szint
                </span>
              </div>
            )}

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
                  Vásárold meg ezt a csomagot és nyisd fel az összes témakört!
                </p>
                {purchaseError && (
                  <p className="mb-3 rounded-lg bg-red-100 px-3 py-2 text-sm text-red-600">{purchaseError}</p>
                )}
                {userId ? (
                  <button
                    onClick={handlePurchase}
                    disabled={isPending}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-french-red-500 px-6 py-3 font-semibold text-white transition-all hover:bg-french-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    {isPending ? 'Feldolgozás...' : `Megvásárolás${bundle.price > 0 ? ` — ${bundle.price} €` : ' — Ingyenes'}`}
                  </button>
                ) : (
                  <Link
                    href={`/auth/login?redirect=/bundles/${bundle.slug}`}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-french-red-500 px-6 py-3 font-semibold text-white transition-all hover:bg-french-red-600"
                  >
                    <Sparkles className="h-4 w-4" />
                    Bejelentkezés a vásárláshoz
                  </Link>
                )}
              </div>
            )}

            {hasAccess && (
              <div className="rounded-xl border-2 border-green-200 bg-green-50 p-6">
                <div className="flex items-center gap-2 text-green-600">
                  <Sparkles className="h-5 w-5" />
                  <h3 className="font-semibold">Teljes hozzáférés feloldva!</h3>
                </div>
                <p className="mt-2 text-sm text-slate-700">
                  Válassz egy témakört és kezdd el a tanulást!
                </p>
              </div>
            )}

            {/* Link to marketplace */}
            <div className="mt-6 rounded-lg bg-slate-50 p-4">
              <p className="text-sm text-slate-500">
                Érdekelnek más városok kártyái?{' '}
                <Link href="/marketplace" className="font-medium text-french-blue-500 hover:underline">
                  Nézd meg a piacteret &rarr;
                </Link>
              </p>
            </div>
          </div>

          {/* Right: Topics list OR demo flashcards */}
          <div>
            <div className="sticky top-8">
              {hasTopics ? (
                /* Topics Grid */
                <div>
                  <h2 className="mb-4 text-lg font-bold text-slate-800">Témakörök</h2>
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.06 } } }}
                    className="space-y-3"
                  >
                    {topics.map((topic) => (
                      <motion.div
                        key={topic.id}
                        variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
                      >
                        {hasAccess ? (
                          <Link href={`/bundles/${bundle.slug}/study?topic=${topic.slug}`}>
                            <TopicCard topic={topic} hasAccess />
                          </Link>
                        ) : (
                          <TopicCard topic={topic} hasAccess={false} />
                        )}
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              ) : (
                /* Fallback: Show demo flashcards directly */
                <div>
                  <div className="mb-4 flex items-center justify-between text-sm text-slate-600">
                    <span>{currentCardIndex + 1}. kártya a {totalCards} közül</span>
                    <span>{Math.round(((currentCardIndex + 1) / totalCards) * 100)}% kész</span>
                  </div>
                  <div className="mb-6 h-2 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full bg-french-blue-500 transition-all duration-300"
                      style={{ width: `${((currentCardIndex + 1) / totalCards) * 100}%` }}
                    />
                  </div>

                  {currentCard ? (
                    <FlipCard flashcard={currentCard} isLocked={false} />
                  ) : (
                    <div className="flex h-96 items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50">
                      <p className="text-slate-400">Nincsenek elérhető kártyák</p>
                    </div>
                  )}

                  <div className="mt-6 flex gap-4">
                    <button
                      onClick={() => setCurrentCardIndex(Math.max(0, currentCardIndex - 1))}
                      disabled={currentCardIndex === 0}
                      className="flex-1 rounded-lg border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition-all hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Előző
                    </button>
                    <button
                      onClick={() => setCurrentCardIndex(Math.min(totalCards - 1, currentCardIndex + 1))}
                      disabled={currentCardIndex >= totalCards - 1}
                      className="flex-1 rounded-lg bg-french-blue-500 px-6 py-3 font-semibold text-white transition-all hover:bg-french-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Következő
                    </button>
                  </div>

                  {!hasAccess && lockedCardsCount > 0 && (
                    <div className="mt-8 rounded-xl bg-slate-100 p-6">
                      <div className="mb-3 flex items-center gap-2 text-slate-700">
                        <Lock className="h-5 w-5" />
                        <h4 className="font-semibold">{lockedCardsCount} További kártya zárolva</h4>
                      </div>
                      <Link
                        href={`/pricing?city=${encodeURIComponent(bundle.city)}`}
                        className="inline-block w-full rounded-lg bg-french-red-500 py-3 text-center font-semibold text-white transition-all hover:bg-french-red-600"
                      >
                        Árak megtekintése
                      </Link>
                    </div>
                  )}

                  {hasAccess && (
                    <Link
                      href={`/bundles/${bundle.slug}/study`}
                      className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-french-blue-500 px-6 py-3 font-semibold text-white transition-all hover:bg-french-blue-600"
                    >
                      <GraduationCap className="h-5 w-5" />
                      Tanulás indítása
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function TopicCard({ topic, hasAccess }: { topic: BundleTopic; hasAccess: boolean }) {
  return (
    <div className={`group flex items-center gap-4 rounded-xl border p-4 transition-all ${
      hasAccess
        ? 'border-slate-200 bg-white hover:border-french-blue-300 hover:shadow-md cursor-pointer'
        : 'border-slate-200 bg-slate-50 opacity-75'
    }`}>
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-french-blue-50 text-french-blue-500">
        <BookOpen className="h-6 w-6" />
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-slate-800">{topic.title}</h4>
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span>{topic.total_cards} kártya</span>
          {topic.difficulty_level && (
            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${difficultyColors[topic.difficulty_level]}`}>
              {difficultyLabels[topic.difficulty_level]}
            </span>
          )}
          {topic.estimated_time_minutes > 0 && (
            <span>~{topic.estimated_time_minutes} perc</span>
          )}
        </div>
        {topic.description && (
          <p className="mt-1 text-xs text-slate-400 line-clamp-1">{topic.description}</p>
        )}
      </div>
      {hasAccess ? (
        <ChevronRight className="h-5 w-5 text-slate-400 transition-transform group-hover:translate-x-1" />
      ) : (
        <Lock className="h-4 w-4 text-slate-400" />
      )}
    </div>
  )
}
