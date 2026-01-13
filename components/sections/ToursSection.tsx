'use client'

import { motion } from 'framer-motion'
import { Clock, Users, Euro, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import type { Tour } from '@/lib/types/database'

interface ToursSectionProps {
  tours?: Tour[]
}

const defaultTours: Tour[] = [
  {
    id: '1',
    title: 'Klasszikus Párizs',
    slug: 'klasszikus-parizs',
    short_description: 'Fedezze fel Párizs legismertebb nevezetességeit egyetlen varázslatos túra során.',
    full_description: '',
    image_url: '/images/tour-classic.jpg',
    price: 150,
    duration: 3,
    max_group_size: 8,
    is_featured: true,
    display_order: 1,
    created_at: '',
    updated_at: '',
  },
  {
    id: '2',
    title: 'Montmartre Művészei',
    slug: 'montmartre-muveszei',
    short_description: 'Sétáljon a művészek negyedében, ahol Picasso és Van Gogh is alkotott.',
    full_description: '',
    image_url: '/images/tour-montmartre.jpg',
    price: 120,
    duration: 2.5,
    max_group_size: 10,
    is_featured: false,
    display_order: 2,
    created_at: '',
    updated_at: '',
  },
  {
    id: '3',
    title: 'Gasztronómiai Kaland',
    slug: 'gasztro-kaland',
    short_description: 'Kóstolja meg Párizs legjobb ételeit és borait egy autentikus túrán.',
    full_description: '',
    image_url: '/images/tour-food.jpg',
    price: 180,
    duration: 4,
    max_group_size: 6,
    is_featured: true,
    display_order: 3,
    created_at: '',
    updated_at: '',
  },
  {
    id: '4',
    title: 'Rejtett Párizs',
    slug: 'rejtett-parizs',
    short_description: 'Fedezze fel a turistautakról távol eső, varázslatos zugokat és helyi titkokat.',
    full_description: '',
    image_url: '/images/tour-hidden.jpg',
    price: 140,
    duration: 3,
    max_group_size: 8,
    is_featured: false,
    display_order: 4,
    created_at: '',
    updated_at: '',
  },
]

export default function ToursSection({ tours = defaultTours }: ToursSectionProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  } as const

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
    },
  } as const

  return (
    <section id="tours" className="relative overflow-hidden bg-parisian-cream-50 py-20 md:py-32">
      {/* Background Decoration */}
      <div className="absolute left-0 top-0 h-64 w-64 rounded-full bg-parisian-beige-300 opacity-10 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-parisian-beige-400 opacity-10 blur-3xl" />

      <div className="container relative z-10 mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 font-playfair text-4xl font-bold text-parisian-grey-800 md:text-5xl lg:text-6xl">
            Túrák & Programok
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-parisian-grey-600 md:text-xl">
            Válasszon a gondosan összeállított túrák közül, és fedezze fel Párizst egy helyi szemével
          </p>
        </motion.div>

        {/* Tours Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-2"
        >
          {tours.map((tour) => (
            <motion.div
              key={tour.id}
              variants={itemVariants}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group relative overflow-hidden rounded-3xl transition-all duration-500"
            >
              {/* Card */}
              <div className="relative h-full overflow-hidden rounded-3xl border-2 border-parisian-beige-200 bg-white p-6 shadow-xl transition-all duration-500 hover:shadow-2xl hover:border-parisian-beige-300">
                {/* Featured Badge */}
                {tour.is_featured && (
                  <div className="absolute right-4 top-4 z-10 rounded-full bg-parisian-beige-400 px-4 py-1 text-xs font-bold text-white">
                    KIEMELT
                  </div>
                )}

                {/* Tour Image */}
                <div className="relative mb-6 aspect-[16/10] overflow-hidden rounded-2xl">
                  <Image
                    src={tour.image_url || '/images/tour-classic.jpg'}
                    alt={tour.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-parisian-grey-900/50 to-transparent" />
                </div>

                {/* Tour Content */}
                <h3 className="mb-3 font-playfair text-2xl font-bold text-parisian-grey-800 md:text-3xl">
                  {tour.title}
                </h3>
                <p className="mb-6 text-parisian-grey-600">{tour.short_description}</p>

                {/* Tour Details */}
                <div className="mb-6 flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 text-sm text-parisian-grey-600">
                    <Clock className="h-5 w-5 text-parisian-beige-500" />
                    <span>{tour.duration} óra</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-parisian-grey-600">
                    <Users className="h-5 w-5 text-parisian-beige-500" />
                    <span>Max. {tour.max_group_size} fő</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-parisian-beige-600">
                    <Euro className="h-5 w-5" />
                    <span>{tour.price} EUR</span>
                  </div>
                </div>

                {/* CTA Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group/btn flex w-full items-center justify-center gap-2 rounded-full bg-parisian-beige-400 px-6 py-3 font-semibold text-white transition-all duration-300 hover:bg-parisian-beige-500"
                >
                  Részletek
                  <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover/btn:translate-x-1" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Custom Tours CTA */}
      </div>
    </section>
  )
}
