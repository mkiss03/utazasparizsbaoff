'use client'

import { motion } from 'framer-motion'
import { Lock } from 'lucide-react'
import { useState } from 'react'
import type { ContactFormNodeData } from '@/lib/planner/flow-types'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function ContactFormTemplate({
  data,
  name,
  email,
  onChangeName,
  onChangeEmail,
  onSubmit,
  onBack,
  isSubmitting,
}: {
  data: ContactFormNodeData
  name: string
  email: string
  onChangeName: (value: string) => void
  onChangeEmail: (value: string) => void
  onSubmit: () => void
  onBack: () => void
  isSubmitting: boolean
}) {
  const [touched, setTouched] = useState(false)
  const isEmailValid = EMAIL_PATTERN.test(email)

  return (
    <div className="flex h-full flex-col items-center justify-center px-4">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-3 text-center font-playfair text-3xl font-bold text-parisian-grey-800 sm:text-4xl md:text-5xl"
      >
        {data.title}
      </motion.h2>
      {data.subtitle && (
        <p className="mb-10 max-w-md text-center font-montserrat text-parisian-grey-500">{data.subtitle}</p>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault()
          setTouched(true)
          if (isEmailValid) onSubmit()
        }}
        className="w-full max-w-sm space-y-4"
      >
        <input
          type="text"
          value={name}
          onChange={(e) => onChangeName(e.target.value)}
          placeholder={data.namePlaceholder}
          className="w-full rounded-2xl border-2 border-parisian-beige-200 bg-white px-5 py-3.5 font-montserrat text-parisian-grey-800 outline-none focus:border-parisian-beige-400"
        />
        <div>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => onChangeEmail(e.target.value)}
            onBlur={() => setTouched(true)}
            placeholder={data.emailPlaceholder}
            className="w-full rounded-2xl border-2 border-parisian-beige-200 bg-white px-5 py-3.5 font-montserrat text-parisian-grey-800 outline-none focus:border-parisian-beige-400"
          />
          {touched && !isEmailValid && (
            <p className="mt-2 font-montserrat text-sm text-french-red-500">Adj meg egy érvényes email címet.</p>
          )}
        </div>

        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={isSubmitting}
          className="w-full rounded-full bg-parisian-beige-400 px-10 py-4 font-montserrat text-base font-semibold text-white shadow-lg transition-colors hover:bg-parisian-beige-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Összeállítjuk...' : data.submitLabel}
        </motion.button>

        {data.privacyNote && (
          <p className="flex items-center justify-center gap-1.5 font-montserrat text-xs text-parisian-grey-400">
            <Lock className="h-3 w-3" />
            {data.privacyNote}
          </p>
        )}
      </form>

      <button
        type="button"
        onClick={onBack}
        disabled={isSubmitting}
        className="mt-8 font-montserrat text-sm font-medium text-parisian-grey-500 underline-offset-4 hover:underline disabled:opacity-40"
      >
        Vissza
      </button>
    </div>
  )
}
