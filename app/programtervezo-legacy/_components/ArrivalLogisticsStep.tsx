'use client'

import { motion } from 'framer-motion'
import { Car, HelpCircle, TrainFront, Users } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { Airport, ArrivalTransport } from './types'

interface ArrivalLogisticsStepProps {
  airport: Airport | null
  transport: ArrivalTransport | null
  onChangeAirport: (airport: Airport) => void
  onChangeTransport: (transport: ArrivalTransport) => void
  onNext: () => void
  onBack: () => void
}

const AIRPORTS: { value: Airport; label: string }[] = [
  { value: 'cdg', label: 'Charles de Gaulle (CDG)' },
  { value: 'orly', label: 'Orly' },
  { value: 'beauvais', label: 'Beauvais' },
  { value: 'other', label: 'Más / még nem tudom' },
]

const TRANSPORT_OPTIONS: { value: ArrivalTransport; label: string; icon: LucideIcon }[] = [
  { value: 'taxi', label: 'Taxi / Uber', icon: Car },
  { value: 'metro', label: 'Metró / RER', icon: TrainFront },
  { value: 'transfer', label: 'Szervezett transzfer', icon: Users },
  { value: 'unsure', label: 'Még nem tudom', icon: HelpCircle },
]

export default function ArrivalLogisticsStep({
  airport,
  transport,
  onChangeAirport,
  onChangeTransport,
  onNext,
  onBack,
}: ArrivalLogisticsStepProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-4">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-10 text-center font-playfair text-3xl font-bold text-parisian-grey-800 sm:text-4xl md:text-5xl"
      >
        Melyik reptérre érkezel, és hogy jutnál be a városba?
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="w-full max-w-xl"
      >
        <p className="mb-3 font-montserrat text-sm font-medium text-parisian-grey-700">Repülőtér</p>
        <div className="mb-8 flex flex-wrap gap-2">
          {AIRPORTS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onChangeAirport(option.value)}
              className={`rounded-full border-2 px-4 py-2 font-montserrat text-sm font-medium transition-colors ${
                airport === option.value
                  ? 'border-parisian-beige-400 bg-parisian-beige-400 text-white'
                  : 'border-parisian-beige-200 bg-white text-parisian-grey-700 hover:border-parisian-beige-300'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <p className="mb-3 font-montserrat text-sm font-medium text-parisian-grey-700">Bejutás a városba</p>
        <div className="grid grid-cols-2 gap-3">
          {TRANSPORT_OPTIONS.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => onChangeTransport(value)}
              className={`flex items-center gap-2 rounded-2xl border-2 px-4 py-3 font-montserrat text-sm font-medium transition-colors ${
                transport === value
                  ? 'border-parisian-beige-400 bg-parisian-beige-50 text-parisian-grey-800'
                  : 'border-parisian-beige-200 bg-white text-parisian-grey-700 hover:border-parisian-beige-300'
              }`}
            >
              <Icon className="h-4 w-4 text-parisian-beige-600" />
              {label}
            </button>
          ))}
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
          disabled={!airport || !transport}
          onClick={onNext}
          className="rounded-full bg-parisian-beige-400 px-10 py-4 font-montserrat text-base font-semibold text-white shadow-lg transition-colors hover:bg-parisian-beige-500 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Tovább
        </motion.button>
      </div>
    </div>
  )
}
