'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import type { SingleSelectNodeData } from '@/lib/planner/flow-types'
import { resolveIcon } from './icons'

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } }
const item = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }

export default function SingleSelectTemplate({
  data,
  onSelect,
  onBack,
}: {
  data: SingleSelectNodeData
  onSelect: (optionId: string) => void
  onBack: () => void
}) {
  const [selected, setSelected] = useState<string | null>(null)
  const hasDescriptions = data.options.some((o) => o.description)

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
        className={hasDescriptions ? 'flex w-full max-w-xl flex-col gap-3' : 'grid w-full max-w-xl grid-cols-2 gap-4'}
      >
        {data.options.map((option) => {
          const Icon = resolveIcon(option.icon)
          const isSelected = selected === option.id
          return (
            <motion.button
              key={option.id}
              type="button"
              variants={item}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                setSelected(option.id)
                if (data.autoAdvance) onSelect(option.id)
              }}
              className={`flex items-center gap-4 rounded-2xl border-2 px-6 py-4 text-left transition-colors ${
                isSelected
                  ? 'border-parisian-beige-400 bg-parisian-beige-50'
                  : 'border-parisian-beige-200 bg-white hover:border-parisian-beige-300'
              } ${!hasDescriptions ? 'flex-col items-center gap-3 text-center' : ''}`}
            >
              {Icon && (
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-parisian-beige-100">
                  <Icon className="h-5 w-5 text-parisian-beige-600" />
                </div>
              )}
              <div>
                <p className="font-montserrat text-base font-semibold text-parisian-grey-800">{option.label}</p>
                {option.description && (
                  <p className="font-montserrat text-sm text-parisian-grey-500">{option.description}</p>
                )}
              </div>
            </motion.button>
          )
        })}
      </motion.div>

      <div className="mt-8 flex items-center gap-6">
        <button
          type="button"
          onClick={onBack}
          className="font-montserrat text-sm font-medium text-parisian-grey-500 underline-offset-4 hover:underline"
        >
          Vissza
        </button>
        {!data.autoAdvance && (
          <motion.button
            type="button"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            disabled={!selected}
            onClick={() => selected && onSelect(selected)}
            className="rounded-full bg-parisian-beige-400 px-10 py-4 font-montserrat text-base font-semibold text-white shadow-lg transition-colors hover:bg-parisian-beige-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Tovább
          </motion.button>
        )}
      </div>
    </div>
  )
}
