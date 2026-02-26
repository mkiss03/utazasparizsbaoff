'use client'

import { motion } from 'framer-motion'
import { Clock, MapPin, Landmark, Palette, Lightbulb, ChevronRight } from 'lucide-react'
import type { LouvreTour, LouvreTourStop } from '@/lib/types/database'
import type { LouvreTourSectionSettings } from '@/lib/types/landing-page'

interface LouvreToursProps {
  tours?: LouvreTour[]
  stops?: LouvreTourStop[]
  pageSettings?: LouvreTourSectionSettings
}

const wingColors: Record<string, string> = {
  'Sully-szárny': 'from-amber-500 to-amber-600',
  'Denon-szárny': 'from-rose-500 to-rose-600',
  'Richelieu-szárny': 'from-sky-500 to-sky-600',
}

const wingEmoji: Record<string, string> = {
  'Sully-szárny': 'S',
  'Denon-szárny': 'D',
  'Richelieu-szárny': 'R',
}

export default function LouvreToursSection({ tours, stops, pageSettings }: LouvreToursProps) {
  const publishedTours = tours?.filter((t) => t.status === 'published') || []
  if (publishedTours.length === 0) return null

  const tour = publishedTours[0]
  const tourStops = stops?.filter((s) => s.tour_id === tour.id).sort((a, b) => a.display_order - b.display_order) || []
  const totalMinutes = tourStops.reduce((sum, s) => sum + s.duration_minutes, 0)

  const accentColor = pageSettings?.accentColor || '#7C3AED'
  const timelineColor = pageSettings?.timelineColor || '#7C3AED'

  return (
    <section id="louvre-tour" className="relative overflow-hidden bg-white py-20 sm:py-28">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full opacity-[0.03]" style={{ background: accentColor }} />
        <div className="absolute -left-32 bottom-0 h-96 w-96 rounded-full opacity-[0.03]" style={{ background: accentColor }} />
      </div>

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
              backgroundColor: pageSettings?.sectionBadgeBgColor || '#EDE9FE',
              color: pageSettings?.sectionBadgeTextColor || '#7C3AED',
            }}
          >
            {pageSettings?.sectionBadge || 'Múzeumi Túra'}
          </span>
          <h2
            className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl"
            style={{ color: pageSettings?.titleColor || '#1F2937' }}
          >
            {tour.title}
          </h2>
          <p
            className="mx-auto mt-4 max-w-2xl text-base leading-relaxed"
            style={{ color: pageSettings?.subtitleColor || '#6B7280' }}
          >
            {tour.subtitle || pageSettings?.subtitle}
          </p>

          {/* Tour stats */}
          <div className="mx-auto mt-8 flex max-w-md items-center justify-center gap-6">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: `${accentColor}15` }}>
                <Clock className="h-4 w-4" style={{ color: accentColor }} />
              </div>
              <span>~{Math.round(totalMinutes / 60)} óra</span>
            </div>
            <div className="h-5 w-px bg-slate-200" />
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: `${accentColor}15` }}>
                <MapPin className="h-4 w-4" style={{ color: accentColor }} />
              </div>
              <span>{tourStops.length} megálló</span>
            </div>
            <div className="h-5 w-px bg-slate-200" />
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: `${accentColor}15` }}>
                <Landmark className="h-4 w-4" style={{ color: accentColor }} />
              </div>
              <span>3 szárny</span>
            </div>
          </div>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line (desktop) */}
          <div
            className="absolute left-1/2 top-0 hidden h-full w-0.5 -translate-x-1/2 md:block"
            style={{ backgroundColor: `${timelineColor}20` }}
          />
          {/* Vertical line (mobile) */}
          <div
            className="absolute left-6 top-0 h-full w-0.5 md:hidden"
            style={{ backgroundColor: `${timelineColor}20` }}
          />

          <div className="space-y-8 md:space-y-12">
            {tourStops.map((stop, index) => {
              const isLeft = index % 2 === 0
              const wingGradient = wingColors[stop.location_wing] || 'from-slate-500 to-slate-600'

              return (
                <motion.div
                  key={stop.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ delay: index * 0.05 }}
                  className={`relative flex items-start gap-4 md:gap-0 ${
                    isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Timeline dot (mobile) */}
                  <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center md:hidden">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white shadow-lg"
                      style={{ backgroundColor: timelineColor }}
                    >
                      {stop.stop_number}
                    </div>
                  </div>

                  {/* Card side */}
                  <div className={`flex-1 md:w-[calc(50%-2rem)] ${isLeft ? 'md:pr-12' : 'md:pl-12'}`}>
                    <div
                      className="group rounded-2xl border border-slate-100 p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:border-slate-200"
                      style={{ backgroundColor: pageSettings?.cardBgColor || '#FFFFFF' }}
                    >
                      {/* Wing badge + duration */}
                      <div className="mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className={`flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br ${wingGradient} text-[10px] font-bold text-white`}
                          >
                            {wingEmoji[stop.location_wing] || '?'}
                          </span>
                          <span
                            className="rounded-md px-2 py-0.5 text-[11px] font-medium"
                            style={{
                              backgroundColor: pageSettings?.wingBadgeBgColor || '#F3F4F6',
                              color: pageSettings?.wingBadgeTextColor || '#4B5563',
                            }}
                          >
                            {stop.location_wing}
                          </span>
                        </div>
                        <span className="flex items-center gap-1 text-xs text-slate-400">
                          <Clock className="h-3 w-3" />
                          {stop.duration_minutes} perc
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-base font-bold text-slate-800">{stop.title}</h3>

                      {/* Location */}
                      <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                        <MapPin className="h-3 w-3" />
                        {stop.location_floor} · {stop.location_rooms}
                      </p>

                      {/* Main artwork */}
                      {stop.main_artwork && (
                        <div className="mt-3 flex items-start gap-2 rounded-lg p-2.5" style={{ backgroundColor: `${accentColor}08` }}>
                          <Palette className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: accentColor }} />
                          <p className="text-xs font-semibold" style={{ color: accentColor }}>
                            {stop.main_artwork}
                          </p>
                        </div>
                      )}

                      {/* Description */}
                      <div className="mt-3 flex items-start gap-2">
                        <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
                        <p className="text-xs leading-relaxed text-slate-600">{stop.description}</p>
                      </div>
                    </div>
                  </div>

                  {/* Center dot (desktop) */}
                  <div className="relative z-10 hidden shrink-0 md:flex md:w-16 md:items-center md:justify-center">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white shadow-lg"
                      style={{ backgroundColor: timelineColor }}
                    >
                      {stop.stop_number}
                    </div>
                  </div>

                  {/* Empty spacer */}
                  <div className="hidden flex-1 md:block md:w-[calc(50%-2rem)]" />
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Summary + Tips */}
        {(tour.summary_text || tour.tips) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto mt-16 max-w-2xl rounded-2xl border border-slate-100 p-6 text-center shadow-sm"
            style={{ backgroundColor: `${accentColor}05` }}
          >
            {tour.summary_text && (
              <p className="text-sm leading-relaxed text-slate-600">{tour.summary_text}</p>
            )}
            {tour.tips && (
              <p className="mt-3 flex items-center justify-center gap-2 text-xs font-medium" style={{ color: accentColor }}>
                <Lightbulb className="h-3.5 w-3.5" />
                {tour.tips}
              </p>
            )}
          </motion.div>
        )}
      </div>
    </section>
  )
}
