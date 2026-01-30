'use client'

import { motion } from 'framer-motion'
import { Quote, Star } from 'lucide-react'

export interface Testimonial {
  id: string
  name: string
  message: string
  rating?: number
  date?: string
  avatar?: string
}

interface TestimonialsSectionProps {
  title?: string
  subtitle?: string
  testimonials: Testimonial[]
}

export default function TestimonialsSection({
  title = 'Élmények, ahogy ők megélték',
  subtitle = 'Amit az utazóink mondanak rólunk',
  testimonials = []
}: TestimonialsSectionProps) {
  if (!testimonials || testimonials.length === 0) {
    return null
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-parisian-cream-50 py-20 md:py-32">
      {/* Background Decoration */}
      <div className="absolute left-0 top-20 h-96 w-96 rounded-full bg-parisian-beige-200 opacity-20 blur-3xl" />
      <div className="absolute bottom-20 right-0 h-96 w-96 rounded-full bg-french-blue-200 opacity-15 blur-3xl" />

      <div className="container relative z-10 mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-parisian-beige-400 to-parisian-beige-500 shadow-lg"
          >
            <Quote className="h-8 w-8 text-white" />
          </motion.div>
          <h2 className="mb-4 font-playfair text-3xl font-bold text-parisian-grey-800 sm:text-4xl md:text-5xl lg:text-6xl">
            {title}
          </h2>
          <p className="mx-auto max-w-2xl text-base text-parisian-grey-600 sm:text-lg md:text-xl">
            {subtitle}
          </p>
        </motion.div>

        {/* Testimonials Grid - Messenger Style */}
        <div className="mx-auto max-w-5xl space-y-8">
          {testimonials.map((testimonial, index) => {
            const isEven = index % 2 === 0
            return (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`flex ${isEven ? 'justify-start' : 'justify-end'}`}
              >
                <div className={`flex max-w-2xl gap-3 ${isEven ? 'flex-row' : 'flex-row-reverse'}`}>
                  {/* Avatar */}
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="flex-shrink-0"
                  >
                    <div className={`flex h-12 w-12 items-center justify-center rounded-full font-playfair text-lg font-bold text-white shadow-lg ${
                      isEven
                        ? 'bg-gradient-to-br from-parisian-beige-400 to-parisian-beige-500'
                        : 'bg-gradient-to-br from-french-blue-400 to-french-blue-500'
                    }`}>
                      {testimonial.avatar || testimonial.name.charAt(0).toUpperCase()}
                    </div>
                  </motion.div>

                  {/* Message Bubble */}
                  <div className="flex-1 space-y-2">
                    <div className={`rounded-2xl p-5 shadow-md ${
                      isEven
                        ? 'rounded-tl-none bg-parisian-cream-100 border-2 border-parisian-beige-200'
                        : 'rounded-tr-none bg-french-blue-50 border-2 border-french-blue-200'
                    }`}>
                      {/* Rating */}
                      {testimonial.rating && (
                        <div className="mb-2 flex gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < testimonial.rating!
                                  ? 'fill-parisian-beige-500 text-parisian-beige-500'
                                  : 'fill-parisian-grey-300 text-parisian-grey-300'
                              }`}
                            />
                          ))}
                        </div>
                      )}

                      {/* Message */}
                      <p className={`text-base leading-relaxed ${
                        isEven ? 'text-parisian-grey-800' : 'text-parisian-grey-800'
                      }`}>
                        &ldquo;{testimonial.message}&rdquo;
                      </p>
                    </div>

                    {/* Name and Date */}
                    <div className={`flex items-center gap-2 text-sm ${
                      isEven ? 'justify-start' : 'justify-end'
                    }`}>
                      <span className="font-semibold text-parisian-grey-700">{testimonial.name}</span>
                      {testimonial.date && (
                        <>
                          <span className="text-parisian-grey-400">•</span>
                          <span className="text-parisian-grey-500">{testimonial.date}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <p className="mb-6 text-lg text-parisian-grey-600">
            Legyél Te is a következő elégedett vendégünk!
          </p>
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-parisian-beige-400 to-parisian-beige-500 px-8 py-4 font-montserrat font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl"
          >
            Foglalj most
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}
