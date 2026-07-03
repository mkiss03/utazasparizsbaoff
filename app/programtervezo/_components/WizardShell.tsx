'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

const TOTAL_STEPS = 6

export function ProgressDots({ step, isDark }: { step: number; isDark: boolean }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-6 z-30 flex justify-center gap-2">
      {Array.from({ length: TOTAL_STEPS }).map((_, index) => (
        <motion.div
          key={index}
          animate={{
            width: index === step ? 28 : 8,
            opacity: index <= step ? 1 : 0.35,
          }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className={`h-2 rounded-full shadow-sm ${isDark ? 'bg-white' : 'bg-parisian-beige-500'}`}
        />
      ))}
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

export const stepVariants = {
  enter: { opacity: 0, x: 40 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
}

export const stepTransition = { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const }
