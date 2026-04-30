'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Sparkles, Euro, Users, Clock, ArrowRight } from 'lucide-react'
import type { ExperiencesPromoSettings } from '@/lib/types/landing-page'
import type { Experience } from '@/lib/types/database'

interface Props {
  settings: ExperiencesPromoSettings
  experiences: Experience[]
}

export default function ExperiencesPromoSection({ settings, experiences }: Props) {
  if (!settings.visible) return null

  return (
    <section className="py-20 bg-[#FAF7F2]">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block bg-[#F5EDE4] text-[#8B7D55] text-xs font-semibold tracking-widest uppercase px-4 py-2 rounded-full mb-4">
            {settings.sectionBadge}
          </span>
          <h2 className="font-playfair text-3xl md:text-4xl font-bold text-[#1F2937] mb-4">
            {settings.title}
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed">
            {settings.subtitle}
          </p>
        </motion.div>

        {/* Cards */}
        {experiences.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-10">
            {experiences.map((exp, i) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Link
                  href={`/elmenyek/${exp.slug}`}
                  className="group block bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={exp.image}
                      alt={exp.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold ${
                      exp.design_accent === 'VR_3D'
                        ? 'bg-purple-600 text-white'
                        : 'bg-amber-500 text-white'
                    }`}>
                      {exp.design_accent === 'VR_3D' ? '✦ VR Élmény' : '✦ Gasztronómia'}
                    </div>
                    <div className="absolute bottom-3 right-3 bg-white/95 rounded-lg px-2.5 py-1 flex items-center gap-1">
                      <Euro className="h-3.5 w-3.5 text-[#C4A882]" />
                      <span className="font-bold text-sm text-[#1F2937]">{exp.price}</span>
                      <span className="text-xs text-slate-400">/ fő</span>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="font-playfair text-lg font-bold text-[#1F2937] mb-1.5 group-hover:text-[#C4A882] transition-colors leading-tight">
                      {exp.title}
                    </h3>
                    <p className="text-slate-500 text-sm mb-3 line-clamp-2">{exp.short_description}</p>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mb-3">
                      {exp.group_size && (
                        <span className="flex items-center gap-1"><Users className="h-3 w-3" />{exp.group_size}</span>
                      )}
                      {exp.duration && (
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{exp.duration}</span>
                      )}
                    </div>
                    <span className="flex items-center gap-1 text-[#C4A882] text-sm font-semibold">
                      Részletek <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : null}

        {/* CTA */}
        <div className="text-center">
          <Link
            href={settings.ctaLink}
            className="inline-flex items-center gap-2 bg-[#1F2937] hover:bg-[#374151] text-white font-semibold px-8 py-3.5 rounded-full transition-colors"
          >
            <Sparkles className="h-4 w-4" />
            {settings.ctaText}
          </Link>
        </div>
      </div>
    </section>
  )
}
