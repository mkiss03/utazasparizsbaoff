'use client'

import { motion } from 'framer-motion'
import { Flower2, Leaf, Snowflake, Sun } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { Season } from './types'
import { staggerContainer, staggerItem } from './WizardShell'

interface SeasonStepProps {
  value: Season
  onSelect: (season: Season) => void
  onNext: () => void
  onBack: () => void
}

const OPTIONS: { value: Exclude<Season, null>; label: string; icon: LucideIcon }[] = [
  { value: 'tavasz', label: 'Tavasszal', icon: Flower2 },
  { value: 'nyar', label: 'Nyáron', icon: Sun },
  { value: 'osz', label: 'Ősszel', icon: Leaf },
  { value: 'tel', label: 'Télen', icon: Snowflake },
]

export default function SeasonStep({ value, onSelect, onNext, onBack }: SeasonStepProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-4">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-3 text-center font-playfair text-3xl font-bold text-parisian-grey-800 sm:text-4xl md:text-5xl"
      >
        Mikor szeretnél utazni?
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mb-10 text-center font-montserrat text-parisian-grey-500"
      >
        Ez segít eltalálni, mennyi szabadtéri és beltéri program illik hozzád
      </motion.p>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="grid w-full max-w-2xl grid-cols-2 gap-4 sm:gap-6"
      >
        {OPTIONS.map(({ value: optionValue, label, icon: Icon }) => {
          const isSelected = value === optionValue
          return (
            <motion.button
              key={optionValue}
              type="button"
              variants={staggerItem}
              whileHover={{ scale: 1.03, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                onSelect(optionValue)
                onNext()
              }}
              className={`flex flex-col items-center gap-3 rounded-3xl border-2 p-6 shadow-md transition-colors ${
                isSelected
                  ? 'border-parisian-beige-400 bg-parisian-beige-50'
                  : 'border-parisian-beige-200 bg-white hover:border-parisian-beige-300'
              }`}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-parisian-beige-100">
                <Icon className="h-6 w-6 text-parisian-beige-600" />
              </div>
              <span className="font-montserrat text-base font-semibold text-parisian-grey-800">
                {label}
              </span>
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
        <button
          type="button"
          onClick={onNext}
          className="font-montserrat text-sm font-medium text-parisian-grey-500 underline-offset-4 hover:underline"
        >
          Még nem tudom
        </button>
      </div>
    </div>
  )
}
