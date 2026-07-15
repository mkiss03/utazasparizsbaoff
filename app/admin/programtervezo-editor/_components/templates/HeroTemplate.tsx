'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import type { HeroNodeData } from '@/lib/planner/flow-types'

export default function HeroTemplate({ data, onNext }: { data: HeroNodeData; onNext: () => void }) {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <motion.div
        animate={{ scale: [1, 1.07, 1] }}
        transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-0 -m-6"
      >
        <Image src={data.backgroundImage} alt="" fill priority sizes="100vw" quality={90} className="object-cover" />
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-t from-parisian-grey-900/85 via-parisian-grey-900/40 to-parisian-grey-900/20" />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mb-4 max-w-2xl font-playfair text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl"
        >
          {data.title}
        </motion.h1>

        {data.subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="mb-10 max-w-md font-montserrat text-white/80"
          >
            {data.subtitle}
          </motion.p>
        )}

        <motion.button
          type="button"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={onNext}
          className="rounded-full bg-parisian-beige-400 px-10 py-4 font-montserrat text-base font-semibold text-white shadow-lg transition-colors hover:bg-parisian-beige-500"
        >
          {data.ctaLabel}
        </motion.button>
      </div>
    </div>
  )
}
