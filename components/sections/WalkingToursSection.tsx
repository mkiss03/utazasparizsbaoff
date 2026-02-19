'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { WalkingTour } from '@/lib/types/database'
import WalkingTourDayModal from '@/components/walking-tours/WalkingTourDayModal'

interface WalkingToursSectionProps {
  tours?: WalkingTour[]
}

const HUNGARIAN_MONTHS = [
  'Január', 'Február', 'Március', 'Április', 'Május', 'Június',
  'Július', 'Augusztus', 'Szeptember', 'Október', 'November', 'December',
]

const HUNGARIAN_DAYS_SHORT = ['H', 'K', 'Sze', 'Cs', 'P', 'Szo', 'V']

export default function WalkingToursSection({ tours = [] }: WalkingToursSectionProps) {
  if (!tours || tours.length === 0) return null

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
  // Monday = 0, Sunday = 6
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
    <section id="walking-tours" className="relative overflow-hidden bg-gradient-to-b from-white to-parisian-cream-50 py-20 md:py-32">
      <div className="absolute left-0 top-20 h-72 w-72 rounded-full bg-parisian-beige-300 opacity-10 blur-3xl" />

      <div className="container relative z-10 mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <span className="mb-4 inline-block rounded-full bg-parisian-beige-100 px-4 py-1.5 text-sm font-medium text-parisian-beige-700">
            Fedezd fel velünk
          </span>
          <h2 className="mb-4 font-playfair text-4xl font-bold text-parisian-grey-800 md:text-5xl lg:text-6xl">
            Közelgő Sétatúrák
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-parisian-grey-600 md:text-xl">
            Csatlakozz egyedülálló, magyar nyelvű sétáinkhoz és fedezd fel Párizs rejtett kincseit
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
          <div className="overflow-hidden rounded-3xl border-2 border-parisian-beige-200 bg-white shadow-xl">
            {/* Calendar Header */}
            <div className="flex items-center justify-between bg-gradient-to-r from-parisian-grey-800 to-parisian-grey-700 px-6 py-5">
              <button
                onClick={() => navigateMonth(-1)}
                className="rounded-full p-2 text-parisian-beige-200 transition-colors hover:bg-white/10 hover:text-white"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <h3 className="font-playfair text-2xl font-bold text-white md:text-3xl">
                {HUNGARIAN_MONTHS[month]} {year}
              </h3>
              <button
                onClick={() => navigateMonth(1)}
                className="rounded-full p-2 text-parisian-beige-200 transition-colors hover:bg-white/10 hover:text-white"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            {/* Day of week headers */}
            <div className="grid grid-cols-7 border-b border-parisian-beige-100 bg-parisian-beige-50">
              {HUNGARIAN_DAYS_SHORT.map(day => (
                <div key={day} className="py-3 text-center text-sm font-semibold text-parisian-grey-600">
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
                      className="min-h-[80px] border-b border-r border-parisian-beige-50 bg-parisian-cream-50/30 md:min-h-[100px]"
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
                    className={`relative min-h-[80px] border-b border-r border-parisian-beige-50 p-1.5 transition-all md:min-h-[100px] md:p-2 ${
                      hasTours
                        ? 'cursor-pointer hover:bg-parisian-beige-50 hover:shadow-inner'
                        : ''
                    } ${isPast && !hasTours ? 'bg-parisian-cream-50/40' : ''}`}
                  >
                    {/* Day number */}
                    <span
                      className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-sm font-medium ${
                        isToday
                          ? 'bg-parisian-grey-800 text-white'
                          : isPast
                          ? 'text-parisian-grey-400'
                          : 'text-parisian-grey-700'
                      }`}
                    >
                      {day}
                    </span>

                    {/* Tour titles */}
                    {hasTours && (
                      <div className="mt-1 space-y-0.5">
                        {dayTours.map(tour => {
                          const available = tour.max_participants - (tour.current_bookings || 0)
                          const isFull = available <= 0
                          return (
                            <div
                              key={tour.id}
                              className={`rounded px-1 py-0.5 text-[10px] font-medium leading-tight md:px-1.5 md:text-xs ${
                                isFull
                                  ? 'bg-red-50 text-red-500'
                                  : 'bg-parisian-beige-100 text-parisian-beige-700'
                              }`}
                            >
                              <span className="line-clamp-1">
                                <span className="hidden sm:inline">{tour.start_time?.slice(0, 5)} </span>
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
          <div className="mt-4 flex items-center justify-center gap-6 text-sm text-parisian-grey-500">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded bg-parisian-beige-100 border border-parisian-beige-200" />
              <span>Van túra</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded bg-red-50 border border-red-200" />
              <span>Betelt</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Tour Day Modal */}
      <WalkingTourDayModal
        tours={selectedTours}
        date={selectedDate}
        onClose={() => setSelectedDate(null)}
      />
    </section>
  )
}
