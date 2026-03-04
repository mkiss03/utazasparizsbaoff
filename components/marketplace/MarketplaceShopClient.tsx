'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import {
  BookOpen,
  Clock,
  MapPin,
  Layers,
} from 'lucide-react'
import type { Bundle, CityPricing } from '@/lib/types/database'

interface MarketplaceShopClientProps {
  bundles: Bundle[]
  cityPricing: CityPricing[]
  initialCity?: string
}

interface CityBundle {
  city: string
  slug: string
  title: string
  description?: string
  short_description?: string
  cover_image?: string
  totalBundles: number
  totalCards: number
  difficulty_level?: string
  estimated_time_minutes: number
  pricing?: CityPricing
}

export default function MarketplaceShopClient({
  bundles,
  cityPricing,
  initialCity,
}: MarketplaceShopClientProps) {
  // Get city price map
  const cityPriceMap = useMemo(() => {
    const map: Record<string, CityPricing> = {}
    cityPricing.forEach((cp) => { map[cp.city] = cp })
    return map
  }, [cityPricing])

  // Group bundles by city → 1 card per city
  const cityBundles = useMemo(() => {
    const cityMap: Record<string, Bundle[]> = {}
    bundles.forEach((b) => {
      if (!cityMap[b.city]) cityMap[b.city] = []
      cityMap[b.city].push(b)
    })

    const result: CityBundle[] = Object.entries(cityMap).map(([city, cityBundleList]) => {
      // Use the first bundle as the "main" one for display
      const main = cityBundleList[0]
      const totalCards = cityBundleList.reduce((sum, b) => sum + (b.total_cards || 0), 0)
      const totalTime = cityBundleList.reduce((sum, b) => sum + (b.estimated_time_minutes || 0), 0)

      return {
        city,
        slug: main.slug,
        title: `${city} kártyák`,
        description: main.description,
        short_description: main.short_description || `Fedezd fel ${city} titkait flashcard kártyákkal!`,
        cover_image: main.cover_image,
        totalBundles: cityBundleList.length,
        totalCards,
        difficulty_level: main.difficulty_level,
        estimated_time_minutes: totalTime,
        pricing: cityPriceMap[city],
      }
    })

    // If initialCity is set, filter to just that city
    if (initialCity) {
      return result.filter((cb) => cb.city.toLowerCase() === initialCity.toLowerCase())
    }

    return result.sort((a, b) => a.city.localeCompare(b.city))
  }, [bundles, cityPriceMap, initialCity])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
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
          {initialCity ? `${initialCity} kártyacsomagok` : 'Kártyacsomagok'}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
          Fedezd fel a városfelfedező flashcard csomagokat! Válassz várost,
          tekintsd meg a témaköreiket, majd szerezz hozzáférést egy City Pass-szal.
        </p>
      </motion.div>

      {/* City Bundle Grid */}
      {cityBundles.length > 0 ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {cityBundles.map((cb) => (
            <motion.div key={cb.city} variants={itemVariants}>
              <Link href={`/bundles/${cb.slug}`}>
                <div className="group h-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-xl hover:border-slate-300">
                  {/* Cover Image */}
                  <div className="relative h-52 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
                    {cb.cover_image ? (
                      <Image
                        src={cb.cover_image}
                        alt={cb.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <BookOpen className="h-16 w-16 text-slate-300" />
                      </div>
                    )}
                    {/* City badge */}
                    <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-sm font-semibold text-slate-700 backdrop-blur-sm shadow-sm">
                      <MapPin className="h-4 w-4" />
                      {cb.city}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="mb-2 text-xl font-bold text-slate-800 group-hover:text-french-blue-500 transition-colors">
                      {cb.title}
                    </h3>
                    <p className="mb-4 line-clamp-2 text-sm text-slate-500">
                      {cb.short_description}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      {cb.totalCards > 0 && (
                        <span className="inline-flex items-center gap-1.5">
                          <Layers className="h-4 w-4" />
                          {cb.totalCards} kártya
                        </span>
                      )}
                      {cb.estimated_time_minutes > 0 && (
                        <span className="inline-flex items-center gap-1.5">
                          <Clock className="h-4 w-4" />
                          ~{cb.estimated_time_minutes} perc
                        </span>
                      )}
                    </div>

                    {/* Pricing */}
                    <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-5">
                      {cb.pricing ? (
                        <span className="text-base font-bold text-slate-800">
                          {cb.pricing.currency === 'HUF'
                            ? `${cb.pricing.price.toLocaleString('hu-HU')} Ft`
                            : `${cb.pricing.price} ${cb.pricing.currency}`}
                          <span className="ml-1.5 text-sm font-normal text-slate-400">
                            / {cb.pricing.duration_days} nap
                          </span>
                        </span>
                      ) : (
                        <span className="text-sm text-slate-400">City Pass szükséges</span>
                      )}
                      <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600 transition-all group-hover:bg-french-blue-500 group-hover:text-white">
                        Megnézem
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mx-auto max-w-md rounded-2xl border-2 border-dashed border-slate-300 bg-white p-12 text-center"
        >
          <BookOpen className="mx-auto mb-4 h-12 w-12 text-slate-300" />
          <h3 className="mb-2 text-lg font-bold text-slate-700">
            {initialCity ? `Még nincs ${initialCity} csomag` : 'Hamarosan érkeznek a csomagok'}
          </h3>
          <p className="text-sm text-slate-500">
            A kártyacsomagok feltöltés alatt vannak. Nézz vissza később!
          </p>
          {initialCity && (
            <Link
              href="/marketplace"
              className="mt-4 inline-block rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
            >
              Összes város megtekintése
            </Link>
          )}
        </motion.div>
      )}
    </div>
  )
}
