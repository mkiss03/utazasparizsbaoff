'use client'

import { motion } from 'framer-motion'

interface ContactStepProps {
  name: string
  email: string
  onNameChange: (value: string) => void
  onEmailChange: (value: string) => void
  onBack?: () => void
  onSubmit: () => void
  isSubmitting: boolean
  error?: string | null
}

export default function ContactStep({
  name,
  email,
  onNameChange,
  onEmailChange,
  onBack,
  onSubmit,
  isSubmitting,
  error,
}: ContactStepProps) {
  const canSubmit = name.trim().length > 0 && /\S+@\S+\.\S+/.test(email)

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.25 }}
      className="mx-auto max-w-md px-4 py-14 text-center"
    >
      <h1 className="mb-2 font-playfair text-3xl font-bold text-parisian-grey-800 sm:text-4xl">
        Már csak egy lépés
      </h1>
      <p className="mb-8 font-montserrat text-parisian-grey-500">
        Add meg az elérhetőségedet -- Viktória személyesen átnézi az igényedet, és hamarosan elküldi a hozzátok
        szabott programtervet.
      </p>

      <div className="space-y-3 text-left">
        <input
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Neved"
          className="w-full rounded-2xl border-2 border-parisian-beige-200 px-5 py-3.5 font-montserrat text-base outline-none focus:border-parisian-beige-400"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          placeholder="Email címed"
          className="w-full rounded-2xl border-2 border-parisian-beige-200 px-5 py-3.5 font-montserrat text-base outline-none focus:border-parisian-beige-400"
        />
      </div>

      {error && (
        <p className="mt-4 font-montserrat text-sm text-french-red-600">{error}</p>
      )}

      <div className="mt-8 flex items-center justify-center gap-6">
        {onBack && (
          <button type="button" onClick={onBack} className="font-montserrat text-sm font-medium text-parisian-grey-500 hover:text-parisian-grey-700">
            Vissza
          </button>
        )}
        <button
          type="button"
          onClick={onSubmit}
          disabled={!canSubmit || isSubmitting}
          className="rounded-full bg-parisian-beige-400 px-8 py-3 font-montserrat text-sm font-semibold text-white transition-colors hover:bg-parisian-beige-500 disabled:opacity-50"
        >
          {isSubmitting ? 'Küldés...' : 'Igény elküldése'}
        </button>
      </div>
    </motion.div>
  )
}
