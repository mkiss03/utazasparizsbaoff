'use client'

import { motion } from 'framer-motion'
import { ChevronLeft, BookOpen, ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'
import type { Bundle } from '@/lib/types/database'

interface CityData {
  city: string
  bundleCount: number
  bundles: Bundle[]
}

interface BundlesCitiesPageClientProps {
  cities: CityData[]
}

export default function BundlesCitiesPageClient({ cities }: BundlesCitiesPageClientProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    },
  }

  return (
    <div className="min-h-screen bg-parisian-cream-50 py-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <Link
            href="/#bundles"
            className="mb-6 inline-flex items-center gap-2 text-parisian-beige-500 hover:text-parisian-beige-600 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Vissza</span>
          </Link>

          <h1 className="mb-4 font-playfair text-5xl font-bold text-parisian-grey-800 md:text-6xl">
            Összes város felfedezése
          </h1>
          <p className="max-w-2xl text-lg text-parisian-grey-600">
            Kiterjesztse utazását más lenyűgöző városokra ugyanazal a tanulási modellel. Válasszon egy várost és kezdje el az új témakörök tanulását!
          </p>
        </motion.div>

        {/* Cities Grid */}
        {cities && cities.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
          >
            {cities.map((cityData) => (
              <motion.div key={cityData.city} variants={itemVariants}>
                <Link href={`/paris-flashcards`}>
                  <div className="group relative h-full overflow-hidden rounded-2xl border-2 border-parisian-beige-200 bg-white shadow-lg transition-all hover:shadow-2xl hover:border-parisian-beige-400">
                    {/* Header - Gradient Background */}
                    <div className="bg-gradient-to-r from-parisian-beige-400 to-parisian-beige-500 p-8 text-white">
                      <h3 className="font-playfair text-3xl font-bold">{cityData.city}</h3>
                      <p className="mt-2 text-sm opacity-90">Tanulási csomagok</p>
                    </div>

                    {/* Content */}
                    <div className="p-8">
                      <div className="mb-6 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-parisian-grey-700">
                          <BookOpen className="h-5 w-5 text-parisian-beige-500" />
                          <span className="font-semibold">
                            {cityData.bundleCount} téma
                          </span>
                        </div>
                        <span className="rounded-full bg-parisian-cream-50 px-3 py-1 text-sm font-medium text-parisian-grey-700">
                          {cityData.bundles.length} csomag
                        </span>
                      </div>

                      {/* Topics Preview */}
                      <div className="mb-6 space-y-2 border-t border-parisian-beige-100 pt-4">
                        <p className="text-xs font-semibold text-parisian-grey-600 uppercase">
                          Témakörök:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {cityData.bundles.slice(0, 3).map((bundle) => (
                            <span
                              key={bundle.id}
                              className="rounded-full bg-parisian-beige-100 px-3 py-1 text-xs text-parisian-grey-700"
                            >
                              {bundle.title}
                            </span>
                          ))}
                          {cityData.bundles.length > 3 && (
                            <span className="rounded-full bg-parisian-beige-100 px-3 py-1 text-xs text-parisian-grey-700">
                              +{cityData.bundles.length - 3} további
                            </span>
                          )}
                        </div>
                      </div>

                      {/* CTA Button */}
                      <div className="flex items-center justify-between rounded-lg bg-parisian-cream-50 p-4 transition-all group-hover:bg-parisian-beige-50">
                        <span className="font-semibold text-parisian-grey-700">
                          Témakörök megtekintése
                        </span>
                        <ArrowRight className="h-5 w-5 text-parisian-beige-500 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl border-2 border-dashed border-parisian-beige-300 bg-white p-12 text-center shadow-lg"
          >
            <BookOpen className="mx-auto mb-4 h-16 w-16 text-parisian-beige-300" />
            <h3 className="mb-2 font-playfair text-2xl font-bold text-parisian-grey-800">
              Városok hamarosan
            </h3>
            <p className="text-parisian-grey-600">
              A tanulási csomagok felépítés alatt vannak. Térj vissza később!
            </p>
          </motion.div>
        )}

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-20 rounded-2xl border-2 border-parisian-beige-200 bg-white p-8 text-center shadow-lg md:p-12"
        >
          <h3 className="mb-2 font-playfair text-2xl font-bold text-parisian-grey-800">
            Egy Város Pass, korlátlan hozzáférés
          </h3>
          <p className="mb-6 max-w-2xl text-parisian-grey-600">
            Egyetlen Pass vásárlásával az összes város összes tanulási csomagához hozzáférést kapsz. Tanulj a saját tempódban!
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
  )
}
