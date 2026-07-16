'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, CalendarDays } from 'lucide-react'
import type { TripPlan } from '@/lib/planner/trip-plan-types'

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } }
const item = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }

export default function TemplateGallery({ templates, error }: { templates: TripPlan[]; error?: string }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-parisian-cream-50 to-parisian-beige-50">
      <div className="relative overflow-hidden bg-parisian-grey-900 py-20 text-center text-white">
        <motion.div
          initial={{ scale: 1.1, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 0.35 }}
          transition={{ duration: 1.4 }}
          className="absolute inset-0"
        >
          <Image src="/images/stock1.jpeg" alt="" fill sizes="100vw" className="object-cover" />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-parisian-grey-900 via-parisian-grey-900/70 to-parisian-grey-900/40" />

        <div className="relative z-10 mx-auto max-w-2xl px-4">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 inline-block rounded-full bg-white/15 px-5 py-2 font-montserrat text-sm font-medium backdrop-blur-sm"
          >
            Programtervező
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-4 font-playfair text-4xl font-bold sm:text-5xl"
          >
            Válaszd ki a párizsi programtervedet
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-montserrat text-white/80"
          >
            Kattints egy kártyára, és rögtön látod a napi bontást.
          </motion.p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-12">
        {error && (
          <div className="mb-8 rounded-xl border-2 border-french-red-200 bg-french-red-50 px-4 py-3 text-center font-montserrat text-sm text-french-red-600">
            {error}
          </div>
        )}

        {!error && templates.length === 0 && (
          <div className="rounded-2xl border-2 border-dashed border-parisian-beige-300 p-10 text-center">
            <p className="font-montserrat text-sm text-parisian-grey-500">
              Egyelőre nincs elérhető programterv-sablon -- nézz vissza hamarosan!
            </p>
          </div>
        )}

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
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
      </div>
    </div>
  )
}
