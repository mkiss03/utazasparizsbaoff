'use client'

import { motion } from 'framer-motion'
import { ChevronRight, CheckCircle, Landmark } from 'lucide-react'
import Link from 'next/link'
import type { LouvreTourSectionSettings } from '@/lib/types/landing-page'
import type { LouvreTour } from '@/lib/types/database'

interface InteractiveToursPromoProps {
  tours?: LouvreTour[]
  pageSettings?: LouvreTourSectionSettings
}

export default function LouvreToursSection({ tours, pageSettings }: InteractiveToursPromoProps) {
  const s = pageSettings
  const publishedTours = tours?.filter((t) => t.status === 'published') || []

  return (
    <section id="louvre-tour" className="relative overflow-hidden bg-[#FAF7F2] py-20 sm:py-28">
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <span
            className="mb-4 inline-block rounded-full px-5 py-1.5 text-xs font-semibold tracking-wide"
            style={{
              backgroundColor: s?.sectionBadgeBgColor || '#F5EDE4',
              color: s?.sectionBadgeTextColor || '#8B7D55',
            }}
          >
            {s?.sectionBadge || 'Interaktív Túra Segédletek'}
          </span>
          <h2
            className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl"
            style={{ color: s?.titleColor || '#1F2937' }}
          >
            {s?.title || 'Fedezd fel a világ legjobb helyeit'}
          </h2>
          <p
            className="mx-auto mt-4 max-w-2xl text-base leading-relaxed"
            style={{ color: s?.subtitleColor || '#6B7280' }}
          >
            {s?.subtitle}
          </p>
        </motion.div>

        {/* Tour cards grid */}
        <div className={`mx-auto grid gap-8 ${publishedTours.length === 1 ? 'max-w-lg' : publishedTours.length === 2 ? 'max-w-3xl sm:grid-cols-2' : 'max-w-5xl sm:grid-cols-2 lg:grid-cols-3'}`}>
          {publishedTours.map((tour, i) => (
            <motion.div
              key={tour.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                {/* Card header */}
                <div
                  className="relative px-6 py-8 text-center text-white"
                  style={{
                    background: tour.cover_image_url
                      ? undefined
                      : `linear-gradient(135deg, ${s?.promoHeaderGradientFrom || '#1a1a2e'}, ${s?.promoHeaderGradientTo || '#2d2d44'})`,
                  }}
                >
                  {tour.cover_image_url && (
                    <>
                      <img src={tour.cover_image_url} alt="" className="absolute inset-0 h-full w-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/80" />
                    </>
                  )}
                  <div className="relative">
                    <Landmark className="mx-auto mb-3 h-8 w-8 text-[#D4C49E]" />
                    <h3 className="text-xl font-bold">{tour.title}</h3>
                    <p className="mt-1 text-sm text-white/70">{tour.duration_text}</p>
                  </div>
                </div>

                {/* Card body */}
                <div className="flex flex-1 flex-col p-6">
                  {tour.subtitle && (
                    <p className="text-sm leading-relaxed text-slate-600">{tour.subtitle}</p>
                  )}

                  {/* Price */}
                  {tour.price_huf && (
                    <div className="mt-4 flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-slate-800">
                        {tour.price_huf.toLocaleString('hu-HU')} Ft
                      </span>
                      {tour.price_eur && (
                        <span className="text-sm text-slate-400">~{tour.price_eur} EUR</span>
                      )}
                    </div>
                  )}

                  {/* Features */}
                  <div className="mt-4 space-y-2">
                    {[
                      'Interaktív, lépésről lépésre vezetés',
                      'Részletes sztorik és érdekességek',
                      'Saját tempóban, korlátlan használat',
                    ].map((f, j) => (
                      <div key={j} className="flex items-center gap-2.5 text-sm text-slate-700">
                        <CheckCircle className="h-4 w-4 shrink-0 text-[#B8A472]" />
                        {f}
                      </div>
                    ))}
                  </div>

                  {/* CTAs */}
                  <div className="mt-auto space-y-3 pt-6">
                    <Link
                      href={`/louvre-tour?slug=${tour.slug}`}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1a1a2e] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#2d2d44]"
                    >
                      Kipróbálom ingyen
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                    <Link
                      href={`/louvre-tour/purchase?slug=${tour.slug}`}
                      className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-[#B8A472] bg-transparent px-6 py-3 text-sm font-semibold text-[#8B7D55] transition-colors hover:bg-[#F5EDE4]"
                    >
                      Megvásárlás{tour.price_huf ? ` – ${tour.price_huf.toLocaleString('hu-HU')} Ft` : ''}
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Fallback if no tours */}
        {publishedTours.length === 0 && (
          <p className="text-center text-sm text-slate-400">Hamarosan érkeznek az interaktív túrák!</p>
        )}
      </div>
    </section>
  )
}
