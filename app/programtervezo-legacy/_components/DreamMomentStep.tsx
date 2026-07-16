'use client'

import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

interface DreamMomentStepProps {
  value: string
  onChange: (value: string) => void
  onNext: () => void
  onBack: () => void
}

const MAX_LENGTH = 300

export default function DreamMomentStep({ value, onChange, onNext, onBack }: DreamMomentStepProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-parisian-beige-100"
      >
        <Sparkles className="h-7 w-7 text-parisian-beige-600" />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-3 max-w-lg text-center font-playfair text-3xl font-bold text-parisian-grey-800 sm:text-4xl md:text-5xl"
      >
        Van valami, amit mindenképp szeretnél átélni Párizsban?
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mb-8 text-center font-montserrat text-parisian-grey-500"
      >
        Ez a rész kizárólag Viktóriához kerül -- a motor nem használja fel, de a végleges terv
        elkészítésekor mindig figyelembe veszi
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="w-full max-w-xl"
      >
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value.slice(0, MAX_LENGTH))}
          rows={4}
          placeholder="Pl. szeretnék napfelkeltekor lenni a Sacré-Cœurnél…"
          className="w-full resize-none rounded-2xl border-2 border-parisian-beige-200 bg-white px-5 py-4 font-montserrat text-parisian-grey-800 outline-none transition-colors focus:border-parisian-beige-400"
        />
        <p className="mt-2 text-right font-montserrat text-xs text-parisian-grey-400">
          {value.length}/{MAX_LENGTH}
        </p>
      </motion.div>

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
          onClick={onNext}
          className="rounded-full bg-parisian-beige-400 px-10 py-4 font-montserrat text-base font-semibold text-white shadow-lg transition-colors hover:bg-parisian-beige-500"
        >
          {value.trim() ? 'Tovább' : 'Kihagyom'}
        </motion.button>
      </div>
    </div>
  )
}
