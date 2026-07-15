'use client'

import { motion } from 'framer-motion'
import { PlaneLanding, PlaneTakeoff } from 'lucide-react'

interface FlightDatesStepProps {
  tripStart: string
  tripEnd: string
  onChangeStart: (value: string) => void
  onChangeEnd: (value: string) => void
  onNext: () => void
  onBack: () => void
}

function computeDays(tripStart: string, tripEnd: string): number | null {
  if (!tripStart || !tripEnd) return null
  const start = new Date(tripStart).getTime()
  const end = new Date(tripEnd).getTime()
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) return null
  return Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)))
}

export default function FlightDatesStep({
  tripStart,
  tripEnd,
  onChangeStart,
  onChangeEnd,
  onNext,
  onBack,
}: FlightDatesStepProps) {
  const days = computeDays(tripStart, tripEnd)
  const isValid = days !== null

  return (
    <div className="flex h-full flex-col items-center justify-center px-4">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-3 text-center font-playfair text-3xl font-bold text-parisian-grey-800 sm:text-4xl md:text-5xl"
      >
        Mikor vagytok kint Párizsban?
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mb-10 text-center font-montserrat text-parisian-grey-500"
      >
        A pontos időpontok alapján a nyitvatartásokhoz igazítjuk a napokat
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="w-full max-w-md space-y-4"
      >
        <label className="block">
          <span className="mb-2 flex items-center gap-2 font-montserrat text-sm font-medium text-parisian-grey-700">
            <PlaneLanding className="h-4 w-4 text-parisian-beige-600" />
            Érkezés Párizsba
          </span>
          <input
            type="datetime-local"
            value={tripStart}
            onChange={(event) => onChangeStart(event.target.value)}
            className="w-full rounded-2xl border-2 border-parisian-beige-200 bg-white px-5 py-3.5 font-montserrat text-parisian-grey-800 outline-none transition-colors focus:border-parisian-beige-400"
          />
        </label>

        <label className="block">
          <span className="mb-2 flex items-center gap-2 font-montserrat text-sm font-medium text-parisian-grey-700">
            <PlaneTakeoff className="h-4 w-4 text-parisian-beige-600" />
            Hazautazás
          </span>
          <input
            type="datetime-local"
            value={tripEnd}
            onChange={(event) => onChangeEnd(event.target.value)}
            min={tripStart || undefined}
            className="w-full rounded-2xl border-2 border-parisian-beige-200 bg-white px-5 py-3.5 font-montserrat text-parisian-grey-800 outline-none transition-colors focus:border-parisian-beige-400"
          />
        </label>

        <div className="h-6 text-center">
          {tripStart && tripEnd && !isValid && (
            <p className="font-montserrat text-sm text-french-red-500">
              A hazautazásnak az érkezés után kell lennie.
            </p>
          )}
          {isValid && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-montserrat text-sm font-medium text-parisian-beige-700"
            >
              {days} nap Párizsban
            </motion.p>
          )}
        </div>
      </motion.div>

      <div className="mt-4 flex items-center gap-6">
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
          disabled={!isValid}
          onClick={onNext}
          className="rounded-full bg-parisian-beige-400 px-10 py-4 font-montserrat text-base font-semibold text-white shadow-lg transition-colors hover:bg-parisian-beige-500 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Tovább
        </motion.button>
      </div>
    </div>
  )
}
