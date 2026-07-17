'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import type { AttractionOption } from '@/lib/planner/attraction-options'

interface ChecklistStepProps {
  title: string
  subtitle?: string
  options: AttractionOption[]
  selected: string[]
  onToggle: (tag: string) => void
  onBack?: () => void
  onNext: () => void
}

export default function ChecklistStep({ title, subtitle, options, selected, onToggle, onBack, onNext }: ChecklistStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.25 }}
      className="mx-auto max-w-2xl px-4 py-14 text-center"
    >
      <h1 className="mb-2 font-playfair text-3xl font-bold text-parisian-grey-800 sm:text-4xl">{title}</h1>
      {subtitle && <p className="mb-8 font-montserrat text-parisian-grey-500">{subtitle}</p>}

      <div className="flex flex-wrap justify-center gap-2.5">
        {options.map((option) => {
          const isSelected = selected.includes(option.tag)
          return (
            <button
              key={option.tag}
              type="button"
              onClick={() => onToggle(option.tag)}
              className={`flex items-center gap-2 rounded-full border-2 px-4 py-2.5 font-montserrat text-sm font-medium transition-all ${
                isSelected
                  ? 'border-parisian-beige-400 bg-parisian-cream-50 text-parisian-grey-800'
                  : 'border-parisian-beige-200 bg-white text-parisian-grey-600 hover:border-parisian-beige-300'
              }`}
            >
              {isSelected && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-parisian-beige-400 text-white">
                  <Check className="h-2.5 w-2.5" />
                </span>
              )}
              {option.label}
            </button>
          )
        })}
      </div>

      <div className="mt-10 flex items-center justify-center gap-6">
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
    </motion.div>
  )
}
