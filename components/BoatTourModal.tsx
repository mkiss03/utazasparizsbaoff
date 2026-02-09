'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Ship, X, Calendar, Clock, QrCode, MapPin, MessageCircle, Sun, Headphones, Users, ArrowRight, RotateCcw } from 'lucide-react'

export default function BoatTourModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)

  const totalSteps = 4

  // Delay showing the FAB
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 2000)
    return () => clearTimeout(timer)
  }, [])

  // Reset step when modal closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => setCurrentStep(1), 300)
    }
  }, [isOpen])

  const whatsappNumber = '36301234567'
  const whatsappMessage = encodeURIComponent('Szia! Szeretnék hajójegyet rendelni Párizsba.')
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`

  // Step content variants
  const contentVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 100 : -100,
      opacity: 0
    })
  }

  const [[page, direction], setPage] = useState([1, 0])

  const paginate = (newDirection: number) => {
    const newStep = currentStep + newDirection
    if (newStep >= 1 && newStep <= totalSteps) {
      setPage([newStep, newDirection])
      setCurrentStep(newStep)
    }
  }

  const goToStep = (step: number) => {
    const dir = step > currentStep ? 1 : -1
    setPage([step, dir])
    setCurrentStep(step)
  }

  // Step 1: Intro
  const Step1 = () => (
    <div className="space-y-6">
      <div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-amber-500 font-semibold text-sm uppercase tracking-wider mb-2"
        >
          Indulás
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-playfair text-3xl md:text-4xl font-bold text-slate-900 leading-tight"
        >
          Szajnai hajózás –<br />
          <span className="text-amber-500">Szabadság és élmény</span>
        </motion.h2>
      </div>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-slate-600 text-lg leading-relaxed"
      >
        Felejtsd el a sorban állást! Párizsban élő idegenvezetőként olyan jegyet kínálok,
        ami nem korlátoz, csak élményt ad.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="pt-4"
      >
        <button
          onClick={() => paginate(1)}
          className="group flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all hover:bg-slate-800 hover:gap-4"
        >
          Induljunk
          <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
        </button>
      </motion.div>
    </div>
  )

  // Step 2: Features
  const Step2 = () => {
    const features = [
      { icon: Calendar, text: 'Teljes rugalmasság', sub: 'Nincs fix időpont' },
      { icon: Clock, text: '1 évig érvényes', sub: 'Bármikor felhasználható' },
      { icon: QrCode, text: 'Azonnali használat', sub: 'Digitális jegy' },
      { icon: MapPin, text: 'Klasszikus útvonal', sub: 'Eiffel, Louvre, Notre-Dame' },
    ]

    return (
      <div className="space-y-6">
        <div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-amber-500 font-semibold text-sm uppercase tracking-wider mb-2"
          >
            2 / 4 – Előnyök
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-playfair text-2xl md:text-3xl font-bold text-slate-900"
          >
            Miért ez a legjobb választás?
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + idx * 0.1 }}
              className="flex items-start gap-3 p-3 rounded-xl hover:bg-amber-50 transition-colors"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-amber-400 flex items-center justify-center">
                <feature.icon className="w-5 h-5 text-slate-900" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">{feature.text}</p>
                <p className="text-sm text-slate-500">{feature.sub}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="pt-2"
        >
          <button
            onClick={() => paginate(1)}
            className="group flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-full font-semibold transition-all hover:bg-slate-800 hover:gap-4"
          >
            Tovább
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </button>
        </motion.div>
      </div>
    )
  }

  // Step 3: Atmosphere
  const Step3 = () => {
    const reasons = [
      { icon: Calendar, text: 'Nem szereted a menetrendeket' },
      { icon: Sun, text: 'Csak akkor hajóznál, ha kisüt a nap' },
      { icon: Headphones, text: 'Szeretnéd megismerni Párizs titkait (Audio guide)' },
    ]

    return (
      <div className="space-y-6">
        <div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-amber-500 font-semibold text-sm uppercase tracking-wider mb-2"
          >
            3 / 4 – Neked szól
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-playfair text-2xl md:text-3xl font-bold text-slate-900"
          >
            Ez a jegy neked szól, ha...
          </motion.h2>
        </div>

        <div className="space-y-3">
          {reasons.map((reason, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + idx * 0.1 }}
              className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-100 shadow-sm"
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                <reason.icon className="w-4 h-4 text-amber-600" />
              </div>
              <p className="text-slate-700">{reason.text}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="flex items-center gap-3 p-4 bg-slate-900 rounded-xl text-white"
        >
          <Ship className="w-6 h-6 text-amber-400" />
          <div>
            <p className="font-semibold">Bateaux Parisiens</p>
            <p className="text-sm text-slate-400">Partnerem 1956 óta</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
        >
          <button
            onClick={() => paginate(1)}
            className="group flex items-center gap-3 bg-amber-400 text-slate-900 px-8 py-4 rounded-full font-semibold transition-all hover:bg-amber-300 hover:gap-4"
          >
            Lássuk az árakat
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </button>
        </motion.div>
      </div>
    )
  }

  // Step 4: Pricing
  const Step4 = () => (
    <div className="space-y-6">
      <div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-amber-500 font-semibold text-sm uppercase tracking-wider mb-2"
        >
          4 / 4 – Jegyvétel
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-playfair text-2xl md:text-3xl font-bold text-slate-900"
        >
          Árak és tudnivalók
        </motion.h2>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-slate-900 rounded-2xl p-6 text-white"
      >
        <div className="flex items-end justify-center gap-8 mb-6">
          <div className="text-center">
            <p className="text-slate-400 text-sm mb-1">Felnőtt</p>
            <p className="text-5xl font-bold">17<span className="text-2xl text-amber-400">€</span></p>
          </div>
          <div className="h-12 w-px bg-slate-700" />
          <div className="text-center">
            <p className="text-slate-400 text-sm mb-1">Gyermek</p>
            <p className="text-4xl font-bold text-amber-400">8<span className="text-xl">€</span></p>
          </div>
        </div>

        <motion.a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center justify-center gap-2 w-full bg-white text-slate-900 py-4 rounded-full font-bold text-lg transition-all hover:bg-amber-50"
        >
          <MessageCircle className="w-5 h-5" />
          Jegyet kérek
        </motion.a>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center text-slate-500 text-sm"
      >
        Fizetés után azonnal küldöm a jegyet WhatsApp-on vagy e-mailben.
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex justify-center"
      >
        <button
          onClick={() => goToStep(1)}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-700 transition-colors"
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
      {/* Floating Action Button */}
      <AnimatePresence>
        {isVisible && !isOpen && (
          <motion.button
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 left-6 z-40 flex items-center gap-2 rounded-full bg-slate-900 px-4 py-3 text-white shadow-2xl transition-all duration-300 hover:bg-slate-800 hover:shadow-amber-500/20 hover:scale-105 md:px-6 md:py-4"
          >
            <Ship className="h-5 w-5 text-amber-400 md:h-6 md:w-6" />
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
              className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md"
            />

            {/* Modal Container */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 30 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-3xl shadow-2xl bg-[#FAF7F2]"
              >
                {/* Close Button */}
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsOpen(false)}
                  className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-slate-900/80 text-white shadow-lg backdrop-blur-sm"
                >
                  <X className="h-5 w-5" />
                </motion.button>

                {/* Split Layout */}
                <div className="flex flex-col md:flex-row h-full max-h-[90vh]">

                  {/* Left Side - Animated Image */}
                  <div className="relative w-full md:w-2/5 h-40 md:h-auto min-h-[160px] md:min-h-[550px] overflow-hidden flex-shrink-0">
                    {/* Panning Background Image */}
                    <motion.div
                      className="absolute inset-0 w-[200%] h-full bg-cover bg-center"
                      style={{
                        backgroundImage: `url('/images/paris-boat.jpg')`,
                        backgroundColor: '#1e293b'
                      }}
                      animate={{
                        x: ['0%', '-50%']
                      }}
                      transition={{
                        x: {
                          duration: 30,
                          repeat: Infinity,
                          ease: 'linear'
                        }
                      }}
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900/70 via-slate-900/50 to-slate-900/30 md:bg-gradient-to-t md:from-slate-900/80 md:via-slate-900/40 md:to-transparent" />

                    {/* Floating branding */}
                    <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="flex items-center gap-3"
                      >
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-amber-400 flex items-center justify-center shadow-lg">
                          <Ship className="w-5 h-5 md:w-6 md:h-6 text-slate-900" />
                        </div>
                        <div className="hidden md:block">
                          <p className="text-white font-semibold">Szajna túra</p>
                          <p className="text-amber-400 text-sm">Párizs szívében</p>
                        </div>
                      </motion.div>
                    </div>
                  </div>

                  {/* Right Side - Content */}
                  <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Scrollable Content Area */}
                    <div className="flex-1 overflow-y-auto p-6 md:p-10">
                      <AnimatePresence mode="wait" custom={direction}>
                        <motion.div
                          key={currentStep}
                          custom={direction}
                          variants={contentVariants}
                          initial="enter"
                          animate="center"
                          exit="exit"
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                        >
                          <CurrentStepComponent />
                        </motion.div>
                      </AnimatePresence>
                    </div>

                    {/* Progress Bar with Ship */}
                    <div className="p-4 md:p-6 border-t border-slate-200 bg-white/50">
                      <div className="relative">
                        {/* Track */}
                        <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-amber-400"
                            initial={{ width: '0%' }}
                            animate={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
                            transition={{ duration: 0.4, ease: 'easeOut' }}
                          />
                        </div>

                        {/* Ship indicator */}
                        <motion.div
                          className="absolute top-1/2 -translate-y-1/2"
                          initial={{ left: '0%' }}
                          animate={{ left: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
                          transition={{ duration: 0.4, ease: 'easeOut' }}
                          style={{ marginLeft: '-12px' }}
                        >
                          <div className="w-6 h-6 rounded-full bg-slate-900 flex items-center justify-center shadow-lg">
                            <Ship className="w-3 h-3 text-amber-400" />
                          </div>
                        </motion.div>

                        {/* Step dots */}
                        <div className="absolute inset-0 flex justify-between items-center pointer-events-none">
                          {[1, 2, 3, 4].map((step) => (
                            <button
                              key={step}
                              onClick={() => goToStep(step)}
                              className={`w-3 h-3 rounded-full transition-all pointer-events-auto ${
                                step <= currentStep
                                  ? 'bg-amber-400'
                                  : 'bg-slate-300'
                              } ${step === currentStep ? 'scale-125' : ''}`}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Step labels */}
                      <div className="flex justify-between mt-3 text-xs text-slate-500">
                        <span className={currentStep >= 1 ? 'text-slate-700 font-medium' : ''}>Indulás</span>
                        <span className={currentStep >= 2 ? 'text-slate-700 font-medium' : ''}>Előnyök</span>
                        <span className={currentStep >= 3 ? 'text-slate-700 font-medium' : ''}>Neked szól</span>
                        <span className={currentStep >= 4 ? 'text-slate-700 font-medium' : ''}>Jegyvétel</span>
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
