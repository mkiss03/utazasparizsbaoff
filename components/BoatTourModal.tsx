'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { Ship, X, Calendar, Clock, QrCode, MapPin, MessageCircle, Anchor } from 'lucide-react'

export default function BoatTourModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  // Mouse position for 3D tilt effect
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Smooth spring physics for tilt
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), { stiffness: 300, damping: 30 })
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), { stiffness: 300, damping: 30 })

  // Handle mouse move for 3D effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    mouseX.set((e.clientX - centerX) / rect.width)
    mouseY.set((e.clientY - centerY) / rect.height)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  // Delay showing the FAB
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 2000)
    return () => clearTimeout(timer)
  }, [])

  const features = [
    { icon: Calendar, title: 'Teljes rugalmasság', description: 'Nincs fix időpont' },
    { icon: Clock, title: '1 év érvényesség', description: 'Bármikor felhasználható' },
    { icon: QrCode, title: 'Azonnali jegy', description: 'Digitális, regisztráció nélkül' },
    { icon: MapPin, title: 'Klasszikus útvonal', description: 'Eiffel, Louvre, Notre-Dame' },
  ]

  const whatsappNumber = '36301234567'
  const whatsappMessage = encodeURIComponent('Szia! Szeretnék hajójegyet rendelni Párizsba.')
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`

  // Animation variants for staggered entrance
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
  }

  const imageVariants = {
    hidden: { opacity: 0, x: -50, scale: 1.1 },
    visible: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.8, ease: 'easeOut' } }
  }

  const featureVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      transition: { delay: 0.4 + i * 0.1, duration: 0.4, ease: 'easeOut' }
    })
  }

  const priceVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { delay: 0.8, duration: 0.5, ease: 'easeOut' } }
  }

  return (
    <>
      {/* Floating Action Button - Keeping as requested */}
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

            {/* 3D Perspective Container */}
            <div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
              style={{ perspective: '1200px' }}
            >
              <motion.div
                ref={cardRef}
                initial={{ opacity: 0, scale: 0.85, rotateX: 15 }}
                animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                exit={{ opacity: 0, scale: 0.85, rotateX: -15 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="relative w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-3xl shadow-2xl"
              >
                {/* Close Button */}
                <motion.button
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsOpen(false)}
                  className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-slate-900/90 text-white shadow-lg backdrop-blur-sm transition-colors hover:bg-slate-800"
                >
                  <X className="h-5 w-5" />
                </motion.button>

                {/* Split Layout Container */}
                <div className="flex flex-col md:flex-row h-full max-h-[90vh]">

                  {/* Left Side - Image */}
                  <motion.div
                    variants={imageVariants}
                    initial="hidden"
                    animate="visible"
                    className="relative w-full md:w-2/5 h-48 md:h-auto min-h-[200px] md:min-h-[500px] flex-shrink-0"
                  >
                    {/* Background Image */}
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{
                        backgroundImage: `url('/images/paris-boat.jpg')`,
                        backgroundColor: '#1e293b'
                      }}
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-transparent md:bg-gradient-to-t md:from-slate-900/80 md:via-slate-900/40 md:to-transparent" />

                    {/* Floating Elements on Image */}
                    <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="flex items-center gap-3"
                      >
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-400 shadow-lg shadow-amber-400/30">
                          <Ship className="h-6 w-6 text-slate-900" />
                        </div>
                        <Anchor className="h-8 w-8 text-amber-400/40" />
                      </motion.div>
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="mt-4 text-sm text-white/70 hidden md:block"
                      >
                        Bateaux Parisiens partner<br />
                        <span className="text-amber-400">1956 óta</span>
                      </motion.p>
                    </div>
                  </motion.div>

                  {/* Right Side - Content */}
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="flex-1 bg-[#FAF7F2] overflow-y-auto"
                  >
                    <div className="p-6 md:p-10 space-y-6">
                      {/* Header */}
                      <motion.div variants={itemVariants}>
                        <h2 className="font-playfair text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
                          Szajnai hajózás<br />
                          <span className="text-amber-500">Párizsban</span>
                        </h2>
                        <p className="mt-3 text-slate-600 leading-relaxed">
                          Felejtsd el a sorban állást és a merev időpontokat!
                          Olyan hajójegyet kínálok, amely nem korlátoz.
                        </p>
                      </motion.div>

                      {/* Features Grid - Minimal Style */}
                      <div className="grid grid-cols-2 gap-4 md:gap-6">
                        {features.map((feature, idx) => (
                          <motion.div
                            key={idx}
                            custom={idx}
                            variants={featureVariants}
                            initial="hidden"
                            animate="visible"
                            whileHover={{ scale: 1.02 }}
                            className="group cursor-default"
                          >
                            <div className="flex items-start gap-3">
                              <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-xl bg-amber-400/10 text-amber-500 transition-all duration-300 group-hover:bg-amber-400 group-hover:text-slate-900 group-hover:shadow-lg group-hover:shadow-amber-400/20">
                                <feature.icon className="h-5 w-5 md:h-6 md:w-6" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-slate-900 text-sm md:text-base">
                                  {feature.title}
                                </h3>
                                <p className="text-xs md:text-sm text-slate-600">
                                  {feature.description}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      {/* Target Audience - Subtle */}
                      <motion.div
                        variants={itemVariants}
                        className="border-l-4 border-amber-400 pl-4 py-2"
                      >
                        <p className="text-sm text-slate-600 italic">
                          "Neked szól, ha nem szereted a menetrendeket,
                          vagy csak akkor hajóznál, ha kisüt a nap."
                        </p>
                      </motion.div>

                      {/* Route Info - Compact */}
                      <motion.div variants={itemVariants} className="flex items-center gap-2 text-sm text-slate-600">
                        <MapPin className="h-4 w-4 text-amber-500" />
                        <span>Indulás: Eiffel-torony • Panoráma üveghajók</span>
                      </motion.div>
                    </div>

                    {/* Price Section - Navy Strip */}
                    <motion.div
                      variants={priceVariants}
                      initial="hidden"
                      animate="visible"
                      className="bg-slate-900 p-6 md:p-8"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                          <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">Jegyárak</p>
                          <div className="flex items-baseline gap-4">
                            <div>
                              <span className="text-3xl md:text-4xl font-bold text-white">17€</span>
                              <span className="ml-1 text-sm text-slate-400">felnőtt</span>
                            </div>
                            <div className="h-8 w-px bg-slate-700" />
                            <div>
                              <span className="text-2xl md:text-3xl font-bold text-amber-400">8€</span>
                              <span className="ml-1 text-sm text-slate-400">gyerek</span>
                            </div>
                          </div>
                        </div>
                        <motion.a
                          href={whatsappLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 font-semibold text-slate-900 shadow-lg transition-all hover:shadow-xl hover:shadow-white/20"
                        >
                          <MessageCircle className="h-5 w-5" />
                          Jegyet kérek
                        </motion.a>
                      </div>
                      <p className="mt-4 text-xs text-slate-500 text-center sm:text-left">
                        Fizetés után azonnal küldöm a jegyet WhatsApp-on vagy e-mailben.
                      </p>
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
