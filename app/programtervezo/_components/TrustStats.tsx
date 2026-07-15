'use client'

import { motion } from 'framer-motion'

const STATS = [
  { value: '10+', label: 'év Párizsban' },
  { value: '1000+', label: 'elégedett vendég' },
  { value: '⭐', label: 'Licencelt idegenvezetés' },
]

export default function TrustStats() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.9 }}
      className="mt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-10"
    >
      {STATS.map((stat) => (
        <div key={stat.label} className="text-center">
          <p className="font-playfair text-2xl font-bold text-parisian-beige-600">{stat.value}</p>
          <p className="font-montserrat text-xs text-parisian-grey-500">{stat.label}</p>
        </div>
      ))}
    </motion.div>
  )
}
