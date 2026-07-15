'use client'

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import Image from 'next/image'
import { useCallback } from 'react'

interface OpeningStepProps {
  onNext: () => void
}

export default function OpeningStep({ onNext }: OpeningStepProps) {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springX = useSpring(mouseX, { stiffness: 40, damping: 20 })
  const springY = useSpring(mouseY, { stiffness: 40, damping: 20 })
  const translateX = useTransform(springX, [-0.5, 0.5], [-18, 18])
  const translateY = useTransform(springY, [-0.5, 0.5], [-12, 12])

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const rect = event.currentTarget.getBoundingClientRect()
      mouseX.set((event.clientX - rect.left) / rect.width - 0.5)
      mouseY.set((event.clientY - rect.top) / rect.height - 0.5)
    },
    [mouseX, mouseY]
  )

  return (
    <div onMouseMove={handleMouseMove} className="relative h-full w-full overflow-hidden">
      <motion.div
        style={{ x: translateX, y: translateY }}
        animate={{ scale: [1, 1.07, 1] }}
        transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-0 -m-6"
      >
        <Image
          src="/images/stock1.jpeg"
          alt="Párizs a Szajna partjáról napnyugtakor, háttérben az Eiffel-toronnyal"
          fill
          priority
          sizes="100vw"
          quality={90}
          className="object-cover"
        />
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-t from-parisian-grey-900/85 via-parisian-grey-900/40 to-parisian-grey-900/20" />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-5 inline-block rounded-full bg-white/15 px-5 py-2 font-montserrat text-sm font-medium text-white backdrop-blur-sm"
        >
          Személyre szabott párizsi programterv
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="mb-4 max-w-2xl font-playfair text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl"
        >
          Tervezzük meg együtt a párizsi utadat
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mb-10 max-w-md font-montserrat text-white/80"
        >
          Néhány kérdés az utazásodról és az érdeklődésedről -- a végén Viktória személyesen
          állítja össze a végleges tervet
        </motion.p>

        <motion.button
          type="button"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.65 }}
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={onNext}
          className="rounded-full bg-parisian-beige-400 px-10 py-4 font-montserrat text-base font-semibold text-white shadow-lg transition-colors hover:bg-parisian-beige-500"
        >
          Kezdjük el
        </motion.button>
      </div>
    </div>
  )
}
