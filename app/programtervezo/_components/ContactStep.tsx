'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

interface ContactStepProps {
  name: string
  email: string
  onChangeName: (name: string) => void
  onChangeEmail: (email: string) => void
  onSubmit: () => void
  onBack: () => void
  isSubmitting: boolean
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function ContactStep({
  name,
  email,
  onChangeName,
  onChangeEmail,
  onSubmit,
  onBack,
  isSubmitting,
}: ContactStepProps) {
  const [touched, setTouched] = useState(false)
  const isEmailValid = EMAIL_PATTERN.test(email)

  return (
    <div className="flex h-full flex-col items-center justify-center px-4">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-3 text-center font-playfair text-3xl font-bold text-parisian-grey-800 sm:text-4xl md:text-5xl"
      >
        Hova küldjük a programtervedet?
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mb-10 max-w-md text-center font-montserrat text-parisian-grey-500"
      >
        Az elképzeléseid alapján személyesen összeállítjuk a végleges tervet, és emailben küldjük el.
      </motion.p>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        onSubmit={(event) => {
          event.preventDefault()
          setTouched(true)
          if (isEmailValid) onSubmit()
        }}
        className="w-full max-w-sm space-y-4"
      >
        <input
          type="text"
          value={name}
          onChange={(event) => onChangeName(event.target.value)}
          placeholder="Neved (opcionális)"
          className="w-full rounded-2xl border-2 border-parisian-beige-200 bg-white px-5 py-3.5 font-montserrat text-parisian-grey-800 outline-none transition-colors focus:border-parisian-beige-400"
        />
        <div>
          <input
            type="email"
            required
            value={email}
            onChange={(event) => onChangeEmail(event.target.value)}
            onBlur={() => setTouched(true)}
            placeholder="Email címed"
            className="w-full rounded-2xl border-2 border-parisian-beige-200 bg-white px-5 py-3.5 font-montserrat text-parisian-grey-800 outline-none transition-colors focus:border-parisian-beige-400"
          />
          {touched && !isEmailValid && (
            <p className="mt-2 font-montserrat text-sm text-french-red-500">
              Adj meg egy érvényes email címet.
            </p>
          )}
        </div>

        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={isSubmitting}
          className="w-full rounded-full bg-parisian-beige-400 px-10 py-4 font-montserrat text-base font-semibold text-white shadow-lg transition-colors hover:bg-parisian-beige-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Összeállítjuk...' : 'Ízelítő kérése'}
        </motion.button>
      </motion.form>

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
