'use client'

import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import FlipCard from '@/components/FlipCard'
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  XCircle,
  Shuffle,
  RotateCcw,
  Trophy,
  BookOpen,
  ChevronLeft,
  Keyboard,
} from 'lucide-react'
import type { Bundle, Flashcard } from '@/lib/types/database'

interface StudyClientProps {
  bundle: Bundle
  flashcards: Flashcard[]
}

export default function StudyClient({ bundle, flashcards }: StudyClientProps) {
  const [cards, setCards] = useState<Flashcard[]>(flashcards)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [knownCards, setKnownCards] = useState<Set<string>>(new Set())
  const [unknownCards, setUnknownCards] = useState<Set<string>>(new Set())
  const [isShuffled, setIsShuffled] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [showShortcuts, setShowShortcuts] = useState(false)
  // Key to force FlipCard remount on card change (resets flip state)
  const [flipKey, setFlipKey] = useState(0)

  const currentCard = cards[currentIndex]
  const totalCards = cards.length
  const reviewedCount = knownCards.size + unknownCards.size

  const goToNext = useCallback(() => {
    if (currentIndex < totalCards - 1) {
      setCurrentIndex((i) => i + 1)
      setFlipKey((k) => k + 1)
    } else {
      setIsCompleted(true)
    }
  }, [currentIndex, totalCards])

  const goToPrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1)
      setFlipKey((k) => k + 1)
    }
  }, [currentIndex])

  const markKnown = useCallback(() => {
    if (!currentCard) return
    setKnownCards((prev) => new Set(prev).add(currentCard.id))
    setUnknownCards((prev) => {
      const next = new Set(prev)
      next.delete(currentCard.id)
      return next
    })
    goToNext()
  }, [currentCard, goToNext])

  const markUnknown = useCallback(() => {
    if (!currentCard) return
    setUnknownCards((prev) => new Set(prev).add(currentCard.id))
    setKnownCards((prev) => {
      const next = new Set(prev)
      next.delete(currentCard.id)
      return next
    })
    goToNext()
  }, [currentCard, goToNext])

  const toggleShuffle = useCallback(() => {
    if (isShuffled) {
      // Restore original order
      setCards([...flashcards])
    } else {
      // Fisher-Yates shuffle
      const shuffled = [...flashcards]
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
      }
      setCards(shuffled)
    }
    setIsShuffled(!isShuffled)
    setCurrentIndex(0)
    setFlipKey((k) => k + 1)
  }, [isShuffled, flashcards])

  const restartAll = useCallback(() => {
    setCards(isShuffled ? cards : [...flashcards])
    setCurrentIndex(0)
    setKnownCards(new Set())
    setUnknownCards(new Set())
    setIsCompleted(false)
    setFlipKey((k) => k + 1)
  }, [isShuffled, cards, flashcards])

  const practiceUnknown = useCallback(() => {
    const unknownCardsList = flashcards.filter((c) => unknownCards.has(c.id))
    if (unknownCardsList.length === 0) return
    setCards(unknownCardsList)
    setCurrentIndex(0)
    setKnownCards(new Set())
    setUnknownCards(new Set())
    setIsCompleted(false)
    setFlipKey((k) => k + 1)
  }, [flashcards, unknownCards])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

      if (isCompleted) return

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault()
          goToPrevious()
          break
        case 'ArrowRight':
          e.preventDefault()
          goToNext()
          break
        case '1':
        case 't':
        case 'T':
          e.preventDefault()
          markKnown()
          break
        case '2':
        case 'n':
        case 'N':
          e.preventDefault()
          markUnknown()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isCompleted, goToNext, goToPrevious, markKnown, markUnknown])

  const getCardStatus = (cardId: string) => {
    if (knownCards.has(cardId)) return 'known'
    if (unknownCards.has(cardId)) return 'unknown'
    return 'pending'
  }

  const progressPercent = totalCards > 0 ? Math.round((reviewedCount / totalCards) * 100) : 0

  // Completion screen
  if (isCompleted) {
    const skippedCount = totalCards - knownCards.size - unknownCards.size
    const knownPercent = totalCards > 0 ? Math.round((knownCards.size / totalCards) * 100) : 0

    return (
      <div className="min-h-screen bg-slate-50 py-12">
        <div className="container mx-auto max-w-2xl px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-lg md:p-12"
          >
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-french-blue-100">
              <Trophy className="h-10 w-10 text-french-blue-500" />
            </div>

            <h2 className="mb-2 font-playfair text-3xl font-bold text-slate-800">
              Csomag befejezve!
            </h2>
            <p className="mb-8 text-slate-600">{bundle.title}</p>

            {/* Stats */}
            <div className="mb-8 grid grid-cols-3 gap-4">
              <div className="rounded-xl bg-green-50 p-4">
                <div className="text-3xl font-bold text-green-600">{knownCards.size}</div>
                <div className="mt-1 text-sm text-green-700">Tudom</div>
              </div>
              <div className="rounded-xl bg-red-50 p-4">
                <div className="text-3xl font-bold text-red-500">{unknownCards.size}</div>
                <div className="mt-1 text-sm text-red-600">Nem tudom</div>
              </div>
              <div className="rounded-xl bg-slate-100 p-4">
                <div className="text-3xl font-bold text-slate-600">{skippedCount}</div>
                <div className="mt-1 text-sm text-slate-500">Kihagyva</div>
              </div>
            </div>

            {/* Score bar */}
            <div className="mb-8">
              <div className="mb-2 text-sm font-medium text-slate-600">
                Tudás szint: {knownPercent}%
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full bg-gradient-to-r from-green-400 to-green-500 transition-all duration-500"
                  style={{ width: `${knownPercent}%` }}
                />
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-3">
              {unknownCards.size > 0 && (
                <button
                  onClick={practiceUnknown}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-french-red-500 px-6 py-3 font-semibold text-white transition-all hover:bg-french-red-600"
                >
                  <RotateCcw className="h-5 w-5" />
                  Gyakorold a nehezeket ({unknownCards.size} kártya)
                </button>
              )}

              <button
                onClick={restartAll}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition-all hover:bg-slate-50"
              >
                <RotateCcw className="h-5 w-5" />
                Kezdd előlről
              </button>

              <Link
                href={`/bundles/${bundle.slug}`}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-100 px-6 py-3 font-semibold text-slate-600 transition-all hover:bg-slate-200"
              >
                <BookOpen className="h-5 w-5" />
                Vissza a csomaghoz
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 md:py-12">
      <div className="container mx-auto px-4">
        {/* Header Bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <Link
            href={`/bundles/${bundle.slug}`}
            className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-medium text-slate-600 shadow-sm transition-colors hover:bg-slate-50"
          >
            <ChevronLeft className="h-4 w-4" />
            Vissza
          </Link>

          <h1 className="flex-1 text-center text-lg font-bold text-slate-800 md:text-xl">
            {bundle.title}
          </h1>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowShortcuts(!showShortcuts)}
              className={`rounded-lg p-2 transition-colors ${
                showShortcuts ? 'bg-slate-200 text-slate-700' : 'bg-white text-slate-400 hover:text-slate-600'
              } shadow-sm`}
              title="Billentyűparancsok"
            >
              <Keyboard className="h-4 w-4" />
            </button>
            <button
              onClick={toggleShuffle}
              className={`rounded-lg p-2 transition-colors ${
                isShuffled ? 'bg-french-blue-100 text-french-blue-600' : 'bg-white text-slate-400 hover:text-slate-600'
              } shadow-sm`}
              title={isShuffled ? 'Eredeti sorrend visszaállítása' : 'Keverés'}
            >
              <Shuffle className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Shortcuts tooltip */}
        <AnimatePresence>
          {showShortcuts && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 overflow-hidden rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm"
            >
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                <div><kbd className="rounded bg-slate-100 px-1.5 py-0.5 text-xs font-mono">←</kbd> Előző</div>
                <div><kbd className="rounded bg-slate-100 px-1.5 py-0.5 text-xs font-mono">→</kbd> Következő</div>
                <div><kbd className="rounded bg-slate-100 px-1.5 py-0.5 text-xs font-mono">T</kbd> Tudom</div>
                <div><kbd className="rounded bg-slate-100 px-1.5 py-0.5 text-xs font-mono">N</kbd> Nem tudom</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between text-sm text-slate-500">
            <span>{currentIndex + 1} / {totalCards}</span>
            <span>{progressPercent}% áttekintve</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-200">
            <motion.div
              className="h-full bg-french-blue-500"
              initial={{ width: 0 }}
              animate={{ width: `${((currentIndex + 1) / totalCards) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Card Area - 2 cols */}
          <div className="lg:col-span-2">
            {/* Flashcard */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`card-${flipKey}`}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.2 }}
              >
                {currentCard && (
                  <FlipCard flashcard={currentCard} isLocked={false} />
                )}
              </motion.div>
            </AnimatePresence>

            {/* Action Buttons */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                onClick={markUnknown}
                className="flex items-center justify-center gap-2 rounded-xl border-2 border-red-200 bg-red-50 px-4 py-4 font-semibold text-red-600 transition-all hover:bg-red-100 hover:border-red-300"
              >
                <XCircle className="h-5 w-5" />
                Nem tudom
              </button>
              <button
                onClick={markKnown}
                className="flex items-center justify-center gap-2 rounded-xl border-2 border-green-200 bg-green-50 px-4 py-4 font-semibold text-green-600 transition-all hover:bg-green-100 hover:border-green-300"
              >
                <CheckCircle className="h-5 w-5" />
                Tudom
              </button>
            </div>

            {/* Navigation */}
            <div className="mt-3 flex gap-3">
              <button
                onClick={goToPrevious}
                disabled={currentIndex === 0}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white py-3 text-sm font-medium text-slate-600 transition-all hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ArrowLeft className="h-4 w-4" />
                Előző
              </button>
              <button
                onClick={goToNext}
                disabled={currentIndex >= totalCards - 1}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white py-3 text-sm font-medium text-slate-600 transition-all hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Következő
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Sidebar - Card List */}
          <div className="hidden lg:block">
            <h3 className="mb-3 text-sm font-semibold text-slate-700">
              Kártyák ({totalCards})
            </h3>

            <div className="max-h-[600px] space-y-1.5 overflow-y-auto rounded-xl border border-slate-200 bg-white p-3">
              {cards.map((card, index) => {
                const status = getCardStatus(card.id)
                return (
                  <button
                    key={card.id}
                    onClick={() => {
                      setCurrentIndex(index)
                      setFlipKey((k) => k + 1)
                    }}
                    className={`w-full rounded-lg border p-3 text-left transition-all ${
                      currentIndex === index
                        ? 'border-french-blue-400 bg-french-blue-50 shadow-sm'
                        : 'border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {/* Status icon */}
                      <div className="mt-0.5 flex-shrink-0">
                        {status === 'known' && (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        )}
                        {status === 'unknown' && (
                          <XCircle className="h-4 w-4 text-red-400" />
                        )}
                        {status === 'pending' && (
                          <div className="mt-1 h-2.5 w-2.5 rounded-full bg-slate-300" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <span className="text-xs font-bold text-slate-400">#{index + 1}</span>
                        <p className="line-clamp-2 text-sm text-slate-700">{card.question}</p>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Stats summary */}
            <div className="mt-4 grid grid-cols-3 gap-2">
              <div className="rounded-lg bg-green-50 p-2 text-center">
                <div className="text-lg font-bold text-green-600">{knownCards.size}</div>
                <div className="text-xs text-green-700">Tudom</div>
              </div>
              <div className="rounded-lg bg-red-50 p-2 text-center">
                <div className="text-lg font-bold text-red-500">{unknownCards.size}</div>
                <div className="text-xs text-red-600">Nem tudom</div>
              </div>
              <div className="rounded-lg bg-slate-100 p-2 text-center">
                <div className="text-lg font-bold text-slate-600">
                  {totalCards - knownCards.size - unknownCards.size}
                </div>
                <div className="text-xs text-slate-500">Hátra</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
