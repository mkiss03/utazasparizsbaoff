'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Ship, Zap, UtensilsCrossed } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Experience } from '@/lib/types/database'
import BoatTourModal from './BoatTourModal'
import ExperienceModal from './ExperienceModal'

interface FloatingExperiencesHubProps {
  visible?: boolean
}

export default function FloatingExperiencesHub({ visible = true }: FloatingExperiencesHubProps) {
  const [hubExpanded, setHubExpanded] = useState(false)
  const [boatTourOpen, setBoatTourOpen] = useState(false)
  const [openExperienceSlug, setOpenExperienceSlug] = useState<string | null>(null)
  const [scrollVisible, setScrollVisible] = useState(false)
  const [experiences, setExperiences] = useState<Experience[]>([])

  // Show FAB after user scrolls a bit
  useEffect(() => {
    const handleScroll = () => setScrollVisible(window.scrollY > 300)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Load active experiences from DB
  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('experiences')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: true })
      .then(({ data }) => {
        if (data) setExperiences(data as Experience[])
      })
  }, [])

  if (!visible) return null

  const anyModalOpen = boatTourOpen || openExperienceSlug !== null

  const openExperience = experiences.find((e) => e.slug === openExperienceSlug) ?? null

  const subButtons = [
    {
      id: 'boat',
      label: 'Hajózás Varázsló',
      icon: <Ship className="h-4 w-4 flex-shrink-0" />,
      bgClass: 'bg-[#1a3a5c] hover:bg-[#1e4570]',
      onClick: () => { setBoatTourOpen(true); setHubExpanded(false) },
    },
    ...experiences.map((exp) => ({
      id: exp.slug,
      label: exp.title,
      icon: exp.design_accent === 'VR_3D'
        ? <Zap className="h-4 w-4 flex-shrink-0" />
        : <UtensilsCrossed className="h-4 w-4 flex-shrink-0" />,
      bgClass: exp.design_accent === 'VR_3D'
        ? 'bg-purple-600 hover:bg-purple-700'
        : 'bg-amber-500 hover:bg-amber-600',
      onClick: () => { setOpenExperienceSlug(exp.slug); setHubExpanded(false) },
    })),
  ]

  return (
    <>
      {/* Speed-dial hub */}
      <AnimatePresence>
        {scrollVisible && !anyModalOpen && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="fixed bottom-6 left-6 z-40 flex flex-col-reverse items-start gap-2"
          >
            {/* Sub-buttons (appear above the main button) */}
            <AnimatePresence>
              {hubExpanded && subButtons.map((btn, i) => (
                <motion.button
                  key={btn.id}
                  custom={i}
                  initial={{ opacity: 0, x: -16, scale: 0.85 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -16, scale: 0.85 }}
                  transition={{ delay: i * 0.07, duration: 0.22, ease: 'easeOut' }}
                  onClick={btn.onClick}
                  className={`flex items-center gap-2.5 rounded-full px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition-colors ${btn.bgClass}`}
                >
                  {btn.icon}
                  <span className="hidden max-w-[180px] truncate md:inline">{btn.label}</span>
                </motion.button>
              ))}
            </AnimatePresence>

            {/* Main FAB button */}
            <button
              onClick={() => setHubExpanded((v) => !v)}
              className="flex items-center gap-2 rounded-full bg-[#C4A882] px-5 py-3.5 text-white shadow-xl transition-colors hover:bg-[#B09672] md:px-6 md:py-4"
            >
              <motion.div
                animate={{ rotate: hubExpanded ? 45 : 0 }}
                transition={{ duration: 0.22 }}
              >
                <Sparkles className="h-5 w-5 md:h-6 md:w-6" />
              </motion.div>
              <span className="hidden font-semibold md:inline">Programok</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Boat Tour Modal — FAB hidden, externally controlled */}
      <BoatTourModal
        hideFab
        externalOpen={boatTourOpen}
        onExternalClose={() => setBoatTourOpen(false)}
      />

      {/* Experience Modals */}
      {experiences.map((exp) => (
        <ExperienceModal
          key={exp.slug}
          experience={exp}
          isOpen={openExperienceSlug === exp.slug}
          onClose={() => setOpenExperienceSlug(null)}
        />
      ))}
    </>
  )
}
