'use client'

import { motion } from 'framer-motion'

interface ProgressDotsProps {
  current: number
  total: number
}

export default function ProgressDots({ current, total }: ProgressDotsProps) {
  const step = Math.min(current, total - 1)

  return (
    <div className="flex items-center gap-3">
      <div className="flex flex-1 gap-1.5">
        {Array.from({ length: total }).map((_, index) => (
          <div key={index} className="h-1.5 flex-1 overflow-hidden rounded-full bg-parisian-beige-100">
            <motion.div
              className="h-full rounded-full bg-parisian-beige-400"
              initial={false}
              animate={{ width: index < step ? '100%' : index === step ? '100%' : '0%' }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>
        ))}
      </div>
      <motion.span
        key={step}
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-shrink-0 font-montserrat text-xs font-medium text-parisian-grey-400"
      >
        {step + 1} / {total}
      </motion.span>
    </div>
  )
}
