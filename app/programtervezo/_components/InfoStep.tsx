'use client'

import { motion } from 'framer-motion'
import { Lightbulb } from 'lucide-react'
import type { ReactNode } from 'react'
import type { GuideTip } from '@/lib/planner/guide-content-types'

interface InfoStepProps {
  title: string
  subtitle?: string
  tips: GuideTip[]
  extra?: ReactNode
  skipLabel: string
  onSkip: () => void
  onBack?: () => void
  onNext: () => void
}

export default function InfoStep({ title, subtitle, tips, extra, skipLabel, onSkip, onBack, onNext }: InfoStepProps) {
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

      {tips.length > 0 && (
        <div className="mb-6 space-y-3 text-left">
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
        </div>
      )}

      {extra}

      <div className="mt-8 flex flex-col items-center gap-3">
        <div className="flex items-center justify-center gap-6">
          {onBack && (
            <button type="button" onClick={onBack} className="font-montserrat text-sm font-medium text-parisian-grey-500 hover:text-parisian-grey-700">
              Vissza
            </button>
          )}
          <button
            type="button"
            onClick={onNext}
            className="rounded-full bg-parisian-beige-400 px-8 py-3 font-montserrat text-sm font-semibold text-white transition-colors hover:bg-parisian-beige-500"
          >
            Tovább
          </button>
        </div>
        <button
          type="button"
          onClick={onSkip}
          className="font-montserrat text-xs font-medium text-parisian-grey-400 underline-offset-2 hover:text-parisian-grey-600 hover:underline"
        >
          {skipLabel}
        </button>
      </div>
    </motion.div>
  )
}
