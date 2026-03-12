'use client'

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { Menu, X, ChevronDown } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import type { MenuSetting } from '@/lib/types/database'

interface NavigationProps {
  menuSettings?: MenuSetting[]
}

// Default fallback settings when DB table not seeded yet
const DEFAULT_SETTINGS: MenuSetting[] = [
  { id: '1', menu_key: 'walking_tours',  label: 'Sétatúrák',      href: '/walking-tours', is_active: true, sort_order: 1, parent_group: 'parisian_experiences', created_at: '', updated_at: '' },
  { id: '2', menu_key: 'louvre_guide',   label: 'Louvre Guide',   href: '/museum-guide',  is_active: true, sort_order: 2, parent_group: 'parisian_experiences', created_at: '', updated_at: '' },
  { id: '3', menu_key: 'bundles',        label: 'Kártyacsomagok', href: '/marketplace',   is_active: true, sort_order: 3, parent_group: 'parisian_experiences', created_at: '', updated_at: '' },
  { id: '4', menu_key: 'blog',           label: 'Párizsi Napló',  href: '/blog',          is_active: true, sort_order: 1, parent_group: 'inspiration',          created_at: '', updated_at: '' },
  { id: '5', menu_key: 'gallery',        label: 'Galéria',        href: '/galeria',        is_active: true, sort_order: 2, parent_group: 'inspiration',          created_at: '', updated_at: '' },
]

export default function Navigation({ menuSettings }: NavigationProps) {
  const settings = menuSettings && menuSettings.length > 0 ? menuSettings : DEFAULT_SETTINGS

  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [mobileOpenGroup, setMobileOpenGroup] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const { scrollY } = useScroll()
  const backgroundColor = useTransform(
    scrollY,
    [0, 100],
    ['rgba(250, 247, 242, 0)', 'rgba(250, 247, 242, 0.98)']
  )

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Close mobile menu on resize
  useEffect(() => {
    const handler = () => { if (window.innerWidth >= 768) setIsOpen(false) }
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  const activeByGroup = (group: string) =>
    settings.filter((s) => s.parent_group === group && s.is_active)
      .sort((a, b) => a.sort_order - b.sort_order)

  const experienceItems = activeByGroup('parisian_experiences')
  const inspirationItems = activeByGroup('inspiration')

  const DropdownMenu = ({ items, groupKey }: { items: MenuSetting[]; groupKey: string }) => {
    if (items.length === 0) return null
    const isOpen = openDropdown === groupKey
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute left-1/2 top-full mt-2 w-52 -translate-x-1/2 overflow-hidden rounded-xl border border-parisian-beige-200 bg-white shadow-xl"
          >
            {items.map((item) => (
              <a
                key={item.menu_key}
                href={item.href}
                onClick={() => setOpenDropdown(null)}
                className="block px-5 py-3 text-sm font-medium text-parisian-grey-700 transition-colors hover:bg-parisian-beige-50 hover:text-parisian-beige-600"
              >
                {item.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    )
  }

  const DesktopDropdownTrigger = ({
    label,
    groupKey,
    items,
  }: {
    label: string
    groupKey: string
    items: MenuSetting[]
  }) => {
    if (items.length === 0) return null
    const active = openDropdown === groupKey
    return (
      <div className="relative" ref={groupKey === 'parisian_experiences' ? dropdownRef : undefined}>
        <button
          onClick={() => setOpenDropdown(active ? null : groupKey)}
          className="flex items-center gap-1 font-montserrat font-medium text-parisian-grey-700 transition-colors hover:text-parisian-beige-600"
        >
          {label}
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-200 ${active ? 'rotate-180' : ''}`}
          />
        </button>
        <DropdownMenu items={items} groupKey={groupKey} />
      </div>
    )
  }

  return (
    <>
      <motion.nav
        style={{ backgroundColor }}
        className={`fixed left-0 right-0 top-0 z-40 transition-all duration-300 ${
          isScrolled ? 'shadow-md backdrop-blur-md' : ''
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
              <div className="relative h-20 w-20 flex-shrink-0">
                <Image
                  src="/images/logofix-removebg-preview.png"
                  alt="Utazás Párizsba"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <span className="hidden font-playfair text-xl font-bold text-parisian-grey-800 sm:inline">
                Utazás <span className="text-parisian-beige-500">Párizsba</span>
              </span>
            </motion.a>

            {/* Desktop Navigation */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="hidden items-center gap-7 md:flex"
            >
              {/* Rólam */}
              <a
                href="/#about"
                className="font-montserrat font-medium text-parisian-grey-700 transition-colors hover:text-parisian-beige-600"
              >
                Rólam
              </a>

              {/* Párizsi Élmények dropdown */}
              <DesktopDropdownTrigger
                label="Párizsi Élmények"
                groupKey="parisian_experiences"
                items={experienceItems}
              />

              {/* Inspiráció dropdown */}
              <DesktopDropdownTrigger
                label="Inspiráció"
                groupKey="inspiration"
                items={inspirationItems}
              />

              {/* Kapcsolat */}
              <a
                href="/#contact"
                className="font-montserrat font-medium text-parisian-grey-700 transition-colors hover:text-parisian-beige-600"
              >
                Kapcsolat
              </a>

              {/* Hírlevél CTA */}
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
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="h-7 w-7 text-parisian-grey-700" />
              ) : (
                <Menu className="h-7 w-7 text-parisian-grey-700" />
              )}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="fixed right-0 top-24 z-30 h-[calc(100vh-6rem)] w-full overflow-y-auto bg-white/98 shadow-xl backdrop-blur-lg md:hidden"
          >
            <div className="flex flex-col gap-1 p-6">
              {/* Rólam */}
              <a
                href="/#about"
                onClick={() => setIsOpen(false)}
                className="rounded-lg px-4 py-3 text-lg font-semibold text-parisian-grey-800 hover:bg-parisian-beige-50"
              >
                Rólam
              </a>

              {/* Párizsi Élmények accordion */}
              {experienceItems.length > 0 && (
                <div>
                  <button
                    onClick={() =>
                      setMobileOpenGroup(
                        mobileOpenGroup === 'parisian_experiences' ? null : 'parisian_experiences'
                      )
                    }
                    className="flex w-full items-center justify-between rounded-lg px-4 py-3 text-lg font-semibold text-parisian-grey-800 hover:bg-parisian-beige-50"
                  >
                    Párizsi Élmények
                    <ChevronDown
                      className={`h-5 w-5 transition-transform ${
                        mobileOpenGroup === 'parisian_experiences' ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {mobileOpenGroup === 'parisian_experiences' && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden pl-4"
                      >
                        {experienceItems.map((item) => (
                          <a
                            key={item.menu_key}
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            className="block rounded-lg px-4 py-2.5 text-base font-medium text-parisian-grey-600 hover:bg-parisian-beige-50 hover:text-parisian-beige-600"
                          >
                            {item.label}
                          </a>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Inspiráció accordion */}
              {inspirationItems.length > 0 && (
                <div>
                  <button
                    onClick={() =>
                      setMobileOpenGroup(
                        mobileOpenGroup === 'inspiration' ? null : 'inspiration'
                      )
                    }
                    className="flex w-full items-center justify-between rounded-lg px-4 py-3 text-lg font-semibold text-parisian-grey-800 hover:bg-parisian-beige-50"
                  >
                    Inspiráció
                    <ChevronDown
                      className={`h-5 w-5 transition-transform ${
                        mobileOpenGroup === 'inspiration' ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {mobileOpenGroup === 'inspiration' && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden pl-4"
                      >
                        {inspirationItems.map((item) => (
                          <a
                            key={item.menu_key}
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            className="block rounded-lg px-4 py-2.5 text-base font-medium text-parisian-grey-600 hover:bg-parisian-beige-50 hover:text-parisian-beige-600"
                          >
                            {item.label}
                          </a>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Kapcsolat */}
              <a
                href="/#contact"
                onClick={() => setIsOpen(false)}
                className="rounded-lg px-4 py-3 text-lg font-semibold text-parisian-grey-800 hover:bg-parisian-beige-50"
              >
                Kapcsolat
              </a>

              {/* Hírlevél */}
              <a
                href="#newsletter"
                onClick={() => setIsOpen(false)}
                className="mx-4 mt-4 rounded-full bg-parisian-beige-400 px-8 py-3 text-center text-lg font-semibold text-white hover:bg-parisian-beige-500"
              >
                Hírlevél
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
