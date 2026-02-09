'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Ship,
  X,
  Calendar,
  Clock,
  QrCode,
  MapPin,
  Sun,
  Headphones,
  ArrowRight,
  RotateCcw,
  Anchor
} from 'lucide-react'

export default function BoatTourModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [direction, setDirection] = useState(0)

  const totalSteps = 4

  // Delay showing the FAB
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 2000)
    return () => clearTimeout(timer)
  }, [])

  // Reset step when modal closes
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setCurrentStep(1)
        setDirection(0)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  // Navigate to next/previous step
  const paginate = (newDirection: number) => {
    const newStep = currentStep + newDirection
    if (newStep >= 1 && newStep <= totalSteps) {
      setDirection(newDirection)
      setCurrentStep(newStep)
    }
  }

  // Jump to specific step
  const goToStep = (step: number) => {
    const dir = step > currentStep ? 1 : -1
    setDirection(dir)
    setCurrentStep(step)
  }

  // Handle CTA click - close modal and scroll to contact form
  const handleOrderClick = () => {
    setIsOpen(false)

    // Wait for modal close animation, then scroll
    setTimeout(() => {
      const contactSection = document.getElementById('contact')
        || document.getElementById('foglalas')
        || document.getElementById('form')
        || document.querySelector('[data-section="contact"]')

      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 350)
  }

  // Animation variants for step transitions
  const stepVariants = {
    enter: (dir: number) => ({
      opacity: 0,
      x: dir > 0 ? 60 : -60,
    }),
    center: {
      opacity: 1,
      x: 0,
    },
    exit: (dir: number) => ({
      opacity: 0,
      x: dir < 0 ? 60 : -60,
    }),
  }

  // Step 1: Introduction
  const Step1 = () => (
    <div className="space-y-6">
      <div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-amber-500 font-semibold text-sm uppercase tracking-wider mb-3"
        >
          1 / 4
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-playfair text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 leading-tight"
        >
          Szajnai hajózás –<br />
          <span className="text-amber-500">Szabadság és élmény</span>
        </motion.h2>
      </div>

      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-slate-600 text-base md:text-lg leading-relaxed"
      >
        Felejtsd el a sorban állást! Párizsban élő idegenvezetőként olyan jegyet
        kínálok neked, ami nem korlátoz.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="pt-2"
      >
        <button
          onClick={() => paginate(1)}
          className="group inline-flex items-center gap-3 bg-amber-500 hover:bg-amber-400 text-slate-900 px-6 py-3 md:px-8 md:py-4 rounded-full font-semibold text-base md:text-lg transition-all shadow-lg shadow-amber-500/25 hover:shadow-amber-400/30"
        >
          Induljunk
          <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
        </button>
      </motion.div>
    </div>
  )

  // Step 2: Benefits/Features
  const Step2 = () => {
    const features = [
      { icon: Calendar, text: 'Teljes rugalmasság', sub: 'Nincs fix időpont' },
      { icon: Clock, text: '1 évig érvényes', sub: 'Bármikor felhasználható' },
      { icon: QrCode, text: 'Azonnali digitális jegy', sub: 'Nincs nyomtatás' },
      { icon: MapPin, text: 'Klasszikus útvonal', sub: 'Eiffel, Louvre, Notre-Dame' },
    ]

    return (
      <div className="space-y-5">
        <div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-amber-500 font-semibold text-sm uppercase tracking-wider mb-3"
          >
            2 / 4 – Előnyök
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-playfair text-xl md:text-2xl lg:text-3xl font-bold text-slate-900"
          >
            Miért ez a legjobb választás?
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + idx * 0.08 }}
              className="flex items-start gap-3 p-3 rounded-xl bg-white/60 border border-amber-100"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center">
                <feature.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">{feature.text}</p>
                <p className="text-sm text-slate-600">{feature.sub}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="pt-1"
        >
          <button
            onClick={() => paginate(1)}
            className="group inline-flex items-center gap-3 bg-amber-500 hover:bg-amber-400 text-slate-900 px-6 py-3 md:px-8 md:py-4 rounded-full font-semibold transition-all shadow-lg shadow-amber-500/25"
          >
            Tovább
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </button>
        </motion.div>
      </div>
    )
  }

  // Step 3: Atmosphere / Target audience
  const Step3 = () => {
    const reasons = [
      { icon: Calendar, text: 'Nem szereted a menetrendeket' },
      { icon: Sun, text: 'Csak akkor hajóznál, ha kisüt a nap' },
      { icon: Headphones, text: 'Szeretnéd megismerni Párizs titkait' },
    ]

    return (
      <div className="space-y-5">
        <div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-amber-500 font-semibold text-sm uppercase tracking-wider mb-3"
          >
            3 / 4 – Neked szól
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-playfair text-xl md:text-2xl lg:text-3xl font-bold text-slate-900"
          >
            Ez a jegy neked szól, ha...
          </motion.h2>
        </div>

        <div className="space-y-3">
          {reasons.map((reason, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + idx * 0.1 }}
              className="flex items-center gap-3 p-4 bg-white/70 rounded-xl border border-amber-100"
            >
              <div className="flex-shrink-0 w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center">
                <reason.icon className="w-4 h-4 text-amber-600" />
              </div>
              <p className="text-slate-700 font-medium">{reason.text}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="flex items-center gap-3 p-4 bg-amber-50 rounded-xl border border-amber-200"
        >
          <Anchor className="w-6 h-6 text-amber-600 flex-shrink-0" />
          <div>
            <p className="font-semibold text-slate-900">Bateaux Parisiens</p>
            <p className="text-sm text-slate-600">Hivatalos partnerem 1956 óta</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
        >
          <button
            onClick={() => paginate(1)}
            className="group inline-flex items-center gap-3 bg-amber-500 hover:bg-amber-400 text-slate-900 px-6 py-3 md:px-8 md:py-4 rounded-full font-semibold transition-all shadow-lg shadow-amber-500/25"
          >
            Lássuk az árakat
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </button>
        </motion.div>
      </div>
    )
  }

  // Step 4: Pricing & CTA
  const Step4 = () => (
    <div className="space-y-5">
      <div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-amber-500 font-semibold text-sm uppercase tracking-wider mb-3"
        >
          4 / 4 – Jegyvétel
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-playfair text-xl md:text-2xl lg:text-3xl font-bold text-slate-900"
        >
          Árak és foglalás
        </motion.h2>
      </div>

      {/* Pricing Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl p-5 md:p-6 border border-amber-200 shadow-sm"
      >
        <div className="flex items-end justify-center gap-6 md:gap-10 mb-5">
          <div className="text-center">
            <p className="text-slate-600 text-sm mb-1">Felnőtt</p>
            <p className="text-4xl md:text-5xl font-bold text-slate-900">
              17<span className="text-xl md:text-2xl text-amber-500">€</span>
            </p>
          </div>
          <div className="h-10 w-px bg-amber-200" />
          <div className="text-center">
            <p className="text-slate-600 text-sm mb-1">Gyermek</p>
            <p className="text-3xl md:text-4xl font-bold text-amber-500">
              8<span className="text-lg md:text-xl">€</span>
            </p>
          </div>
        </div>

        {/* Main CTA Button */}
        <motion.button
          onClick={handleOrderClick}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-amber-500 hover:bg-amber-400 text-slate-900 py-4 rounded-full font-bold text-lg transition-all shadow-lg shadow-amber-500/30"
        >
          Jegyet kérek
        </motion.button>

        {/* Privacy Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="text-center text-slate-500 text-xs mt-3"
        >
          A megrendeléssel elfogadod az adatvédelmi tájékoztatómat.
        </motion.p>
      </motion.div>

      {/* Back to start */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.55 }}
        className="flex justify-center"
      >
        <button
          onClick={() => goToStep(1)}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-700 transition-colors text-sm"
        >
          <RotateCcw className="w-4 h-4" />
          Vissza az elejére
        </button>
      </motion.div>
    </div>
  )

  const steps = [Step1, Step2, Step3, Step4]
  const CurrentStepComponent = steps[currentStep - 1]

  return (
    <>
      {/* Floating Action Button - Amber/Gold */}
      <AnimatePresence>
        {isVisible && !isOpen && (
          <motion.button
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 left-6 z-40 flex items-center gap-2 rounded-full bg-amber-500 hover:bg-amber-400 px-4 py-3 text-slate-900 shadow-xl shadow-amber-500/30 transition-all duration-300 hover:scale-105 md:px-6 md:py-4"
          >
            <Ship className="h-5 w-5 md:h-6 md:w-6" />
            <span className="hidden font-semibold md:inline">Hajózás Párizsban</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm"
            />

            {/* Modal Container */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: 20 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl md:rounded-3xl shadow-2xl"
                style={{ backgroundColor: '#FAF7F2' }}
              >
                {/* Close Button */}
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.25 }}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsOpen(false)}
                  className="absolute right-3 top-3 md:right-4 md:top-4 z-20 flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-md hover:bg-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </motion.button>

                {/* Split Layout */}
                <div className="flex flex-col md:flex-row h-full max-h-[90vh]">

                  {/* Left Side - Journey Visualization */}
                  <div
                    className="relative w-full md:w-2/5 h-36 md:h-auto min-h-[144px] md:min-h-[520px] overflow-hidden flex-shrink-0 bg-[#FAF7F2] z-10"
                  >
                    {/* Journey Path Container */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      {/* Mobile: Horizontal layout */}
                      <div className="md:hidden relative w-full h-full px-8 py-6">
                        {/* Horizontal dashed path */}
                        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                          <path
                            d="M 10% 50% Q 30% 35%, 50% 50% T 90% 50%"
                            fill="none"
                            stroke="#fcd34d"
                            strokeWidth="2"
                            strokeDasharray="8 6"
                            strokeLinecap="round"
                          />
                        </svg>

                        {/* Checkpoint dots - horizontal */}
                        {[10, 36, 64, 90].map((pos, idx) => (
                          <motion.div
                            key={idx}
                            className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-white shadow-sm transition-colors duration-300 ${
                              idx + 1 <= currentStep ? 'bg-amber-500' : 'bg-amber-200'
                            }`}
                            style={{ left: `${pos}%`, marginLeft: '-6px' }}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2 + idx * 0.1 }}
                          />
                        ))}

                        {/* Boat - horizontal movement */}
                        <motion.div
                          className="absolute top-1/2 -translate-y-1/2"
                          initial={{ left: '10%' }}
                          animate={{
                            left: `${[10, 36, 64, 90][currentStep - 1]}%`,
                          }}
                          transition={{ duration: 0.5, ease: 'easeInOut' }}
                          style={{ marginLeft: '-20px', marginTop: '-24px' }}
                        >
                          {/* Floating boat animation */}
                          <motion.div
                            animate={{ y: [0, -4, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                          >
                            <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center shadow-lg border-3 border-white">
                              <Ship className="w-5 h-5 text-white" />
                            </div>
                          </motion.div>

                          {/* Wave effect */}
                          <motion.div
                            className="absolute -bottom-1 left-1/2 -translate-x-1/2"
                            animate={{ opacity: [0.4, 0.8, 0.4], scale: [0.8, 1.1, 0.8] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                          >
                            <svg width="32" height="8" viewBox="0 0 32 8">
                              <path
                                d="M0 4 Q8 0, 16 4 T32 4"
                                fill="none"
                                stroke="#fbbf24"
                                strokeWidth="2"
                                strokeLinecap="round"
                              />
                            </svg>
                          </motion.div>
                        </motion.div>
                      </div>

                      {/* Desktop: Vertical layout */}
                      <div className="hidden md:flex relative w-full h-full flex-col items-center py-12 px-8">
                        {/* Curved vertical path SVG */}
                        <svg
                          className="absolute inset-0 w-full h-full"
                          viewBox="0 0 100 100"
                          preserveAspectRatio="none"
                        >
                          <path
                            d="M 50 8 Q 35 25, 50 35 T 50 65 Q 65 75, 50 92"
                            fill="none"
                            stroke="#fcd34d"
                            strokeWidth="0.8"
                            strokeDasharray="3 2"
                            strokeLinecap="round"
                            vectorEffect="non-scaling-stroke"
                          />
                        </svg>

                        {/* Checkpoint dots with labels */}
                        {[
                          { top: '10%', label: 'Indulás' },
                          { top: '35%', label: 'Előnyök' },
                          { top: '65%', label: 'Neked szól' },
                          { top: '90%', label: 'Jegyvétel' },
                        ].map((checkpoint, idx) => (
                          <motion.div
                            key={idx}
                            className="absolute left-1/2 -translate-x-1/2 flex items-center gap-3"
                            style={{ top: checkpoint.top }}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + idx * 0.1 }}
                          >
                            {/* Dot */}
                            <div
                              className={`w-4 h-4 rounded-full border-2 border-white shadow-md transition-all duration-300 ${
                                idx + 1 <= currentStep
                                  ? 'bg-amber-500 scale-110'
                                  : 'bg-amber-200'
                              }`}
                            />
                            {/* Label */}
                            <span
                              className={`absolute left-8 whitespace-nowrap text-sm font-medium transition-colors duration-300 ${
                                idx + 1 <= currentStep ? 'text-slate-700' : 'text-slate-400'
                              }`}
                            >
                              {checkpoint.label}
                            </span>
                          </motion.div>
                        ))}

                        {/* The Boat Hero - Animated along the path */}
                        <motion.div
                          className="absolute left-1/2 -translate-x-1/2"
                          initial={{ top: '10%' }}
                          animate={{
                            top: ['10%', '35%', '65%', '90%'][currentStep - 1],
                          }}
                          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                          style={{ marginLeft: '-28px' }}
                        >
                          {/* Floating/bobbing animation wrapper */}
                          <motion.div
                            animate={{ y: [0, -6, 0] }}
                            transition={{
                              duration: 2.5,
                              repeat: Infinity,
                              ease: 'easeInOut',
                            }}
                          >
                            {/* Boat container */}
                            <div className="relative">
                              {/* Glow effect */}
                              <div className="absolute inset-0 bg-amber-400/30 rounded-full blur-xl scale-150" />

                              {/* Main boat icon */}
                              <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center shadow-xl border-4 border-white">
                                <Ship className="w-7 h-7 text-white drop-shadow-sm" />
                              </div>

                              {/* Wave elements */}
                              <motion.div
                                className="absolute -bottom-2 left-1/2 -translate-x-1/2"
                                animate={{
                                  opacity: [0.5, 1, 0.5],
                                  scale: [0.9, 1.1, 0.9],
                                }}
                                transition={{
                                  duration: 2,
                                  repeat: Infinity,
                                  ease: 'easeInOut',
                                }}
                              >
                                <svg width="48" height="12" viewBox="0 0 48 12">
                                  <path
                                    d="M0 6 Q12 2, 24 6 T48 6"
                                    fill="none"
                                    stroke="#fbbf24"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                  />
                                </svg>
                              </motion.div>

                              {/* Secondary wave */}
                              <motion.div
                                className="absolute -bottom-4 left-1/2 -translate-x-1/2"
                                animate={{
                                  opacity: [0.3, 0.6, 0.3],
                                  scale: [1, 1.2, 1],
                                }}
                                transition={{
                                  duration: 2.5,
                                  repeat: Infinity,
                                  ease: 'easeInOut',
                                  delay: 0.3,
                                }}
                              >
                                <svg width="56" height="10" viewBox="0 0 56 10">
                                  <path
                                    d="M0 5 Q14 1, 28 5 T56 5"
                                    fill="none"
                                    stroke="#fcd34d"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                  />
                                </svg>
                              </motion.div>
                            </div>
                          </motion.div>
                        </motion.div>

                        {/* Decorative floating bubbles */}
                        {[
                          { left: '20%', top: '25%', delay: 0 },
                          { left: '75%', top: '45%', delay: 0.5 },
                          { left: '30%', top: '70%', delay: 1 },
                        ].map((bubble, idx) => (
                          <motion.div
                            key={idx}
                            className="absolute w-2 h-2 rounded-full bg-amber-300/40"
                            style={{ left: bubble.left, top: bubble.top }}
                            animate={{
                              y: [0, -10, 0],
                              opacity: [0.3, 0.6, 0.3],
                            }}
                            transition={{
                              duration: 3,
                              repeat: Infinity,
                              ease: 'easeInOut',
                              delay: bubble.delay,
                            }}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Bottom branding badge */}
                    <div className="absolute bottom-3 left-3 md:bottom-4 md:left-4">
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-md"
                      >
                        <Anchor className="w-4 h-4 text-amber-500" />
                        <span className="text-xs font-medium text-slate-600">Szajna túra</span>
                      </motion.div>
                    </div>
                  </div>

                  {/* Right Side - Content */}
                  <div
                    className="flex-1 flex flex-col overflow-hidden relative z-10 bg-[#FAF7F2]"
                  >
                    {/* Scrollable Content Area */}
                    <div className="flex-1 overflow-y-auto p-5 md:p-8 lg:p-10 bg-[#FAF7F2]">
                      <AnimatePresence mode="wait" custom={direction}>
                        <motion.div
                          key={currentStep}
                          custom={direction}
                          variants={stepVariants}
                          initial="enter"
                          animate="center"
                          exit="exit"
                          transition={{ duration: 0.25, ease: 'easeInOut' }}
                          className="w-full bg-[#FAF7F2]"
                        >
                          <CurrentStepComponent />
                        </motion.div>
                      </AnimatePresence>
                    </div>

                    {/* Progress Bar with Ship Icon */}
                    <div
                      className="p-4 md:p-5 border-t border-amber-100"
                      style={{ backgroundColor: '#FAF7F2' }}
                    >
                      <div className="relative h-6">
                        {/* Track background */}
                        <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-1 bg-amber-100 rounded-full">
                          {/* Filled track */}
                          <motion.div
                            className="h-full bg-amber-500 rounded-full"
                            initial={{ width: '0%' }}
                            animate={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
                            transition={{ duration: 0.35, ease: 'easeOut' }}
                          />
                        </div>

                        {/* Step dots */}
                        <div className="absolute inset-0 flex justify-between items-center">
                          {[1, 2, 3, 4].map((step) => (
                            <button
                              key={step}
                              onClick={() => goToStep(step)}
                              className={`relative z-10 w-3 h-3 rounded-full transition-all duration-300 ${
                                step <= currentStep
                                  ? 'bg-amber-500'
                                  : 'bg-amber-200'
                              } ${step === currentStep ? 'scale-125 ring-2 ring-amber-300 ring-offset-2' : 'hover:scale-110'}`}
                              style={{
                                ringOffsetColor: '#FAF7F2',
                              }}
                            />
                          ))}
                        </div>

                        {/* Ship indicator - positioned on the track */}
                        <motion.div
                          className="absolute top-1/2 -translate-y-1/2 z-20"
                          initial={{ left: '0%' }}
                          animate={{
                            left: `calc(${((currentStep - 1) / (totalSteps - 1)) * 100}%)`,
                          }}
                          transition={{ duration: 0.35, ease: 'easeOut' }}
                          style={{ marginLeft: '-10px' }}
                        >
                          <div className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center shadow-md border-2 border-white">
                            <Ship className="w-2.5 h-2.5 text-white" />
                          </div>
                        </motion.div>
                      </div>

                      {/* Step labels */}
                      <div className="flex justify-between mt-2 text-xs">
                        {['Indulás', 'Előnyök', 'Neked szól', 'Jegyvétel'].map((label, idx) => (
                          <span
                            key={label}
                            className={`transition-colors ${
                              currentStep >= idx + 1
                                ? 'text-slate-700 font-medium'
                                : 'text-slate-400'
                            }`}
                          >
                            {label}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
