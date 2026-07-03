'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import type { ProgramItem } from '@/lib/planner/types'

interface ClosingStepProps {
  name: string
  highlights: ProgramItem[]
}

// A katalógus category slugjai ASCII-ban (az engine ezekkel párosít), a
// vendégnek viszont a helyes, ékezetes magyar címkét mutatjuk.
const CATEGORY_LABELS: Record<string, string> = {
  muzeum: 'Múzeum',
  seta: 'Séta',
  latvanyossag: 'Látványosság',
  gasztro: 'Gasztronómia',
}

function categoryLabel(category: string): string {
  return CATEGORY_LABELS[category] ?? category
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.3 } },
}

const item = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1 },
}

export default function ClosingStep({ name, highlights }: ClosingStepProps) {
  const greeting = name.trim() ? `${name.trim()}, ez` : 'Ez'

  return (
    <div className="flex h-full flex-col items-center justify-center overflow-y-auto px-4 py-16">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-3 text-center font-playfair text-3xl font-bold text-parisian-grey-800 sm:text-4xl md:text-5xl"
      >
        {greeting} biztosan benne lesz…
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="mb-12 text-center font-montserrat text-parisian-grey-500"
      >
        Ízelítő a leendő párizsi programodból
      </motion.p>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="mb-14 grid w-full max-w-4xl gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {highlights.map((program) => (
          <motion.div
            key={program.id}
            variants={item}
            className="rounded-3xl border-2 border-parisian-beige-200 bg-white p-6 shadow-md"
          >
            <span className="mb-3 inline-block rounded-full bg-parisian-beige-100 px-3 py-1 font-montserrat text-xs font-semibold uppercase tracking-wider text-parisian-grey-600">
              {categoryLabel(program.category)}
            </span>
            <h3 className="mb-2 font-playfair text-xl font-bold text-parisian-grey-800">
              {program.title}
            </h3>
            {program.description && (
              <p className="font-montserrat text-sm leading-relaxed text-parisian-grey-600">
                {program.description}
              </p>
            )}
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.6 }}
        className="flex w-full max-w-xl flex-col items-center gap-5 rounded-3xl border-2 border-parisian-beige-200 bg-gradient-to-br from-white to-parisian-cream-50 p-8 text-center shadow-lg sm:flex-row sm:text-left"
      >
        <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-full border-2 border-parisian-beige-200">
          <Image
            src="/images/viktoriaprofillouvre.jpg"
            alt="Viktória"
            fill
            sizes="80px"
            className="object-cover object-top"
          />
        </div>
        <div>
          <p className="font-montserrat text-base leading-relaxed text-parisian-grey-700">
            Az elképzeléseid alapján most személyesen összeállítom a végleges programtervedet —
            24 órán belül emailben megkapod.
          </p>
          <p className="mt-2 font-montserrat text-sm font-semibold text-parisian-grey-500">
            — Viktória
          </p>
        </div>
      </motion.div>
    </div>
  )
}
