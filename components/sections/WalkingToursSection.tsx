'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { WalkingTour, WalkingTourCalendarSettings } from '@/lib/types/database'
import { defaultCalendarSettings } from '@/lib/types/database'
import WalkingTourDayModal from '@/components/walking-tours/WalkingTourDayModal'

interface WalkingToursSectionProps {
  tours?: WalkingTour[]
  calendarSettings?: WalkingTourCalendarSettings | null
}

const HUNGARIAN_MONTHS = [
  'Január', 'Február', 'Március', 'Április', 'Május', 'Június',
  'Július', 'Augusztus', 'Szeptember', 'Október', 'November', 'December',
]

const HUNGARIAN_DAYS_SHORT = ['H', 'K', 'Sze', 'Cs', 'P', 'Szo', 'V']

export default function WalkingToursSection({ tours = [], calendarSettings }: WalkingToursSectionProps) {
  if (!tours || tours.length === 0) return null

  const s = { ...defaultCalendarSettings, ...calendarSettings }

  const earliestTourDate = useMemo(() => {
    const dates = tours.map(t => new Date(t.tour_date + 'T00:00:00'))
    dates.sort((a, b) => a.getTime() - b.getTime())
    return dates[0] || new Date()
  }, [tours])

  const [currentMonth, setCurrentMonth] = useState(() => {
    return new Date(earliestTourDate.getFullYear(), earliestTourDate.getMonth(), 1)
  })
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const toursByDate = useMemo(() => {
    const map: Record<string, WalkingTour[]> = {}
    tours.forEach(tour => {
      if (!map[tour.tour_date]) map[tour.tour_date] = []
      map[tour.tour_date].push(tour)
    })
    return map
  }, [tours])

  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDayOfWeek = (new Date(year, month, 1).getDay() + 6) % 7

  const calendarDays = useMemo(() => {
    const days: (number | null)[] = []
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null)
    }
    for (let d = 1; d <= daysInMonth; d++) {
      days.push(d)
    }
    return days
  }, [firstDayOfWeek, daysInMonth])

  const getDateString = (day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  }

  const navigateMonth = (direction: number) => {
    setCurrentMonth(new Date(year, month + direction, 1))
  }

  const today = new Date().toISOString().split('T')[0]
  const selectedTours = selectedDate ? (toursByDate[selectedDate] || []) : []

  return (
    <section id="walking-tours" className="relative overflow-hidden py-20 md:py-32" style={{ background: 'linear-gradient(to bottom, #ffffff, #FFFEFB)' }}>
      <div className="absolute left-0 top-20 h-72 w-72 rounded-full opacity-10 blur-3xl" style={{ backgroundColor: s.tourDayBorderColor }} />

      <div className="container relative z-10 mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <span
            className="mb-4 inline-block rounded-full px-4 py-1.5 text-sm font-medium"
            style={{ backgroundColor: s.sectionBadgeBgColor, color: s.sectionBadgeTextColor }}
          >
            {s.sectionBadgeText}
          </span>
          <h2
            className="mb-4 font-playfair text-4xl font-bold md:text-5xl lg:text-6xl"
            style={{ color: s.sectionTitleColor }}
          >
            {s.sectionTitle}
          </h2>
          <p
            className="mx-auto max-w-2xl text-lg md:text-xl"
            style={{ color: s.sectionSubtitleColor }}
          >
            {s.sectionSubtitle}
          </p>
        </motion.div>

        {/* Calendar */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="mx-auto max-w-4xl"
        >
          <div className="overflow-hidden rounded-3xl border-2 bg-white shadow-xl" style={{ borderColor: s.tourDayBorderColor + '40' }}>
            {/* Calendar Header */}
            <div
              className="flex items-center justify-between px-6 py-5"
              style={{ background: `linear-gradient(to right, ${s.headerBgFrom}, ${s.headerBgTo})` }}
            >
              <button
                onClick={() => navigateMonth(-1)}
                className="rounded-full p-2 transition-colors hover:bg-white/10"
                style={{ color: s.headerNavColor }}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <h3
                className="font-playfair text-2xl font-bold md:text-3xl"
                style={{ color: s.headerTextColor }}
              >
                {HUNGARIAN_MONTHS[month]} {year}
              </h3>
              <button
                onClick={() => navigateMonth(1)}
                className="rounded-full p-2 transition-colors hover:bg-white/10"
                style={{ color: s.headerNavColor }}
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            {/* Day of week headers */}
            <div
              className="grid grid-cols-7 border-b"
              style={{ backgroundColor: s.dayHeaderBgColor, borderColor: s.tourDayBorderColor + '30' }}
            >
              {HUNGARIAN_DAYS_SHORT.map(day => (
                <div
                  key={day}
                  className="py-3 text-center text-sm font-semibold"
                  style={{ color: s.dayHeaderTextColor }}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7">
              {calendarDays.map((day, idx) => {
                if (day === null) {
                  return (
                    <div
                      key={`empty-${idx}`}
                      className="min-h-[80px] border-b border-r md:min-h-[100px]"
                      style={{ borderColor: '#f5f5f5', backgroundColor: '#fafafa' }}
                    />
                  )
                }

                const dateStr = getDateString(day)
                const dayTours = toursByDate[dateStr] || []
                const hasTours = dayTours.length > 0
                const isToday = dateStr === today
                const isPast = dateStr < today

                return (
                  <div
                    key={dateStr}
                    onClick={() => hasTours && setSelectedDate(dateStr)}
                    className={`relative min-h-[80px] border-b border-r p-1.5 transition-all md:min-h-[100px] md:p-2 ${
                      hasTours ? 'cursor-pointer' : ''
                    }`}
                    style={{
                      borderColor: hasTours ? s.tourDayBorderColor : '#f5f5f5',
                      borderWidth: hasTours ? `${s.tourDayBorderWidth}px` : '1px',
                      backgroundColor: hasTours ? s.tourDayBgColor : (isPast ? '#fafafa' : 'transparent'),
                      boxShadow: hasTours ? `inset 0 0 0 1px ${s.tourDayBorderColor}20` : 'none',
                    }}
                    onMouseEnter={(e) => {
                      if (hasTours) {
                        e.currentTarget.style.boxShadow = `0 4px 12px ${s.tourDayBorderColor}40`
                        e.currentTarget.style.transform = 'scale(1.02)'
                        e.currentTarget.style.zIndex = '10'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (hasTours) {
                        e.currentTarget.style.boxShadow = `inset 0 0 0 1px ${s.tourDayBorderColor}20`
                        e.currentTarget.style.transform = 'scale(1)'
                        e.currentTarget.style.zIndex = '0'
                      }
                    }}
                  >
                    {/* Day number */}
                    <span
                      className="inline-flex h-7 w-7 items-center justify-center rounded-full text-sm font-medium"
                      style={{
                        backgroundColor: isToday ? s.todayBgColor : 'transparent',
                        color: isToday ? s.todayTextColor : (isPast ? s.pastDayTextColor : s.dayTextColor),
                        fontWeight: hasTours ? 700 : 500,
                      }}
                    >
                      {day}
                    </span>

                    {/* Tour badges */}
                    {hasTours && (
                      <div className="mt-1 space-y-0.5">
                        {dayTours.map(tour => {
                          const available = tour.max_participants - (tour.current_bookings || 0)
                          const isFull = available <= 0
                          return (
                            <div
                              key={tour.id}
                              className="rounded px-1 py-0.5 text-[10px] font-semibold leading-tight md:px-1.5 md:text-xs"
                              style={{
                                backgroundColor: isFull ? s.fullBadgeBgColor : s.tourBadgeBgColor,
                                color: isFull ? s.fullBadgeTextColor : s.tourBadgeTextColor,
                              }}
                            >
                              <span className="line-clamp-1">
                                {s.showTimeOnBadge && (
                                  <span className="hidden sm:inline">{tour.start_time?.slice(0, 5)} </span>
                                )}
                                {tour.title}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Legend */}
          {s.showLegend && (
            <div className="mt-4 flex items-center justify-center gap-6 text-sm" style={{ color: s.pastDayTextColor }}>
              <div className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded border"
                  style={{ backgroundColor: s.tourBadgeBgColor, borderColor: s.tourDayBorderColor }}
                />
                <span>{s.legendTourLabel}</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded border"
                  style={{ backgroundColor: s.fullBadgeBgColor, borderColor: s.fullBadgeTextColor + '40' }}
                />
                <span>{s.legendFullLabel}</span>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Tour Day Modal */}
      <WalkingTourDayModal
        tours={selectedTours}
        date={selectedDate}
        onClose={() => setSelectedDate(null)}
        calendarSettings={s}
      />
    </section>
  )
}
