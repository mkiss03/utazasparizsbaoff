'use client'

import { motion } from 'framer-motion'
import { Sparkles, BookOpen, ArrowRight, Lock } from 'lucide-react'
import Link from 'next/link'
import type { FlashcardsPromoSettings } from '@/lib/types/landing-page'

interface ParisFlashcardsPromoSectionProps {
  pageSettings?: FlashcardsPromoSettings
}

export default function ParisFlashcardsPromoSection({ pageSettings: ps }: ParisFlashcardsPromoSectionProps = {}) {
  const sectionBadge = ps?.sectionBadge || 'Párizs Tematikus Csomagok'
  const title = ps?.title || 'Város Útmutató Flashcardok'
  const subtitle = ps?.subtitle || 'Sajátítsd el Párizst az interaktív flashcard csomagjainkkal. Tanulj helyi kifejezéseket, metrótérképeket, kulturális tippeket és még sok mást!'
  const cardTitle = ps?.cardTitle || 'Párizs'
  const cardSubtitle = ps?.cardSubtitle || 'Nyelvtanulási csomag'
  const cardDescription = ps?.cardDescription || 'Felfedezd az összes Párizs-specifikus tanulási témakört. Demo kártyákat megtekinthetsz ingyenesen, az összes többi után pedig szükséges egy Város Pass.'
  const feature1 = ps?.feature1 || 'Több témakör'
  const feature2 = ps?.feature2 || 'Demo kártyák mindenki számára'
  const feature3 = ps?.feature3 || 'Pass után teljes hozzáférés'
  const ctaText = ps?.ctaText || 'Témakörök megtekintése'
  const bottomTitle = ps?.bottomTitle || 'Más városok érdekelnek?'
  const bottomDescription = ps?.bottomDescription || 'Fedezd fel a tanulási csomagokat más nagyvárosok számára is.'
  const bottomCtaText = ps?.bottomCtaText || 'Összes város megtekintése'
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
            {sectionBadge}
          </div>
          <h2 className="mb-4 font-playfair text-4xl font-bold text-parisian-grey-800 md:text-5xl lg:text-6xl">
            {title}
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-parisian-grey-600 md:text-xl">
            {subtitle}
          </p>
        </motion.div>

        {/* Paris Bundle Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mx-auto max-w-md"
        >
          <Link href="/paris-flashcards">
            <div className="group relative overflow-hidden rounded-2xl border-2 border-parisian-beige-200 bg-white shadow-lg transition-all hover:shadow-2xl hover:border-parisian-beige-400">
              {/* Header */}
              <div className="bg-gradient-to-r from-parisian-beige-400 to-parisian-beige-500 p-8 text-center text-white">
                <h3 className="font-playfair text-3xl font-bold">{cardTitle}</h3>
                <p className="mt-2 text-sm opacity-90">{cardSubtitle}</p>
              </div>

              {/* Content */}
              <div className="space-y-6 p-8">
                <p className="text-center text-parisian-grey-600">
                  {cardDescription}
                </p>

                {/* Features */}
                <div className="space-y-3 border-y border-parisian-beige-100 py-6">
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-5 w-5 flex-shrink-0 text-parisian-beige-500" />
                    <span className="text-sm text-parisian-grey-700">{feature1}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Lock className="h-5 w-5 flex-shrink-0 text-parisian-beige-500" />
                    <span className="text-sm text-parisian-grey-700">{feature2}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Sparkles className="h-5 w-5 flex-shrink-0 text-parisian-beige-500" />
                    <span className="text-sm text-parisian-grey-700">{feature3}</span>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="flex items-center justify-between rounded-lg bg-parisian-cream-50 p-4 transition-all group-hover:bg-parisian-beige-50">
                  <span className="font-semibold text-parisian-grey-700">
                    {ctaText}
                  </span>
                  <ArrowRight className="h-5 w-5 text-parisian-beige-500 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Other Cities CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-16 rounded-2xl border-2 border-parisian-beige-200 bg-white p-8 text-center shadow-lg md:p-12"
        >
          <h3 className="mb-2 font-playfair text-2xl font-bold text-parisian-grey-800">
            {bottomTitle}
          </h3>
          <p className="mb-6 text-parisian-grey-600">
            {bottomDescription}
          </p>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 rounded-full bg-parisian-beige-400 px-8 py-3 font-semibold text-white transition-all hover:bg-parisian-beige-500"
          >
            <Sparkles className="h-4 w-4" />
            {bottomCtaText}
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
