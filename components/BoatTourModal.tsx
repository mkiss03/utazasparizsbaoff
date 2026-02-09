'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Ship, X, Calendar, Clock, QrCode, MapPin, MessageCircle, Anchor, Users } from 'lucide-react'

export default function BoatTourModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  // Delay showing the FAB for a smoother experience
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 2000)
    return () => clearTimeout(timer)
  }, [])

  const features = [
    {
      icon: Calendar,
      title: 'Teljes rugalmasság',
      description: 'Nincs fix időpont. Akkor mész, amikor neked jó.',
    },
    {
      icon: Clock,
      title: 'Hosszú érvényesség',
      description: '1 évig bármikor felhasználható a jegyed.',
    },
    {
      icon: QrCode,
      title: 'Azonnali használat',
      description: 'Névre szóló regisztráció nélkül, azonnal digitális jegy.',
    },
    {
      icon: MapPin,
      title: 'Klasszikus útvonal',
      description: 'Eiffel-torony indulás, Louvre, Notre-Dame, Hidak.',
    },
  ]

  const whatsappNumber = '36301234567' // Placeholder number
  const whatsappMessage = encodeURIComponent('Szia! Szeretnék hajójegyet rendelni Párizsba.')
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`

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
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed inset-4 z-50 mx-auto flex max-h-[90vh] max-w-3xl items-center justify-center md:inset-8"
            >
              <div className="relative h-full w-full overflow-hidden rounded-3xl bg-slate-50 shadow-2xl">
                {/* Close Button */}
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsOpen(false)}
                  className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-slate-900/80 text-white shadow-lg transition-colors hover:bg-slate-800"
                >
                  <X className="h-5 w-5" />
                </motion.button>

                {/* Scrollable Content */}
                <div className="h-full overflow-y-auto">
                  {/* Header with gradient overlay */}
                  <div className="relative h-48 bg-gradient-to-br from-slate-900 via-slate-800 to-amber-900 md:h-56">
                    <div className="absolute inset-0 bg-[url('/images/paris-river.jpg')] bg-cover bg-center opacity-30" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-400 shadow-lg">
                          <Ship className="h-6 w-6 text-slate-900" />
                        </div>
                        <Anchor className="h-6 w-6 text-amber-400/60" />
                      </div>
                      <h2 className="font-playfair text-2xl font-bold text-white md:text-3xl">
                        Szajnai hajózás Párizsban
                      </h2>
                      <p className="mt-1 text-sm text-amber-200 md:text-base">
                        Szabadság és élmény, kompromisszumok nélkül
                      </p>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-6 md:p-8 space-y-6">
                    {/* Intro */}
                    <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100">
                      <p className="text-base leading-relaxed text-slate-700">
                        <span className="font-semibold text-slate-900">Felejtsd el a sorban állást és a merev időpontokat!</span>{' '}
                        Párizsban élő, regisztrált idegenvezetőként olyan hajójegyet kínálok, amely nem korlátoz.
                      </p>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {features.map((feature, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 + idx * 0.1 }}
                          className="group rounded-xl border-2 border-slate-100 bg-white p-4 transition-all duration-300 hover:border-amber-200 hover:shadow-md"
                        >
                          <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600 transition-colors group-hover:bg-amber-400 group-hover:text-white">
                            <feature.icon className="h-5 w-5" />
                          </div>
                          <h3 className="font-semibold text-slate-900">{feature.title}</h3>
                          <p className="mt-1 text-sm text-slate-600">{feature.description}</p>
                        </motion.div>
                      ))}
                    </div>

                    {/* Target Audience */}
                    <div className="rounded-2xl bg-gradient-to-r from-amber-50 to-amber-100/50 p-5 border border-amber-200">
                      <div className="flex items-start gap-3">
                        <Users className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-slate-900">Neked szól, ha...</h4>
                          <p className="mt-1 text-sm text-slate-700">
                            ...nem szereted a menetrendeket, vagy csak akkor hajóznál, ha kisüt a nap. Tökéletes, ha spontán döntést hozol!
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Partner Section */}
                    <div className="rounded-2xl bg-slate-900 p-5 text-white">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                          <Ship className="h-5 w-5 text-amber-400" />
                        </div>
                        <div>
                          <h4 className="font-bold">Bateaux Parisiens</h4>
                          <p className="text-xs text-slate-400">Partner 1956 óta</p>
                        </div>
                      </div>
                      <p className="text-sm text-slate-300 leading-relaxed">
                        Panoráma üveghajók, indulás az Eiffel-toronytól. Párizs legismertebb hajótársasága garantálja az élményt.
                      </p>
                    </div>

                    {/* Pricing & CTA */}
                    <div className="rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 p-6 shadow-xl">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm text-slate-400 mb-1">Jegyárak</p>
                          <div className="flex items-baseline gap-4">
                            <div>
                              <span className="text-3xl font-bold text-white">17€</span>
                              <span className="ml-1 text-sm text-slate-400">/ felnőtt</span>
                            </div>
                            <div>
                              <span className="text-2xl font-bold text-amber-400">8€</span>
                              <span className="ml-1 text-sm text-slate-400">/ gyerek</span>
                            </div>
                          </div>
                        </div>
                        <motion.a
                          href={whatsappLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-400 px-6 py-3 font-semibold text-slate-900 shadow-lg transition-all hover:bg-amber-300 hover:shadow-amber-400/30"
                        >
                          <MessageCircle className="h-5 w-5" />
                          Jegyet kérek
                        </motion.a>
                      </div>
                      <p className="mt-4 text-xs text-slate-400 text-center sm:text-left">
                        Fizetés után azonnal küldöm a jegyet WhatsApp-on vagy e-mailben.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
