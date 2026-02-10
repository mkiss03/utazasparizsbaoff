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
import { DistrictGuide } from '@/lib/types/database'
import ParisArrondissementsSVG from '@/components/maps/ParisArrondissementsSVG'

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

export default function ParisDistrictGuide() {
  const [districts, setDistricts] = useState<DistrictGuide[]>([])
  const [activeIndex, setActiveIndex] = useState(0)
  const [hoveredDistrict, setHoveredDistrict] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const timelineRef = useRef<HTMLDivElement>(null)

  // Fetch districts from Supabase
  useEffect(() => {
    async function fetchDistricts() {
      try {
        const supabase = createClient()
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
        console.error('Failed to fetch districts:', err)
        setDistricts(fallbackDistricts)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDistricts()
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
      <section className="py-16 bg-[#FAF7F2]">
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
    <section className="py-16 bg-[#FAF7F2]" id="district-guide">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 text-slate-600 font-semibold text-sm uppercase tracking-wider mb-3">
            <Map className="w-4 h-4" />
            Kerületi Útmutató
          </span>
          <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            Fedezd fel Párizs kerületeit
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Minden kerületnek megvan a saját karaktere. Kattints a térképre vagy navigálj az idővonalon!
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
            <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 border border-stone-200">
              <div className="w-full">
                <ParisArrondissementsSVG
                  activeDistrict={hoveredDistrict || activeDistrict?.district_number || null}
                  onDistrictClick={handleMapClick}
                  onDistrictHover={setHoveredDistrict}
                />
              </div>

              {/* Map Legend */}
              <div className="mt-4 flex items-center justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-slate-800" />
                  <span className="text-slate-600">Aktív</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-stone-300" />
                  <span className="text-slate-600">Megtekintett</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-white border border-slate-300" />
                  <span className="text-slate-600">Nem aktív</span>
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
                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-stone-200"
              >
                {/* Card Header - Navy gradient */}
                <div className="bg-gradient-to-r from-slate-800 to-slate-700 p-6 text-white">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        {(() => {
                          const Icon = getIcon(activeDistrict?.icon_name)
                          return <Icon className="w-5 h-5" />
                        })()}
                        <span className="text-slate-300 text-sm font-medium">
                          {activeIndex + 1} / {districts.length}
                        </span>
                      </div>
                      <h3 className="font-playfair text-2xl md:text-3xl font-bold mb-1">
                        {activeDistrict?.title}
                      </h3>
                      {activeDistrict?.subtitle && (
                        <p className="text-slate-300">{activeDistrict.subtitle}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-4xl font-bold opacity-30">
                        {activeDistrict?.district_number}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6">
                  {/* Description */}
                  <p className="text-slate-600 leading-relaxed mb-6">
                    {activeDistrict?.description}
                  </p>

                  {/* Best For Tags */}
                  {activeDistrict?.best_for && activeDistrict.best_for.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-slate-600" />
                        Ideális, ha...
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {activeDistrict.best_for.map((tag, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-stone-100 text-slate-700 border border-stone-200"
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
                      <h4 className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
                        <Star className="w-4 h-4 text-slate-600" />
                        Fő látnivalók
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {activeDistrict.highlights.map((highlight, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2 text-sm text-slate-600"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                            {highlight}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Local Tips */}
                  {activeDistrict?.local_tips && (
                    <div className="bg-stone-50 rounded-xl p-4 border border-stone-200">
                      <h4 className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
                        <Lightbulb className="w-4 h-4 text-slate-600" />
                        Viktória tippje
                      </h4>
                      <p className="text-sm text-slate-600">{activeDistrict.local_tips}</p>
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
                    <div className="mt-6 bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-5 text-white">
                      <div className="flex items-center gap-3 mb-3">
                        <Ticket className="w-5 h-5 text-stone-300" />
                        <span className="text-stone-300 font-semibold text-sm uppercase tracking-wider">
                          Fő attrakció
                        </span>
                      </div>
                      <p className="text-white/90">{activeDistrict.main_attraction}</p>
                    </div>
                  )}
                </div>

                {/* Navigation Buttons */}
                <div className="px-6 pb-6 flex items-center justify-between">
                  <button
                    onClick={() => navigate('prev')}
                    disabled={activeIndex === 0}
                    className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-stone-100 text-slate-700 hover:bg-stone-200"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Előző
                  </button>
                  <button
                    onClick={() => navigate('next')}
                    disabled={activeIndex === districts.length - 1}
                    className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-slate-800 text-white hover:bg-slate-700"
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
          <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 border border-stone-200">
            <h4 className="text-sm font-semibold text-slate-900 mb-4 text-center">
              Felfedezési útvonal
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
                          backgroundColor: idx === activeIndex ? '#1e293b' : idx < activeIndex ? '#a8a29e' : '#e7e5e4',
                        }}
                        className={`w-4 h-4 rounded-full border-2 border-white shadow-sm transition-all ${
                          idx === activeIndex ? 'ring-4 ring-stone-200' : ''
                        }`}
                      />

                      {/* Label */}
                      <span
                        className={`mt-2 text-xs font-medium whitespace-nowrap transition-colors ${
                          idx === activeIndex
                            ? 'text-slate-800'
                            : 'text-slate-400 group-hover:text-slate-600'
                        }`}
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
                          <MapPin className="w-4 h-4 text-slate-800 fill-slate-800" />
                        </motion.div>
                      )}
                    </button>

                    {/* Connector Line */}
                    {idx < districts.length - 1 && (
                      <div
                        className={`w-12 md:w-20 h-0.5 mx-1 transition-colors ${
                          idx < activeIndex ? 'bg-stone-400' : 'bg-stone-200'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Progress indicator */}
            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-slate-500">
              <span>{activeIndex + 1}</span>
              <div className="w-24 h-1.5 bg-stone-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-slate-800 rounded-full"
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
