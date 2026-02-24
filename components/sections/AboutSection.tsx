'use client'

import { motion } from 'framer-motion'
import { Heart, Sparkles, MapPin } from 'lucide-react'
import Image from 'next/image'
import type { AboutSectionSettings } from '@/lib/types/landing-page'

interface AboutSectionProps {
  title?: string
  description?: string
  image?: string
  pageSettings?: AboutSectionSettings
}

export default function AboutSection({
  title: propTitle = 'Bemutatkozás',
  description: propDescription,
  image: propImage = '/images/viktoriaprofillouvre.jpg',
  pageSettings: ps,
}: AboutSectionProps) {
  const title = ps?.title || propTitle
  const description = ps?.description || propDescription
  const image = ps?.aboutImage || propImage
  const sectionBadge = ps?.sectionBadge || 'Rólam'
  const offerCardsTitle = ps?.offerCardsTitle || 'Amit kínálok'
  const card1Title = ps?.offerCard1Title || 'Személyre szabott élmények'
  const card1Desc = ps?.offerCard1Description || 'Minden túra az érdeklődésedre és tempódra van szabva, legyen szó művészetről, gasztronómiáról vagy történelemről.'
  const card2Title = ps?.offerCard2Title || 'Helyi insider tudás'
  const card2Desc = ps?.offerCard2Description || 'Megmutatom azokat a helyeket, amiket csak a helyiek ismernek – autentikus kávézókat, rejtett udvarokat és varázslatos utcákat.'
  const card3Title = ps?.offerCard3Title || 'Gondtalan élmény'
  const card3Desc = ps?.offerCard3Description || 'Teljes körű szervezéstől kezdve a praktikus tippekig – minden részletre figyelek, hogy te csak élvezd Párizst.'
  const stat1Value = ps?.stat1Value || '10+'
  const stat1Label = ps?.stat1Label || 'év Párizsban'
  const stat2Value = ps?.stat2Value || '1000+'
  const stat2Label = ps?.stat2Label || 'elégedett vendég'
  const stat3Value = ps?.stat3Value || '⭐'
  const stat3Label = ps?.stat3Label || 'Licencelt idegenvezetés'
  const quoteText = ps?.quoteText || 'Párizs mindig jó ötlet – és szeretném, ha a te párizsi élményeid felejthetetlenek lennének.'
  const quoteAuthor = ps?.quoteAuthor || '— Viktória'
  // Use default image if image prop is null or empty
  const imageUrl = image && image.trim() !== '' ? image : '/images/viktoriaprofillouvre.jpg'

  return (
    <section
      id="about"
      className="relative overflow-hidden bg-white py-20 md:py-32"
    >
      {/* Background Decorations */}
      <div className="absolute right-0 top-20 h-96 w-96 rounded-full bg-parisian-beige-200 opacity-20 blur-3xl" />
      <div className="absolute bottom-20 left-0 h-96 w-96 rounded-full bg-parisian-cream-200 opacity-20 blur-3xl" />

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
            {sectionBadge}
          </motion.span>
          <h2 className="mb-4 font-playfair text-3xl font-bold text-parisian-grey-800 sm:text-4xl md:text-5xl lg:text-6xl">
            {title}
          </h2>
        </motion.div>

        {/* Main Content - Text-focused layout */}
        <div className="mx-auto max-w-5xl">
          <div className="grid items-start gap-12 md:grid-cols-[2fr_1fr] lg:gap-16">
            {/* Left: Main Text Content */}
            <div className="space-y-8">
              {/* Introduction Text */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                {description ? (
                  <div
                    className="prose prose-lg max-w-none text-parisian-grey-700"
                    dangerouslySetInnerHTML={{ __html: description }}
                  />
                ) : (
                  <>
                    <p className="text-lg leading-relaxed text-parisian-grey-700 md:text-xl">
                      <span className="font-playfair text-2xl font-semibold text-parisian-grey-800">
                        Üdvözöllek!
                      </span>{' '}
                      Viktória vagyok, és több mint 10 éve élek Párizsban. A francia kultúra és történelem iránti szenvedélyem vezet minden nap, amikor megosztom veled a Fények Városa rejtett kincseit.
                    </p>
                    <p className="text-base leading-relaxed text-parisian-grey-600 md:text-lg">
                      Párizs nem csak egy város számomra – ez az otthonom, a második hazám, ahol minden utca egy történetet mesél, minden sarok egy titkot rejt. Célom, hogy ne csak turistaként, hanem egy helyi szemével fedezd fel ezt a varázslatos várost.
                    </p>
                  </>
                )}
              </motion.div>

              {/* What I Offer - Styled Cards */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
                className="space-y-4"
              >
                <h3 className="mb-6 font-playfair text-2xl font-bold text-parisian-grey-800 md:text-3xl">
                  {offerCardsTitle}
                </h3>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-3 sm:gap-4 rounded-2xl border-2 border-parisian-beige-200 bg-gradient-to-br from-white to-parisian-cream-50 p-4 sm:p-6 transition-all duration-300 hover:border-parisian-beige-300 hover:shadow-lg"
                >
                  <div className="flex h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 items-center justify-center rounded-full bg-parisian-beige-100">
                    <Heart className="h-5 w-5 sm:h-6 sm:w-6 text-parisian-beige-600" />
                  </div>
                  <div>
                    <h4 className="mb-2 font-montserrat text-base sm:text-lg font-bold text-parisian-grey-800">
                      {card1Title}
                    </h4>
                    <p className="text-sm leading-relaxed text-parisian-grey-600">
                      {card1Desc}
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-3 sm:gap-4 rounded-2xl border-2 border-parisian-beige-200 bg-gradient-to-br from-white to-parisian-cream-50 p-4 sm:p-6 transition-all duration-300 hover:border-parisian-beige-300 hover:shadow-lg"
                >
                  <div className="flex h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 items-center justify-center rounded-full bg-parisian-beige-100">
                    <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-parisian-beige-600" />
                  </div>
                  <div>
                    <h4 className="mb-2 font-montserrat text-base sm:text-lg font-bold text-parisian-grey-800">
                      {card2Title}
                    </h4>
                    <p className="text-sm leading-relaxed text-parisian-grey-600">
                      {card2Desc}
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-3 sm:gap-4 rounded-2xl border-2 border-parisian-beige-200 bg-gradient-to-br from-white to-parisian-cream-50 p-4 sm:p-6 transition-all duration-300 hover:border-parisian-beige-300 hover:shadow-lg"
                >
                  <div className="flex h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 items-center justify-center rounded-full bg-parisian-beige-100">
                    <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-parisian-beige-600" />
                  </div>
                  <div>
                    <h4 className="mb-2 font-montserrat text-base sm:text-lg font-bold text-parisian-grey-800">
                      {card3Title}
                    </h4>
                    <p className="text-sm leading-relaxed text-parisian-grey-600">
                      {card3Desc}
                    </p>
                  </div>
                </motion.div>
              </motion.div>

              {/* Closing Statement */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                viewport={{ once: true }}
                className="rounded-2xl bg-parisian-beige-50 p-6"
              >
                <p className="font-montserrat text-base italic leading-relaxed text-parisian-grey-700">
                  &ldquo;{quoteText}&rdquo;
                </p>
                <p className="mt-3 font-montserrat text-sm font-semibold text-parisian-grey-600">
                  {quoteAuthor}
                </p>
              </motion.div>
            </div>

            {/* Right: Small Profile Photo + Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              className="space-y-6 mx-auto md:mx-0"
            >
              {/* Smaller Profile Image */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                className="relative mx-auto md:mx-0"
              >
                <div className="relative aspect-[3/4] w-full max-w-full sm:max-w-[280px] overflow-hidden rounded-3xl shadow-xl">
                  <Image
                    src={imageUrl}
                    alt="Viktória"
                    fill
                    sizes="(max-width: 640px) 100vw, 280px"
                    className="object-cover object-top"
                  />
                </div>
                {/* Decorative accent */}
                <div className="absolute -right-3 -top-3 -z-10 h-full w-full rounded-3xl bg-parisian-beige-200" />
              </motion.div>

              {/* Quick Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                viewport={{ once: true }}
                className="space-y-4"
              >
                <div className="rounded-2xl border-2 border-parisian-beige-200 bg-white p-4">
                  <div className="text-center">
                    <p className="font-playfair text-3xl font-bold text-parisian-beige-600">{stat1Value}</p>
                    <p className="font-montserrat text-sm text-parisian-grey-600">{stat1Label}</p>
                  </div>
                </div>

                <div className="rounded-2xl border-2 border-parisian-beige-200 bg-white p-4">
                  <div className="text-center">
                    <p className="font-playfair text-3xl font-bold text-parisian-beige-600">{stat2Value}</p>
                    <p className="font-montserrat text-sm text-parisian-grey-600">{stat2Label}</p>
                  </div>
                </div>

                <div className="rounded-2xl border-2 border-parisian-beige-200 bg-white p-4">
                  <div className="text-center">
                    <p className="font-playfair text-3xl font-bold text-parisian-beige-600">{stat3Value}</p>
                    <p className="font-montserrat text-sm text-parisian-grey-600">{stat3Label}</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
