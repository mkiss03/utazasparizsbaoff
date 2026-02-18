'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Clock,
  MapPin,
  Users,
  ArrowRight,
} from 'lucide-react'
import Link from 'next/link'
import type { WalkingTour } from '@/lib/types/database'

const DAYS = ['H', 'K', 'Sze', 'Cs', 'P', 'Szo', 'V']
const MONTH_NAMES = [
  'Január', 'Február', 'Március', 'Április', 'Május', 'Június',
  'Július', 'Augusztus', 'Szeptember', 'Október', 'November', 'December',
]

interface WalkingToursCalendarClientProps {
  tours: WalkingTour[]
}

export default function WalkingToursCalendarClient({ tours }: WalkingToursCalendarClientProps) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), 1)
  })
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  // Map tour dates for calendar dots
  const tourDateSet = useMemo(
    () => new Set(tours.map((t) => t.tour_date)),
    [tours]
  )

  // Generate calendar grid
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)

    // Monday=0, Sunday=6
    let startDow = firstDay.getDay() - 1
    if (startDow < 0) startDow = 6

    const days: (number | null)[] = []
    for (let i = 0; i < startDow; i++) days.push(null)
    for (let d = 1; d <= lastDay.getDate(); d++) days.push(d)
    while (days.length % 7 !== 0) days.push(null)

    return days
  }, [currentMonth])

  const getDateString = (day: number) => {
    const m = String(currentMonth.getMonth() + 1).padStart(2, '0')
    const d = String(day).padStart(2, '0')
    return `${currentMonth.getFullYear()}-${m}-${d}`
  }

  const filteredTours = selectedDate
    ? tours.filter((t) => t.tour_date === selectedDate)
    : tours

  const getAvailability = (tour: WalkingTour) => {
    const available = tour.max_participants - (tour.current_bookings || 0)
    if (available <= 0) return { text: 'Betelt', color: 'text-red-600' }
    if (available <= 3) return { text: `Még ${available} hely`, color: 'text-orange-600' }
    return { text: `${available} szabad hely`, color: 'text-green-600' }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString + 'T00:00:00').toLocaleDateString('hu-HU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    })
  }

  const todayStr = new Date().toISOString().split('T')[0]

  return (
    <div className="container mx-auto px-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-12 text-center"
      >
        <span className="mb-4 inline-block rounded-full bg-parisian-beige-100 px-4 py-1.5 text-sm font-medium text-parisian-beige-700">
          Naptár
        </span>
        <h1 className="mb-4 font-playfair text-4xl font-bold text-parisian-grey-800 md:text-5xl">
          Sétatúra Időpontok
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-parisian-grey-600">
          Válassz egy időpontot és foglald le a helyed a következő párizsi sétatúránkon
        </p>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-[360px,1fr]">
        {/* Calendar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="sticky top-28 rounded-2xl border-2 border-parisian-beige-200 bg-white p-6 shadow-lg">
            {/* Month navigation */}
            <div className="mb-4 flex items-center justify-between">
              <button
                onClick={() =>
                  setCurrentMonth(
                    new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
                  )
                }
                className="rounded-lg p-2 hover:bg-parisian-beige-50 transition-colors"
              >
                <ChevronLeft className="h-5 w-5 text-parisian-grey-600" />
              </button>
              <h3 className="font-playfair text-lg font-bold text-parisian-grey-800">
                {MONTH_NAMES[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </h3>
              <button
                onClick={() =>
                  setCurrentMonth(
                    new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
                  )
                }
                className="rounded-lg p-2 hover:bg-parisian-beige-50 transition-colors"
              >
                <ChevronRight className="h-5 w-5 text-parisian-grey-600" />
              </button>
            </div>

            {/* Day headers */}
            <div className="mb-2 grid grid-cols-7 gap-1">
              {DAYS.map((d) => (
                <div key={d} className="text-center text-xs font-semibold text-parisian-grey-400 py-1">
                  {d}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, i) => {
                if (day === null) return <div key={`empty-${i}`} />

                const dateStr = getDateString(day)
                const hasTour = tourDateSet.has(dateStr)
                const isToday = dateStr === todayStr
                const isSelected = dateStr === selectedDate
                const isPast = dateStr < todayStr

                return (
                  <button
                    key={dateStr}
                    onClick={() => {
                      if (hasTour) setSelectedDate(isSelected ? null : dateStr)
                    }}
                    disabled={!hasTour}
                    className={`
                      relative flex h-10 w-full items-center justify-center rounded-lg text-sm transition-all
                      ${isPast ? 'text-parisian-grey-300' : 'text-parisian-grey-700'}
                      ${hasTour && !isSelected ? 'font-bold hover:bg-parisian-beige-50 cursor-pointer' : ''}
                      ${isSelected ? 'bg-parisian-grey-800 text-white font-bold' : ''}
                      ${isToday && !isSelected ? 'ring-2 ring-parisian-beige-400' : ''}
                      ${!hasTour ? 'cursor-default' : ''}
                    `}
                  >
                    {day}
                    {hasTour && !isSelected && (
                      <span className="absolute bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-parisian-beige-500" />
                    )}
                  </button>
                )
              })}
            </div>

            {/* Legend */}
            <div className="mt-4 flex items-center gap-4 text-xs text-parisian-grey-500">
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-parisian-beige-500" />
                <span>Van túra</span>
              </div>
              {selectedDate && (
                <button
                  onClick={() => setSelectedDate(null)}
                  className="text-parisian-beige-600 underline"
                >
                  Szűrő törlése
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Tour List */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="space-y-6"
        >
          {selectedDate && (
            <p className="text-sm text-parisian-grey-600">
              Szűrve: <span className="font-semibold">{formatDate(selectedDate)}</span>
            </p>
          )}

          {filteredTours.length > 0 ? (
            filteredTours.map((tour) => {
              const availability = getAvailability(tour)
              const isFull = tour.current_bookings >= tour.max_participants

              return (
                <motion.div
                  key={tour.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -4 }}
                  className="group"
                >
                  <Link href={`/walking-tours/${tour.slug}`}>
                    <div className="overflow-hidden rounded-2xl border-2 border-parisian-beige-200 bg-white shadow-md transition-all duration-300 hover:shadow-xl hover:border-parisian-beige-300">
                      <div className="flex flex-col md:flex-row">
                        {/* Date sidebar */}
                        <div className="flex items-center gap-4 bg-gradient-to-br from-parisian-grey-800 to-parisian-grey-700 px-6 py-4 text-white md:w-48 md:flex-col md:justify-center md:gap-1 md:py-6">
                          <CalendarDays className="h-5 w-5 md:h-6 md:w-6" />
                          <div className="md:text-center">
                            <div className="text-sm font-medium opacity-80">
                              {new Date(tour.tour_date + 'T00:00:00').toLocaleDateString('hu-HU', { weekday: 'long' })}
                            </div>
                            <div className="text-lg font-bold md:text-2xl">
                              {new Date(tour.tour_date + 'T00:00:00').toLocaleDateString('hu-HU', { month: 'short', day: 'numeric' })}
                            </div>
                          </div>
                          <div className="text-sm opacity-80">
                            {tour.start_time?.slice(0, 5)}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="mb-1 font-playfair text-xl font-bold text-parisian-grey-800 transition-colors group-hover:text-parisian-beige-600">
                                {tour.title}
                              </h3>
                              {tour.short_description && (
                                <p className="mb-3 text-sm text-parisian-grey-600 line-clamp-2">
                                  {tour.short_description}
                                </p>
                              )}
                              <div className="flex flex-wrap gap-3 text-sm text-parisian-grey-500">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3.5 w-3.5" />
                                  {tour.duration_minutes} perc
                                </span>
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3.5 w-3.5" />
                                  {tour.meeting_point}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Users className="h-3.5 w-3.5" />
                                  <span className={availability.color}>{availability.text}</span>
                                </span>
                              </div>
                            </div>
                            <div className="ml-4 text-right">
                              <span className="text-2xl font-bold text-parisian-grey-800">
                                {tour.price_per_person}€
                              </span>
                              <span className="block text-xs text-parisian-grey-500">/ fő</span>
                              {!isFull && (
                                <div className="mt-2 flex items-center gap-1 text-sm font-semibold text-parisian-beige-600 transition-all group-hover:gap-2">
                                  Foglalás <ArrowRight className="h-3.5 w-3.5" />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )
            })
          ) : (
            <div className="rounded-2xl border-2 border-dashed border-parisian-beige-200 p-12 text-center">
              <CalendarDays className="mx-auto h-12 w-12 text-parisian-beige-300" />
              <h3 className="mt-4 font-playfair text-xl font-semibold text-parisian-grey-600">
                {selectedDate ? 'Ezen a napon nincs túra' : 'Jelenleg nincs elérhető túra'}
              </h3>
              <p className="mt-2 text-sm text-parisian-grey-400">
                {selectedDate
                  ? 'Válassz egy másik napot a naptárban'
                  : 'Hamarosan új időpontokat hirdetünk meg!'}
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
