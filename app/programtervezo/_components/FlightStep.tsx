'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Lightbulb } from 'lucide-react'
import type { GuideTip } from '@/lib/planner/guide-content-types'

export type FlightStatus = 'have' | 'not_yet' | 'need_help'

interface FlightStepProps {
  title: string
  subtitle?: string
  options: { value: FlightStatus; label: string }[]
  status: FlightStatus | null
  onChange: (status: FlightStatus) => void
  tips: GuideTip[]
  onBack?: () => void
  onNext: () => void
}

export default function FlightStep({ title, subtitle, options, status, onChange, tips, onBack, onNext }: FlightStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.25 }}
      className="mx-auto max-w-xl px-4 py-14 text-center"
    >
      <h1 className="mb-2 font-playfair text-3xl font-bold text-parisian-grey-800 sm:text-4xl">{title}</h1>
      {subtitle && <p className="mb-8 font-montserrat text-parisian-grey-500">{subtitle}</p>}

      <div className="flex flex-wrap justify-center gap-2.5">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`rounded-full border-2 px-5 py-2.5 font-montserrat text-sm font-medium transition-colors ${
              status === option.value
                ? 'border-parisian-beige-400 bg-parisian-cream-50 text-parisian-grey-800'
                : 'border-parisian-beige-200 bg-white text-parisian-grey-600 hover:border-parisian-beige-300'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <AnimatePresence>
        {status === 'need_help' && tips.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 space-y-3 overflow-hidden text-left"
          >
            {tips.map((tip, index) => (
              <div key={index} className="flex gap-3 rounded-2xl border-2 border-parisian-beige-200 bg-white p-4">
                <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-parisian-beige-100 text-parisian-beige-600">
                  <Lightbulb className="h-4 w-4" />
                </span>
                <span>
                  <span className="block font-montserrat text-sm font-semibold text-parisian-grey-800">{tip.title}</span>
                  <span className="block font-montserrat text-sm text-parisian-grey-500">{tip.description}</span>
                </span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-8 flex items-center justify-center gap-6">
        {onBack && (
          <button type="button" onClick={onBack} className="font-montserrat text-sm font-medium text-parisian-grey-500 hover:text-parisian-grey-700">
            Vissza
          </button>
        )}
        <button
          type="button"
          onClick={onNext}
          disabled={status === null}
          className="rounded-full bg-parisian-beige-400 px-8 py-3 font-montserrat text-sm font-semibold text-white transition-colors hover:bg-parisian-beige-500 disabled:opacity-50"
        >
          Tovább
        </button>
      </div>
    </motion.div>
  )
}
