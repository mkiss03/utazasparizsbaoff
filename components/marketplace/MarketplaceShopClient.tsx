'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import {
  Search,
  BookOpen,
  Clock,
  MapPin,
  Layers,
  SlidersHorizontal,
  X,
  ArrowUpDown,
} from 'lucide-react'
import type { Bundle, CityPricing } from '@/lib/types/database'

interface MarketplaceShopClientProps {
  bundles: Bundle[]
  cityPricing: CityPricing[]
  initialCity?: string
}

type SortOption = 'newest' | 'cards' | 'popular'
type DifficultyFilter = 'all' | 'beginner' | 'intermediate' | 'advanced'

const difficultyLabels: Record<string, string> = {
  beginner: 'Kezdő',
  intermediate: 'Közép',
  advanced: 'Haladó',
}

const difficultyColors: Record<string, string> = {
  beginner: 'bg-green-100 text-green-700',
  intermediate: 'bg-yellow-100 text-yellow-700',
  advanced: 'bg-red-100 text-red-700',
}

const sortLabels: Record<SortOption, string> = {
  newest: 'Legújabb',
  cards: 'Legtöbb kártya',
  popular: 'Népszerű',
}

export default function MarketplaceShopClient({
  bundles,
  cityPricing,
  initialCity,
}: MarketplaceShopClientProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCity, setSelectedCity] = useState<string>(initialCity || 'all')
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyFilter>('all')
  const [sortBy, setSortBy] = useState<SortOption>('newest')
  const [showFilters, setShowFilters] = useState(false)

  // Extract unique cities from bundles
  const cities = useMemo(() => {
    const uniqueCities = [...new Set(bundles.map((b) => b.city))]
    return uniqueCities.sort()
  }, [bundles])

  // Get city price map
  const cityPriceMap = useMemo(() => {
    const map: Record<string, CityPricing> = {}
    cityPricing.forEach((cp) => {
      map[cp.city] = cp
    })
    return map
  }, [cityPricing])

  // Filter and sort bundles
  const filteredBundles = useMemo(() => {
    let result = [...bundles]

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.description?.toLowerCase().includes(q) ||
          b.short_description?.toLowerCase().includes(q)
      )
    }

    // City filter
    if (selectedCity !== 'all') {
      result = result.filter((b) => b.city === selectedCity)
    }

    // Difficulty filter
    if (selectedDifficulty !== 'all') {
      result = result.filter((b) => b.difficulty_level === selectedDifficulty)
    }

    // Sort
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        break
      case 'cards':
        result.sort((a, b) => (b.total_cards || 0) - (a.total_cards || 0))
        break
      case 'popular':
        result.sort((a, b) => (b.total_sales || 0) - (a.total_sales || 0))
        break
    }

    return result
  }, [bundles, searchQuery, selectedCity, selectedDifficulty, sortBy])

  const hasActiveFilters = searchQuery || selectedCity !== 'all' || selectedDifficulty !== 'all'

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCity('all')
    setSelectedDifficulty('all')
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 text-center"
      >
        <h1 className="text-4xl font-bold text-slate-900 sm:text-5xl">
          Kártyacsomagok
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
          Fedezd fel a városfelfedező flashcard csomagokat! Válassz témakört,
          tekintsd meg az ingyenes demo kártyákat, majd oldj fel mindent egy Város Pass-szal.
        </p>
      </motion.div>

      {/* Search + Filter Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8 space-y-4"
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Keresés cím vagy leírás alapján..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
            />
          </div>

          {/* Filter toggle (mobile) */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 sm:hidden"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Szűrők
          </button>

          {/* Sort */}
          <div className="relative">
            <ArrowUpDown className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="appearance-none rounded-lg border border-slate-200 bg-white py-3 pl-9 pr-8 text-sm font-medium text-slate-700 transition-colors focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
            >
              {Object.entries(sortLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter chips */}
        <div className={`flex flex-wrap gap-2 ${showFilters ? '' : 'hidden sm:flex'}`}>
          {/* City chips */}
          <button
            onClick={() => setSelectedCity('all')}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
              selectedCity === 'all'
                ? 'bg-slate-800 text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Összes város
          </button>
          {cities.map((city) => (
            <button
              key={city}
              onClick={() => setSelectedCity(selectedCity === city ? 'all' : city)}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                selectedCity === city
                  ? 'bg-slate-800 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <MapPin className="h-3 w-3" />
              {city}
            </button>
          ))}

          {/* Separator */}
          <div className="mx-1 h-8 w-px bg-slate-200" />

          {/* Difficulty chips */}
          <button
            onClick={() => setSelectedDifficulty('all')}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
              selectedDifficulty === 'all'
                ? 'bg-slate-800 text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Mind
          </button>
          {(['beginner', 'intermediate', 'advanced'] as const).map((level) => (
            <button
              key={level}
              onClick={() =>
                setSelectedDifficulty(selectedDifficulty === level ? 'all' : level)
              }
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                selectedDifficulty === level
                  ? 'bg-slate-800 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {difficultyLabels[level]}
            </button>
          ))}

          {/* Clear filters */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-1 rounded-full bg-red-50 px-3 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-100"
            >
              <X className="h-3 w-3" />
              Szűrők törlése
            </button>
          )}
        </div>
      </motion.div>

      {/* Results count */}
      <div className="mb-6 text-sm text-slate-500">
        {filteredBundles.length} csomag{hasActiveFilters ? ' (szűrt)' : ''}
      </div>

      {/* Bundle Grid */}
      {filteredBundles.length > 0 ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          key={`${selectedCity}-${selectedDifficulty}-${sortBy}-${searchQuery}`}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filteredBundles.map((bundle) => {
            const pricing = cityPriceMap[bundle.city]
            return (
              <motion.div key={bundle.id} variants={itemVariants}>
                <Link href={`/bundles/${bundle.slug}`}>
                  <div className="group h-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-lg hover:border-slate-300">
                    {/* Cover Image */}
                    <div className="relative h-44 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
                      {bundle.cover_image ? (
                        <Image
                          src={bundle.cover_image}
                          alt={bundle.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <BookOpen className="h-12 w-12 text-slate-300" />
                        </div>
                      )}
                      {/* City badge */}
                      <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-slate-700 backdrop-blur-sm">
                        <MapPin className="h-3 w-3" />
                        {bundle.city}
                      </div>
                      {/* Difficulty badge */}
                      {bundle.difficulty_level && (
                        <div
                          className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold ${difficultyColors[bundle.difficulty_level]}`}
                        >
                          {difficultyLabels[bundle.difficulty_level]}
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3 className="mb-2 text-lg font-bold text-slate-800 group-hover:text-slate-900">
                        {bundle.title}
                      </h3>
                      <p className="mb-4 line-clamp-2 text-sm text-slate-500">
                        {bundle.short_description || bundle.description || 'Tanulási csomag'}
                      </p>

                      {/* Stats row */}
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        {bundle.total_cards > 0 && (
                          <span className="inline-flex items-center gap-1">
                            <Layers className="h-3.5 w-3.5" />
                            {bundle.total_cards} kártya
                          </span>
                        )}
                        {bundle.estimated_time_minutes > 0 && (
                          <span className="inline-flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            ~{bundle.estimated_time_minutes} perc
                          </span>
                        )}
                      </div>

                      {/* Price / CTA */}
                      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                        {pricing ? (
                          <span className="text-sm font-semibold text-slate-700">
                            {pricing.currency === 'HUF'
                              ? `${pricing.price.toLocaleString('hu-HU')} Ft`
                              : `${pricing.price} ${pricing.currency}`}
                            <span className="ml-1 text-xs font-normal text-slate-400">
                              / {pricing.duration_days} nap
                            </span>
                          </span>
                        ) : (
                          <span className="text-sm text-slate-400">City Pass szükséges</span>
                        )}
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 transition-colors group-hover:bg-slate-800 group-hover:text-white">
                          Megnézem
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </motion.div>
      ) : (
        /* Empty State */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mx-auto max-w-md rounded-2xl border-2 border-dashed border-slate-300 bg-white p-12 text-center"
        >
          <BookOpen className="mx-auto mb-4 h-12 w-12 text-slate-300" />
          <h3 className="mb-2 text-lg font-bold text-slate-700">
            {hasActiveFilters ? 'Nincs találat' : 'Hamarosan érkeznek a csomagok'}
          </h3>
          <p className="text-sm text-slate-500">
            {hasActiveFilters
              ? 'Próbáld módosítani a szűrőket.'
              : 'A kártyacsomagok feltöltés alatt vannak. Nézz vissza később!'}
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="mt-4 rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200"
            >
              Szűrők törlése
            </button>
          )}
        </motion.div>
      )}
    </div>
  )
}
