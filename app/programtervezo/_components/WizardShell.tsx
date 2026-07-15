'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { MAX_PROGRESS_WEIGHT, STEP_PROGRESS_WEIGHT, type StepKey } from './types'

export function ProgressBar({ step, isDark }: { step: StepKey; isDark: boolean }) {
  const percent = Math.min(100, (STEP_PROGRESS_WEIGHT[step] / MAX_PROGRESS_WEIGHT) * 100)

  return (
    <div
      className={`pointer-events-none fixed inset-x-0 top-0 z-30 h-1 ${
        isDark ? 'bg-white/20' : 'bg-parisian-beige-100'
      }`}
    >
      <motion.div
        animate={{ width: `${percent}%` }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`h-full ${isDark ? 'bg-white' : 'bg-parisian-beige-400'}`}
      />
    </div>
  )
}

export function WizardLogo({ isDark }: { isDark: boolean }) {
  return (
    <Link
      href="/"
      className={`fixed left-6 top-6 z-30 font-playfair text-lg font-semibold transition-opacity hover:opacity-80 ${
        isDark ? 'text-white drop-shadow-sm' : 'text-parisian-grey-800'
      }`}
    >
      Utazás Párizsba
    </Link>
  )
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
}

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
}

export { container as staggerContainer, item as staggerItem }

export const stepVariants = {
  enter: { opacity: 0, x: 40 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
}

export const stepTransition = { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const }
