'use client'

import { motion } from 'framer-motion'
import { BadgeCheck } from 'lucide-react'

/**
 * Halk, végigkísérő bizalom-motívum: emlékezteti a vendéget, hogy a végén
 * nem egy gép, hanem Viktória nézi át személyesen a tervet. Szándékosan
 * visszafogott -- nem jelvény-gyűjtögetés, csak egy csendes ígéret.
 */
export default function CuratorBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="fixed bottom-6 right-6 z-30 flex items-center gap-2 rounded-full border border-parisian-beige-200 bg-white/90 px-4 py-2 shadow-sm backdrop-blur-sm"
    >
      <motion.div
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        <BadgeCheck className="h-4 w-4 text-parisian-beige-600" />
      </motion.div>
      <span className="font-montserrat text-xs font-medium text-parisian-grey-600">
        Viktória személyesen átnézi a tervedet
      </span>
    </motion.div>
  )
}
