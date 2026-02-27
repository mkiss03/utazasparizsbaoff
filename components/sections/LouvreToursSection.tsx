'use client'

import { motion } from 'framer-motion'
import { Landmark, Clock, MapPin, Sparkles, ChevronRight, Lock, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import type { LouvreTourSectionSettings } from '@/lib/types/landing-page'

interface LouvreToursPromoProps {
  pageSettings?: LouvreTourSectionSettings
}

export default function LouvreToursSection({ pageSettings }: LouvreToursPromoProps) {
  const s = pageSettings

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
            {s?.sectionBadge || 'Interaktív Louvre Túra'}
          </span>
          <h2
            className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl"
            style={{ color: s?.titleColor || '#1F2937' }}
          >
            {s?.title || 'Louvre – Mesterművek időutazása'}
          </h2>
          <p
            className="mx-auto mt-4 max-w-2xl text-base leading-relaxed"
            style={{ color: s?.subtitleColor || '#6B7280' }}
          >
            {s?.subtitle}
          </p>
        </motion.div>

        {/* Value props */}
        <div className="mx-auto mb-16 grid max-w-4xl grid-cols-2 gap-6 sm:grid-cols-4">
          {[
            { icon: Landmark, title: s?.valueProp1Title, desc: s?.valueProp1Description },
            { icon: Clock, title: s?.valueProp2Title, desc: s?.valueProp2Description },
            { icon: MapPin, title: s?.valueProp3Title, desc: s?.valueProp3Description },
            { icon: Sparkles, title: s?.valueProp4Title, desc: s?.valueProp4Description },
          ].map((vp, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#F5EDE4]">
                <vp.icon className="h-5 w-5 text-[#B8A472]" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">{vp.title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">{vp.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Promo card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-lg"
        >
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
            {/* Card header */}
            <div
              className="px-6 py-8 text-center text-white"
              style={{
                background: `linear-gradient(135deg, ${s?.promoHeaderGradientFrom || '#1a1a2e'}, ${s?.promoHeaderGradientTo || '#2d2d44'})`,
              }}
            >
              <Landmark className="mx-auto mb-3 h-8 w-8 text-[#D4C49E]" />
              <h3 className="text-xl font-bold">{s?.promoCardTitle || 'Fedezd fel a Louvre kincseit'}</h3>
              <p className="mt-1 text-sm text-white/70">{s?.promoCardSubtitle || '10 megálló · 3 szárny · ~3 óra'}</p>
            </div>

            {/* Card body */}
            <div className="p-6">
              <p className="text-sm leading-relaxed text-slate-600">
                {s?.promoCardDescription}
              </p>

              {/* Features */}
              <div className="mt-5 space-y-2.5">
                {[s?.promoFeature1, s?.promoFeature2, s?.promoFeature3].map((f, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm text-slate-700">
                    <CheckCircle className="h-4 w-4 shrink-0 text-[#B8A472]" />
                    {f}
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div className="mt-6 space-y-3">
                <Link
                  href="/louvre-tour"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1a1a2e] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#2d2d44]"
                >
                  {s?.promoCtaText || 'Kipróbálom ingyen'}
                  <ChevronRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/louvre-tour/purchase"
                  className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-[#B8A472] bg-transparent px-6 py-3 text-sm font-semibold text-[#8B7D55] transition-colors hover:bg-[#F5EDE4]"
                >
                  {s?.purchaseCtaText || 'Túra megvásárlása – 3 990 Ft'}
                </Link>
                <p className="text-center text-xs text-slate-400">
                  {s?.purchaseNote || 'Egyszeri vásárlás, korlátlan használat'}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
