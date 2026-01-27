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

// Desktop Version - Curved Line with Proper Responsive Layout
function MetroMapDesktop({ isInView }: { isInView: boolean }) {
  const [activeStation, setActiveStation] = useState<string | null>(null)

  return (
    <>
      {/* Main Container with Aspect Ratio */}
      <div
        className="relative w-full rounded-3xl border-2 border-parisian-beige-200 bg-white shadow-2xl overflow-hidden"
        style={{ aspectRatio: '2 / 1' }}
      >
        {/* Background Map - Fits Container Perfectly */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: 'url(/images/ujmetro.png)',
              backgroundSize: 'cover'
            }}
          />
          <div className="absolute inset-0 bg-white/85" />
        </div>

        {/* SVG Metro Line - Matches Container Aspect Ratio */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 1000 500"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#D4C5A0" />
              <stop offset="50%" stopColor="#C9B88A" />
              <stop offset="100%" stopColor="#D4C5A0" />
            </linearGradient>
          </defs>

          {/* Smooth Curved Path */}
          <motion.path
            d="M 80 280 Q 280 200, 500 250 Q 720 300, 920 250"
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth="8"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={isInView ? { pathLength: 1 } : {}}
            transition={{ duration: 2, ease: 'easeInOut', delay: 0.2 }}
          />
        </svg>

        {/* Station Nodes - Percentage Based with Center Anchor */}
        {stationsDesktop.map((station, index) => (
          <motion.div
            key={station.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.6 + index * 0.1, type: 'spring', bounce: 0.5 }}
            className="absolute"
            style={{
              left: `${station.x}%`,
              top: `${station.y}%`,
              transform: 'translate(-50%, -50%)',
              zIndex: 20,
            }}
          >
            {/* Station Circle */}
            <motion.button
              onClick={() => setActiveStation(activeStation === station.id ? null : station.id)}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.95 }}
              className={`relative flex h-20 w-20 items-center justify-center rounded-full border-4 border-white shadow-2xl transition-all ${
                activeStation === station.id
                  ? 'bg-gradient-to-br from-french-blue-500 to-french-blue-600 ring-4 ring-french-blue-400'
                  : 'bg-gradient-to-br from-parisian-beige-400 to-parisian-beige-600 hover:ring-4 hover:ring-parisian-beige-300'
              }`}
            >
              <span className="font-playfair text-3xl font-bold text-white">{station.letter}</span>

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

            {/* Station Label - Positioned Below */}
            <div
              className="absolute w-36 text-center pointer-events-none"
              style={{
                top: '100%',
                left: '50%',
                transform: 'translateX(-50%)',
                marginTop: '0.5rem'
              }}
            >
              <p className="text-xs font-bold text-parisian-grey-800 bg-white/95 rounded-lg px-2 py-1.5 shadow-md">
                {station.title}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal - Completely Isolated with Premium Styling */}
      {activeStation && (
        <>
          {/* Full Screen Backdrop with Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setActiveStation(null)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              background: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              zIndex: 9999,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '1rem'
            }}
          >
            {/* Modal Card - Premium Animation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', bounce: 0.25, duration: 0.6 }}
              onClick={(e) => e.stopPropagation()}
              className="rounded-3xl bg-white shadow-2xl"
              style={{
                width: '100%',
                maxWidth: '48rem',
                maxHeight: '85vh',
                overflow: 'hidden'
              }}
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
                        className="absolute right-4 top-4 rounded-full bg-parisian-grey-100 p-3 text-parisian-grey-600 transition-all hover:bg-parisian-grey-200 hover:scale-110"
                        style={{ zIndex: 10 }}
                      >
                        <X className="h-6 w-6" />
                      </button>

                      {/* Icon */}
                      {Icon && (
                        <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-parisian-beige-100 to-parisian-beige-200 shadow-lg">
                          <Icon className="h-10 w-10 text-parisian-beige-600" />
                        </div>
                      )}

                      {/* Content */}
                      <h3 className="mb-4 font-playfair text-4xl font-bold text-parisian-grey-800">
                        {station.title}
                      </h3>
                      <p className="mb-6 text-xl text-parisian-grey-600 leading-relaxed">
                        {station.description}
                      </p>

                      {/* Details */}
                      <div className="space-y-4 rounded-2xl bg-gradient-to-br from-parisian-cream-50 to-parisian-beige-50 p-8">
                        {station.details.map((detail, idx) => (
                          <div key={idx} className="flex items-start gap-4 text-lg text-parisian-grey-700">
                            <div className="mt-2 h-2.5 w-2.5 flex-shrink-0 rounded-full bg-parisian-beige-500" />
                            <span>{detail}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )
                })()}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </>
  )
}

// Mobile Version - Vertical Curved Line with Responsive Layout
function MetroMapMobile({ isInView }: { isInView: boolean }) {
  const [activeStation, setActiveStation] = useState<string | null>(null)

  return (
    <>
      {/* Main Container with Aspect Ratio */}
      <div
        className="relative w-full rounded-3xl border-2 border-parisian-beige-200 bg-white shadow-2xl overflow-hidden"
        style={{ aspectRatio: '1 / 2' }}
      >
        {/* Background Map */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: 'url(/images/ujmetro.png)',
              backgroundSize: 'cover'
            }}
          />
          <div className="absolute inset-0 bg-white/85" />
        </div>

        {/* SVG Metro Line - Matches Container Aspect Ratio */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 400 800"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="lineGradientMobile" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#D4C5A0" />
              <stop offset="50%" stopColor="#C9B88A" />
              <stop offset="100%" stopColor="#D4C5A0" />
            </linearGradient>
          </defs>

          {/* Smooth Vertical Curved Path */}
          <motion.path
            d="M 200 80 Q 250 240, 200 400 Q 150 560, 200 720"
            fill="none"
            stroke="url(#lineGradientMobile)"
            strokeWidth="7"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={isInView ? { pathLength: 1 } : {}}
            transition={{ duration: 2, ease: 'easeInOut', delay: 0.2 }}
          />
        </svg>

        {/* Station Nodes - Percentage Based with Center Anchor */}
        {stationsMobile.map((station, index) => (
          <motion.div
            key={station.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.6 + index * 0.1, type: 'spring', bounce: 0.5 }}
            className="absolute"
            style={{
              left: `${station.x}%`,
              top: `${station.y}%`,
              transform: 'translate(-50%, -50%)',
              zIndex: 20,
            }}
          >
            {/* Station Circle */}
            <motion.button
              onClick={() => setActiveStation(activeStation === station.id ? null : station.id)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={`relative flex h-16 w-16 items-center justify-center rounded-full border-4 border-white shadow-2xl transition-all ${
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

            {/* Station Label - Positioned to the Right */}
            <div
              className="absolute w-32 pointer-events-none"
              style={{
                left: '100%',
                top: '50%',
                transform: 'translateY(-50%)',
                marginLeft: '0.5rem'
              }}
            >
              <p className="text-xs font-bold text-parisian-grey-800 bg-white/95 rounded-lg px-2 py-1.5 shadow-md text-left">
                {station.title}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal - Completely Isolated with Premium Styling */}
      {activeStation && (
        <>
          {/* Full Screen Backdrop with Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setActiveStation(null)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              background: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              zIndex: 9999,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '1rem'
            }}
          >
            {/* Modal Card - Premium Animation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', bounce: 0.25, duration: 0.6 }}
              onClick={(e) => e.stopPropagation()}
              className="rounded-3xl bg-white shadow-2xl"
              style={{
                width: '100%',
                maxWidth: '32rem',
                maxHeight: '85vh',
                overflow: 'hidden'
              }}
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
                        className="absolute right-4 top-4 rounded-full bg-parisian-grey-100 p-3 text-parisian-grey-600 transition-all hover:bg-parisian-grey-200 hover:scale-110"
                        style={{ zIndex: 10 }}
                      >
                        <X className="h-6 w-6" />
                      </button>

                      {/* Icon */}
                      {Icon && (
                        <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-parisian-beige-100 to-parisian-beige-200 shadow-lg">
                          <Icon className="h-8 w-8 text-parisian-beige-600" />
                        </div>
                      )}

                      {/* Content */}
                      <h3 className="mb-3 font-playfair text-2xl font-bold text-parisian-grey-800">
                        {station.title}
                      </h3>
                      <p className="mb-6 text-base text-parisian-grey-600 leading-relaxed">
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
          </motion.div>
        </>
      )}
    </>
  )
}

