'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Check, MapPin, Users } from 'lucide-react'
import type { TripPlan } from '@/lib/planner/trip-plan-types'

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.12 } } }
const item = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }

export default function TripPlanView({ plan }: { plan: TripPlan }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-parisian-cream-50 to-parisian-beige-50">
      <div className="relative overflow-hidden bg-parisian-grey-900 py-16 text-center text-white">
        <motion.div
          initial={{ scale: 1.1, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 0.35 }}
          transition={{ duration: 1.4 }}
          className="absolute inset-0"
        >
          <Image src="/images/stock1.jpeg" alt="" fill sizes="100vw" className="object-cover" />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-parisian-grey-900 via-parisian-grey-900/70 to-parisian-grey-900/40" />

        <div className="relative z-10 mx-auto max-w-2xl px-4">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 inline-block rounded-full bg-white/15 px-5 py-2 font-montserrat text-sm font-medium backdrop-blur-sm"
          >
            Párizsi programterv
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-4 font-playfair text-4xl font-bold sm:text-5xl"
          >
            {plan.guestName ? `${plan.guestName} programterve` : 'A programterved'}
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-montserrat text-sm text-white/80"
          >
            <span>{plan.dateRangeLabel}</span>
            {plan.accommodation && (
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                {plan.accommodation}
              </span>
            )}
            {plan.headcount && (
              <span className="flex items-center gap-1.5">
                <Users className="h-4 w-4" />
                {plan.headcount} fő
              </span>
            )}
          </motion.div>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-12">
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
          {plan.days.map((day) => (
            <motion.div
              key={day.id}
              variants={item}
              className="rounded-3xl border-2 border-parisian-beige-200 bg-white p-6 shadow-sm"
            >
              <h2 className="mb-1 font-playfair text-xl font-bold text-parisian-grey-800">{day.dateLabel}</h2>
              {day.note && <p className="mb-4 font-montserrat text-sm italic text-parisian-grey-500">{day.note}</p>}

              <ul className="space-y-2.5">
                {day.items.map((dayItem) => (
                  <li key={dayItem.id} className="flex items-start gap-3">
                    <span
                      className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full ${
                        dayItem.confirmed ? 'bg-parisian-beige-400 text-white' : 'border-2 border-parisian-beige-200'
                      }`}
                    >
                      {dayItem.confirmed && <Check className="h-3 w-3" />}
                    </span>
                    <span className="font-montserrat text-sm leading-relaxed text-parisian-grey-700">
                      {dayItem.time && <span className="font-semibold text-parisian-grey-800">{dayItem.time} -- </span>}
                      {dayItem.text}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {plan.curatorMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-10 flex flex-col items-center gap-5 rounded-3xl border-2 border-parisian-beige-200 bg-gradient-to-br from-white to-parisian-cream-50 p-8 text-center shadow-lg sm:flex-row sm:text-left"
          >
            <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-full border-2 border-parisian-beige-200">
              <Image
                src="/images/viktoriaprofillouvre.jpg"
                alt="Viktória"
                fill
                sizes="80px"
                className="object-cover object-top"
              />
            </div>
            <div>
              <p className="font-montserrat text-base leading-relaxed text-parisian-grey-700">{plan.curatorMessage}</p>
              <p className="mt-2 font-montserrat text-sm font-semibold text-parisian-grey-500">— Viktória</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
