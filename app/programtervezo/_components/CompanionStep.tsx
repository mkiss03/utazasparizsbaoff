'use client'

import { motion } from 'framer-motion'
import { Heart, PartyPopper, User, Users } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { CompanionType } from './types'

interface CompanionStepProps {
  value: CompanionType | null
  onSelect: (companion: CompanionType) => void
  onNext: () => void
  onBack: () => void
}

const OPTIONS: { value: CompanionType; label: string; icon: LucideIcon }[] = [
  { value: 'paar', label: 'Párban', icon: Heart },
  { value: 'csalad', label: 'Családdal', icon: Users },
  { value: 'baratok', label: 'Barátokkal', icon: PartyPopper },
  { value: 'egyedul', label: 'Egyedül', icon: User },
]

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
}

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
}

export default function CompanionStep({ value, onSelect, onNext, onBack }: CompanionStepProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-4">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-12 text-center font-playfair text-3xl font-bold text-parisian-grey-800 sm:text-4xl md:text-5xl"
      >
        Kikkel utazol?
      </motion.h2>

      <motion.div
        variants={container}
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
              variants={item}
              whileHover={{ scale: 1.03, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                onSelect(optionValue)
                onNext()
              }}
              className={`flex flex-col items-center gap-4 rounded-3xl border-2 p-8 shadow-md transition-colors ${
                isSelected
                  ? 'border-parisian-beige-400 bg-parisian-beige-50'
                  : 'border-parisian-beige-200 bg-white hover:border-parisian-beige-300'
              }`}
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-parisian-beige-100">
                <Icon className="h-7 w-7 text-parisian-beige-600" />
              </div>
              <span className="font-montserrat text-lg font-semibold text-parisian-grey-800">
                {label}
              </span>
            </motion.button>
          )
        })}
      </motion.div>

      <button
        type="button"
        onClick={onBack}
        className="mt-10 font-montserrat text-sm font-medium text-parisian-grey-500 underline-offset-4 hover:underline"
      >
        Vissza
      </button>
    </div>
  )
}
