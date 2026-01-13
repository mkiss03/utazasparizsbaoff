'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { DiscoverItem } from '@/lib/types/database'

interface DiscoverSectionProps {
  items?: DiscoverItem[]
}

export default function DiscoverSection({ items = [] }: DiscoverSectionProps) {
  if (!items || items.length === 0) return null

  // Take first 6 items for the Bento Grid
  const displayItems = items.slice(0, 6)

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <section className="relative overflow-hidden bg-white py-20 md:py-32">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="mb-4 font-playfair text-4xl font-bold text-parisian-grey-800 md:text-5xl lg:text-6xl">
            Fedezze Fel Párizzsal
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-parisian-grey-600">
            Merüljön el a fények városának varázslatos világában - a gasztronómiától a művészetig
          </p>
        </motion.div>

        {/* Bento Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {displayItems.map((discoverItem, index) => {
            // Make first item span 2 columns on large screens for visual interest
            const isLarge = index === 0
            const gridClass = isLarge ? 'lg:col-span-2 lg:row-span-2' : ''

            return (
              <motion.div
                key={discoverItem.id}
                variants={item}
                className={`group relative overflow-hidden rounded-3xl border-2 border-parisian-beige-200 bg-white shadow-lg transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:border-parisian-beige-300 ${gridClass}`}
              >
                <Link
                  href={discoverItem.link_url || '/discover'}
                  className="block h-full"
                >
                  {/* Image */}
                  <div className={`relative w-full overflow-hidden ${isLarge ? 'h-96' : 'h-64'}`}>
                    {discoverItem.image_url ? (
                      <Image
                        src={discoverItem.image_url}
                        alt={discoverItem.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-parisian-beige-100 to-parisian-beige-200">
                        <span className="text-4xl">📍</span>
                      </div>
                    )}
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-parisian-grey-900/90 via-parisian-grey-900/50 to-transparent opacity-90 transition-opacity group-hover:opacity-100" />
                  </div>

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    {/* Category Badge */}
                    {discoverItem.category && (
                      <span className="mb-3 inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
                        {discoverItem.category}
                      </span>
                    )}

                    {/* Title */}
                    <h3 className={`mb-2 font-playfair font-bold ${isLarge ? 'text-3xl md:text-4xl' : 'text-2xl'}`}>
                      {discoverItem.title}
                    </h3>

                    {/* Description */}
                    {discoverItem.description && (
                      <p className={`mb-4 leading-relaxed text-white/90 ${isLarge ? 'text-base' : 'text-sm'}`}>
                        {discoverItem.description}
                      </p>
                    )}

                    {/* Arrow Icon */}
                    <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider">
                      <span>Tudj meg többet</span>
                      <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-2" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </motion.div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <Link
            href="/discover"
            className="inline-flex items-center gap-2 rounded-full border-2 border-parisian-beige-400 px-8 py-4 font-semibold text-parisian-grey-700 transition-all hover:bg-parisian-beige-400 hover:text-white"
          >
            <span>Minden Felfedezés</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="pointer-events-none absolute right-0 top-0 h-96 w-96 rounded-full bg-parisian-beige-200 opacity-20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-96 w-96 rounded-full bg-parisian-beige-300 opacity-20 blur-3xl" />
    </section>
  )
}
