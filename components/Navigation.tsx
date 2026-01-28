'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import Image from 'next/image'

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { scrollY } = useScroll()
  const backgroundColor = useTransform(
    scrollY,
    [0, 100],
    ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.98)']
  )

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const enableFlashcards = process.env.NEXT_PUBLIC_ENABLE_FLASHCARDS === 'true'

  const allNavItems = [
    { name: 'Kezdőlap', href: '/' },
    { name: 'Rólam', href: '/#about' },
    { name: 'Szolgáltatások', href: '/#services' },
    { name: 'Városbérletek', href: '/pricing' },
    { name: 'Párizsi naplóm', href: '/blog' },
    { name: 'Kapcsolat', href: '/#contact' },
  ]

  // Filter out Városbérletek if flashcards feature is disabled
  const navItems = enableFlashcards
    ? allNavItems
    : allNavItems.filter(item => item.name !== 'Városbérletek')

  return (
    <>
      <motion.nav
        style={{ backgroundColor }}
        className={`fixed left-0 right-0 top-0 z-40 transition-all duration-300 ${
          isScrolled ? 'shadow-lg backdrop-blur-md' : ''
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex h-24 items-center justify-between">
            {/* Logo */}
            <motion.a
              href="/"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-3"
            >
              <div className="relative h-[5.5rem] w-[5.5rem]">
                <Image
                  src="/images/logofix-removebg-preview.png"
                  alt="Utazás Párizsba"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <span className="font-playfair text-xl font-bold text-parisian-grey-800 hidden sm:inline">
                Utazás <span className="text-parisian-beige-500">Párizsba</span>
              </span>
            </motion.a>

            {/* Desktop Navigation */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="hidden items-center gap-8 md:flex"
            >
              {navItems.map((item, index) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="relative font-montserrat font-medium text-parisian-grey-700 transition-colors hover:text-parisian-beige-600"
                >
                  {item.name}
                  <motion.span
                    className="absolute -bottom-1 left-0 h-0.5 w-0 bg-parisian-beige-400 transition-all duration-300 hover:w-full"
                    whileHover={{ width: '100%' }}
                  />
                </motion.a>
              ))}
              <motion.a
                href="#newsletter"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="rounded-full bg-parisian-beige-400 px-6 py-2 font-semibold text-white transition-all duration-300 hover:bg-parisian-beige-500"
              >
                Hírlevél
              </motion.a>
            </motion.div>

            {/* Mobile Menu Button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="h-8 w-8 text-parisian-grey-700" />
              ) : (
                <Menu className="h-8 w-8 text-parisian-grey-700" />
              )}
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <motion.div
        initial={{ opacity: 0, x: '100%' }}
        animate={{
          opacity: isOpen ? 1 : 0,
          x: isOpen ? 0 : '100%',
        }}
        transition={{ duration: 0.3 }}
        className={`fixed right-0 top-24 z-30 h-screen w-full bg-white/98 backdrop-blur-lg shadow-xl md:hidden ${
          isOpen ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
      >
        <div className="flex flex-col items-center gap-8 p-8">
          {navItems.map((item, index) => (
            <motion.a
              key={item.name}
              href={item.href}
              initial={{ opacity: 0, x: 50 }}
              animate={{
                opacity: isOpen ? 1 : 0,
                x: isOpen ? 0 : 50,
              }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              onClick={() => setIsOpen(false)}
              className="text-2xl font-semibold text-parisian-grey-800"
            >
              {item.name}
            </motion.a>
          ))}
          <motion.a
            href="#newsletter"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: isOpen ? 1 : 0,
              scale: isOpen ? 1 : 0.8,
            }}
            transition={{ duration: 0.3, delay: 0.4 }}
            onClick={() => setIsOpen(false)}
            className="rounded-full bg-parisian-beige-400 px-8 py-3 text-xl font-semibold text-white"
          >
            Hírlevél
          </motion.a>
        </div>
      </motion.div>
    </>
  )
}
