'use client'

import { motion } from 'framer-motion'
import type { FreeTextNodeData } from '@/lib/planner/flow-types'

export default function FreeTextTemplate({
  data,
  value,
  onChange,
  onNext,
  onBack,
}: {
  data: FreeTextNodeData
  value: string
  onChange: (value: string) => void
  onNext: () => void
  onBack: () => void
}) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-4">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-3 max-w-lg text-center font-playfair text-3xl font-bold text-parisian-grey-800 sm:text-4xl md:text-5xl"
      >
        {data.title}
      </motion.h2>
      {data.noteLabel && (
        <p className="mb-8 text-center font-montserrat text-parisian-grey-500">{data.noteLabel}</p>
      )}

      <div className="w-full max-w-xl">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value.slice(0, data.maxLength))}
          rows={4}
          placeholder={data.placeholder}
          className="w-full resize-none rounded-2xl border-2 border-parisian-beige-200 bg-white px-5 py-4 font-montserrat text-parisian-grey-800 outline-none focus:border-parisian-beige-400"
        />
        <p className="mt-2 text-right font-montserrat text-xs text-parisian-grey-400">
          {value.length}/{data.maxLength}
        </p>
      </div>

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
