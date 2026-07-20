'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
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
  const [pending, setPending] = useState<T | null>(null)

  function handlePick(value: T) {
    setPending(value)
    onSelect(value)
    // Rövid szünet, hogy a kiválasztás vizuálisan látszódjon, mielőtt a
    // lépés automatikusan továbblép -- egyetlen kattintás legyen elég.
    window.setTimeout(onNext, 220)
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
          const isSelected = option.value === selected || option.value === pending
          const Icon = option.icon
          return (
            <motion.button
              key={index}
              type="button"
              onClick={() => handlePick(option.value)}
              whileHover={{ scale: pending === null ? 1.015 : 1 }}
              whileTap={{ scale: 0.985 }}
              animate={isSelected ? { scale: [1, 1.02, 1] } : {}}
              transition={{ duration: 0.2 }}
              className={`flex w-full items-center gap-4 rounded-2xl border-2 p-5 text-left transition-colors ${
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
            </motion.button>
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
