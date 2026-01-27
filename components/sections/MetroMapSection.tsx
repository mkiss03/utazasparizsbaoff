'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import {
  Smartphone,
  Banknote,
  Navigation as NavigationIcon,
  Calendar,
  Plane,
  Ticket,
  AlertTriangle,
  X,
} from 'lucide-react'
import { stationsDesktop, stationsMobile, type MetroStation } from './metro-map-data'

const iconMap: Record<string, any> = {
  Smartphone,
  Banknote,
  Navigation: NavigationIcon,
  Calendar,
  Plane,
  Ticket,
  AlertTriangle,
}

export default function MetroMapSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 })

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-gradient-to-b from-white to-parisian-beige-50 py-20 md:py-32"
    >
      {/* Header */}
      <div className="container relative z-10 mx-auto mb-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={isInView ? { scale: 1 } : {}}
            className="mb-4 inline-block"
          >
            <span className="rounded-full bg-parisian-beige-100 px-4 py-2 font-montserrat text-sm font-medium text-parisian-grey-700">
              🚇 Metro Útmutató
            </span>
          </motion.div>
          <h2 className="mb-4 font-playfair text-4xl font-bold text-parisian-grey-800 md:text-5xl lg:text-6xl">
            Párizsi Metró 2026
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-parisian-grey-600">
            Minden, amit az új jegyekről és árakról tudnod kell
          </p>
        </motion.div>
      </div>

      {/* Map Container */}
      <div className="container relative mx-auto px-4">
        {/* Desktop Map */}
        <div className="hidden lg:block">
          <MetroMapDesktop isInView={isInView} />
        </div>

        {/* Mobile Map */}
        <div className="block lg:hidden">
          <MetroMapMobile isInView={isInView} />
        </div>
      </div>
    </section>
  )
}

// Desktop Version - Clean Horizontal Line
function MetroMapDesktop({ isInView }: { isInView: boolean }) {
  const [activeStation, setActiveStation] = useState<string | null>(null)

  return (
    <div className="relative w-full rounded-3xl border-2 border-parisian-beige-200 bg-white shadow-2xl overflow-hidden" style={{ height: '400px' }}>
      {/* Background Map Image with Overlay */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/images/ujmetro.png)' }}
        />
        <div className="absolute inset-0 bg-white/85" />
      </div>

      {/* Metro Line - Simple and Visible */}
      <div className="absolute inset-0 flex items-center px-16">
        <motion.div
          className="w-full h-3 rounded-full bg-gradient-to-r from-parisian-beige-400 via-parisian-beige-500 to-parisian-beige-400 shadow-lg"
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 1.5, ease: 'easeInOut', delay: 0.2 }}
          style={{ transformOrigin: 'left' }}
        />
      </div>

      {/* Station Nodes */}
      <div className="absolute inset-0 flex items-center justify-between px-16">
        {stationsDesktop.map((station, index) => (
          <motion.div
            key={station.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.6 + index * 0.1, type: 'spring', bounce: 0.5 }}
            className="relative flex flex-col items-center"
          >
            {/* Station Circle */}
            <motion.button
              onClick={() => setActiveStation(activeStation === station.id ? null : station.id)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={`relative z-30 flex h-20 w-20 items-center justify-center rounded-full border-4 border-white shadow-2xl transition-all ${
                activeStation === station.id
                  ? 'bg-gradient-to-br from-french-blue-500 to-french-blue-600 ring-4 ring-french-blue-400'
                  : 'bg-gradient-to-br from-parisian-beige-400 to-parisian-beige-600 hover:ring-4 hover:ring-parisian-beige-300'
              }`}
            >
              <span className="font-playfair text-3xl font-bold text-white">{station.letter}</span>

              {/* Pulse Animation when active */}
              {activeStation === station.id && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-french-blue-400"
                  initial={{ scale: 1, opacity: 0.6 }}
                  animate={{ scale: 1.8, opacity: 0 }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
            </motion.button>

            {/* Station Label - Always Visible Below */}
            <div className="absolute top-24 w-32 text-center">
              <p className="text-xs font-bold text-parisian-grey-800 bg-white/90 rounded-lg px-2 py-1.5 shadow-md">
                {station.title}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal for Active Station */}
      {activeStation && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveStation(null)}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-1/2 top-1/2 z-50 w-[90vw] max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-white shadow-2xl"
          >
            <div className="max-h-[85vh] overflow-y-auto p-8">
              {(() => {
                const station = stationsDesktop.find(s => s.id === activeStation)
                if (!station) return null
                const Icon = iconMap[station.icon]

                return (
                  <>
                    {/* Close Button */}
                    <button
                      onClick={() => setActiveStation(null)}
                      className="absolute right-4 top-4 rounded-full bg-parisian-grey-100 p-2 text-parisian-grey-600 transition-colors hover:bg-parisian-grey-200"
                    >
                      <X className="h-5 w-5" />
                    </button>

                    {/* Icon */}
                    {Icon && (
                      <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-parisian-beige-100 to-parisian-beige-200">
                        <Icon className="h-8 w-8 text-parisian-beige-600" />
                      </div>
                    )}

                    {/* Content */}
                    <h3 className="mb-3 font-playfair text-3xl font-bold text-parisian-grey-800">
                      {station.title}
                    </h3>
                    <p className="mb-6 text-lg text-parisian-grey-600">
                      {station.description}
                    </p>

                    {/* Details */}
                    <div className="space-y-3 rounded-2xl bg-gradient-to-br from-parisian-cream-50 to-parisian-beige-50 p-6">
                      {station.details.map((detail, idx) => (
                        <div key={idx} className="flex items-start gap-3 text-base text-parisian-grey-700">
                          <div className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-parisian-beige-500" />
                          <span>{detail}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )
              })()}
            </div>
          </motion.div>
        </>
      )}
    </div>
  )
}

// Mobile Version - Vertical Line
function MetroMapMobile({ isInView }: { isInView: boolean }) {
  const [activeStation, setActiveStation] = useState<string | null>(null)

  return (
    <div className="relative w-full overflow-hidden rounded-3xl border-2 border-parisian-beige-200 bg-white shadow-2xl" style={{ height: '900px' }}>
      {/* Background Map Image with Overlay */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/images/ujmetro.png)' }}
        />
        <div className="absolute inset-0 bg-white/85" />
      </div>

      {/* Metro Line - Vertical */}
      <div className="absolute inset-0 flex flex-col items-center justify-center py-16">
        <motion.div
          className="h-full w-3 rounded-full bg-gradient-to-b from-parisian-beige-400 via-parisian-beige-500 to-parisian-beige-400 shadow-lg"
          initial={{ scaleY: 0 }}
          animate={isInView ? { scaleY: 1 } : {}}
          transition={{ duration: 1.5, ease: 'easeInOut', delay: 0.2 }}
          style={{ transformOrigin: 'top' }}
        />
      </div>

      {/* Station Nodes */}
      <div className="absolute inset-0 flex flex-col items-center justify-around py-16">
        {stationsMobile.map((station, index) => (
          <motion.div
            key={station.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.6 + index * 0.1, type: 'spring', bounce: 0.5 }}
            className="relative flex items-center"
          >
            {/* Station Circle */}
            <motion.button
              onClick={() => setActiveStation(activeStation === station.id ? null : station.id)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={`relative z-30 flex h-16 w-16 items-center justify-center rounded-full border-4 border-white shadow-2xl transition-all ${
                activeStation === station.id
                  ? 'bg-gradient-to-br from-french-blue-500 to-french-blue-600 ring-4 ring-french-blue-400'
                  : 'bg-gradient-to-br from-parisian-beige-400 to-parisian-beige-600 hover:ring-4 hover:ring-parisian-beige-300'
              }`}
            >
              <span className="font-playfair text-2xl font-bold text-white">{station.letter}</span>

              {/* Pulse Animation */}
              {activeStation === station.id && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-french-blue-400"
                  initial={{ scale: 1, opacity: 0.6 }}
                  animate={{ scale: 1.8, opacity: 0 }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
            </motion.button>

            {/* Station Label - To the right */}
            <div className="absolute left-20 w-32">
              <p className="text-xs font-bold text-parisian-grey-800 bg-white/90 rounded-lg px-2 py-1.5 shadow-md text-left">
                {station.title}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal for Active Station */}
      {activeStation && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveStation(null)}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-1/2 top-1/2 z-50 w-[90vw] max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-white shadow-2xl"
          >
            <div className="max-h-[85vh] overflow-y-auto p-6">
              {(() => {
                const station = stationsMobile.find(s => s.id === activeStation)
                if (!station) return null
                const Icon = iconMap[station.icon]

                return (
                  <>
                    {/* Close Button */}
                    <button
                      onClick={() => setActiveStation(null)}
                      className="absolute right-4 top-4 rounded-full bg-parisian-grey-100 p-2 text-parisian-grey-600 transition-colors hover:bg-parisian-grey-200"
                    >
                      <X className="h-5 w-5" />
                    </button>

                    {/* Icon */}
                    {Icon && (
                      <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-parisian-beige-100 to-parisian-beige-200">
                        <Icon className="h-8 w-8 text-parisian-beige-600" />
                      </div>
                    )}

                    {/* Content */}
                    <h3 className="mb-3 font-playfair text-2xl font-bold text-parisian-grey-800">
                      {station.title}
                    </h3>
                    <p className="mb-6 text-base text-parisian-grey-600">
                      {station.description}
                    </p>

                    {/* Details */}
                    <div className="space-y-3 rounded-2xl bg-gradient-to-br from-parisian-cream-50 to-parisian-beige-50 p-6">
                      {station.details.map((detail, idx) => (
                        <div key={idx} className="flex items-start gap-3 text-sm text-parisian-grey-700">
                          <div className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-parisian-beige-500" />
                          <span>{detail}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )
              })()}
            </div>
          </motion.div>
        </>
      )}
    </div>
  )
}

