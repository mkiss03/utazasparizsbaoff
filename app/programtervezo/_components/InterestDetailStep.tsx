'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { useState } from 'react'
import { INTEREST_CATEGORY_LABEL, INTEREST_SUBCATEGORIES } from './catalogAdjust'
import { staggerContainer, staggerItem } from './WizardShell'

interface InterestDetailStepProps {
  category: string
  positionInQueue: number
  totalInQueue: number
  onSubmit: (subcategories: string[]) => void
  onBack: () => void
}

/**
 * A `key={category}` a szülőben biztosítja, hogy minden kategóriaváltásnál
 * ez a komponens újra létrejön -- a helyi `selected` state emiatt mindig
 * üresen indul az adott alkategória-kérdésnél.
 */
export default function InterestDetailStep({
  category,
  positionInQueue,
  totalInQueue,
  onSubmit,
  onBack,
}: InterestDetailStepProps) {
  const [selected, setSelected] = useState<string[]>([])
  const options = INTEREST_SUBCATEGORIES[category] ?? []
  const categoryLabel = INTEREST_CATEGORY_LABEL[category] ?? category

  function toggle(option: string) {
    setSelected((current) =>
      current.includes(option) ? current.filter((o) => o !== option) : [...current, option]
    )
  }

  return (
    <div className="flex h-full flex-col items-center justify-center px-4">
      <motion.span
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-3 font-montserrat text-xs font-semibold uppercase tracking-wider text-parisian-beige-600"
      >
        Érdeklődés részletezése -- {positionInQueue}/{totalInQueue}
      </motion.span>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-10 text-center font-playfair text-3xl font-bold text-parisian-grey-800 sm:text-4xl md:text-5xl"
      >
        {categoryLabel} -- mi áll hozzád közelebb?
      </motion.h2>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="flex max-w-xl flex-wrap justify-center gap-3"
      >
        {options.map((option) => {
          const isSelected = selected.includes(option)
          return (
            <motion.button
              key={option}
              type="button"
              variants={staggerItem}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => toggle(option)}
              className={`flex items-center gap-2 rounded-full border-2 px-5 py-3 font-montserrat text-sm font-medium transition-colors ${
                isSelected
                  ? 'border-parisian-beige-400 bg-parisian-beige-400 text-white'
                  : 'border-parisian-beige-200 bg-white text-parisian-grey-700 hover:border-parisian-beige-300'
              }`}
            >
              {isSelected && <Check className="h-4 w-4" />}
              {option}
            </motion.button>
          )
        })}
      </motion.div>

      <div className="mt-10 flex items-center gap-6">
        <button
          type="button"
          onClick={onBack}
          className="font-montserrat text-sm font-medium text-parisian-grey-500 underline-offset-4 hover:underline"
        >
          Vissza
        </button>
        <motion.button
          type="button"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSubmit(selected)}
          className="rounded-full bg-parisian-beige-400 px-10 py-4 font-montserrat text-base font-semibold text-white shadow-lg transition-colors hover:bg-parisian-beige-500"
        >
          {selected.length > 0 ? 'Tovább' : 'Kihagyom'}
        </motion.button>
      </div>
    </div>
  )
}
