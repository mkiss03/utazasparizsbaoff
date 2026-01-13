'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Lock, ArrowRight, BookOpen } from 'lucide-react'
import FlipCard from '@/components/FlipCard'
import type { Bundle, Flashcard } from '@/lib/types/database'

interface ParisTopicDetailClientProps {
  bundle: Bundle
  flashcards: Flashcard[]
  hasAccess: boolean
}

export default function ParisTopicDetailClient({
  bundle,
  flashcards,
  hasAccess,
}: ParisTopicDetailClientProps) {
  const [selectedCardIndex, setSelectedCardIndex] = useState(0)

  const currentCard = flashcards[selectedCardIndex]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  } as const

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    },
  } as const

  return (
    <div className="min-h-screen bg-parisian-cream-50 py-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-parisian-grey-700 shadow-md hover:shadow-lg transition-all"
            >
              <ArrowLeft className="h-4 w-4" />
              Vissza az összes témakörre
            </motion.button>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-4"
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-parisian-beige-100 px-4 py-2 text-sm font-semibold text-parisian-grey-700">
              <BookOpen className="h-4 w-4" />
              Párizs Tanulás
            </div>
            <h1 className="font-playfair text-5xl font-bold text-parisian-grey-800 md:text-6xl">
              {bundle.title}
            </h1>
            {bundle.description && (
              <p className="mt-4 max-w-2xl text-lg text-parisian-grey-600">
                {bundle.description}
              </p>
            )}
          </motion.div>
        </div>

        {/* Access Check */}
        {!hasAccess ? (
          <div className="mx-auto max-w-3xl rounded-3xl border-2 border-parisian-beige-200 bg-white p-8 text-center shadow-lg md:p-12">
            <Lock className="mx-auto mb-4 h-12 w-12 text-parisian-beige-500" />
            <h2 className="mb-4 font-playfair text-3xl font-bold text-parisian-grey-800">
              Hozzáférés szükséges
            </h2>
            <p className="mb-8 text-parisian-grey-600">
              Ez a tanulási csomag csak az aktív Párizs városbérlet tulajdonosok számára érhető el. 
              Vásároljon egy hétre szóló hozzáférést és fedezze fel az összes kártyát!
            </p>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 rounded-full bg-parisian-beige-400 px-8 py-3 font-semibold text-white transition-all hover:bg-parisian-beige-500"
            >
              Városbérlet megvásárlása
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : flashcards.length === 0 ? (
          <div className="mx-auto max-w-3xl rounded-3xl border-2 border-dashed border-parisian-beige-300 bg-white p-12 text-center shadow-lg">
            <BookOpen className="mx-auto mb-4 h-12 w-12 text-parisian-beige-300" />
            <h2 className="mb-2 font-playfair text-2xl font-bold text-parisian-grey-800">
              Nem találtunk kártyákat
            </h2>
            <p className="text-parisian-grey-600">
              Ez a témakör még nem tartalmaz kártyákat. Később majd feltöltik!
            </p>
          </div>
        ) : (
          <div className="grid gap-12 lg:grid-cols-3 lg:gap-8">
            {/* Main Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2"
            >
              <div className="sticky top-8">
                <FlipCard flashcard={currentCard} isLocked={false} />

                {/* Card Info */}
                <div className="mt-6 grid grid-cols-3 gap-3">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="rounded-xl bg-white p-4 text-center shadow-md"
                  >
                    <p className="text-2xl font-bold text-parisian-beige-500">
                      {flashcards.length}
                    </p>
                    <p className="mt-1 text-xs text-parisian-grey-600">Összes kártya</p>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    className="rounded-xl bg-white p-4 text-center shadow-md"
                  >
                    <p className="text-2xl font-bold text-parisian-beige-500">
                      {selectedCardIndex + 1}
                    </p>
                    <p className="mt-1 text-xs text-parisian-grey-600">Jelenlegi</p>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="rounded-xl bg-white p-4 text-center shadow-md"
                  >
                    <p className="text-2xl font-bold text-parisian-beige-500">
                      {bundle.estimated_time_minutes || 10}m
                    </p>
                    <p className="mt-1 text-xs text-parisian-grey-600">Idő</p>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Sidebar - Card List */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              <h3 className="font-semibold text-parisian-grey-800">
                Válassz kártyát ({flashcards.length})
              </h3>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="max-h-[600px] space-y-2 overflow-y-auto rounded-xl border-2 border-parisian-beige-100 bg-white p-4"
              >
                {flashcards.map((card, index) => (
                  <motion.button
                    key={card.id}
                    variants={itemVariants}
                    onClick={() => setSelectedCardIndex(index)}
                    className={`w-full text-left rounded-lg border-2 p-3 transition-all ${
                      selectedCardIndex === index
                        ? 'border-parisian-beige-500 bg-parisian-beige-50 shadow-md'
                        : 'border-parisian-beige-200 bg-white hover:border-parisian-beige-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <span className="text-xs font-bold text-parisian-beige-500">
                          #{index + 1}
                        </span>
                        <p className="line-clamp-2 text-sm font-semibold text-parisian-grey-700">
                          {card.question}
                        </p>
                      </div>
                      {selectedCardIndex === index && (
                        <div className="ml-2 flex h-6 w-6 items-center justify-center rounded-full bg-parisian-beige-500 text-white">
                          <span className="text-xs">✓</span>
                        </div>
                      )}
                    </div>
                  </motion.button>
                ))}
              </motion.div>

              {/* Progress Bar */}
              <div className="rounded-full bg-parisian-beige-100 h-2 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${((selectedCardIndex + 1) / flashcards.length) * 100}%` }}
                  transition={{ duration: 0.3 }}
                  className="h-full bg-parisian-beige-500"
                />
              </div>
              <p className="text-center text-xs text-parisian-grey-600">
                {selectedCardIndex + 1} / {flashcards.length}
              </p>
            </motion.div>
          </div>
        )}

        {/* Footer CTA */}
        {hasAccess && flashcards.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-16 rounded-2xl bg-gradient-to-r from-parisian-beige-400 to-parisian-beige-500 p-8 text-center text-white shadow-xl md:p-12"
          >
            <h3 className="mb-2 font-playfair text-2xl font-bold">
              Szeretnél több témakört tanulni?
            </h3>
            <p className="mb-6">
              Fedezd fel az összes Párizs tanulási csomag!
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3 font-semibold text-parisian-beige-500 transition-all hover:shadow-lg"
            >
              Vissza a témakörökre
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  )
}
