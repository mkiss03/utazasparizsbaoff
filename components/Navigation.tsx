'use client'

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { Menu, X, ChevronDown } from 'lucide-react'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import type { MenuSetting } from '@/lib/types/database'

interface NavigationProps {
  menuSettings?: MenuSetting[]
}

const DEFAULT_SETTINGS: MenuSetting[] = [
  { id: '1', menu_key: 'walking_tours',  label: 'Sétatúrák',      href: '/walking-tours', is_active: true, sort_order: 1, parent_group: 'parisian_experiences', created_at: '', updated_at: '' },
  { id: '2', menu_key: 'louvre_guide',   label: 'Louvre Guide',   href: '/museum-guide',  is_active: false, sort_order: 2, parent_group: 'parisian_experiences', created_at: '', updated_at: '' },
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
  const [navExperiences, setNavExperiences] = useState<{ slug: string; title: string }[]>([])

  // Load active experiences for the dropdown
  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('experiences')
      .select('slug, title')
      .eq('is_active', true)
      .order('created_at', { ascending: true })
      .then(({ data }) => { if (data) setNavExperiences(data as { slug: string; title: string }[]) })
  }, [])

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

  // Close dropdown on outside click — only active when a dropdown is open
  useEffect(() => {
    if (!openDropdown) return
    const handler = () => setOpenDropdown(null)
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [openDropdown])

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
  const serviceItems = activeByGroup('services')

  // Fallback service items when DB not seeded yet
  const FALLBACK_SERVICES = [
    { label: 'Sétatúrák', href: '/#services' },
    { label: 'Repülőtéri Transzfer', href: '/#services' },
    { label: 'Programszervezés', href: '/#services' },
  ]
  const resolvedServiceItems = serviceItems.length > 0
    ? serviceItems.map((s) => ({ label: s.label, href: s.href }))
    : FALLBACK_SERVICES

  const openBoatTour = () => {
    window.dispatchEvent(new CustomEvent('open-boat-tour'))
    setOpenDropdown(null)
    setIsOpen(false)
  }

  const linkClass = 'block px-5 py-3 text-sm font-medium text-parisian-grey-700 transition-colors hover:bg-parisian-beige-50 hover:text-parisian-beige-600 text-left w-full'

  const DropdownMenu = ({ items, groupKey }: { items: MenuSetting[]; groupKey: string }) => {
    const visible = openDropdown === groupKey
    const isExperiences = groupKey === 'parisian_experiences'
    const isServices = groupKey === 'services'

    return (
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            className="absolute left-1/2 top-full mt-2 w-56 -translate-x-1/2 overflow-hidden rounded-xl border border-parisian-beige-200 bg-white shadow-xl"
          >
            {/* Párizsi Élmények: Hajózás + experiences table + menu_settings items */}
            {isExperiences && (
              <>
                <button onClick={openBoatTour} className={linkClass}>
                  Hajózás a Szajnán
                </button>
                {navExperiences.map((exp) => (
                  <a
                    key={exp.slug}
                    href={`/elmenyek/${exp.slug}`}
                    onClick={() => setOpenDropdown(null)}
                    className={linkClass}
                  >
                    {exp.title}
                  </a>
                ))}
              </>
            )}
            {/* Párizsi Élmények: extra menu_settings items (Sétatúrák, Kártyacsomagok stb.) */}
            {isExperiences && items.filter((i) => i.href !== '#boat-tour').map((item) => (
              <a
                key={item.menu_key}
                href={item.href}
                onClick={() => setOpenDropdown(null)}
                className={linkClass}
              >
                {item.label}
              </a>
            ))}
            {/* Szolgáltatások: DB vagy fallback */}
            {isServices && resolvedServiceItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setOpenDropdown(null)}
                className={linkClass}
              >
                {item.label}
              </a>
            ))}
            {/* Inspiráció és egyéb csoportok */}
            {!isExperiences && !isServices && items.map((item) => (
              <a
                key={item.menu_key}
                href={item.href}
                onClick={() => setOpenDropdown(null)}
                className={linkClass}
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
    alwaysShow,
  }: {
    label: string
    groupKey: string
    items: MenuSetting[]
    alwaysShow?: boolean
  }) => {
    if (items.length === 0 && !alwaysShow) return null
    const active = openDropdown === groupKey
    return (
      <div className="relative">
        <button
          onClick={(e) => {
            e.stopPropagation()
            setOpenDropdown(active ? null : groupKey)
          }}
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
                alwaysShow
              />

              {/* Szolgáltatások dropdown */}
              <DesktopDropdownTrigger
                label="Szolgáltatások"
                groupKey="services"
                items={serviceItems}
                alwaysShow
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
                      {/* Hajózás a Szajnán — modal trigger */}
                      <button
                        onClick={openBoatTour}
                        className="block w-full rounded-lg px-4 py-2.5 text-left text-base font-medium text-parisian-grey-600 hover:bg-parisian-beige-50 hover:text-parisian-beige-600"
                      >
                        Hajózás a Szajnán
                      </button>
                      {/* Élmények az experiences táblából */}
                      {navExperiences.map((exp) => (
                        <a
                          key={exp.slug}
                          href={`/elmenyek/${exp.slug}`}
                          onClick={() => setIsOpen(false)}
                          className="block rounded-lg px-4 py-2.5 text-base font-medium text-parisian-grey-600 hover:bg-parisian-beige-50 hover:text-parisian-beige-600"
                        >
                          {exp.title}
                        </a>
                      ))}
                      {/* Egyéb menu_settings elemek (Sétatúrák, Kártyacsomagok stb.) */}
                      {experienceItems.filter((i) => i.href !== '#boat-tour').map((item) => (
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

              {/* Szolgáltatások accordion */}
              <div>
                <button
                  onClick={() =>
                    setMobileOpenGroup(
                      mobileOpenGroup === 'services' ? null : 'services'
                    )
                  }
                  className="flex w-full items-center justify-between rounded-lg px-4 py-3 text-lg font-semibold text-parisian-grey-800 hover:bg-parisian-beige-50"
                >
                  Szolgáltatások
                  <ChevronDown
                    className={`h-5 w-5 transition-transform ${
                      mobileOpenGroup === 'services' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {mobileOpenGroup === 'services' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden pl-4"
                    >
                      {resolvedServiceItems.map((item) => (
                        <a
                          key={item.label}
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
