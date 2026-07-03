'use client'

import { motion } from 'framer-motion'
import type { Pace } from '@/lib/planner/types'

interface PaceStepProps {
  value: Pace
  onChange: (pace: Pace) => void
  onNext: () => void
  onBack: () => void
}

const PACE_STEPS: { value: Pace; label: string; description: string }[] = [
  { value: 'relaxed', label: 'Ráérős flâneur', description: 'Kevesebb program, több idő élvezni a pillanatot' },
  { value: 'moderate', label: 'Kiegyensúlyozott', description: 'Jó arányban látnivaló és pihenés' },
  { value: 'packed', label: 'Mindent látni akarok', description: 'Sűrű, aktív napok, tele élményekkel' },
]

const PACE_INDEX: Record<Pace, number> = { relaxed: 0, moderate: 1, packed: 2 }

export default function PaceStep({ value, onChange, onNext, onBack }: PaceStepProps) {
  const activeIndex = PACE_INDEX[value]

  return (
    <div className="flex h-full flex-col items-center justify-center px-4">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-3 text-center font-playfair text-3xl font-bold text-parisian-grey-800 sm:text-4xl md:text-5xl"
      >
        Milyen tempóban szeretnél haladni?
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="mt-12 w-full max-w-xl"
      >
        <div className="relative mb-8 h-2 rounded-full bg-parisian-beige-100">
          <motion.div
            animate={{ width: `${(activeIndex / (PACE_STEPS.length - 1)) * 100}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="absolute inset-y-0 left-0 rounded-full bg-parisian-beige-400"
          />
          {PACE_STEPS.map((step, index) => (
            <motion.button
              key={step.value}
              type="button"
              onClick={() => onChange(step.value)}
              whileTap={{ scale: 0.9 }}
              style={{ left: `${(index / (PACE_STEPS.length - 1)) * 100}%` }}
              className="absolute top-1/2 flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-white bg-parisian-beige-400 shadow-md"
              aria-label={step.label}
            />
          ))}
        </div>

        <motion.div
          key={value}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-2xl border-2 border-parisian-beige-200 bg-white p-6 text-center"
        >
          <p className="mb-1 font-playfair text-2xl font-bold text-parisian-grey-800">
            {PACE_STEPS[activeIndex].label}
          </p>
          <p className="font-montserrat text-sm text-parisian-grey-600">
            {PACE_STEPS[activeIndex].description}
          </p>
        </motion.div>
      </motion.div>

      <div className="mt-12 flex items-center gap-6">
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
