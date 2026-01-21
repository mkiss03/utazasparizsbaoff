'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import {
  Smartphone,
  Banknote,
  Navigation as NavigationIcon,
  Calendar,
  Plane,
  X,
} from 'lucide-react'
import { stationsDesktop, stationsMobile, type MetroStation } from './metro-map-data'

const iconMap: Record<string, any> = {
  Smartphone,
  Banknote,
  Navigation: NavigationIcon,
  Calendar,
  Plane,
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
            Párizsi Metro 2026
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-parisian-grey-600">
            Fedezd fel a párizsi tömegközlekedés legfontosabb információit
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

// Desktop Version - Horizontal S-Curve
function MetroMapDesktop({ isInView }: { isInView: boolean }) {
  const [activeStation, setActiveStation] = useState<string | null>(null)

  return (
    <div className="relative h-[600px] w-full overflow-hidden rounded-3xl border-2 border-parisian-beige-200 bg-white shadow-2xl">
      {/* Background Map Image with Overlay */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-parisian-beige-50 to-parisian-cream-100" />
        <div className="absolute inset-0 bg-gradient-to-br from-white/90 to-parisian-beige-50/80" />

        {/* Decorative Elements to simulate map */}
        <svg className="absolute inset-0 h-full w-full opacity-10">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" className="text-parisian-grey-400" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* SVG Metro Line */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1000 600"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#EBE0BB" />
            <stop offset="50%" stopColor="#E6D9AC" />
            <stop offset="100%" stopColor="#EBE0BB" />
          </linearGradient>
        </defs>

        {/* S-Curve Path */}
        <motion.path
          d="M 100 270 Q 280 210, 500 300 T 900 300"
          fill="none"
          stroke="url(#lineGradient)"
          strokeWidth="6"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={isInView ? { pathLength: 1 } : {}}
          transition={{ duration: 2, ease: 'easeInOut', delay: 0.3 }}
        />
      </svg>

      {/* Station Nodes */}
      {stationsDesktop.map((station, index) => (
        <StationNode
          key={station.id}
          station={station}
          isActive={activeStation === station.id}
          onToggle={() => setActiveStation(activeStation === station.id ? null : station.id)}
          index={index}
          isInView={isInView}
        />
      ))}
    </div>
  )
}

// Mobile Version - Vertical Winding Line
function MetroMapMobile({ isInView }: { isInView: boolean }) {
  const [activeStation, setActiveStation] = useState<string | null>(null)

  return (
    <div className="relative h-[800px] w-full overflow-hidden rounded-3xl border-2 border-parisian-beige-200 bg-white shadow-2xl">
      {/* Background Map Image with Overlay */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-parisian-beige-50 to-parisian-cream-100" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/90 to-parisian-beige-50/80" />

        {/* Decorative Grid */}
        <svg className="absolute inset-0 h-full w-full opacity-10">
          <defs>
            <pattern id="gridMobile" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="currentColor" strokeWidth="1" className="text-parisian-grey-400" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#gridMobile)" />
        </svg>
      </div>

      {/* SVG Metro Line */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 400 800"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="lineGradientMobile" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#EBE0BB" />
            <stop offset="50%" stopColor="#E6D9AC" />
            <stop offset="100%" stopColor="#EBE0BB" />
          </linearGradient>
        </defs>

        {/* Vertical Winding Path */}
        <motion.path
          d="M 180 80 Q 220 210, 200 360 T 200 656"
          fill="none"
          stroke="url(#lineGradientMobile)"
          strokeWidth="5"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={isInView ? { pathLength: 1 } : {}}
          transition={{ duration: 2, ease: 'easeInOut', delay: 0.3 }}
        />
      </svg>

      {/* Station Nodes */}
      {stationsMobile.map((station, index) => (
        <StationNode
          key={station.id}
          station={station}
          isActive={activeStation === station.id}
          onToggle={() => setActiveStation(activeStation === station.id ? null : station.id)}
          index={index}
          isInView={isInView}
        />
      ))}
    </div>
  )
}

// Station Node Component
function StationNode({
  station,
  isActive,
  onToggle,
  index,
  isInView,
}: {
  station: MetroStation
  isActive: boolean
  onToggle: () => void
  index: number
  isInView: boolean
}) {
  const Icon = iconMap[station.icon]

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={isInView ? { scale: 1, opacity: 1 } : {}}
      transition={{ duration: 0.4, delay: 0.5 + index * 0.15, type: 'spring' }}
      className="absolute z-20"
      style={{
        left: `${station.x}%`,
        top: `${station.y}%`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      {/* Station Marker (Circle) */}
      <motion.button
        onClick={onToggle}
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.95 }}
        className={`relative flex h-14 w-14 items-center justify-center rounded-full border-4 border-white shadow-lg transition-all ${
          isActive
            ? 'bg-gradient-to-br from-french-blue-500 to-french-blue-600 ring-4 ring-french-blue-200'
            : 'bg-gradient-to-br from-parisian-beige-400 to-parisian-beige-600 hover:ring-4 hover:ring-parisian-beige-200'
        }`}
      >
        <span className="font-playfair text-xl font-bold text-white">{station.letter}</span>

        {/* Pulse Effect */}
        {isActive && (
          <motion.div
            className="absolute inset-0 rounded-full bg-french-blue-400"
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ scale: 1.8, opacity: 0 }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
      </motion.button>

      {/* Station Title (Always Visible) */}
      <motion.div
        className="pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-white/90 px-3 py-1 text-center text-sm font-semibold text-parisian-grey-800 shadow-md backdrop-blur-sm"
        initial={{ opacity: 0, y: -10 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.7 + index * 0.15 }}
      >
        {station.title}
      </motion.div>

      {/* Info Card (Glassmorphism) - Shows on Click/Active */}
      {isActive && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 10 }}
          className="absolute left-1/2 top-full z-30 mt-16 w-64 -translate-x-1/2"
        >
          <div className="glass-strong relative rounded-2xl border border-white/30 bg-white/95 p-6 shadow-2xl backdrop-blur-xl">
            {/* Close Button */}
            <button
              onClick={onToggle}
              className="absolute right-2 top-2 rounded-full p-1 text-parisian-grey-500 transition-colors hover:bg-parisian-beige-100 hover:text-parisian-grey-800"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Icon */}
            {Icon && (
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-parisian-beige-100 to-parisian-beige-200">
                <Icon className="h-6 w-6 text-parisian-beige-600" />
              </div>
            )}

            {/* Content */}
            <h3 className="mb-2 font-playfair text-xl font-bold text-parisian-grey-800">
              {station.title}
            </h3>
            <p className="text-sm leading-relaxed text-parisian-grey-600">
              {station.description}
            </p>

            {/* Arrow pointing to marker */}
            <div className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-white/95" />
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
