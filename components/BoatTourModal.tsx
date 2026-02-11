'use client'

import { useState, useEffect, useMemo } from 'react'
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
  Anchor,
  Star,
  Heart,
  Sparkles,
  Zap,
  Coffee,
  Camera,
  Music,
  Gift,
  Map,
  Eye,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import {
  WizardConfig,
  WizardStep,
  WizardStyles,
  WizardPricing,
  WizardFeature,
  createDefaultWizardConfig,
} from '@/lib/types/database'

// Icon mapping
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Calendar,
  Clock,
  QrCode,
  MapPin,
  Sun,
  Headphones,
  Star,
  Heart,
  Sparkles,
  Zap,
  Coffee,
  Camera,
  Music,
  Gift,
  Ship,
}

export default function BoatTourModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [direction, setDirection] = useState(0)
  const [showMap, setShowMap] = useState(false)

  // Config state (loaded from database)
  const [config, setConfig] = useState<{
    steps: WizardStep[]
    styles: WizardStyles
    pricing: WizardPricing
    fabText: string
    fabPosition: 'bottom-left' | 'bottom-right'
    isActive: boolean
  } | null>(null)

  const totalSteps = config?.steps.length || 4

  // Load config from database
  useEffect(() => {
    async function loadConfig() {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('cruise_wizard_configs')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(1)
          .single()

        if (error && error.code !== 'PGRST116') {
          console.error('Error loading wizard config:', error)
        }

        if (data) {
          setConfig({
            steps: data.steps || [],
            styles: data.styles || createDefaultWizardConfig().styles,
            pricing: data.pricing || createDefaultWizardConfig().pricing,
            fabText: data.fab_text || 'Hajózás Párizsban',
            fabPosition: data.fab_position || 'bottom-left',
            isActive: data.is_active ?? true,
          })
        } else {
          // Use default config if nothing in database
          const defaultConfig = createDefaultWizardConfig()
          setConfig({
            steps: defaultConfig.steps,
            styles: defaultConfig.styles,
            pricing: defaultConfig.pricing,
            fabText: defaultConfig.fabText,
            fabPosition: defaultConfig.fabPosition,
            isActive: defaultConfig.isActive,
          })
        }
      } catch (err) {
        console.error('Failed to load wizard config:', err)
        // Fall back to defaults
        const defaultConfig = createDefaultWizardConfig()
        setConfig({
          steps: defaultConfig.steps,
          styles: defaultConfig.styles,
          pricing: defaultConfig.pricing,
          fabText: defaultConfig.fabText,
          fabPosition: defaultConfig.fabPosition,
          isActive: defaultConfig.isActive,
        })
      }
    }

    loadConfig()
  }, [])

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
        setShowMap(false)
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
      const contactSection =
        document.getElementById('contact') ||
        document.getElementById('foglalas') ||
        document.getElementById('form') ||
        document.querySelector('[data-section="contact"]')

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

  // Get icon component by name
  const getIcon = (iconName: string) => iconMap[iconName] || Star

  // Don't render if config not loaded or not active
  if (!config || !config.isActive) {
    return null
  }

  const { steps, styles, pricing, fabText, fabPosition } = config
  const activeStep = steps[currentStep - 1]

  // Generate background style for card
  const cardBackground = styles.card.gradientEnabled
    ? `linear-gradient(${styles.card.gradientDirection?.replace('to-', 'to ') || 'to bottom right'}, ${styles.card.gradientFrom || styles.card.backgroundColor}, ${styles.card.gradientTo || styles.card.backgroundColor})`
    : styles.card.backgroundColor

  // Render step content dynamically
  const renderStepContent = () => {
    if (!activeStep) return null

    const isLastStep = currentStep === totalSteps
    const stepIndex = currentStep - 1

    return (
      <div className="space-y-5">
        {/* Step Counter */}
        <div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-semibold text-sm uppercase tracking-wider mb-3"
            style={{ color: styles.typography.stepCounterColor }}
          >
            {currentStep} / {totalSteps}
            {activeStep.label && ` – ${activeStep.label}`}
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-playfair text-xl md:text-2xl lg:text-3xl font-bold leading-tight"
            style={{ color: styles.typography.headingColor }}
          >
            {activeStep.title}
            {activeStep.subtitle && (
              <>
                <br />
                <span style={{ color: styles.typography.bodyTextColor }}>{activeStep.subtitle}</span>
              </>
            )}
          </motion.h2>
        </div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-base md:text-lg leading-relaxed"
          style={{ color: styles.typography.bodyTextColor }}
        >
          {activeStep.description}
        </motion.p>

        {/* Features (if any) */}
        {activeStep.features && activeStep.features.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {activeStep.features.map((feature: WizardFeature, idx: number) => {
              const FeatureIcon = getIcon(feature.icon)
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + idx * 0.08 }}
                  className="flex items-start gap-3 p-3 rounded-xl bg-white/60 border"
                  style={{ borderColor: styles.card.borderColor }}
                >
                  <div
                    className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: styles.button.backgroundColor }}
                  >
                    <FeatureIcon className="w-5 h-5" style={{ color: styles.button.textColor }} />
                  </div>
                  <div>
                    <p className="font-semibold" style={{ color: styles.typography.headingColor }}>
                      {feature.text}
                    </p>
                    {feature.subtext && (
                      <p className="text-sm" style={{ color: styles.typography.bodyTextColor }}>
                        {feature.subtext}
                      </p>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}

        {/* Pricing Card (Last Step) */}
        {isLastStep && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl p-5 md:p-6 border shadow-sm"
            style={{ borderColor: styles.card.borderColor, backgroundColor: 'white' }}
          >
            <div className="flex items-end justify-center gap-6 md:gap-10 mb-5">
              <div className="text-center">
                <p className="text-sm mb-1" style={{ color: styles.typography.bodyTextColor }}>
                  Felnőtt
                </p>
                <p className="text-4xl md:text-5xl font-bold" style={{ color: styles.pricing.adultPriceColor }}>
                  {pricing.adultPrice}
                  <span className="text-xl md:text-2xl" style={{ color: styles.pricing.currencyColor }}>
                    {pricing.currency}
                  </span>
                </p>
              </div>
              <div className="h-10 w-px" style={{ backgroundColor: styles.pricing.dividerColor }} />
              <div className="text-center">
                <p className="text-sm mb-1" style={{ color: styles.typography.bodyTextColor }}>
                  Gyermek
                </p>
                <p className="text-3xl md:text-4xl font-bold" style={{ color: styles.pricing.childPriceColor }}>
                  {pricing.childPrice}
                  <span className="text-lg md:text-xl">{pricing.currency}</span>
                </p>
              </div>
            </div>

            {/* Button Container */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              {/* Main CTA Button */}
              <motion.button
                onClick={handleOrderClick}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:flex-1 py-4 font-bold text-lg transition-all shadow-lg"
                style={{
                  backgroundColor: styles.button.backgroundColor,
                  color: styles.button.textColor,
                  borderRadius: `${styles.button.borderRadius}px`,
                }}
              >
                {activeStep.ctaText}
              </motion.button>

              {/* Route Map Button */}
              <motion.button
                onClick={() => setShowMap(!showMap)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-4 font-semibold text-base transition-all border border-slate-300 text-slate-700 hover:bg-slate-100"
                style={{
                  borderRadius: `${styles.button.borderRadius}px`,
                }}
              >
                {showMap ? <Eye className="w-5 h-5" /> : <Map className="w-5 h-5" />}
                <span className="hidden sm:inline">{showMap ? 'Bezárás' : 'Útvonal'}</span>
              </motion.button>
            </div>

            {/* Holographic Route Map Reveal */}
            <AnimatePresence>
              {showMap && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    y: 0,
                  }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="relative mt-4 rounded-2xl overflow-hidden"
                >
                  {/* Glassmorphism container */}
                  <motion.div
                    className="relative backdrop-blur-md bg-white/30 border border-white/60 rounded-2xl p-3 shadow-[0_0_20px_rgba(255,255,255,0.6),0_8px_32px_rgba(0,0,0,0.1)]"
                    animate={{
                      y: [-2, 2, -2],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  >
                    {/* Close button */}
                    <button
                      onClick={() => setShowMap(false)}
                      className="absolute top-2 right-2 z-10 w-7 h-7 flex items-center justify-center rounded-full bg-white/80 hover:bg-white shadow-md transition-all hover:scale-110"
                    >
                      <X className="w-4 h-4 text-slate-600" />
                    </button>

                    {/* Holographic glow effect */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-400/10 via-purple-400/10 to-pink-400/10 pointer-events-none" />

                    {/* Scan lines effect */}
                    <div
                      className="absolute inset-0 rounded-2xl pointer-events-none opacity-30"
                      style={{
                        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
                      }}
                    />

                    {/* The Map Image */}
                    <motion.img
                      src="/images/folyooo.jpg"
                      alt="Szajna útvonal térkép"
                      className="w-full rounded-xl mix-blend-multiply opacity-90"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.9 }}
                      transition={{ delay: 0.15 }}
                    />

                    {/* Label */}
                    <motion.div
                      className="absolute bottom-5 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-white/80 backdrop-blur-sm rounded-full shadow-lg"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                        <Ship className="w-3.5 h-3.5" />
                        Klasszikus Szajna Útvonal
                      </span>
                    </motion.div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Privacy Note */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="text-center text-xs mt-3"
              style={{ color: styles.typography.labelColor }}
            >
              {pricing.privacyNote}
            </motion.p>
          </motion.div>
        )}

        {/* CTA Button (Not Last Step) */}
        {!isLastStep && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="pt-2"
          >
            <button
              onClick={() => paginate(1)}
              className="group inline-flex items-center gap-3 px-6 py-3 md:px-8 md:py-4 font-semibold text-base md:text-lg transition-all shadow-lg"
              style={{
                backgroundColor: styles.button.backgroundColor,
                color: styles.button.textColor,
                borderRadius: `${styles.button.borderRadius}px`,
              }}
            >
              {activeStep.ctaText}
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>
          </motion.div>
        )}

        {/* Back to start (Last Step) */}
        {isLastStep && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
            className="flex justify-center"
          >
            <button
              onClick={() => goToStep(1)}
              className="flex items-center gap-2 transition-colors text-sm"
              style={{ color: styles.typography.labelColor }}
            >
              <RotateCcw className="w-4 h-4" />
              Vissza az elejére
            </button>
          </motion.div>
        )}
      </div>
    )
  }

  // FAB position class
  const fabPositionClass = fabPosition === 'bottom-right' ? 'right-6' : 'left-6'

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
            className={`fixed bottom-6 ${fabPositionClass} z-40 flex items-center gap-2 px-4 py-3 md:px-6 md:py-4 shadow-xl transition-all duration-300 hover:scale-105`}
            style={{
              backgroundColor: styles.button.backgroundColor,
              color: styles.button.textColor,
              borderRadius: `${styles.button.borderRadius}px`,
            }}
          >
            <Ship className="h-5 w-5 md:h-6 md:w-6" />
            <span className="hidden font-semibold md:inline">{fabText}</span>
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
                className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl"
                style={{
                  background: cardBackground,
                  borderRadius: `${styles.card.borderRadius}px`,
                  border: `1px solid ${styles.card.borderColor}`,
                }}
              >
                {/* Close Button */}
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.25 }}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsOpen(false)}
                  className="absolute right-3 top-3 md:right-4 md:top-4 z-20 flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-full bg-white/90 shadow-md hover:bg-white transition-colors"
                  style={{ color: styles.typography.headingColor }}
                >
                  <X className="h-5 w-5" />
                </motion.button>

                {/* Split Layout */}
                <div className="flex flex-col md:flex-row h-full max-h-[90vh]">
                  {/* Left Side - Journey Visualization */}
                  <div
                    className="relative w-full md:w-2/5 h-36 md:h-auto min-h-[144px] md:min-h-[520px] overflow-hidden flex-shrink-0 z-10"
                    style={{ backgroundColor: styles.card.backgroundColor }}
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
                            stroke={styles.journeyPathColor}
                            strokeWidth="2"
                            strokeDasharray="8 6"
                            strokeLinecap="round"
                          />
                        </svg>

                        {/* Checkpoint dots - horizontal */}
                        {steps.map((step, idx) => {
                          const pos = 10 + (idx * 80) / (steps.length - 1)
                          return (
                            <motion.div
                              key={step.id}
                              className="absolute top-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-sm transition-colors duration-300"
                              style={{
                                left: `${pos}%`,
                                marginLeft: '-6px',
                                width: `${styles.timeline.dotSize}px`,
                                height: `${styles.timeline.dotSize}px`,
                                backgroundColor:
                                  idx + 1 <= currentStep
                                    ? styles.timeline.dotColorActive
                                    : styles.timeline.dotColorInactive,
                              }}
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.2 + idx * 0.1 }}
                            />
                          )
                        })}

                        {/* Boat - horizontal movement */}
                        <motion.div
                          className="absolute top-1/2 -translate-y-1/2"
                          initial={{ left: '10%' }}
                          animate={{
                            left: `${10 + ((currentStep - 1) * 80) / (steps.length - 1)}%`,
                          }}
                          transition={{ duration: 0.5, ease: 'easeInOut' }}
                          style={{ marginLeft: '-20px', marginTop: '-24px' }}
                        >
                          <motion.div
                            animate={{ y: [0, -4, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                          >
                            <div
                              className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-3 border-white"
                              style={{ backgroundColor: styles.journeyBoatBackground }}
                            >
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
                                stroke={styles.journeyWaveColor}
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
                            stroke={styles.journeyPathColor}
                            strokeWidth="0.8"
                            strokeDasharray="3 2"
                            strokeLinecap="round"
                            vectorEffect="non-scaling-stroke"
                          />
                        </svg>

                        {/* Checkpoint dots with labels */}
                        {steps.map((step, idx) => {
                          const topPercent = 10 + (idx * 80) / (steps.length - 1)
                          return (
                            <motion.div
                              key={step.id}
                              className="absolute left-1/2 -translate-x-1/2 flex items-center gap-3"
                              style={{ top: `${topPercent}%` }}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.3 + idx * 0.1 }}
                            >
                              {/* Dot */}
                              <div
                                className="rounded-full border-2 border-white shadow-md transition-all duration-300"
                                style={{
                                  width: `${styles.timeline.dotSize + 4}px`,
                                  height: `${styles.timeline.dotSize + 4}px`,
                                  backgroundColor:
                                    idx + 1 <= currentStep
                                      ? styles.timeline.dotColorActive
                                      : styles.timeline.dotColorInactive,
                                  transform: idx + 1 <= currentStep ? 'scale(1.1)' : 'scale(1)',
                                }}
                              />
                              {/* Label */}
                              <span
                                className="absolute left-8 whitespace-nowrap text-sm font-medium transition-colors duration-300"
                                style={{
                                  color:
                                    idx + 1 <= currentStep
                                      ? styles.typography.headingColor
                                      : styles.typography.labelColor,
                                }}
                              >
                                {step.label}
                              </span>
                            </motion.div>
                          )
                        })}

                        {/* The Boat Hero - Animated along the path */}
                        <motion.div
                          className="absolute left-1/2 -translate-x-1/2"
                          initial={{ top: '10%' }}
                          animate={{
                            top: `${10 + ((currentStep - 1) * 80) / (steps.length - 1)}%`,
                          }}
                          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                          style={{ marginLeft: '-28px' }}
                        >
                          <motion.div
                            animate={{ y: [0, -6, 0] }}
                            transition={{
                              duration: 2.5,
                              repeat: Infinity,
                              ease: 'easeInOut',
                            }}
                          >
                            <div className="relative">
                              {/* Glow effect */}
                              <div
                                className="absolute inset-0 rounded-full blur-xl scale-150"
                                style={{ backgroundColor: `${styles.journeyBoatBackground}30` }}
                              />

                              {/* Main boat icon */}
                              <div
                                className="relative w-14 h-14 rounded-full flex items-center justify-center shadow-xl border-4 border-white"
                                style={{ backgroundColor: styles.journeyBoatBackground }}
                              >
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
                                    stroke={styles.journeyWaveColor}
                                    strokeWidth="2.5"
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
                            className="absolute w-2 h-2 rounded-full"
                            style={{
                              left: bubble.left,
                              top: bubble.top,
                              backgroundColor: `${styles.journeyPathColor}40`,
                            }}
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
                        <Anchor className="w-4 h-4" style={{ color: styles.timeline.boatIconColor }} />
                        <span className="text-xs font-medium" style={{ color: styles.typography.bodyTextColor }}>
                          Szajna túra
                        </span>
                      </motion.div>
                    </div>
                  </div>

                  {/* Right Side - Content */}
                  <div
                    className="flex-1 flex flex-col overflow-hidden relative z-10"
                    style={{ backgroundColor: styles.card.backgroundColor }}
                  >
                    {/* Scrollable Content Area */}
                    <div
                      className="flex-1 overflow-y-auto p-5 md:p-8 lg:p-10"
                      style={{ backgroundColor: styles.card.backgroundColor }}
                    >
                      <AnimatePresence mode="wait" custom={direction}>
                        <motion.div
                          key={currentStep}
                          custom={direction}
                          variants={stepVariants}
                          initial="enter"
                          animate="center"
                          exit="exit"
                          transition={{ duration: 0.25, ease: 'easeInOut' }}
                          className="w-full"
                          style={{ backgroundColor: styles.card.backgroundColor }}
                        >
                          {renderStepContent()}
                        </motion.div>
                      </AnimatePresence>
                    </div>

                    {/* Progress Bar with Ship Icon */}
                    <div
                      className="p-4 md:p-5 border-t"
                      style={{
                        backgroundColor: styles.card.backgroundColor,
                        borderColor: styles.card.borderColor,
                      }}
                    >
                      <div className="relative h-6">
                        {/* Track background */}
                        <div
                          className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-1 rounded-full"
                          style={{ backgroundColor: styles.timeline.lineColorInactive }}
                        >
                          {/* Filled track */}
                          <motion.div
                            className="h-full rounded-full"
                            style={{ backgroundColor: styles.timeline.lineColorActive }}
                            initial={{ width: '0%' }}
                            animate={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
                            transition={{ duration: 0.35, ease: 'easeOut' }}
                          />
                        </div>

                        {/* Step dots */}
                        <div className="absolute inset-0 flex justify-between items-center">
                          {steps.map((step, idx) => (
                            <button
                              key={step.id}
                              onClick={() => goToStep(idx + 1)}
                              className="relative z-10 w-3 h-3 rounded-full transition-all duration-300 hover:scale-110"
                              style={{
                                backgroundColor:
                                  idx + 1 <= currentStep
                                    ? styles.timeline.dotColorActive
                                    : styles.timeline.dotColorInactive,
                                transform: idx + 1 === currentStep ? 'scale(1.25)' : 'scale(1)',
                                boxShadow:
                                  idx + 1 === currentStep
                                    ? `0 0 0 2px ${styles.timeline.dotColorInactive}, 0 0 0 4px ${styles.card.backgroundColor}`
                                    : 'none',
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
                          <div
                            className="w-5 h-5 rounded-full flex items-center justify-center shadow-md border-2 border-white"
                            style={{ backgroundColor: styles.timeline.boatIconColor }}
                          >
                            <Ship className="w-2.5 h-2.5 text-white" />
                          </div>
                        </motion.div>
                      </div>

                      {/* Step labels */}
                      <div className="flex justify-between mt-2 text-xs">
                        {steps.map((step, idx) => (
                          <span
                            key={step.id}
                            className="transition-colors"
                            style={{
                              color:
                                currentStep >= idx + 1
                                  ? styles.typography.headingColor
                                  : styles.typography.labelColor,
                              fontWeight: currentStep === idx + 1 ? 500 : 400,
                            }}
                          >
                            {step.label}
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
