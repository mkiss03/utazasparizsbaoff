'use client'

import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useRef } from 'react'
import Image from 'next/image'

interface HeroSectionProps {
  headline?: string
  subheadline?: string
  backgroundImage?: string
  ctaText?: string
  ctaLink?: string
}

export default function HeroSection({
  headline = 'Fedezze fel Párizs',
  subheadline = 'Személyre szabott túrák a Fények Városában',
  backgroundImage = '/images/eiffel1.jpeg',
  ctaText = 'Nézd meg szolgáltatásainkat',
  ctaLink = '#services',
}: HeroSectionProps) {
  const ref = useRef<HTMLDivElement>(null)

  // Use default image if backgroundImage is null or empty
  const imageUrl = backgroundImage && backgroundImage.trim() !== '' ? backgroundImage : '/images/eiffel1.jpeg'

  return (
    <section ref={ref} className="relative min-h-screen overflow-hidden bg-gradient-to-br from-white via-parisian-cream-50 to-parisian-beige-50">

      {/* Decorative Elements - Subtle geometric shapes */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Top right accent */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.08, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-parisian-beige-300"
        />

        {/* Bottom left accent */}
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 0.05, x: 0 }}
          transition={{ duration: 1.8, ease: "easeOut" }}
          className="absolute -bottom-24 -left-24 h-64 w-64 rotate-45 bg-parisian-beige-200"
        />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-20">

        {/* Content Grid: Text Left, Image Right */}
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-2">

          {/* Left: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-4 inline-block"
            >
              <span className="rounded-full bg-parisian-beige-100 px-4 py-2 font-montserrat text-sm font-medium text-parisian-grey-700">
                Utazás Párizsba
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mb-6 font-playfair text-3xl font-bold leading-tight text-parisian-grey-800 sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl"
            >
              {headline}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="mb-10 max-w-xl text-base leading-relaxed text-parisian-grey-600 sm:text-lg md:text-xl"
            >
              {subheadline}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start"
            >
              <motion.a
                href={ctaLink}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="group relative overflow-hidden rounded-full bg-parisian-beige-400 px-8 py-4 font-montserrat text-base font-semibold text-white shadow-lg transition-all duration-300 hover:bg-parisian-beige-500 hover:shadow-xl"
              >
                <span className="relative z-10">{ctaText}</span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-parisian-beige-500 to-parisian-beige-600"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.a>

              {process.env.NEXT_PUBLIC_ENABLE_FLASHCARDS === 'true' && (
                <motion.a
                  href="/pricing"
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="rounded-full border-2 border-parisian-beige-400 bg-transparent px-8 py-4 font-montserrat text-base font-semibold text-parisian-grey-700 transition-all duration-300 hover:border-parisian-beige-500 hover:bg-parisian-beige-50"
                >
                  Get City Pass
                </motion.a>
              )}
            </motion.div>
          </motion.div>

          {/* Right: Image with elegant reveal */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            {/* Background decoration */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="absolute -right-8 -top-8 -z-10 h-full w-full rounded-3xl bg-parisian-beige-100"
            />

            {/* Main Image Container */}
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
              className="relative overflow-hidden rounded-3xl shadow-2xl"
            >
              <div className="relative h-[400px] w-full sm:h-[500px] lg:h-[600px]">
                <Image
                  src={imageUrl}
                  alt="Paris"
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Subtle overlay for better image integration */}
              <div className="absolute inset-0 bg-gradient-to-t from-parisian-beige-50/20 to-transparent" />
            </motion.div>

            {/* Floating accent element */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="absolute bottom-2 left-2 rounded-2xl bg-white p-4 shadow-xl sm:p-6 lg:-bottom-6 lg:-left-6"
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-parisian-beige-100 sm:h-12 sm:w-12">
                  <svg className="h-5 w-5 text-parisian-beige-600 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-montserrat text-xs font-semibold text-parisian-grey-800 sm:text-sm">
                    Teljes körű szervezés
                  </p>
                  <p className="font-montserrat text-xs text-parisian-grey-500 hidden sm:block">
                    Minden részlet egy helyen
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Second floating element */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 1.4 }}
              className="absolute right-2 top-20 rounded-2xl bg-white p-3 shadow-xl sm:p-4 lg:-right-4"
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-parisian-beige-100 sm:h-10 sm:w-10"
                >
                  <span className="text-base sm:text-lg">✨</span>
                </motion.div>
                <div>
                  <p className="font-montserrat text-xs font-semibold text-parisian-grey-800 sm:text-sm">
                    Több éves tapasztalat
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.6 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronDown className="h-8 w-8 text-parisian-grey-400" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
