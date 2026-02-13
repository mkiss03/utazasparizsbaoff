'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MapPin,
  ChevronLeft,
  ChevronRight,
  Star,
  Lightbulb,
  Sparkles,
  Map,
  Ticket,
  Coffee,
  Camera,
  BookOpen,
  Crown,
  RotateCcw,
} from 'lucide-react'
import {
  DistrictContent,
  ParisGuideStyles,
  ParisGuideGlobalContent,
} from '@/lib/types/database'

// Simplified SVG paths for the 20 arrondissements (approximate shapes)
const DISTRICT_PATHS: Record<number, string> = {
  1: 'M 480,265 L 520,250 L 545,270 L 540,300 L 510,310 L 475,295 Z',
  2: 'M 520,250 L 560,235 L 580,255 L 570,280 L 545,270 Z',
  3: 'M 580,255 L 620,245 L 635,275 L 615,300 L 570,280 Z',
  4: 'M 510,310 L 540,300 L 570,280 L 615,300 L 600,335 L 545,345 L 505,330 Z',
  5: 'M 505,330 L 545,345 L 560,385 L 520,410 L 480,380 Z',
  6: 'M 430,330 L 480,295 L 505,330 L 480,380 L 440,370 Z',
  7: 'M 350,290 L 430,280 L 475,295 L 430,330 L 380,350 L 340,320 Z',
  8: 'M 380,220 L 450,200 L 520,250 L 475,295 L 430,280 L 380,260 Z',
  9: 'M 450,200 L 520,180 L 560,235 L 520,250 Z',
  10: 'M 520,180 L 600,165 L 620,245 L 580,255 L 560,235 Z',
  11: 'M 620,245 L 680,235 L 700,295 L 670,340 L 615,300 L 635,275 Z',
  12: 'M 615,300 L 670,340 L 700,410 L 620,440 L 560,385 L 600,335 Z',
  13: 'M 480,380 L 520,410 L 560,385 L 620,440 L 580,500 L 480,480 L 440,420 Z',
  14: 'M 380,350 L 440,370 L 480,380 L 440,420 L 380,440 L 340,390 Z',
  15: 'M 280,320 L 340,320 L 380,350 L 340,390 L 300,440 L 240,400 L 260,340 Z',
  16: 'M 240,220 L 320,200 L 380,220 L 380,260 L 350,290 L 340,320 L 280,320 L 240,280 Z',
  17: 'M 320,140 L 420,120 L 450,200 L 380,220 L 320,200 L 300,160 Z',
  18: 'M 420,120 L 520,100 L 560,140 L 520,180 L 450,200 Z',
  19: 'M 560,140 L 650,120 L 700,180 L 680,235 L 620,245 L 600,165 Z',
  20: 'M 680,235 L 700,180 L 750,220 L 760,300 L 700,295 Z',
}

interface DistrictGuidePreviewProps {
  globalContent: ParisGuideGlobalContent
  districts: DistrictContent[]
  styles: ParisGuideStyles
}

// Icon mapping
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  MapPin,
  Star,
  Ticket,
  Sparkles,
  Coffee,
  Camera,
  BookOpen,
  Crown,
  Lightbulb,
  Map,
}

export default function DistrictGuidePreview({
  globalContent,
  districts,
  styles,
}: DistrictGuidePreviewProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [hoveredDistrict, setHoveredDistrict] = useState<number | null>(null)

  // Filter and sort active districts
  const activeDistricts = useMemo(() => {
    return districts
      .filter((d) => d.isActive)
      .sort((a, b) => a.sortOrder - b.sortOrder)
  }, [districts])

  const activeDistrict = activeDistricts[activeIndex]

  const navigate = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && activeIndex > 0) {
      setActiveIndex(activeIndex - 1)
    } else if (direction === 'next' && activeIndex < activeDistricts.length - 1) {
      setActiveIndex(activeIndex + 1)
    }
  }

  const handleMapClick = (districtNumber: number) => {
    const index = activeDistricts.findIndex((d) => d.districtNumber === districtNumber)
    if (index !== -1) {
      setActiveIndex(index)
    }
  }

  const getIcon = (iconName?: string) => {
    return iconMap[iconName || 'MapPin'] || MapPin
  }

  const shadowClass = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
    '2xl': 'shadow-2xl',
  }[styles.card.shadowIntensity]

  if (activeDistricts.length === 0) {
    return (
      <div
        className="rounded-xl p-8 text-center"
        style={{ backgroundColor: styles.sectionBackground }}
      >
        <Map className="w-12 h-12 mx-auto mb-4 text-slate-300" />
        <p className="text-slate-500">Nincs aktív kerület kiválasztva</p>
        <p className="text-sm text-slate-400 mt-1">
          Aktiválj legalább egy kerületet az előnézet megjelenítéséhez
        </p>
      </div>
    )
  }

  return (
    <div className="sticky top-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-900">Élő előnézet</h3>
        <button
          type="button"
          onClick={() => setActiveIndex(0)}
          className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
      </div>

      {/* Preview Container */}
      <div
        className="rounded-2xl p-4 overflow-hidden"
        style={{ backgroundColor: styles.sectionBackground }}
      >
        {/* Header */}
        <div className="text-center mb-4">
          <div
            className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider mb-2"
            style={{ color: styles.subheadingColor }}
          >
            <Map className="w-4 h-4" />
            Kerületi Útmutató
          </div>
          <h2
            className="font-playfair text-xl font-bold mb-1"
            style={{ color: styles.headingColor }}
          >
            {globalContent.mainTitle}
          </h2>
          <p className="text-sm" style={{ color: styles.subheadingColor }}>
            {globalContent.subtitle}
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Left: Map */}
          <div
            className="rounded-xl p-3 border"
            style={{
              backgroundColor: styles.card.backgroundColor,
              borderColor: styles.card.borderColor,
            }}
          >
            <svg viewBox="200 80 600 460" className="w-full h-auto">
              {/* Background */}
              <rect x="200" y="80" width="600" height="460" fill={styles.sectionBackground} />

              {/* District paths */}
              {Object.entries(DISTRICT_PATHS).map(([num, path]) => {
                const districtNum = parseInt(num)
                const district = districts.find((d) => d.districtNumber === districtNum)
                const isActive = district?.isActive
                const isSelected = activeDistrict?.districtNumber === districtNum
                const isHovered = hoveredDistrict === districtNum

                let fillColor = styles.map.baseColor
                if (isSelected) fillColor = styles.map.activeColor
                else if (isHovered && isActive) fillColor = styles.map.hoverColor

                return (
                  <g key={num}>
                    <path
                      d={path}
                      fill={fillColor}
                      stroke={styles.map.strokeColor}
                      strokeWidth={styles.map.strokeWidth}
                      className={isActive ? 'cursor-pointer' : 'cursor-not-allowed'}
                      style={{
                        transition: 'fill 0.2s ease',
                        opacity: isActive ? 1 : 0.5,
                      }}
                      onClick={() => isActive && handleMapClick(districtNum)}
                      onMouseEnter={() => setHoveredDistrict(districtNum)}
                      onMouseLeave={() => setHoveredDistrict(null)}
                    />
                  </g>
                )
              })}
            </svg>

            {/* Mini Legend */}
            <div className="flex items-center justify-center gap-3 mt-2 text-[10px]">
              <div className="flex items-center gap-1">
                <div
                  className="w-3 h-3 rounded"
                  style={{ backgroundColor: styles.map.activeColor }}
                />
                <span style={{ color: styles.card.bodyTextColor }}>
                  {globalContent.legendActiveText}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <div
                  className="w-3 h-3 rounded border"
                  style={{
                    backgroundColor: styles.map.baseColor,
                    borderColor: styles.map.strokeColor,
                  }}
                />
                <span style={{ color: styles.card.bodyTextColor }}>
                  {globalContent.legendInactiveText}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Content Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeDistrict?.districtNumber}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className={`rounded-xl overflow-hidden border ${shadowClass}`}
              style={{
                backgroundColor: styles.card.backgroundColor,
                borderColor: styles.card.borderColor,
                borderRadius: `${styles.card.borderRadius}px`,
              }}
            >
              {/* Card Header */}
              <div
                className="p-3"
                style={{
                  background: `linear-gradient(to right, ${styles.card.headerGradientFrom}, ${styles.card.headerGradientTo})`,
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      {(() => {
                        const Icon = getIcon(activeDistrict?.iconName)
                        return <Icon className="w-3 h-3" style={{ color: styles.card.subtitleColor }} />
                      })()}
                      <span
                        className="text-[10px] font-medium"
                        style={{ color: styles.card.subtitleColor }}
                      >
                        {activeIndex + 1} / {activeDistricts.length}
                      </span>
                    </div>
                    <h3
                      className="font-playfair text-sm font-bold"
                      style={{ color: styles.card.titleColor }}
                    >
                      {activeDistrict?.title}
                    </h3>
                    {activeDistrict?.subtitle && (
                      <p
                        className="text-[10px]"
                        style={{ color: styles.card.subtitleColor }}
                      >
                        {activeDistrict.subtitle}
                      </p>
                    )}
                  </div>
                  <span
                    className="text-2xl font-bold opacity-30"
                    style={{ color: styles.card.titleColor }}
                  >
                    {activeIndex + 1}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-3 space-y-2">
                <p
                  className="text-[10px] leading-relaxed line-clamp-3"
                  style={{ color: styles.card.bodyTextColor }}
                >
                  {activeDistrict?.description}
                </p>

                {/* Best For Tags */}
                {activeDistrict?.bestFor && activeDistrict.bestFor.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {activeDistrict.bestFor.slice(0, 3).map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[8px] px-1.5 py-0.5 rounded-full border"
                        style={{
                          borderColor: styles.card.borderColor,
                          color: styles.card.bodyTextColor,
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Local Tips */}
                {activeDistrict?.localTips && (
                  <div
                    className="rounded-lg p-2 mt-2"
                    style={{ backgroundColor: styles.sectionBackground }}
                  >
                    <div className="flex items-center gap-1 mb-1">
                      <Lightbulb
                        className="w-3 h-3"
                        style={{ color: styles.card.accentColor }}
                      />
                      <span
                        className="text-[9px] font-semibold"
                        style={{ color: styles.card.accentColor }}
                      >
                        Tipp
                      </span>
                    </div>
                    <p
                      className="text-[9px] line-clamp-2"
                      style={{ color: styles.card.bodyTextColor }}
                    >
                      {activeDistrict.localTips}
                    </p>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => navigate('prev')}
                    disabled={activeIndex === 0}
                    className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{
                      backgroundColor: styles.sectionBackground,
                      color: styles.card.bodyTextColor,
                    }}
                  >
                    <ChevronLeft className="w-3 h-3" />
                    Előző
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('next')}
                    disabled={activeIndex === activeDistricts.length - 1}
                    className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{
                      backgroundColor: styles.card.accentColor,
                      color: styles.card.titleColor,
                    }}
                  >
                    Következő
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Timeline Preview */}
        <div
          className="mt-4 rounded-xl p-3 border"
          style={{
            backgroundColor: styles.card.backgroundColor,
            borderColor: styles.card.borderColor,
          }}
        >
          <p
            className="text-[10px] font-semibold text-center mb-2"
            style={{ color: styles.card.accentColor }}
          >
            {globalContent.timelineTitle}
          </p>

          <div className="flex items-center justify-center overflow-x-auto">
            {activeDistricts.slice(0, 6).map((district, idx) => (
              <div key={district.districtNumber} className="flex items-center">
                <button
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  className="flex flex-col items-center"
                >
                  <motion.div
                    animate={{
                      scale: idx === activeIndex ? 1.2 : 1,
                      backgroundColor:
                        idx === activeIndex
                          ? styles.timeline.dotColorActive
                          : idx < activeIndex
                          ? styles.timeline.lineColorActive
                          : styles.timeline.dotColorInactive,
                    }}
                    className="rounded-full border-2 border-white shadow-sm"
                    style={{
                      width: `${styles.timeline.dotSize * 0.6}px`,
                      height: `${styles.timeline.dotSize * 0.6}px`,
                    }}
                  />
                  <span
                    className="text-[8px] mt-1 whitespace-nowrap"
                    style={{
                      color:
                        idx === activeIndex
                          ? styles.timeline.labelColorActive
                          : styles.timeline.labelColorInactive,
                      fontWeight: idx === activeIndex ? 600 : 400,
                    }}
                  >
                    {idx + 1}. ker.
                  </span>
                </button>

                {idx < Math.min(activeDistricts.length - 1, 5) && (
                  <div
                    className="w-6 h-0.5 mx-1"
                    style={{
                      backgroundColor:
                        idx < activeIndex
                          ? styles.timeline.lineColorActive
                          : styles.timeline.lineColor,
                    }}
                  />
                )}
              </div>
            ))}
            {activeDistricts.length > 6 && (
              <span
                className="text-[9px] ml-2"
                style={{ color: styles.timeline.labelColorInactive }}
              >
                +{activeDistricts.length - 6} más
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Preview Controls */}
      <div className="mt-4 flex items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => navigate('prev')}
          disabled={activeIndex === 0}
          className="px-3 py-1.5 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Előző
        </button>
        <span className="text-sm text-slate-500">
          {activeIndex + 1} / {activeDistricts.length}
        </span>
        <button
          type="button"
          onClick={() => navigate('next')}
          disabled={activeIndex === activeDistricts.length - 1}
          className="px-3 py-1.5 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Következő
        </button>
      </div>
    </div>
  )
}
