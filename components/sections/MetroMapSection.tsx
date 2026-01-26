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

// Desktop Version - Horizontal S-Curve
function MetroMapDesktop({ isInView }: { isInView: boolean }) {
  const [activeStation, setActiveStation] = useState<string | null>(null)

  return (
    <div className="relative h-[500px] w-full overflow-visible rounded-3xl border-2 border-parisian-beige-200 bg-white shadow-2xl pb-16">
      {/* Background Map Image with Overlay */}
      <div className="absolute inset-0 overflow-hidden rounded-3xl">
        {/* Paris Map Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/images/ujmetro.png)' }}
        />
        {/* Light overlay so map is visible but doesn't compete with content */}
        <div className="absolute inset-0 bg-white/85" />
      </div>

      {/* SVG Metro Line */}
      <svg
        className="absolute inset-0 h-full w-full pointer-events-none"
        viewBox="0 0 1000 500"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#EBE0BB" />
            <stop offset="50%" stopColor="#E6D9AC" />
            <stop offset="100%" stopColor="#EBE0BB" />
          </linearGradient>
        </defs>

        {/* Wide S-Curve Path spanning full width */}
        <motion.path
          d="M 80 250 Q 300 180, 500 235 T 920 250"
          fill="none"
          stroke="url(#lineGradient)"
          strokeWidth="5"
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
        {/* Paris Map Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/images/ujmetro.png)' }}
        />
        {/* Light overlay so map is visible but doesn't compete with content */}
        <div className="absolute inset-0 bg-white/85" />
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

        {/* Vertical Smooth S-Curve Path */}
        <motion.path
          d="M 200 96 Q 240 224, 200 384 Q 160 544, 200 704"
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
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
        className={`relative flex h-12 w-12 items-center justify-center rounded-full border-3 border-white shadow-lg transition-all ${
          isActive
            ? 'bg-gradient-to-br from-french-blue-500 to-french-blue-600 ring-2 ring-french-blue-300'
            : 'bg-gradient-to-br from-parisian-beige-400 to-parisian-beige-600 hover:ring-2 hover:ring-parisian-beige-300'
        }`}
      >
        <span className="font-playfair text-lg font-bold text-white">{station.letter}</span>

        {/* Pulse Effect */}
        {isActive && (
          <motion.div
            className="absolute inset-0 rounded-full bg-french-blue-400"
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
      </motion.button>

      {/* Station Title (Always Visible) */}
      <motion.div
        className="pointer-events-none absolute left-1/2 top-full mt-3 -translate-x-1/2 whitespace-nowrap rounded-lg bg-white/95 px-2.5 py-1 text-center text-xs font-semibold text-parisian-grey-800 shadow-md backdrop-blur-sm max-w-[140px]"
        initial={{ opacity: 0, y: -10 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.7 + index * 0.15 }}
      >
        <span className="line-clamp-2">{station.title}</span>
      </motion.div>

      {/* Modal Backdrop - Fixed fullscreen */}
      {isActive && (
        <>
          {/* Dark Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onToggle}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
          />

          {/* Modal Card - Centered and Scrollable */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed left-1/2 top-1/2 z-50 max-h-[85vh] w-[90vw] max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-3xl bg-white shadow-2xl"
            style={{ position: 'fixed' }}
          >
            <div className="max-h-[85vh] overflow-y-auto">
              <div className="relative p-6 md:p-8">
                {/* Close Button */}
                <button
                  onClick={onToggle}
                  className="absolute right-4 top-4 z-10 rounded-full bg-parisian-grey-100 p-2 text-parisian-grey-600 transition-colors hover:bg-parisian-grey-200 hover:text-parisian-grey-800"
                >
                  <X className="h-5 w-5" />
                </button>

                {/* Icon */}
                {Icon && (
                  <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-parisian-beige-100 to-parisian-beige-200 shadow-md">
                    <Icon className="h-8 w-8 text-parisian-beige-600" />
                  </div>
                )}

                {/* Title */}
                <h3 className="mb-3 font-playfair text-2xl font-bold text-parisian-grey-800 md:text-3xl">
                  {station.title}
                </h3>

                {/* Description */}
                <p className="mb-6 text-base leading-relaxed text-parisian-grey-600 md:text-lg">
                  {station.description}
                </p>

                {/* Details List */}
                {station.details && station.details.length > 0 && (
                  <div className="space-y-3 rounded-2xl bg-gradient-to-br from-parisian-cream-50 to-parisian-beige-50 p-6">
                    {station.details.map((detail, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 text-sm leading-relaxed text-parisian-grey-700 md:text-base"
                      >
                        <div className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-parisian-beige-500" />
                        <span>{detail}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </motion.div>
  )
}
