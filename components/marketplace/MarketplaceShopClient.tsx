'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { BookOpen, Clock, MapPin, Layers, ShoppingCart } from 'lucide-react'
import type { Bundle } from '@/lib/types/database'

interface MarketplaceShopClientProps {
  bundles: Bundle[]
  cityPricing?: unknown[]
  initialCity?: string
}

const difficultyLabels: Record<string, string> = {
  beginner: 'Kezdő',
  intermediate: 'Közép',
  advanced: 'Haladó',
}

export default function MarketplaceShopClient({ bundles, initialCity }: MarketplaceShopClientProps) {
  const filtered = initialCity
    ? bundles.filter((b) => b.city.toLowerCase() === initialCity.toLowerCase())
    : bundles

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  }
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 text-center"
      >
        <h1 className="text-4xl font-bold text-slate-900 sm:text-5xl">
          {initialCity ? `${initialCity} kártyacsomagok` : 'Kártyacsomagok'}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
          Fedezd fel a városfelfedező flashcard csomagokat! Vásárolj meg egy csomagot és tanulj saját tempódban.
        </p>
      </motion.div>

      {/* Bundle Grid */}
      {filtered.length > 0 ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filtered.map((bundle) => (
            <motion.div key={bundle.id} variants={itemVariants}>
              <Link href={`/bundles/${bundle.slug}`}>
                <div className="group h-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-xl hover:border-slate-300">
                  {/* Cover Image */}
                  <div className="relative h-52 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
                    {bundle.cover_image ? (
                      <Image
                        src={bundle.cover_image}
                        alt={bundle.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <BookOpen className="h-16 w-16 text-slate-300" />
                      </div>
                    )}
                    {/* City badge */}
                    <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-sm font-semibold text-slate-700 backdrop-blur-sm shadow-sm">
                      <MapPin className="h-4 w-4" />
                      {bundle.city}
                    </div>
                    {bundle.difficulty_level && (
                      <div className="absolute right-4 top-4">
                        <span className="rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-slate-600 backdrop-blur-sm shadow-sm">
                          {difficultyLabels[bundle.difficulty_level] || bundle.difficulty_level}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="mb-2 text-xl font-bold text-slate-800 group-hover:text-french-blue-500 transition-colors">
                      {bundle.title}
                    </h3>
                    {bundle.short_description && (
                      <p className="mb-4 line-clamp-2 text-sm text-slate-500">
                        {bundle.short_description}
                      </p>
                    )}

                    {/* Stats */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                      {(bundle.total_cards ?? 0) > 0 && (
                        <span className="inline-flex items-center gap-1.5">
                          <Layers className="h-4 w-4" />
                          {bundle.total_cards} kártya
                        </span>
                      )}
                      {(bundle.estimated_time_minutes ?? 0) > 0 && (
                        <span className="inline-flex items-center gap-1.5">
                          <Clock className="h-4 w-4" />
                          ~{bundle.estimated_time_minutes} perc
                        </span>
                      )}
                    </div>

                    {/* Price + CTA */}
                    <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-5">
                      <span className="text-xl font-bold text-slate-900">
                        {(bundle.price ?? 0) === 0 ? (
                          <span className="text-green-600">Ingyenes</span>
                        ) : (
                          `${bundle.price} €`
                        )}
                      </span>
                      <span className="inline-flex items-center gap-2 rounded-full bg-french-blue-500 px-4 py-2 text-sm font-semibold text-white transition-all group-hover:bg-french-blue-600">
                        <ShoppingCart className="h-4 w-4" />
                        Megnézem
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mx-auto max-w-md rounded-2xl border-2 border-dashed border-slate-300 bg-white p-12 text-center"
        >
          <BookOpen className="mx-auto mb-4 h-12 w-12 text-slate-300" />
          <h3 className="mb-2 text-lg font-bold text-slate-700">
            {initialCity ? `Még nincs ${initialCity} csomag` : 'Hamarosan érkeznek a csomagok'}
          </h3>
          <p className="text-sm text-slate-500">
            A kártyacsomagok feltöltés alatt vannak. Nézz vissza később!
          </p>
          {initialCity && (
            <Link
              href="/marketplace"
              className="mt-4 inline-block rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
            >
              Összes csomag megtekintése
            </Link>
          )}
        </motion.div>
      )}
    </div>
  )
}
