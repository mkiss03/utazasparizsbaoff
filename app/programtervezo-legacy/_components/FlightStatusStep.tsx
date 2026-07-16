'use client'

import { motion } from 'framer-motion'
import { Compass, LifeBuoy, PlaneTakeoff } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { FlightStatus } from './types'
import { staggerContainer, staggerItem } from './WizardShell'

interface FlightStatusStepProps {
  value: FlightStatus | null
  onSelect: (status: FlightStatus) => void
  onNext: () => void
  onBack: () => void
}

const OPTIONS: { value: FlightStatus; label: string; description: string; icon: LucideIcon }[] = [
  {
    value: 'booked',
    label: 'Megvan a repjegyem',
    description: 'Pontosan tudom az érkezés és a hazautazás időpontját',
    icon: PlaneTakeoff,
  },
  {
    value: 'planning-self',
    label: 'Még nincs, magam intézem',
    description: 'Van egy hozzávetőleges időszak, amit tervezek',
    icon: Compass,
  },
  {
    value: 'wants-help',
    label: 'Még nincs, kérnék segítséget',
    description: 'Szívesen kérnék tanácsot a jegy- és szállásfoglaláshoz',
    icon: LifeBuoy,
  },
]

export default function FlightStatusStep({ value, onSelect, onNext, onBack }: FlightStatusStepProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-4">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-3 text-center font-playfair text-3xl font-bold text-parisian-grey-800 sm:text-4xl md:text-5xl"
      >
        Van már repjegyed?
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mb-10 text-center font-montserrat text-parisian-grey-500"
      >
        Ez segít pontosan beütemezni a napjaidat -- a nyitvatartásokkal együtt
      </motion.p>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="flex w-full max-w-xl flex-col gap-3"
      >
        {OPTIONS.map(({ value: optionValue, label, description, icon: Icon }) => {
          const isSelected = value === optionValue
          return (
            <motion.button
              key={optionValue}
              type="button"
              variants={staggerItem}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(optionValue)}
              className={`flex items-center gap-4 rounded-2xl border-2 px-6 py-4 text-left transition-colors ${
                isSelected
                  ? 'border-parisian-beige-400 bg-parisian-beige-50'
                  : 'border-parisian-beige-200 bg-white hover:border-parisian-beige-300'
              }`}
            >
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-parisian-beige-100">
                <Icon className="h-5 w-5 text-parisian-beige-600" />
              </div>
              <div>
                <p className="font-montserrat text-base font-semibold text-parisian-grey-800">{label}</p>
                <p className="font-montserrat text-sm text-parisian-grey-500">{description}</p>
              </div>
            </motion.button>
          )
        })}
      </motion.div>

      <div className="mt-6 h-10">
        {value === 'wants-help' && (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="max-w-md text-center font-montserrat text-sm italic text-parisian-beige-700"
          >
            Rendben -- a végleges tervben Viktória konkrét javaslatokat is küld a foglaláshoz.
          </motion.p>
        )}
      </div>

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
