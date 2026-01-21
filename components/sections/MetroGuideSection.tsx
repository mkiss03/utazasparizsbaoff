'use client'

import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import {
  Smartphone,
  Banknote,
  Navigation as NavigationIcon,
  Calendar,
  Plane
} from 'lucide-react'

interface MetroGuideItem {
  id: string
  letter: string
  title: string
  description: string
  iconName: string
}

interface MetroGuideSectionProps {
  items?: MetroGuideItem[]
}

const defaultItems: MetroGuideItem[] = [
  {
    id: '1',
    letter: 'A',
    title: 'App & Card',
    description: 'Use Bonjour RATP app or Navigo Easy card.',
    iconName: 'Smartphone',
  },
  {
    id: '2',
    letter: 'F',
    title: 'Fares',
    description: 'Flat €2.55 fare covers all Metro & RER in region.',
    iconName: 'Banknote',
  },
  {
    id: '3',
    letter: 'N',
    title: 'Navigation',
    description: 'Follow line number and Terminus station.',
    iconName: 'Navigation',
  },
  {
    id: '4',
    letter: 'W',
    title: 'Weekly Pass',
    description: '€32.40 Navigo (Mon-Sun) is best value.',
    iconName: 'Calendar',
  },
  {
    id: '5',
    letter: 'Z',
    title: 'Zones & Airports',
    description: 'Line 14 for Orly, RER B for CDG.',
    iconName: 'Plane',
  },
]

const iconMap: Record<string, any> = {
  Smartphone,
  Banknote,
  Navigation: NavigationIcon,
  Calendar,
  Plane,
}

export default function MetroGuideSection({ items = defaultItems }: MetroGuideSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-gradient-to-b from-parisian-beige-50 to-white py-20 md:py-32"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-parisian-beige-400 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-french-blue-400 blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            className="mb-4 inline-block"
          >
            <span className="rounded-full bg-parisian-beige-100 px-4 py-2 font-montserrat text-sm font-medium text-parisian-grey-700">
              🚇 Metro Útmutató
            </span>
          </motion.div>
          <h2 className="mb-4 font-playfair text-4xl font-bold text-parisian-grey-800 md:text-5xl lg:text-6xl">
            Párizsi Metro 2026
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-parisian-grey-600">
            Minden amit tudnod kell a párizsi tömegközlekedésről egyetlen útvonalon
          </p>
        </motion.div>

        {/* Mobile: Vertical Timeline */}
        <div className="block lg:hidden">
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-6 top-0 h-full w-1 bg-parisian-beige-200">
              <motion.div
                className="h-full w-full origin-top bg-gradient-to-b from-parisian-beige-400 to-parisian-beige-600"
                style={{
                  scaleY: useTransform(scrollYProgress, [0, 0.8], [0, 1]),
                }}
              />
            </div>

            {/* Items */}
            <div className="space-y-12">
              {items.map((item, index) => (
                <MetroStopVertical
                  key={item.id}
                  item={item}
                  index={index}
                  totalItems={items.length}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Desktop: Horizontal Timeline */}
        <div className="hidden lg:block">
          <div className="relative">
            {/* Horizontal Line */}
            <div className="absolute left-0 top-24 h-1 w-full bg-parisian-beige-200">
              <motion.div
                className="h-full w-full origin-left bg-gradient-to-r from-parisian-beige-400 to-parisian-beige-600"
                style={{
                  scaleX: useTransform(scrollYProgress, [0.1, 0.9], [0, 1]),
                }}
              />
            </div>

            {/* Items */}
            <div className="flex justify-between">
              {items.map((item, index) => (
                <MetroStopHorizontal
                  key={item.id}
                  item={item}
                  index={index}
                  totalItems={items.length}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Vertical Metro Stop (Mobile)
function MetroStopVertical({
  item,
  index,
  totalItems,
}: {
  item: MetroGuideItem
  index: number
  totalItems: number
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const Icon = iconMap[item.iconName]

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="relative flex items-start gap-6 pl-16"
    >
      {/* Station Circle */}
      <motion.div
        initial={{ scale: 0 }}
        animate={isInView ? { scale: 1 } : {}}
        transition={{ duration: 0.4, delay: index * 0.1 + 0.2 }}
        className="absolute left-0 flex h-12 w-12 items-center justify-center rounded-full border-4 border-white bg-parisian-beige-400 shadow-lg"
      >
        <span className="font-playfair text-lg font-bold text-white">{item.letter}</span>
      </motion.div>

      {/* Content Card */}
      <div className="flex-1 rounded-2xl border border-parisian-beige-200 bg-white p-6 shadow-md transition-all hover:shadow-xl">
        <div className="mb-3 flex items-center gap-3">
          {Icon && (
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-parisian-beige-100">
              <Icon className="h-5 w-5 text-parisian-beige-600" />
            </div>
          )}
          <h3 className="font-playfair text-xl font-bold text-parisian-grey-800">
            {item.title}
          </h3>
        </div>
        <p className="font-montserrat text-parisian-grey-600">{item.description}</p>
      </div>
    </motion.div>
  )
}

// Horizontal Metro Stop (Desktop)
function MetroStopHorizontal({
  item,
  index,
  totalItems,
}: {
  item: MetroGuideItem
  index: number
  totalItems: number
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const Icon = iconMap[item.iconName]

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className="relative flex flex-col items-center"
      style={{ width: `${100 / totalItems}%` }}
    >
      {/* Content Card - Above the line */}
      <motion.div
        whileHover={{ scale: 1.05, y: -8 }}
        transition={{ type: 'spring', stiffness: 300 }}
        className="group relative mb-8 w-full max-w-[200px] cursor-pointer rounded-2xl border border-parisian-beige-200 bg-white p-6 shadow-md transition-all hover:border-parisian-beige-400 hover:shadow-2xl"
      >
        {/* Glow effect on hover */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-parisian-beige-400/0 to-parisian-beige-400/0 opacity-0 transition-opacity group-hover:opacity-20" />

        <div className="relative z-10">
          {Icon && (
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-parisian-beige-100 transition-colors group-hover:bg-parisian-beige-200">
              <Icon className="h-6 w-6 text-parisian-beige-600" />
            </div>
          )}
          <h3 className="mb-2 font-playfair text-lg font-bold text-parisian-grey-800">
            {item.title}
          </h3>
          <p className="text-sm font-montserrat text-parisian-grey-600">
            {item.description}
          </p>
        </div>
      </motion.div>

      {/* Station Circle - On the line */}
      <motion.div
        initial={{ scale: 0 }}
        animate={isInView ? { scale: 1 } : {}}
        transition={{ duration: 0.4, delay: index * 0.15 + 0.2, type: 'spring' }}
        className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-parisian-beige-400 to-parisian-beige-600 shadow-lg"
      >
        <span className="font-playfair text-2xl font-bold text-white">{item.letter}</span>
      </motion.div>

      {/* Connector line from card to station */}
      <motion.div
        initial={{ scaleY: 0 }}
        animate={isInView ? { scaleY: 1 } : {}}
        transition={{ duration: 0.3, delay: index * 0.15 + 0.4 }}
        className="absolute top-[calc(100%-8rem)] h-8 w-0.5 origin-top bg-parisian-beige-300"
      />
    </motion.div>
  )
}
