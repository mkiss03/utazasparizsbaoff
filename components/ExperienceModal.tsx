'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Check, Clock, Users, Euro, ChevronRight, ChevronLeft, Zap, UtensilsCrossed, ExternalLink } from 'lucide-react'
import Image from 'next/image'
import type { Experience } from '@/lib/types/database'

interface ExperienceModalProps {
  experience: Experience
  isOpen: boolean
  onClose: () => void
}

const TOTAL_STEPS = 2

export default function ExperienceModal({ experience: exp, isOpen, onClose }: ExperienceModalProps) {
  const [step, setStep] = useState(1)
  const [direction, setDirection] = useState(0)

  // Reset step on close
  useEffect(() => {
    if (!isOpen) {
      const t = setTimeout(() => { setStep(1); setDirection(0) }, 300)
      return () => clearTimeout(t)
    }
  }, [isOpen])

  const paginate = (dir: number) => {
    const next = step + dir
    if (next >= 1 && next <= TOTAL_STEPS) {
      setDirection(dir)
      setStep(next)
    }
  }

  const isVR = exp.design_accent === 'VR_3D'
  const accentColor = isVR ? '#7C3AED' : '#D97706'
  const accentBg = isVR ? 'bg-purple-600' : 'bg-amber-500'
  const AccentIcon = isVR ? Zap : UtensilsCrossed
  const accentLabel = isVR ? 'VR / 3D Élmény' : 'Gasztronómia'

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -60 : 60, opacity: 0 }),
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl bg-white"
            >
              {/* Close button */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
                whileHover={{ scale: 1.1, rotate: 90 }}
                onClick={onClose}
                className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm hover:bg-black/50 transition-colors"
              >
                <X className="h-4 w-4" />
              </motion.button>

              {/* Split layout */}
              <div className="flex flex-col md:flex-row h-full max-h-[85vh]">
                {/* Left: image panel */}
                <div className="relative h-52 flex-shrink-0 md:h-auto md:w-2/5">
                  <Image
                    src={exp.image}
                    alt={exp.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent md:bg-gradient-to-r md:from-transparent md:to-black/10" />
                  {/* Accent badge */}
                  <div className={`absolute top-4 left-4 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold text-white ${accentBg}`}>
                    <AccentIcon className="h-3.5 w-3.5" />
                    {accentLabel}
                  </div>
                  {/* Price chip */}
                  <div className="absolute bottom-4 left-4 flex items-center gap-1 rounded-xl bg-white/95 px-3 py-1.5 shadow">
                    <Euro className="h-4 w-4" style={{ color: accentColor }} />
                    <span className="font-bold text-slate-800">{exp.price}</span>
                    <span className="text-xs text-slate-500">/ fő</span>
                  </div>
                </div>

                {/* Right: content */}
                <div className="flex flex-1 flex-col overflow-hidden">
                  {/* Step content */}
                  <div className="flex-1 overflow-y-auto p-6 md:p-8">
                    <AnimatePresence mode="wait" custom={direction}>
                      <motion.div
                        key={step}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.28, ease: 'easeInOut' }}
                      >
                        {step === 1 && (
                          <div className="space-y-4">
                            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: accentColor }}>
                              Bemutatkozás
                            </p>
                            <h2 className="font-playfair text-2xl font-bold text-slate-800 leading-tight">
                              {exp.title}
                            </h2>
                            <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                              {exp.short_description}
                            </p>
                            {/* Meta chips */}
                            <div className="flex flex-wrap gap-3 pt-2">
                              {exp.group_size && (
                                <div className="flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-2 text-xs text-slate-600">
                                  <Users className="h-3.5 w-3.5" />
                                  {exp.group_size}
                                </div>
                              )}
                              {exp.duration && (
                                <div className="flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-2 text-xs text-slate-600">
                                  <Clock className="h-3.5 w-3.5" />
                                  {exp.duration}
                                </div>
                              )}
                              <div className="flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-2 text-xs text-slate-600">
                                <Euro className="h-3.5 w-3.5" />
                                {exp.price} € / fő
                              </div>
                            </div>
                          </div>
                        )}

                        {step === 2 && (
                          <div className="space-y-5">
                            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: accentColor }}>
                              Program részletei
                            </p>
                            {exp.full_description && (
                              <p className="text-slate-600 leading-relaxed text-sm whitespace-pre-line">
                                {exp.full_description}
                              </p>
                            )}
                            {exp.includes && exp.includes.length > 0 && (
                              <div>
                                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">A programban foglalt:</p>
                                <ul className="space-y-2">
                                  {exp.includes.map((item, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                                      <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                                      {item}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {/* CTA */}
                            <a
                              href={`/elmenyek/${exp.slug}`}
                              onClick={onClose}
                              className="mt-4 flex items-center justify-center gap-2 rounded-full px-8 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:scale-105"
                              style={{ backgroundColor: accentColor }}
                            >
                              Részletek & Foglalás
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </div>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Footer: progress + navigation */}
                  <div className="border-t border-slate-100 px-6 py-4">
                    {/* Progress bar */}
                    <div className="mb-4 h-1 w-full overflow-hidden rounded-full bg-slate-200">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: accentColor }}
                        animate={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
                        transition={{ duration: 0.4, ease: 'easeInOut' }}
                      />
                    </div>
                    {/* Nav buttons */}
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => paginate(-1)}
                        disabled={step === 1}
                        className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100 disabled:opacity-30 transition-colors"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Vissza
                      </button>
                      <span className="text-xs text-slate-400">{step} / {TOTAL_STEPS}</span>
                      {step < TOTAL_STEPS ? (
                        <button
                          onClick={() => paginate(1)}
                          className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:scale-105"
                          style={{ backgroundColor: accentColor }}
                        >
                          Tovább
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      ) : (
                        <button
                          onClick={onClose}
                          className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100 transition-colors"
                        >
                          Bezárás
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
