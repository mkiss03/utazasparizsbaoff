'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MapPin,
  ChevronLeft,
  ChevronRight,
  Star,
  Lightbulb,
  AlertTriangle,
  Sparkles,
  Map,
  Ticket,
  List,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import {
  DistrictGuide,
  ParisGuideStyles,
  ParisGuideGlobalContent,
  DistrictContent,
  createDefaultParisGuideConfig,
} from '@/lib/types/database'
import ParisArrondissementsSVG from '@/components/maps/ParisArrondissementsSVG'

// Convert DistrictContent (from config) to DistrictGuide format
function convertToDistrictGuide(district: DistrictContent): DistrictGuide {
  return {
    id: String(district.districtNumber),
    district_number: district.districtNumber,
    title: district.title,
    subtitle: district.subtitle,
    description: district.description,
    highlights: district.highlights,
    content_layout: district.layoutType === 'rich_ticket' ? 'rich_ticket' : district.layoutType === 'rich_list' ? 'rich_list' : 'standard',
    sort_order: district.sortOrder,
    is_active: district.isActive,
    main_attraction: district.mainAttraction,
    local_tips: district.localTips,
    best_for: district.bestFor,
    avoid_tips: district.avoidTips,
    accent_color: district.accentColor || 'slate',
    icon_name: district.iconName || 'MapPin',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
}

// Fallback data for when database is empty
const fallbackDistricts: DistrictGuide[] = [
  {
    id: '1',
    district_number: 7,
    title: '7. kerület - Eiffel-torony',
    subtitle: 'Az ikonikus negyed',
    description: 'Az Eiffel-torony, Invalidusok és az Orsay Múzeum. A legtöbb turista itt kezdi a párizsi kalandját.',
    highlights: ['Eiffel-torony', 'Musée d\'Orsay', 'Invalidusok', 'Champ de Mars'],
    content_layout: 'rich_ticket',
    sort_order: 1,
    is_active: true,
    main_attraction: 'Az Eiffel-torony - Párizs ikonikus szimbóluma',
    local_tips: 'A legjobb kilátás a Trocadéróról van. Kerüld a csúcsidőt (10-14 óra)!',
    best_for: ['Turisták', 'Romantika', 'Fotózás'],
    accent_color: 'slate',
    icon_name: 'Ticket',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    district_number: 18,
    title: '18. kerület - Montmartre',
    subtitle: 'Bohém Párizs',
    description: 'A Sacré-Cœur bazilika, művészek tere és a Moulin Rouge otthona. A legikonikusabb negyed a művészet szerelmeseinek.',
    highlights: ['Sacré-Cœur', 'Place du Tertre', 'Moulin Rouge', 'Montmartre szőlőskert'],
    content_layout: 'rich_ticket',
    sort_order: 2,
    is_active: true,
    main_attraction: 'Sacré-Cœur bazilika és a páratlan kilátás',
    local_tips: 'Reggel érkezz, mielőtt megérkeznek a turistacsoportok. A funiculaire megspórolja a lépcsőzést!',
    best_for: ['Művészet', 'Romantika', 'Kilátás'],
    accent_color: 'slate',
    icon_name: 'Star',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    district_number: 4,
    title: '4. kerület - Notre-Dame és Marais',
    subtitle: 'A szív és a lélek',
    description: 'Notre-Dame, Hôtel de Ville, és a Marais negyed. A párizsi romantika és történelem epicentruma.',
    highlights: ['Notre-Dame', 'Marais', 'Place des Vosges', 'Île de la Cité'],
    content_layout: 'standard',
    sort_order: 3,
    is_active: true,
    main_attraction: 'Notre-Dame katedrális (felújítás alatt)',
    local_tips: 'A falafel a Rue des Rosiers-n kötelező! Vasárnap délelőtt a legnyugisabb.',
    best_for: ['Történelem', 'Gasztronómia', 'Séta'],
    accent_color: 'slate',
    icon_name: 'MapPin',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

// Default styles for fallback
const defaultConfig = createDefaultParisGuideConfig()

// Icon mapping
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  MapPin,
  Star,
  Lightbulb,
  Ticket,
  List,
  Map,
  Sparkles,
}

// Shadow intensity mapping
const shadowMap: Record<string, string> = {
  none: 'shadow-none',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl',
  '2xl': 'shadow-2xl',
}

export default function ParisDistrictGuide() {
  const [districts, setDistricts] = useState<DistrictGuide[]>([])
  const [activeIndex, setActiveIndex] = useState(0)
  const [hoveredDistrict, setHoveredDistrict] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [styles, setStyles] = useState<ParisGuideStyles>(defaultConfig.styles)
  const [globalContent, setGlobalContent] = useState<ParisGuideGlobalContent>(defaultConfig.globalContent)
  const timelineRef = useRef<HTMLDivElement>(null)

  // Fetch config and districts from Supabase
  useEffect(() => {
    async function fetchConfig() {
      try {
        const supabase = createClient()

        // First try to get config from paris_guide_configs
        const { data: configData, error: configError } = await supabase
          .from('paris_guide_configs')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(1)
          .single()

        if (configError && configError.code !== 'PGRST116') {
          console.error('Error fetching paris guide config:', configError)
        }

        if (configData) {
          // Use config from admin panel
          if (configData.styles) {
            setStyles(configData.styles)
          }
          if (configData.global_content) {
            setGlobalContent(configData.global_content)
          }
          if (configData.districts && configData.districts.length > 0) {
            // Convert DistrictContent[] to DistrictGuide[] and filter active ones
            const activeDistricts = configData.districts
              .filter((d: DistrictContent) => d.isActive)
              .sort((a: DistrictContent, b: DistrictContent) => a.sortOrder - b.sortOrder)
              .map(convertToDistrictGuide)

            if (activeDistricts.length > 0) {
              setDistricts(activeDistricts)
              setIsLoading(false)
              return
            }
          }
        }

        // Fallback: fetch from district_guides table
        const { data, error } = await supabase
          .from('district_guides')
          .select('*')
          .eq('is_active', true)
          .order('sort_order', { ascending: true })

        if (error) {
          console.error('Error fetching districts:', error)
          setDistricts(fallbackDistricts)
        } else if (data && data.length > 0) {
          setDistricts(data)
        } else {
          setDistricts(fallbackDistricts)
        }
      } catch (err) {
        console.error('Failed to fetch config:', err)
        setDistricts(fallbackDistricts)
      } finally {
        setIsLoading(false)
      }
    }

    fetchConfig()
  }, [])

  const activeDistrict = districts[activeIndex]

  // Navigate to next/previous
  const navigate = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && activeIndex > 0) {
      setActiveIndex(activeIndex - 1)
    } else if (direction === 'next' && activeIndex < districts.length - 1) {
      setActiveIndex(activeIndex + 1)
    }
  }

  // Handle map click
  const handleMapClick = (districtNumber: number) => {
    const index = districts.findIndex((d) => d.district_number === districtNumber)
    if (index !== -1) {
      setActiveIndex(index)
    }
  }

  // Scroll timeline to active item
  useEffect(() => {
    if (timelineRef.current) {
      const activeItem = timelineRef.current.querySelector(`[data-index="${activeIndex}"]`)
      if (activeItem) {
        activeItem.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
      }
    }
  }, [activeIndex])

  // Get icon component
  const getIcon = (iconName?: string) => {
    const Icon = iconMap[iconName || 'MapPin'] || MapPin
    return Icon
  }

  if (isLoading) {
    return (
      <section className="py-16" style={{ backgroundColor: styles.sectionBackground }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-8 bg-stone-200 rounded w-64 mb-4" />
            <div className="h-4 bg-stone-100 rounded w-96 mb-8" />
            <div className="w-full h-96 bg-stone-50 rounded-2xl" />
          </div>
        </div>
      </section>
    )
  }

  if (districts.length === 0) {
    return null
  }

  return (
    <section className="py-16" id="district-guide" style={{ backgroundColor: styles.sectionBackground }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span
            className="inline-flex items-center gap-2 font-semibold text-sm uppercase tracking-wider mb-3"
            style={{ color: styles.subheadingColor }}
          >
            <Map className="w-4 h-4" />
            {globalContent.timelineTitle}
          </span>
          <h2
            className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
            style={{ color: styles.headingColor }}
          >
            {globalContent.mainTitle}
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: styles.subheadingColor }}>
            {globalContent.subtitle}
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left: Map */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div
              className={`p-4 md:p-6 border ${shadowMap[styles.card.shadowIntensity]}`}
              style={{
                backgroundColor: styles.card.backgroundColor,
                borderColor: styles.card.borderColor,
                borderRadius: `${styles.card.borderRadius}px`,
              }}
            >
              <div className="w-full">
                <ParisArrondissementsSVG
                  activeDistrict={hoveredDistrict || activeDistrict?.district_number || null}
                  onDistrictClick={handleMapClick}
                  onDistrictHover={setHoveredDistrict}
                  mapStyles={styles.map}
                  sectionBackground={styles.sectionBackground}
                />
              </div>

              {/* Map Legend */}
              <div className="mt-4 flex items-center justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: styles.map.activeColor }} />
                  <span style={{ color: styles.card.bodyTextColor }}>{globalContent.legendActiveText}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: styles.map.hoverColor }} />
                  <span style={{ color: styles.card.bodyTextColor }}>{globalContent.legendVisitedText}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded border"
                    style={{ backgroundColor: styles.map.baseColor, borderColor: styles.map.strokeColor }}
                  />
                  <span style={{ color: styles.card.bodyTextColor }}>{globalContent.legendInactiveText}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Content Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeDistrict?.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className={`overflow-hidden border ${shadowMap[styles.card.shadowIntensity]}`}
                style={{
                  backgroundColor: styles.card.backgroundColor,
                  borderColor: styles.card.borderColor,
                  borderRadius: `${styles.card.borderRadius}px`,
                }}
              >
                {/* Card Header - Dynamic gradient */}
                <div
                  className="p-6"
                  style={{
                    background: `linear-gradient(to right, ${styles.card.headerGradientFrom}, ${styles.card.headerGradientTo})`,
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        {(() => {
                          const Icon = getIcon(activeDistrict?.icon_name)
                          return <Icon className="w-5 h-5" style={{ color: styles.card.subtitleColor }} />
                        })()}
                        <span className="text-sm font-medium" style={{ color: styles.card.subtitleColor }}>
                          {activeIndex + 1} / {districts.length}
                        </span>
                      </div>
                      <h3
                        className="font-playfair text-2xl md:text-3xl font-bold mb-1"
                        style={{ color: styles.card.titleColor }}
                      >
                        {activeDistrict?.title}
                      </h3>
                      {activeDistrict?.subtitle && (
                        <p style={{ color: styles.card.subtitleColor }}>{activeDistrict.subtitle}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-4xl font-bold opacity-30" style={{ color: styles.card.titleColor }}>
                        {activeDistrict?.district_number}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6">
                  {/* Description */}
                  <p className="leading-relaxed mb-6" style={{ color: styles.card.bodyTextColor }}>
                    {activeDistrict?.description}
                  </p>

                  {/* Best For Tags */}
                  {activeDistrict?.best_for && activeDistrict.best_for.length > 0 && (
                    <div className="mb-6">
                      <h4
                        className="text-sm font-semibold mb-2 flex items-center gap-2"
                        style={{ color: styles.headingColor }}
                      >
                        <Sparkles className="w-4 h-4" style={{ color: styles.card.accentColor }} />
                        Ideális, ha...
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {activeDistrict.best_for.map((tag, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm border"
                            style={{
                              backgroundColor: `${styles.card.accentColor}15`,
                              color: styles.card.bodyTextColor,
                              borderColor: styles.card.borderColor,
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Highlights */}
                  {activeDistrict?.highlights && activeDistrict.highlights.length > 0 && (
                    <div className="mb-6">
                      <h4
                        className="text-sm font-semibold mb-2 flex items-center gap-2"
                        style={{ color: styles.headingColor }}
                      >
                        <Star className="w-4 h-4" style={{ color: styles.card.accentColor }} />
                        Fő látnivalók
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {activeDistrict.highlights.map((highlight, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2 text-sm"
                            style={{ color: styles.card.bodyTextColor }}
                          >
                            <div
                              className="w-1.5 h-1.5 rounded-full"
                              style={{ backgroundColor: styles.card.accentColor }}
                            />
                            {highlight}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Local Tips */}
                  {activeDistrict?.local_tips && (
                    <div
                      className="rounded-xl p-4 border"
                      style={{
                        backgroundColor: `${styles.card.accentColor}10`,
                        borderColor: styles.card.borderColor,
                      }}
                    >
                      <h4
                        className="text-sm font-semibold mb-2 flex items-center gap-2"
                        style={{ color: styles.headingColor }}
                      >
                        <Lightbulb className="w-4 h-4" style={{ color: styles.card.accentColor }} />
                        Viktória tippje
                      </h4>
                      <p className="text-sm" style={{ color: styles.card.bodyTextColor }}>
                        {activeDistrict.local_tips}
                      </p>
                    </div>
                  )}

                  {/* Avoid Tips (if any) */}
                  {activeDistrict?.avoid_tips && (
                    <div className="mt-4 bg-red-50 rounded-xl p-4 border border-red-100">
                      <h4 className="text-sm font-semibold text-red-800 mb-2 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                        Kerüld el
                      </h4>
                      <p className="text-sm text-red-700">{activeDistrict.avoid_tips}</p>
                    </div>
                  )}

                  {/* Rich Ticket Layout (special design) */}
                  {activeDistrict?.content_layout === 'rich_ticket' && activeDistrict?.main_attraction && (
                    <div
                      className="mt-6 rounded-xl p-5"
                      style={{
                        background: `linear-gradient(to bottom right, ${styles.card.headerGradientFrom}, ${styles.card.headerGradientTo})`,
                      }}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <Ticket className="w-5 h-5" style={{ color: styles.card.subtitleColor }} />
                        <span
                          className="font-semibold text-sm uppercase tracking-wider"
                          style={{ color: styles.card.subtitleColor }}
                        >
                          Fő attrakció
                        </span>
                      </div>
                      <p style={{ color: styles.card.titleColor, opacity: 0.9 }}>
                        {activeDistrict.main_attraction}
                      </p>
                    </div>
                  )}
                </div>

                {/* Navigation Buttons */}
                <div className="px-6 pb-6 flex items-center justify-between">
                  <button
                    onClick={() => navigate('prev')}
                    disabled={activeIndex === 0}
                    className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-80"
                    style={{
                      backgroundColor: `${styles.card.accentColor}15`,
                      color: styles.card.bodyTextColor,
                    }}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Előző
                  </button>
                  <button
                    onClick={() => navigate('next')}
                    disabled={activeIndex === districts.length - 1}
                    className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-80"
                    style={{
                      backgroundColor: styles.card.accentColor,
                      color: styles.card.titleColor,
                    }}
                  >
                    Következő
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Timeline Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12"
        >
          <div
            className={`rounded-2xl p-4 md:p-6 border ${shadowMap[styles.card.shadowIntensity]}`}
            style={{
              backgroundColor: styles.card.backgroundColor,
              borderColor: styles.card.borderColor,
              borderRadius: `${styles.card.borderRadius}px`,
            }}
          >
            <h4
              className="text-sm font-semibold mb-4 text-center"
              style={{ color: styles.headingColor }}
            >
              {globalContent.timelineTitle}
            </h4>

            {/* Scrollable Timeline */}
            <div
              ref={timelineRef}
              className="overflow-x-auto scrollbar-hide pb-2"
            >
              <div className="flex items-center min-w-max px-4">
                {districts.map((district, idx) => (
                  <div
                    key={district.id}
                    data-index={idx}
                    className="flex items-center"
                  >
                    {/* Timeline Node */}
                    <button
                      onClick={() => setActiveIndex(idx)}
                      className={`relative flex flex-col items-center group`}
                    >
                      {/* Dot */}
                      <motion.div
                        animate={{
                          scale: idx === activeIndex ? 1.3 : 1,
                          backgroundColor:
                            idx === activeIndex
                              ? styles.timeline.dotColorActive
                              : idx < activeIndex
                              ? styles.timeline.lineColorActive
                              : styles.timeline.dotColorInactive,
                        }}
                        style={{
                          width: `${styles.timeline.dotSize}px`,
                          height: `${styles.timeline.dotSize}px`,
                        }}
                        className={`rounded-full border-2 border-white shadow-sm transition-all ${
                          idx === activeIndex ? 'ring-4' : ''
                        }`}
                      />

                      {/* Label */}
                      <span
                        className="mt-2 text-xs font-medium whitespace-nowrap transition-colors"
                        style={{
                          color:
                            idx === activeIndex
                              ? styles.timeline.labelColorActive
                              : styles.timeline.labelColorInactive,
                        }}
                      >
                        {district.district_number}. ker.
                      </span>

                      {/* Active indicator */}
                      {idx === activeIndex && (
                        <motion.div
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="absolute -top-6"
                        >
                          <MapPin
                            className="w-4 h-4"
                            style={{
                              color: styles.timeline.pinColor,
                              fill: styles.timeline.pinColor,
                            }}
                          />
                        </motion.div>
                      )}
                    </button>

                    {/* Connector Line */}
                    {idx < districts.length - 1 && (
                      <div
                        className="w-12 md:w-20 h-0.5 mx-1 transition-colors"
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
              </div>
            </div>

            {/* Progress indicator */}
            <div
              className="mt-4 flex items-center justify-center gap-2 text-sm"
              style={{ color: styles.timeline.labelColorInactive }}
            >
              <span>{activeIndex + 1}</span>
              <div
                className="w-24 h-1.5 rounded-full overflow-hidden"
                style={{ backgroundColor: styles.timeline.lineColor }}
              >
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: styles.timeline.dotColorActive }}
                  animate={{
                    width: `${((activeIndex + 1) / districts.length) * 100}%`,
                  }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <span>{districts.length}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
