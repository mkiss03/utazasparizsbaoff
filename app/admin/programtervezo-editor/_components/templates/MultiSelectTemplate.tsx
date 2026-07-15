'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { useState } from 'react'
import type { MultiSelectNodeData } from '@/lib/planner/flow-types'

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } }
const item = { hidden: { opacity: 0, scale: 0.85 }, show: { opacity: 1, scale: 1 } }

export default function MultiSelectTemplate({
  data,
  onSubmit,
  onBack,
}: {
  data: MultiSelectNodeData
  onSubmit: (selected: string[]) => void
  onBack: () => void
}) {
  const [selected, setSelected] = useState<string[]>([])

  function toggle(optionId: string) {
    setSelected((current) =>
      current.includes(optionId) ? current.filter((o) => o !== optionId) : [...current, optionId]
    )
  }

  const canContinue = selected.length >= data.minSelected

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
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-10 text-center font-montserrat text-parisian-grey-500"
        >
          {data.subtitle}
        </motion.p>
      )}

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="flex max-w-xl flex-wrap justify-center gap-3"
      >
        {data.options.map((option) => {
          const isSelected = selected.includes(option.id)
          return (
            <motion.button
              key={option.id}
              type="button"
              variants={item}
              layout
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => toggle(option.id)}
              className={`flex items-center gap-2 rounded-full border-2 px-5 py-3 font-montserrat text-sm font-medium transition-colors ${
                isSelected
                  ? 'border-parisian-beige-400 bg-parisian-beige-400 text-white'
                  : 'border-parisian-beige-200 bg-white text-parisian-grey-700 hover:border-parisian-beige-300'
              }`}
            >
              {isSelected && <Check className="h-4 w-4" />}
              {option.label}
            </motion.button>
          )
        })}
      </motion.div>

      <div className="mt-10 flex items-center gap-6">
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
          disabled={!canContinue}
          onClick={() => onSubmit(selected)}
          className="rounded-full bg-parisian-beige-400 px-10 py-4 font-montserrat text-base font-semibold text-white shadow-lg transition-colors hover:bg-parisian-beige-500 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {selected.length > 0 || data.minSelected > 0 ? 'Tovább' : 'Kihagyom'}
        </motion.button>
      </div>
    </div>
  )
}
