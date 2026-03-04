'use client'

import { motion } from 'framer-motion'
import { Sparkles, BookOpen, ArrowRight, Lock, Clock } from 'lucide-react'
import Link from 'next/link'
import type { Bundle } from '@/lib/types/database'

interface ParisTopicsSectionProps {
  bundles?: Bundle[]
}

export default function ParisFlashcardsSection({ bundles = [] }: ParisTopicsSectionProps) {
  // Show placeholder if no bundles available
  if (!bundles || bundles.length === 0) {
    return (
      <section className="relative overflow-hidden bg-gradient-to-b from-white to-parisian-cream-50 py-20 md:py-32">
        <div className="absolute left-0 top-1/4 h-64 w-64 rounded-full bg-parisian-beige-300 opacity-10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-parisian-beige-400 opacity-10 blur-3xl" />

        <div className="container relative z-10 mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-parisian-beige-100 px-4 py-2 text-sm font-semibold text-parisian-grey-700">
              <Sparkles className="h-4 w-4" />
              Párizs Témakörök
            </div>
            <h2 className="mb-4 font-playfair text-4xl font-bold text-parisian-grey-800 md:text-5xl lg:text-6xl">
              Tanulási Csomagok
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-parisian-grey-600 md:text-xl">
              Szervezett témakörök franciául. Interaktív flashcard-okkal tanuld meg az összes szükséges kifejezéseket.
            </p>
          </motion.div>

          <div className="mx-auto max-w-3xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="rounded-3xl border-2 border-dashed border-parisian-beige-300 bg-white p-12 text-center shadow-lg"
            >
              <BookOpen className="mx-auto mb-4 h-16 w-16 text-parisian-beige-300" />
              <h3 className="mb-2 font-playfair text-2xl font-bold text-parisian-grey-800">
                Témakörök hamarosan
              </h3>
              <p className="mb-8 text-parisian-grey-600">
                A Párizs tanulási témakörök felépítés alatt vannak. Vásároljon egy heti hozzáférést, hogy mikor élő lesz, azonnal használhatja!
              </p>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 rounded-full bg-parisian-beige-400 px-8 py-3 font-semibold text-white transition-all hover:bg-parisian-beige-500"
              >
                <Sparkles className="h-4 w-4" />
                Városbérletek megtekintése
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    )
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  } as const

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    },
  } as const

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-parisian-cream-50 py-20 md:py-32">
      {/* Background Decoration */}
      <div className="absolute left-0 top-1/4 h-64 w-64 rounded-full bg-parisian-beige-300 opacity-10 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-parisian-beige-400 opacity-10 blur-3xl" />

      <div className="container relative z-10 mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-parisian-beige-100 px-4 py-2 text-sm font-semibold text-parisian-grey-700">
            <Sparkles className="h-4 w-4" />
            Párizs Nyelvtanulás
          </div>
          <h2 className="mb-4 font-playfair text-4xl font-bold text-parisian-grey-800 md:text-5xl lg:text-6xl">
            Tanulási Témakörök
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-parisian-grey-600 md:text-xl">
            Válassz egy témakört és kezdd el tanulni a franciát interaktív flashcard-okkal.
          </p>
        </motion.div>

        {/* Topics Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {bundles.map((bundle) => (
            <motion.div key={bundle.id} variants={itemVariants}>
              <Link href={`/bundles/${bundle.slug}`}>
                <div className="group relative h-full overflow-hidden rounded-2xl border-2 border-parisian-beige-200 bg-white shadow-lg transition-all hover:shadow-2xl hover:border-parisian-beige-400">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-parisian-beige-400 to-parisian-beige-500 p-6 text-white">
                    <h3 className="font-playfair text-2xl font-bold">{bundle.title}</h3>
                    {bundle.difficulty_level && (
                      <p className="mt-2 text-sm opacity-90">
                        {bundle.difficulty_level === 'beginner' && '🟢 Kezdő'}
                        {bundle.difficulty_level === 'intermediate' && '🟡 Közép'}
                        {bundle.difficulty_level === 'advanced' && '🔴 Haladó'}
                      </p>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <p className="mb-6 line-clamp-3 text-sm text-parisian-grey-600">
                      {bundle.short_description || bundle.description || 'Tanulási csomag'}
                    </p>

                    {/* Stats */}
                    <div className="mb-6 space-y-2 border-t border-parisian-beige-100 pt-4">
                      {bundle.total_cards && (
                        <div className="flex items-center gap-2 text-sm text-parisian-grey-700">
                          <BookOpen className="h-4 w-4 text-parisian-beige-500" />
                          <span>{bundle.total_cards} kártya</span>
                        </div>
                      )}
                      {bundle.estimated_time_minutes && (
                        <div className="flex items-center gap-2 text-sm text-parisian-grey-700">
                          <Clock className="h-4 w-4 text-parisian-beige-500" />
                          <span>~{bundle.estimated_time_minutes} perc</span>
                        </div>
                      )}
                    </div>

                    {/* CTA Button */}
                    <div className="flex items-center justify-between rounded-lg bg-parisian-cream-50 p-3 transition-all group-hover:bg-parisian-beige-50">
                      <span className="text-sm font-semibold text-parisian-grey-700">
                        Megnyitás
                      </span>
                      <ArrowRight className="h-4 w-4 text-parisian-beige-500 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-16 rounded-2xl border-2 border-parisian-beige-200 bg-white p-8 text-center shadow-lg md:p-12"
        >
          <Lock className="mx-auto mb-4 h-8 w-8 text-parisian-beige-500" />
          <h3 className="mb-2 font-playfair text-2xl font-bold text-parisian-grey-800">
            Hozzáférés szükséges
          </h3>
          <p className="mb-6 text-parisian-grey-600">
            Ezek a tanulási csomagok csak az aktív városbérlet tulajdonosok számára érhetők el.
          </p>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 rounded-full bg-parisian-beige-400 px-8 py-3 font-semibold text-white transition-all hover:bg-parisian-beige-500"
          >
            <Sparkles className="h-4 w-4" />
            Szerezzen hozzáférést most
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
