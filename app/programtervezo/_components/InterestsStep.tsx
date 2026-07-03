'use client'

import { motion } from 'framer-motion'
import { Camera, Check, Coffee, Heart, Landmark, Palette, TreePine, UtensilsCrossed } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface InterestsStepProps {
  selected: string[]
  onToggle: (interest: string) => void
  onNext: () => void
  onBack: () => void
}

const INTERESTS: { value: string; label: string; icon: LucideIcon }[] = [
  { value: 'muveszet', label: 'Művészet', icon: Palette },
  { value: 'gasztro', label: 'Gasztronómia', icon: UtensilsCrossed },
  { value: 'kultura', label: 'Kultúra és történelem', icon: Landmark },
  { value: 'kilatas', label: 'Panoráma és kilátás', icon: Camera },
  { value: 'termeszet', label: 'Parkok, természet', icon: TreePine },
  { value: 'romantikus', label: 'Romantikus helyszínek', icon: Heart },
  { value: 'kave', label: 'Kávéházi hangulat', icon: Coffee },
]

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
}

const item = {
  hidden: { opacity: 0, scale: 0.85 },
  show: { opacity: 1, scale: 1 },
}

export default function InterestsStep({ selected, onToggle, onNext, onBack }: InterestsStepProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-4">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-3 text-center font-playfair text-3xl font-bold text-parisian-grey-800 sm:text-4xl md:text-5xl"
      >
        Mi érdekel?
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mb-10 text-center font-montserrat text-parisian-grey-500"
      >
        Válassz annyit, amennyi igaz rád
      </motion.p>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="flex max-w-2xl flex-wrap justify-center gap-3"
      >
        {INTERESTS.map(({ value, label, icon: Icon }) => {
          const isSelected = selected.includes(value)
          return (
            <motion.button
              key={value}
              type="button"
              variants={item}
              layout
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => onToggle(value)}
              className={`flex items-center gap-2 rounded-full border-2 px-5 py-3 font-montserrat text-sm font-medium transition-colors ${
                isSelected
                  ? 'border-parisian-beige-400 bg-parisian-beige-400 text-white'
                  : 'border-parisian-beige-200 bg-white text-parisian-grey-700 hover:border-parisian-beige-300'
              }`}
            >
              {isSelected ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
              {label}
            </motion.button>
          )
        })}
      </motion.div>

      <div className="mt-12 flex items-center gap-6">
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
          disabled={selected.length === 0}
          onClick={onNext}
          className="rounded-full bg-parisian-beige-400 px-10 py-4 font-montserrat text-base font-semibold text-white shadow-lg transition-colors hover:bg-parisian-beige-500 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Tovább
        </motion.button>
      </div>
    </div>
  )
}
