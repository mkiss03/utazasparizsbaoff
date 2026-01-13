'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { RotateCw, Lightbulb } from 'lucide-react'
import type { Flashcard } from '@/lib/types/database'

interface FlipCardProps {
  flashcard: Flashcard
  isLocked?: boolean
}

export default function FlipCard({ flashcard, isLocked = false }: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [showHint, setShowHint] = useState(false)

  const handleFlip = () => {
    if (!isLocked) {
      setIsFlipped(!isFlipped)
    }
  }

  return (
    <div className="perspective-1000 h-96 w-full">
      <motion.div
        className="relative h-full w-full cursor-pointer"
        style={{
          transformStyle: 'preserve-3d',
        }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring' }}
        onClick={handleFlip}
      >
        {/* Front Side - Question */}
        <div
          className="backface-hidden absolute inset-0 flex flex-col rounded-3xl border-2 border-parisian-beige-200 bg-white p-8 shadow-2xl"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
        >
          {/* Locked Overlay */}
          {isLocked && (
            <div className="absolute inset-0 z-10 flex items-center justify-center rounded-3xl bg-parisian-grey-900/80 backdrop-blur-sm">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
                  <svg
                    className="h-8 w-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <p className="font-semibold text-white">Megvásárláshoz szükséges</p>
                <p className="mt-2 text-sm text-white/70">Vásárolj meg ezt a csomagot a kártyák megtekintéséhez</p>
              </div>
            </div>
          )}

          {/* Card Number Badge */}
          <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-parisian-beige-400 text-sm font-bold text-white shadow-lg">
            {flashcard.card_order + 1}
          </div>

          {/* Question Label */}
          <div className="mb-4">
            <span className="inline-block rounded-full bg-parisian-beige-100 px-4 py-1 text-sm font-semibold text-parisian-grey-700">
              Kérdés
            </span>
          </div>

          {/* Question Content */}
          <div className="flex flex-1 items-center justify-center">
            <h3 className="text-center font-playfair text-2xl font-bold text-parisian-grey-800 md:text-3xl">
              {isLocked ? '???' : flashcard.question}
            </h3>
          </div>

          {/* Image if exists */}
          {!isLocked && flashcard.image_url && (
            <div className="relative mt-4 h-32 w-full overflow-hidden rounded-2xl">
              <Image
                src={flashcard.image_url}
                alt="Card illustration"
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Hint Button */}
          {!isLocked && flashcard.hint && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowHint(!showHint)
              }}
              className="mt-4 flex items-center gap-2 self-center rounded-full bg-parisian-beige-100 px-4 py-2 text-sm text-parisian-grey-700 transition-all hover:bg-parisian-beige-200"
            >
              <Lightbulb className="h-4 w-4" />
              {showHint ? flashcard.hint : 'Mutasd meg a tippet'}
            </button>
          )}

          {/* Flip Indicator */}
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-parisian-grey-400">
            <RotateCw className="h-4 w-4" />
            <span>Kattints a megfordításhoz</span>
          </div>
        </div>

        {/* Back Side - Answer */}
        <div
          className="backface-hidden absolute inset-0 flex flex-col rounded-3xl border-2 border-parisian-beige-300 bg-gradient-to-br from-parisian-beige-100 to-parisian-beige-200 p-8 shadow-2xl"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          {/* Answer Label */}
          <div className="mb-4">
            <span className="inline-block rounded-full bg-parisian-beige-400 px-4 py-1 text-sm font-semibold text-white">
              Válasz
            </span>
          </div>

          {/* Answer Content */}
          <div className="flex flex-1 items-center justify-center">
            <p className="text-center text-xl leading-relaxed text-parisian-grey-700 md:text-2xl">
              {flashcard.answer}
            </p>
          </div>

          {/* Flip Back Indicator */}
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-parisian-grey-500">
            <RotateCw className="h-4 w-4" />
            <span>Kattints a visszafordításhoz</span>
          </div>
        </div>
      </motion.div>

      <style jsx global>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .backface-hidden {
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
        }
      `}</style>
    </div>
  )
}
