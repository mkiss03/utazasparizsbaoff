'use client'

import { motion } from 'framer-motion'
import { Baby } from 'lucide-react'
import { staggerContainer, staggerItem } from './WizardShell'

interface FamilyDetailsStepProps {
  value: string | null
  onSelect: (kidsAge: string) => void
  onNext: () => void
  onBack: () => void
}

const OPTIONS = ['Csecsemő / kisgyerek (0-4)', 'Kisiskolás (5-11)', 'Tizenéves (12-17)', 'Felnőtt gyerekek']

export default function FamilyDetailsStep({ value, onSelect, onNext, onBack }: FamilyDetailsStepProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-parisian-beige-100"
      >
        <Baby className="h-7 w-7 text-parisian-beige-600" />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-3 text-center font-playfair text-3xl font-bold text-parisian-grey-800 sm:text-4xl md:text-5xl"
      >
        Hány évesek a gyerekek?
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mb-10 text-center font-montserrat text-parisian-grey-500"
      >
        Ez segít eltalálni a napi ritmust és a programok energiaszintjét
      </motion.p>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="flex w-full max-w-xl flex-col gap-3"
      >
        {OPTIONS.map((option) => {
          const isSelected = value === option
          return (
            <motion.button
              key={option}
              type="button"
              variants={staggerItem}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                onSelect(option)
                onNext()
              }}
              className={`rounded-2xl border-2 px-6 py-4 text-left font-montserrat text-base font-medium transition-colors ${
                isSelected
                  ? 'border-parisian-beige-400 bg-parisian-beige-50 text-parisian-grey-800'
                  : 'border-parisian-beige-200 bg-white text-parisian-grey-700 hover:border-parisian-beige-300'
              }`}
            >
              {option}
            </motion.button>
          )
        })}
      </motion.div>

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
