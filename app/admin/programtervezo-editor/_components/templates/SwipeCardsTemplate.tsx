'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Clock, ThumbsDown, ThumbsUp } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { ProgramItem } from '@/lib/planner/types'
import type { SwipeCardsNodeData } from '@/lib/planner/flow-types'

const CATEGORY_LABELS: Record<string, string> = {
  muzeum: 'Múzeum',
  seta: 'Séta',
  latvanyossag: 'Látványosság',
  gasztro: 'Gasztronómia',
}

export default function SwipeCardsTemplate({
  data,
  candidates,
  onFinish,
  onBack,
}: {
  data: SwipeCardsNodeData
  candidates: ProgramItem[]
  onFinish: (liked: string[], disliked: string[]) => void
  onBack: () => void
}) {
  const [index, setIndex] = useState(0)
  const [liked, setLiked] = useState<string[]>([])
  const [disliked, setDisliked] = useState<string[]>([])

  useEffect(() => {
    if (candidates.length === 0) onFinish([], [])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [candidates.length])

  if (candidates.length === 0) return null

  const current = candidates[index]

  function decide(isLiked: boolean) {
    const nextLiked = isLiked ? [...liked, current.id] : liked
    const nextDisliked = !isLiked ? [...disliked, current.id] : disliked
    if (index + 1 >= candidates.length) {
      onFinish(nextLiked, nextDisliked)
      return
    }
    setLiked(nextLiked)
    setDisliked(nextDisliked)
    setIndex(index + 1)
  }

  return (
    <div className="flex h-full flex-col items-center justify-center px-4">
      <span className="mb-3 font-montserrat text-xs font-semibold uppercase tracking-wider text-parisian-beige-600">
        {index + 1}/{candidates.length}
      </span>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 text-center font-playfair text-3xl font-bold text-parisian-grey-800 sm:text-4xl md:text-5xl"
      >
        {data.title}
      </motion.h2>

      <div className="relative w-full max-w-md">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, x: 60, rotate: 4 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            exit={{ opacity: 0, x: -60, rotate: -4 }}
            transition={{ duration: 0.35 }}
            className="rounded-3xl border-2 border-parisian-beige-200 bg-white p-8 shadow-xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="inline-block rounded-full bg-parisian-beige-100 px-3 py-1 font-montserrat text-xs font-semibold uppercase tracking-wider text-parisian-grey-600">
                {CATEGORY_LABELS[current.category] ?? current.category}
              </span>
              {current.priceRange && (
                <span className="font-montserrat text-sm font-semibold text-parisian-beige-700">{current.priceRange}</span>
              )}
            </div>
            <h3 className="mb-2 font-playfair text-2xl font-bold text-parisian-grey-800">{current.title}</h3>
            {current.description && (
              <p className="mb-4 font-montserrat text-sm leading-relaxed text-parisian-grey-600">{current.description}</p>
            )}
            <div className="flex items-center gap-1.5 font-montserrat text-xs text-parisian-grey-400">
              <Clock className="h-3.5 w-3.5" />
              kb. {Math.round(current.durationMin / 30) * 30} perc
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-8 flex items-center gap-4">
        <button
          type="button"
          onClick={() => decide(false)}
          className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-parisian-grey-200 bg-white text-parisian-grey-500 shadow-sm hover:border-french-red-300 hover:text-french-red-500"
        >
          <ThumbsDown className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => decide(true)}
          className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-parisian-beige-300 bg-parisian-beige-50 text-parisian-beige-600 shadow-sm hover:border-parisian-beige-400"
        >
          <ThumbsUp className="h-5 w-5" />
        </button>
      </div>

      <button
        type="button"
        onClick={onBack}
        className="mt-8 font-montserrat text-sm font-medium text-parisian-grey-500 underline-offset-4 hover:underline"
      >
        Vissza
      </button>
    </div>
  )
}
