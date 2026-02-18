'use client'

import { motion } from 'framer-motion'
import { CalendarDays, Clock, MapPin, Users, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import type { WalkingTour } from '@/lib/types/database'

interface WalkingToursSectionProps {
  tours?: WalkingTour[]
}

export default function WalkingToursSection({ tours = [] }: WalkingToursSectionProps) {
  if (!tours || tours.length === 0) return null

  const formatDate = (dateString: string) => {
    return new Date(dateString + 'T00:00:00').toLocaleDateString('hu-HU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    })
  }

  const getAvailability = (tour: WalkingTour) => {
    const available = tour.max_participants - (tour.current_bookings || 0)
    if (available <= 0) return { text: 'Betelt', color: 'text-red-600' }
    if (available <= 3) return { text: `Még ${available} hely`, color: 'text-orange-600' }
    return { text: `${available} szabad hely`, color: 'text-green-600' }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  } as const

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  } as const

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

        {/* Tour Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {tours.map((tour) => {
            const availability = getAvailability(tour)
            return (
              <motion.div key={tour.id} variants={itemVariants} whileHover={{ y: -10, scale: 1.02 }} className="group">
                <Link href={`/walking-tours/${tour.slug}`}>
                  <div className="overflow-hidden rounded-3xl border-2 border-parisian-beige-200 bg-white shadow-xl transition-all duration-500 hover:shadow-2xl hover:border-parisian-beige-300">
                    {/* Date Badge */}
                    <div className="bg-gradient-to-r from-parisian-grey-800 to-parisian-grey-700 px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-parisian-beige-200">
                        <CalendarDays className="h-4 w-4" />
                        <span className="font-medium">{formatDate(tour.tour_date)}</span>
                      </div>
                      <div className="mt-1 flex items-center gap-4 text-xs text-parisian-beige-300">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {tour.start_time?.slice(0, 5)} • {tour.duration_minutes} perc
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="mb-2 font-playfair text-2xl font-bold text-parisian-grey-800 transition-colors group-hover:text-parisian-beige-600">
                        {tour.title}
                      </h3>

                      {tour.short_description && (
                        <p className="mb-4 line-clamp-2 text-parisian-grey-600">
                          {tour.short_description}
                        </p>
                      )}

                      <div className="mb-4 space-y-2 text-sm text-parisian-grey-600">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-parisian-beige-500" />
                          <span className="line-clamp-1">{tour.meeting_point}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-parisian-beige-500" />
                          <span className={`font-medium ${availability.color}`}>
                            {availability.text}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-t border-parisian-beige-100 pt-4">
                        <div>
                          <span className="text-2xl font-bold text-parisian-grey-800">
                            {tour.price_per_person} €
                          </span>
                          <span className="text-sm text-parisian-grey-500"> / fő</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm font-semibold text-parisian-beige-600 transition-all group-hover:gap-3">
                          <span>Foglalj most</span>
                          <ArrowRight className="h-4 w-4" />
                        </div>
                      </div>

                      <p className="mt-2 text-xs text-parisian-grey-400">
                        Min. {tour.min_participants} főtől indul
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <Link href="/walking-tours">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="rounded-full bg-parisian-beige-400 px-8 py-3 font-semibold text-white transition-all duration-300 hover:bg-parisian-beige-500"
            >
              Összes sétatúra
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
