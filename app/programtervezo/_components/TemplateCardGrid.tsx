'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, CalendarDays } from 'lucide-react'
import type { TripPlan } from '@/lib/planner/trip-plan-types'

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } }
const item = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }

export default function TemplateCardGrid({ templates }: { templates: TripPlan[] }) {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {templates.map((template) => (
        <motion.div key={template.id} variants={item}>
          <Link
            href={`/programterv/${template.shareToken}`}
            className="group flex h-full flex-col overflow-hidden rounded-3xl border-2 border-parisian-beige-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:border-parisian-beige-400 hover:shadow-lg"
          >
            <div className="relative h-44 w-full overflow-hidden bg-parisian-beige-100">
              <Image
                src={template.templateImage || '/images/stock1.jpeg'}
                alt={template.templateTitle || 'Programterv'}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-1 flex-col p-6">
              <h2 className="mb-2 font-playfair text-xl font-bold text-parisian-grey-800">
                {template.templateTitle || 'Programterv'}
              </h2>
              {template.templateTeaser && (
                <p className="mb-4 flex-1 font-montserrat text-sm leading-relaxed text-parisian-grey-500">
                  {template.templateTeaser}
                </p>
              )}
              <div className="mt-auto flex items-center justify-between">
                {template.dateRangeLabel && (
                  <span className="flex items-center gap-1.5 font-montserrat text-xs font-medium text-parisian-grey-400">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {template.dateRangeLabel}
                  </span>
                )}
                <span className="ml-auto flex items-center gap-1 font-montserrat text-sm font-semibold text-parisian-beige-600">
                  Megnézem
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  )
}
