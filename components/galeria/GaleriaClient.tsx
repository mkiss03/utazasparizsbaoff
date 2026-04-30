'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'

const FALLBACK_IMAGES = [
  { src: '/images/kepnezopar1.JPG', alt: 'Párizsi pillanat 1' },
  { src: '/images/kepnezopar2.jpg', alt: 'Párizsi pillanat 2' },
  { src: '/images/kepnezopar3.jpg', alt: 'Párizsi pillanat 3' },
  { src: '/images/kepnezopar4.jpg', alt: 'Párizsi pillanat 4' },
  { src: '/images/kepnezopar5.jpg', alt: 'Párizsi pillanat 5' },
  { src: '/images/kepnezopar6.JPG', alt: 'Párizsi pillanat 6' },
]

const HEIGHT_CYCLE = ['h-80', 'h-96', 'h-72', 'h-96', 'h-64', 'h-80']

export default function GaleriaClient() {
  const [images, setImages] = useState<{ src: string; alt: string }[]>([])
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('gallery')
      .select('image_url, alt_text')
      .order('display_order')
      .then(({ data }) => {
        if (data && data.length > 0) {
          setImages(data.map((img) => ({ src: img.image_url, alt: img.alt_text || 'Párizsi pillanat' })))
        } else {
          setImages(FALLBACK_IMAGES)
        }
      })
      .catch(() => setImages(FALLBACK_IMAGES))
  }, [])

  const total = images.length

  const goToPrev = () => {
    if (lightboxIndex === null) return
    setLightboxIndex(lightboxIndex === 0 ? total - 1 : lightboxIndex - 1)
  }

  const goToNext = () => {
    if (lightboxIndex === null) return
    setLightboxIndex(lightboxIndex === total - 1 ? 0 : lightboxIndex + 1)
  }

  return (
    <>
      {/* Header */}
      <section className="pb-12 pt-36 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="mb-4 font-playfair text-4xl font-bold text-parisian-grey-900 md:text-5xl lg:text-6xl">
            Párizsi Pillanatok
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-parisian-grey-600">
            Fedezd fel Párizs varázsát a mi szemünkön keresztül
          </p>
        </motion.div>
      </section>

      {/* Masonry Grid */}
      <section className="container mx-auto px-4 pb-20">
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {images.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="mb-4 break-inside-avoid"
            >
              <div
                className={`group relative cursor-pointer overflow-hidden rounded-xl ${HEIGHT_CYCLE[index % HEIGHT_CYCLE.length]} shadow-md transition-shadow duration-300 hover:shadow-xl`}
                onClick={() => setLightboxIndex(index)}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-black/0 transition-all duration-300 group-hover:bg-black/20" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
            onClick={() => setLightboxIndex(null)}
          >
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
              aria-label="Bezárás"
            >
              <X className="h-6 w-6" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); goToPrev() }}
              className="absolute left-4 z-10 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20"
              aria-label="Előző"
            >
              <ChevronLeft className="h-8 w-8" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); goToNext() }}
              className="absolute right-4 z-10 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20"
              aria-label="Következő"
            >
              <ChevronRight className="h-8 w-8" />
            </button>
            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="relative mx-16 h-[80vh] w-full max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={images[lightboxIndex].src}
                alt={images[lightboxIndex].alt}
                fill
                className="rounded-lg object-contain"
                sizes="90vw"
                priority
              />
            </motion.div>
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-sm">
              {lightboxIndex + 1} / {total}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
