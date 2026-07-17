'use client'

import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'

export interface QuestionOption<T> {
  value: T
  icon: LucideIcon
  title: string
  description: string
}

interface QuestionStepProps<T> {
  title: string
  subtitle?: string
  options: QuestionOption<T>[]
  selected: T
  onSelect: (value: T) => void
  onBack?: () => void
  onNext: () => void
}

export default function QuestionStep<T>({ title, subtitle, options, selected, onSelect, onBack, onNext }: QuestionStepProps<T>) {
  function handlePick(value: T) {
    onSelect(value)
    onNext()
  }

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

      <div className="space-y-3 text-left">
        {options.map((option, index) => {
          const isSelected = option.value === selected
          const Icon = option.icon
          return (
            <button
              key={index}
              type="button"
              onClick={() => handlePick(option.value)}
              className={`flex w-full items-center gap-4 rounded-2xl border-2 p-5 text-left transition-all ${
                isSelected
                  ? 'border-parisian-beige-400 bg-parisian-cream-50'
                  : 'border-parisian-beige-200 bg-white hover:border-parisian-beige-300'
              }`}
            >
              <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-parisian-beige-100 text-parisian-beige-600">
                <Icon className="h-5 w-5" />
              </span>
              <span>
                <span className="block font-montserrat text-base font-semibold text-parisian-grey-800">
                  {option.title}
                </span>
                <span className="block font-montserrat text-sm text-parisian-grey-500">{option.description}</span>
              </span>
            </button>
          )
        })}
      </div>

      {onBack && (
        <div className="mt-8">
          <button type="button" onClick={onBack} className="font-montserrat text-sm font-medium text-parisian-grey-500 hover:text-parisian-grey-700">
            Vissza
          </button>
        </div>
      )}
    </motion.div>
  )
}
