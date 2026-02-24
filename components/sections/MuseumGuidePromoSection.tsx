'use client'

import { motion } from 'framer-motion'
import { Landmark, Languages, Coins, Smartphone, Clock, ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'
import type { MuseumGuidePromoSettings } from '@/lib/types/landing-page'

interface MuseumGuidePromoSectionProps {
  pageSettings?: MuseumGuidePromoSettings
}

export default function MuseumGuidePromoSection({ pageSettings: ps }: MuseumGuidePromoSectionProps = {}) {
  const sectionBadge = ps?.sectionBadge || 'Digitalis Utikalauz'
  const sectionTitle = ps?.title || 'Louvre Digitalis Utikalauz'
  const sectionSubtitle = ps?.subtitle || 'Az egyetlen magyar nyelvu interaktiv Louvre-kalauz. Gondosan valogatott alkotasok, lenyugozo sztorik, utvonalterv — mindezt a zsebedben.'
  const promoCardTitle = ps?.promoCardTitle || 'Fedezd fel a Louvre kincseit'
  const promoCardSubtitle = ps?.promoCardSubtitle || 'Interaktiv kartyak, terkep, sztorik'
  const promoCardDescription = ps?.promoCardDescription || '12-15 gondosan valogatott alkotas, mindegyikhez lenyugozo sztori es erdekes teny. Logikus utvonal a Louvre-ban, hogy semmit ne hagyj ki.'
  const promoFeature1 = ps?.promoFeature1 || 'Interaktiv, lapozgathato kartyak'
  const promoFeature2 = ps?.promoFeature2 || 'Beepitett Louvre terkep utvonallal'
  const promoFeature3 = ps?.promoFeature3 || 'Teljes egeszeben magyarul'
  const promoCtaText = ps?.promoCtaText || 'Kiprobalom ingyen'
  const purchaseCtaText = ps?.purchaseCtaText || 'Utikalauz megvasarlasa — 4 990 Ft'
  const purchaseNote = ps?.purchaseNote || 'Egyszeri vasarlas, korlátlan hasznalat'

  const valueProps = [
    {
      icon: Languages,
      title: ps?.valueProp1Title || 'Magyar nyelven',
      description: ps?.valueProp1Description || 'Az egyetlen magyar nyelven elérhető interaktív Louvre útikalauz.',
    },
    {
      icon: Coins,
      title: ps?.valueProp2Title || 'Spórolj pénzt',
      description: ps?.valueProp2Description || 'Élő idegenvezetés 50-60€, a belépő mindössze 22€ — a digitális guide mellé.',
    },
    {
      icon: Smartphone,
      title: ps?.valueProp3Title || 'Interaktív élmény',
      description: ps?.valueProp3Description || 'Húzogatható kártyák, beépített térkép, lenyűgöző sztorik minden alkotáshoz.',
    },
    {
      icon: Clock,
      title: ps?.valueProp4Title || 'Mindig elérhető',
      description: ps?.valueProp4Description || 'Nincs időpont-egyeztetés — használd bármikor, a saját tempódban.',
    },
  ]
  return (
    <section id="museum-guide" className="relative overflow-hidden bg-gradient-to-b from-parisian-cream-50 to-white py-20 md:py-32">
      {/* Background Decoration */}
      <div className="absolute right-0 top-1/4 h-72 w-72 rounded-full bg-parisian-beige-300 opacity-10 blur-3xl" />
      <div className="absolute -left-20 bottom-0 h-80 w-80 rounded-full bg-parisian-beige-400 opacity-10 blur-3xl" />

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
            <Landmark className="h-4 w-4" />
            {sectionBadge}
          </div>
          <h2 className="mb-4 font-playfair text-4xl font-bold text-parisian-grey-800 md:text-5xl lg:text-6xl">
            {sectionTitle}
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-parisian-grey-600 md:text-xl">
            {sectionSubtitle}
          </p>
        </motion.div>

        {/* Value Proposition Cards */}
        <div className="mx-auto mb-16 grid max-w-4xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {valueProps.map((prop, index) => (
            <motion.div
              key={prop.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="rounded-xl border border-parisian-beige-100 bg-white p-6 text-center shadow-sm transition-all hover:shadow-md hover:border-parisian-beige-300"
            >
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-parisian-beige-50">
                <prop.icon className="h-6 w-6 text-parisian-beige-600" />
              </div>
              <h3 className="mb-2 font-playfair text-lg font-bold text-parisian-grey-800">
                {prop.title}
              </h3>
              <p className="text-sm leading-relaxed text-parisian-grey-500">
                {prop.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Main Promo Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mx-auto max-w-lg"
        >
          <Link href="/museum-guide">
            <div className="group relative overflow-hidden rounded-2xl border-2 border-parisian-beige-200 bg-white shadow-lg transition-all hover:shadow-2xl hover:border-parisian-beige-400">
              {/* Header with dark elegant gradient */}
              <div className="relative bg-gradient-to-r from-[#1a1a2e] to-[#2d2d44] p-8 text-center text-white">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIvPjwvc3ZnPg==')] opacity-60" />
                <div className="relative">
                  <Landmark className="mx-auto mb-3 h-8 w-8 opacity-80" />
                  <h3 className="font-playfair text-3xl font-bold">{promoCardTitle}</h3>
                  <p className="mt-2 text-sm opacity-80">{promoCardSubtitle}</p>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-5 p-8">
                <p className="text-center text-parisian-grey-600">
                  {promoCardDescription}
                </p>

                {/* Feature list */}
                <div className="space-y-3 border-y border-parisian-beige-100 py-5">
                  <div className="flex items-center gap-3">
                    <Sparkles className="h-5 w-5 flex-shrink-0 text-parisian-beige-500" />
                    <span className="text-sm text-parisian-grey-700">{promoFeature1}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Landmark className="h-5 w-5 flex-shrink-0 text-parisian-beige-500" />
                    <span className="text-sm text-parisian-grey-700">{promoFeature2}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Languages className="h-5 w-5 flex-shrink-0 text-parisian-beige-500" />
                    <span className="text-sm text-parisian-grey-700">{promoFeature3}</span>
                  </div>
                </div>

                {/* CTA Arrow */}
                <div className="flex items-center justify-between rounded-lg bg-parisian-cream-50 p-4 transition-all group-hover:bg-parisian-beige-50">
                  <span className="font-semibold text-parisian-grey-700">
                    {promoCtaText}
                  </span>
                  <ArrowRight className="h-5 w-5 text-parisian-beige-500 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Purchase CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-8 text-center"
        >
          <Link
            href="/museum-guide/purchase"
            className="inline-flex items-center gap-2 rounded-full bg-parisian-beige-400 px-8 py-3 font-semibold text-white transition-all hover:bg-parisian-beige-500 hover:shadow-lg"
          >
            <Landmark className="h-4 w-4" />
            {purchaseCtaText}
          </Link>
          <p className="mt-3 text-sm text-parisian-grey-400">
            {purchaseNote}
          </p>
        </motion.div>
      </div>
    </section>
  )
}
