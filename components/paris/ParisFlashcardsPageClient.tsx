'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, Lock, BookOpen, Clock, Sparkles } from 'lucide-react'
import Link from 'next/link'
import FlipCard from '@/components/FlipCard'
import type { Bundle, Flashcard } from '@/lib/types/database'

interface BundleWithCards extends Bundle {
  flashcards?: Flashcard[]
}

interface ParisFlashcardsPageClientProps {
  bundles: BundleWithCards[]
}

export default function ParisFlashcardsPageClient({ bundles }: ParisFlashcardsPageClientProps) {
  const [expandedBundle, setExpandedBundle] = useState<string | null>(null)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    },
  }

  return (
    <div className="min-h-screen bg-parisian-cream-50 py-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <Link
            href="/#bundles"
            className="mb-6 inline-flex items-center gap-2 text-parisian-beige-500 hover:text-parisian-beige-600 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Vissza</span>
          </Link>

          <h1 className="mb-4 font-playfair text-5xl font-bold text-parisian-grey-800 md:text-6xl">
            Párizs Flashcardok
          </h1>
          <p className="max-w-2xl text-lg text-parisian-grey-600">
            Felfedezd az összes Párizs-specifikus tanulási témakört. Minden témakörből megtekinthetsz néhány demo kártyát ingyenesen. A teljes hozzáféréshez szükséges egy Város Pass.
          </p>
        </motion.div>

        {/* Bundles Grid */}
        {bundles && bundles.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
          >
            {bundles.map((bundle) => (
              <motion.div key={bundle.id} variants={itemVariants}>
                <div className="h-full overflow-hidden rounded-2xl border-2 border-parisian-beige-200 bg-white shadow-lg transition-all hover:shadow-2xl hover:border-parisian-beige-400">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-parisian-beige-400 to-parisian-beige-500 p-6 text-white">
                    <h3 className="font-playfair text-2xl font-bold">{bundle.title}</h3>
                    {bundle.difficulty_level && (
                      <p className="mt-2 text-sm opacity-90">
                        {bundle.difficulty_level === 'beginner' && '🟢 Kezdő'}
                        {bundle.difficulty_level === 'intermediate' && '🟡 Közép'}
                        {bundle.difficulty_level === 'advanced' && '🔴 Haladó'}
                      </p>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <p className="mb-6 line-clamp-3 text-sm text-parisian-grey-600">
                      {bundle.short_description || bundle.description || 'Tanulási csomag'}
                    </p>

                    {/* Stats */}
                    <div className="mb-6 space-y-2 border-t border-parisian-beige-100 pt-4">
                      {bundle.total_cards && (
                        <div className="flex items-center gap-2 text-sm text-parisian-grey-700">
                          <BookOpen className="h-4 w-4 text-parisian-beige-500" />
                          <span>{bundle.total_cards} kártya</span>
                        </div>
                      )}
                      {bundle.estimated_time_minutes && (
                        <div className="flex items-center gap-2 text-sm text-parisian-grey-700">
                          <Clock className="h-4 w-4 text-parisian-beige-500" />
                          <span>~{bundle.estimated_time_minutes} perc</span>
                        </div>
                      )}
                    </div>

                    {/* Expand/Collapse Button */}
                    <button
                      onClick={() =>
                        setExpandedBundle(expandedBundle === bundle.id ? null : bundle.id)
                      }
                      className="w-full rounded-lg bg-parisian-cream-50 px-4 py-3 font-semibold text-parisian-grey-700 transition-all hover:bg-parisian-beige-50"
                    >
                      {expandedBundle === bundle.id
                        ? 'Bezárás'
                        : `Demo kártyák (${bundle.flashcards?.length || 0})`}
                    </button>

                    {/* Demo Flashcards */}
                    {expandedBundle === bundle.id && bundle.flashcards && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-6 space-y-4 border-t border-parisian-beige-100 pt-6"
                      >
                        {bundle.flashcards.length > 0 ? (
                          bundle.flashcards.map((card) => (
                            <div key={card.id} className="transform">
                              <FlipCard
                                flashcard={card}
                                isLocked={false}
                              />
                            </div>
                          ))
                        ) : (
                          <div className="rounded-lg bg-parisian-cream-50 p-4 text-center text-sm text-parisian-grey-600">
                            Nincsenek elérhető demo kártyák
                          </div>
                        )}

                        {/* Purchase CTA */}
                        <div className="rounded-lg border-2 border-dashed border-parisian-beige-300 bg-parisian-beige-50 p-4 text-center">
                          <Lock className="mx-auto mb-2 h-5 w-5 text-parisian-beige-500" />
                          <p className="mb-3 text-sm text-parisian-grey-700">
                            A többi kártya Város Pass után elérhető
                          </p>
                          <Link
                            href="/pricing"
                            className="inline-flex items-center gap-2 rounded-full bg-parisian-beige-400 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-parisian-beige-500"
                          >
                            <Sparkles className="h-4 w-4" />
                            Pass vásárlása
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl border-2 border-dashed border-parisian-beige-300 bg-white p-12 text-center shadow-lg"
          >
            <BookOpen className="mx-auto mb-4 h-16 w-16 text-parisian-beige-300" />
            <h3 className="mb-2 font-playfair text-2xl font-bold text-parisian-grey-800">
              Témakörök hamarosan
            </h3>
            <p className="text-parisian-grey-600">
              A Párizs tanulási témakörök felépítés alatt vannak. Térj vissza később!
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
