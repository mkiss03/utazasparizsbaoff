'use client'

import { motion } from 'framer-motion'

interface TextStepProps {
  title: string
  subtitle?: string
  value: string
  placeholder?: string
  onChange: (value: string) => void
  onBack?: () => void
  onNext: () => void
}

export default function TextStep({ title, subtitle, value, placeholder, onChange, onBack, onNext }: TextStepProps) {
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

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border-2 border-parisian-beige-200 px-5 py-4 text-center font-montserrat text-base outline-none focus:border-parisian-beige-400"
      />

      <div className="mt-8 flex items-center justify-center gap-6">
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
