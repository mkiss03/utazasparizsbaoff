'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import * as Icons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Tour } from '@/lib/types/database'

interface Program {
  title: string
  description?: string
  items?: string[]
  price?: number
  duration?: number
  max_persons?: number
  show_price?: boolean
  show_duration?: boolean
  show_max_persons?: boolean
}

interface Service {
  id: string
  title: string
  icon: LucideIcon
  shortDescription: string
  description: string
  programs: Program[]
  duration: string
  price: string
  color: string
}

interface ServicesSectionProps {
  groupBookingTitle?: string
  groupBookingDescription?: string
  groupBookingButtonText?: string
  customOfferText?: string
  customOfferButtonText?: string
}

export default function ServicesSection({
  groupBookingTitle = 'Csoportos megrendelés?',
  groupBookingDescription = 'Nagyobb csoportok, céges rendezvények vagy különleges igények esetén egyedi árkalkulációt biztosítunk. Vegye fel velünk a kapcsolatot, és állítsunk össze Önnek személyre szabott ajánlatot!',
  groupBookingButtonText = 'Érdekel az egyedi ajánlat',
  customOfferText = 'Nem találja amit keres? Kérjen egyedi ajánlatot!',
  customOfferButtonText = 'Egyedi ajánlatkérés',
}: ServicesSectionProps = {}) {
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [services, setServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchServices = async () => {
      const supabase = createClient()
      const { data: tours, error } = await supabase
        .from('tours')
        .select('*')
        .order('display_order')

      if (error) {
        console.error('Error fetching services:', error)
        setIsLoading(false)
        return
      }

      // Transform tours to services with special display rules
      const transformedServices: Service[] = (tours || []).map((tour: Tour) => {
        const isAirportTransfer = tour.title.toLowerCase().includes('repülőtéri transzfer')
        const isProgramOrganization = tour.title.toLowerCase().includes('programszervez')

        let duration = ''
        let price = ''

        if (isAirportTransfer) {
          // Repülőtéri transzfer: Show kilometer-based billing note
          duration = ''
          price = 'Kilométer alapú árképzés'
        } else if (isProgramOrganization) {
          // Programszervezés: Show only price, no duration or max people
          duration = ''
          price = tour.price ? `${tour.price} EUR` : ''
        } else {
          // Default: Show all information
          duration = tour.duration ? `kb. ${tour.duration} óra` : ''
          price = tour.price ? `${tour.price} EUR / szolgáltatás (max. ${tour.max_group_size} fő)` : ''
        }

        return {
          id: tour.id,
          title: tour.title,
          icon: getIconComponent(tour.icon_name || 'MapPin'),
          shortDescription: tour.short_description || '',
          description: tour.full_description || tour.short_description || '',
          programs: tour.programs || [],
          duration,
          price,
          color: tour.color_gradient || 'from-parisian-beige-400 to-parisian-beige-500'
        }
      })

      setServices(transformedServices)
      setIsLoading(false)
    }

    fetchServices()
  }, [])

  // Helper to get Lucide icon component by name
  const getIconComponent = (iconName: string): LucideIcon => {
    const IconComponent = (Icons as Record<string, LucideIcon>)[iconName]
    return IconComponent || Icons.MapPin  // Fallback to MapPin
  }

  if (isLoading) {
    return (
      <section id="services" className="relative overflow-hidden bg-white py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <p className="text-lg text-parisian-grey-600">Betöltés...</p>
        </div>
      </section>
    )
  }

  if (services.length === 0) {
    return (
      <section id="services" className="relative overflow-hidden bg-white py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <p className="text-lg text-parisian-grey-600">Nincsenek elérhető szolgáltatások.</p>
        </div>
      </section>
    )
  }

  return (
    <section id="services" className="relative overflow-hidden bg-white py-20 md:py-32">
      {/* Background Decorations */}
      <div className="absolute left-0 top-20 h-96 w-96 rounded-full bg-parisian-beige-200 opacity-20 blur-3xl" />
      <div className="absolute bottom-20 right-0 h-96 w-96 rounded-full bg-parisian-beige-300 opacity-20 blur-3xl" />

      <div className="container relative z-10 mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="mb-4 inline-block rounded-full bg-parisian-beige-100 px-6 py-2 font-montserrat text-sm font-semibold text-parisian-grey-700"
          >
            Mit kínálunk
          </motion.span>
          <h2 className="mb-4 font-playfair text-3xl font-bold text-parisian-grey-800 sm:text-4xl md:text-5xl lg:text-6xl">
            Szolgáltatások
          </h2>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-parisian-grey-600 sm:text-lg md:text-xl">
            Kattints a kártyákra a részletes információkért
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="mx-auto grid max-w-6xl gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              viewport={{ once: true, margin: '-50px' }}
              onClick={() => setSelectedService(service)}
              className="group relative cursor-pointer"
            >
              {/* Service Card */}
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="relative h-full overflow-hidden rounded-3xl bg-gradient-to-br from-white to-parisian-cream-50 p-6 sm:p-8 shadow-lg transition-all duration-500 hover:shadow-2xl"
              >
                {/* Icon */}
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                  className={`mb-4 sm:mb-6 inline-flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${service.color} shadow-lg`}
                >
                  <service.icon className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
                </motion.div>

                {/* Title */}
                <h3 className="mb-3 sm:mb-4 font-playfair text-xl sm:text-2xl font-bold text-parisian-grey-800">
                  {service.title}
                </h3>

                {/* Short Description */}
                <p className="mb-4 sm:mb-6 text-sm sm:text-base leading-relaxed text-parisian-grey-600">
                  {service.shortDescription}
                </p>

                {/* View More Hint */}
                <div className="flex items-center gap-2 font-montserrat text-sm font-semibold text-parisian-beige-600 transition-transform group-hover:translate-x-2">
                  <span>Részletek</span>
                  <motion.svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </motion.svg>
                </div>

                {/* Decorative Corner */}
                <div className="absolute -bottom-4 -right-4 h-32 w-32 rounded-full bg-parisian-beige-100 opacity-30 blur-2xl transition-opacity duration-500 group-hover:opacity-50" />
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Group Booking CTA - Csoportos foglalás kiemelés */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-16 mx-auto max-w-4xl"
        >
          <div className="rounded-3xl bg-gradient-to-br from-parisian-beige-100 via-parisian-cream-100 to-parisian-beige-50 border-2 border-parisian-beige-300 p-8 md:p-10 shadow-xl">
            <div className="text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-parisian-beige-400 to-parisian-beige-500 shadow-lg"
              >
                <Icons.Users className="h-8 w-8 text-white" />
              </motion.div>
              <h3 className="mb-3 font-playfair text-2xl md:text-3xl font-bold text-parisian-grey-800">
                {groupBookingTitle}
              </h3>
              <p className="mb-6 text-base md:text-lg leading-relaxed text-parisian-grey-700">
                {groupBookingDescription}
              </p>
              <motion.a
                href="#contact"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 rounded-full bg-parisian-beige-400 px-8 py-4 font-montserrat text-base md:text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:bg-parisian-beige-500 hover:shadow-xl"
              >
                {groupBookingButtonText}
                <Icons.ArrowRight className="h-5 w-5" />
              </motion.a>
            </div>
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="mb-6 text-lg text-parisian-grey-600">
            {customOfferText}
          </p>
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 rounded-full border-2 border-parisian-beige-400 bg-transparent px-8 py-4 font-montserrat font-semibold text-parisian-grey-700 transition-all duration-300 hover:border-parisian-beige-500 hover:bg-parisian-beige-50"
          >
            {customOfferButtonText}
          </motion.a>
        </motion.div>
      </div>

      {/* Modal/Overlay for Detailed View */}
      <AnimatePresence>
        {selectedService && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedService(null)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Content - Book Style */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotateY: -15 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              exit={{ opacity: 0, scale: 0.9, rotateY: 15 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="fixed inset-4 z-50 mx-auto flex max-h-[90vh] max-w-4xl items-center justify-center md:inset-8"
              style={{ perspective: '1000px' }}
            >
              <div className="relative h-full w-full overflow-hidden rounded-3xl bg-white shadow-2xl">
                {/* Close Button */}
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedService(null)}
                  className="absolute right-6 top-6 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-parisian-grey-800 text-white shadow-lg transition-colors hover:bg-parisian-grey-700"
                >
                  <X className="h-5 w-5" />
                </motion.button>

                {/* Scrollable Content */}
                <div className="h-full overflow-y-auto p-8 md:p-12">
                  {/* Header with Icon */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mb-8 flex items-start gap-6"
                  >
                    <div className={`flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br ${selectedService.color} shadow-xl`}>
                      <selectedService.icon className="h-10 w-10 text-white" />
                    </div>
                    <div>
                      <h2 className="mb-2 font-playfair text-3xl font-bold text-parisian-grey-800 md:text-4xl">
                        {selectedService.title}
                      </h2>
                      <p className="text-lg text-parisian-grey-600">{selectedService.shortDescription}</p>
                    </div>
                  </motion.div>

                  {/* Description */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mb-8"
                  >
                    <p className="text-base leading-relaxed text-parisian-grey-700">
                      {selectedService.description}
                    </p>
                  </motion.div>

                  {/* Programs - csak akkor jelenjen meg, ha van program */}
                  {selectedService.programs && selectedService.programs.length > 0 && (
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="mb-8 space-y-6"
                    >
                      {selectedService.programs.map((program, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.5 + idx * 0.1 }}
                          className="rounded-2xl border-2 border-parisian-beige-200 bg-gradient-to-br from-white to-parisian-cream-50 p-6 shadow-md"
                        >
                          <h4 className="mb-3 font-montserrat text-lg font-bold text-parisian-grey-800">
                            {program.title}
                          </h4>
                          {program.description && (
                            <p className="mb-3 text-sm leading-relaxed text-parisian-grey-600">
                              {program.description}
                            </p>
                          )}
                          {program.items && program.items.length > 0 && (
                            <ul className="space-y-2">
                              {program.items.map((item, itemIdx) => (
                                <motion.li
                                  key={itemIdx}
                                  initial={{ x: -10, opacity: 0 }}
                                  animate={{ x: 0, opacity: 1 }}
                                  transition={{ delay: 0.6 + idx * 0.1 + itemIdx * 0.05 }}
                                  className="flex items-start gap-3"
                                >
                                  <div className="mt-1.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-parisian-beige-200">
                                    <div className="h-2 w-2 rounded-full bg-parisian-beige-500" />
                                  </div>
                                  <span className="text-sm leading-relaxed text-parisian-grey-600">{item}</span>
                                </motion.li>
                              ))}
                            </ul>
                          )}

                          {/* Program szintű árképzés */}
                          {program.title.trim().toLowerCase().replace(/\s+/g, ' ').includes('repülőtéri transzfer') ? (
                            // Repülőtéri transzfer - fix szöveg
                            <div className="mt-4 rounded-xl border-t-2 border-parisian-beige-300 bg-gradient-to-r from-parisian-beige-50 to-parisian-cream-50 p-4">
                              <div className="space-y-1.5 text-sm">
                                <p className="font-montserrat text-base font-bold text-parisian-grey-800">
                                  Kilométer alapú árképzés
                                </p>
                              </div>
                            </div>
                          ) : (
                            // Normál árképzés
                            selectedService.price !== 'Kilométer alapú árképzés' && (program.show_price || program.show_duration || program.show_max_persons) && (
                              <div className="mt-4 rounded-xl border-t-2 border-parisian-beige-300 bg-gradient-to-r from-parisian-beige-50 to-parisian-cream-50 p-4">
                                <div className="space-y-1.5 text-sm">
                                  {program.show_duration && program.duration && (
                                    <p className="font-montserrat text-parisian-grey-700">
                                      <span className="font-bold">Időtartam:</span> kb. {program.duration} óra
                                    </p>
                                  )}
                                  {program.show_price && program.price !== undefined && (
                                    <p className="font-montserrat text-parisian-grey-700">
                                      <span className="font-bold">Ár:</span> {program.price} EUR
                                      {program.show_max_persons && program.max_persons && ` (max. ${program.max_persons} fő)`}
                                    </p>
                                  )}
                                  {program.show_max_persons && program.max_persons && !program.show_price && (
                                    <p className="font-montserrat text-parisian-grey-700">
                                      <span className="font-bold">Létszám:</span> max. {program.max_persons} fő
                                    </p>
                                  )}
                                </div>
                              </div>
                            )
                          )}
                        </motion.div>
                      ))}
                    </motion.div>
                  )}

                  {/* CTA Button */}
                  <motion.a
                    href="#contact"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedService(null)}
                    className={`flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r ${selectedService.color} px-8 py-4 font-montserrat text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl`}
                  >
                    Kapcsolatfelvétel
                  </motion.a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  )
}
