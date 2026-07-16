'use client'

import { motion } from 'framer-motion'
import { CalendarRange, Minus, Plus } from 'lucide-react'

interface TravelWindowStepProps {
  approxMonth: string
  approxDays: number
  onChangeMonth: (value: string) => void
  onChangeDays: (days: number) => void
  onNext: () => void
  onBack: () => void
}

const MIN_DAYS = 1
const MAX_DAYS = 14

export default function TravelWindowStep({
  approxMonth,
  approxDays,
  onChangeMonth,
  onChangeDays,
  onNext,
  onBack,
}: TravelWindowStepProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-4">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-3 text-center font-playfair text-3xl font-bold text-parisian-grey-800 sm:text-4xl md:text-5xl"
      >
        Nagyjából mikorra tervezed?
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mb-10 text-center font-montserrat text-parisian-grey-500"
      >
        Ha még nincs pontos dátum, egy hozzávetőleges hónap is elég
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="w-full max-w-sm"
      >
        <label className="mb-8 block">
          <span className="mb-2 flex items-center gap-2 font-montserrat text-sm font-medium text-parisian-grey-700">
            <CalendarRange className="h-4 w-4 text-parisian-beige-600" />
            Célhónap (opcionális)
          </span>
          <input
            type="month"
            value={approxMonth}
            onChange={(event) => onChangeMonth(event.target.value)}
            className="w-full rounded-2xl border-2 border-parisian-beige-200 bg-white px-5 py-3.5 font-montserrat text-parisian-grey-800 outline-none transition-colors focus:border-parisian-beige-400"
          />
        </label>

        <span className="mb-3 block text-center font-montserrat text-sm font-medium text-parisian-grey-700">
          Hány napra tervezed?
        </span>
        <div className="flex items-center justify-center gap-6 rounded-full bg-parisian-beige-50 px-6 py-4">
          <motion.button
            type="button"
            whileTap={{ scale: 0.9 }}
            onClick={() => onChangeDays(Math.max(MIN_DAYS, approxDays - 1))}
            disabled={approxDays <= MIN_DAYS}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-parisian-grey-800 shadow-sm transition-opacity disabled:opacity-30"
            aria-label="Kevesebb nap"
          >
            <Minus className="h-5 w-5" />
          </motion.button>

          <motion.span
            key={approxDays}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25 }}
            className="w-16 text-center font-playfair text-4xl font-bold text-parisian-grey-800"
          >
            {approxDays}
          </motion.span>

          <motion.button
            type="button"
            whileTap={{ scale: 0.9 }}
            onClick={() => onChangeDays(Math.min(MAX_DAYS, approxDays + 1))}
            disabled={approxDays >= MAX_DAYS}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-parisian-grey-800 shadow-sm transition-opacity disabled:opacity-30"
            aria-label="Több nap"
          >
            <Plus className="h-5 w-5" />
          </motion.button>
        </div>
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
