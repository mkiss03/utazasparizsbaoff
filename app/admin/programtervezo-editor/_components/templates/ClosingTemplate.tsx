'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import type { ClosingNodeData } from '@/lib/planner/flow-types'
import type { ProgramItem } from '@/lib/planner/types'

const CATEGORY_LABELS: Record<string, string> = {
  muzeum: 'Múzeum',
  seta: 'Séta',
  latvanyossag: 'Látványosság',
  gasztro: 'Gasztronómia',
}

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.3 } } }
const item = { hidden: { opacity: 0, y: 30, scale: 0.95 }, show: { opacity: 1, y: 0, scale: 1 } }

export default function ClosingTemplate({
  data,
  highlights,
}: {
  data: ClosingNodeData
  highlights: ProgramItem[]
}) {
  return (
    <div className="flex h-full flex-col items-center justify-center overflow-y-auto px-4 py-16">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-3 text-center font-playfair text-3xl font-bold text-parisian-grey-800 sm:text-4xl md:text-5xl"
      >
        {data.title}
      </motion.h2>
      {data.subtitle && (
        <p className="mb-12 text-center font-montserrat text-parisian-grey-500">{data.subtitle}</p>
      )}

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="mb-14 grid w-full max-w-4xl gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {highlights.map((program) => (
          <motion.div key={program.id} variants={item} className="rounded-3xl border-2 border-parisian-beige-200 bg-white p-6 shadow-md">
            <span className="mb-3 inline-block rounded-full bg-parisian-beige-100 px-3 py-1 font-montserrat text-xs font-semibold uppercase tracking-wider text-parisian-grey-600">
              {CATEGORY_LABELS[program.category] ?? program.category}
            </span>
            <h3 className="mb-2 font-playfair text-xl font-bold text-parisian-grey-800">{program.title}</h3>
            {program.description && (
              <p className="font-montserrat text-sm leading-relaxed text-parisian-grey-600">{program.description}</p>
            )}
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex w-full max-w-xl flex-col items-center gap-5 rounded-3xl border-2 border-parisian-beige-200 bg-gradient-to-br from-white to-parisian-cream-50 p-8 text-center shadow-lg sm:flex-row sm:text-left"
      >
        <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-full border-2 border-parisian-beige-200">
          <Image src={data.curatorPhoto} alt={data.curatorName} fill sizes="80px" className="object-cover object-top" />
        </div>
        <div>
          <p className="font-montserrat text-base leading-relaxed text-parisian-grey-700">{data.curatorMessage}</p>
          <p className="mt-2 font-montserrat text-sm font-semibold text-parisian-grey-500">— {data.curatorName}</p>
        </div>
      </motion.div>
    </div>
  )
}
