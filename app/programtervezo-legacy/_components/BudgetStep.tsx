'use client'

import { motion } from 'framer-motion'
import { Coins, Gem, HelpCircle, Wallet } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { BudgetBand } from './types'
import { staggerContainer, staggerItem } from './WizardShell'

interface BudgetStepProps {
  value: BudgetBand | null
  onSelect: (band: BudgetBand) => void
  onNext: () => void
  onBack: () => void
}

const OPTIONS: { value: BudgetBand; label: string; description: string; icon: LucideIcon }[] = [
  {
    value: 'gazdasagos',
    label: 'Gazdaságos',
    description: 'Ingyenes és olcsó programok, helyi bisztrók',
    icon: Wallet,
  },
  {
    value: 'kozepkategoria',
    label: 'Középkategória',
    description: 'Kényelmes egyensúly élmény és ár között',
    icon: Coins,
  },
  {
    value: 'premium',
    label: 'Prémium',
    description: 'A legjobb helyek, exkluzív élmények',
    icon: Gem,
  },
  {
    value: 'nem-tudom',
    label: 'Még nem tudom',
    description: 'Viktória vegyesen javasol majd',
    icon: HelpCircle,
  },
]

export default function BudgetStep({ value, onSelect, onNext, onBack }: BudgetStepProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-4">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-3 text-center font-playfair text-3xl font-bold text-parisian-grey-800 sm:text-4xl md:text-5xl"
      >
        Milyen költségkeretben gondolkodsz?
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mb-10 text-center font-montserrat text-parisian-grey-500"
      >
        A repjegyen és szálláson felüli napi programokra értve -- ez irányár, Viktória a végén pontosít
      </motion.p>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="grid w-full max-w-2xl grid-cols-2 gap-4"
      >
        {OPTIONS.map(({ value: optionValue, label, description, icon: Icon }) => {
          const isSelected = value === optionValue
          return (
            <motion.button
              key={optionValue}
              type="button"
              variants={staggerItem}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(optionValue)}
              className={`flex flex-col items-center gap-2 rounded-3xl border-2 p-6 text-center shadow-md transition-colors ${
                isSelected
                  ? 'border-parisian-beige-400 bg-parisian-beige-50'
                  : 'border-parisian-beige-200 bg-white hover:border-parisian-beige-300'
              }`}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-parisian-beige-100">
                <Icon className="h-6 w-6 text-parisian-beige-600" />
              </div>
              <span className="font-montserrat text-base font-semibold text-parisian-grey-800">{label}</span>
              <span className="font-montserrat text-xs text-parisian-grey-500">{description}</span>
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
          disabled={!value}
          onClick={onNext}
          className="rounded-full bg-parisian-beige-400 px-10 py-4 font-montserrat text-base font-semibold text-white shadow-lg transition-colors hover:bg-parisian-beige-500 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Tovább
        </motion.button>
      </div>
    </div>
  )
}
