'use client'

import { motion } from 'framer-motion'
import { Check, UtensilsCrossed } from 'lucide-react'
import { staggerContainer, staggerItem } from './WizardShell'

interface DietaryStepProps {
  selected: string[]
  onToggle: (option: string) => void
  onNext: () => void
  onBack: () => void
}

const OPTIONS = ['Vegetáriánus', 'Vegán', 'Gluténmentes', 'Tejmentes', 'Nincs megkötés']

export default function DietaryStep({ selected, onToggle, onNext, onBack }: DietaryStepProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-parisian-beige-100"
      >
        <UtensilsCrossed className="h-7 w-7 text-parisian-beige-600" />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-3 text-center font-playfair text-3xl font-bold text-parisian-grey-800 sm:text-4xl md:text-5xl"
      >
        Van étkezési preferenciád?
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mb-10 text-center font-montserrat text-parisian-grey-500"
      >
        Mivel a gasztronómia fontos neked, erre külön figyelünk az étterem-ajánlásoknál
      </motion.p>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="flex max-w-xl flex-wrap justify-center gap-3"
      >
        {OPTIONS.map((option) => {
          const isSelected = selected.includes(option)
          return (
            <motion.button
              key={option}
              type="button"
              variants={staggerItem}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => onToggle(option)}
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
          onClick={onNext}
          className="rounded-full bg-parisian-beige-400 px-10 py-4 font-montserrat text-base font-semibold text-white shadow-lg transition-colors hover:bg-parisian-beige-500"
        >
          Tovább
        </motion.button>
      </div>
    </div>
  )
}
