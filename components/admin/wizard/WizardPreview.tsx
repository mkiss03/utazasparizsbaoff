'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Ship,
  ArrowRight,
  RotateCcw,
  Anchor,
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
} from 'lucide-react'
import { WizardConfig, WizardStep, WizardFeature } from '@/lib/types/database'

interface WizardPreviewProps {
  config: Omit<WizardConfig, 'id' | 'created_at' | 'updated_at'>
}

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
}

export default function WizardPreview({ config }: WizardPreviewProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [direction, setDirection] = useState(0)

  const { steps, styles, pricing } = config
  const totalSteps = steps.length

  const paginate = (newDirection: number) => {
    const newStep = currentStep + newDirection
    if (newStep >= 1 && newStep <= totalSteps) {
      setDirection(newDirection)
      setCurrentStep(newStep)
    }
  }

  const goToStep = (step: number) => {
    const dir = step > currentStep ? 1 : -1
    setDirection(dir)
    setCurrentStep(step)
  }

  const stepVariants = {
    enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 40 : -40 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir < 0 ? 40 : -40 }),
  }

  const activeStep = steps[currentStep - 1]
  const getIcon = (iconName: string) => iconMap[iconName] || Star

  // Generate background style
  const cardBackground = styles.card.gradientEnabled
    ? `linear-gradient(${styles.card.gradientDirection?.replace('to-', 'to ')}, ${styles.card.gradientFrom}, ${styles.card.gradientTo})`
    : styles.card.backgroundColor

  const shadowClass = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
    '2xl': 'shadow-2xl',
  }[styles.card.shadowIntensity]

  // Render step content based on step type
  const renderStepContent = (step: WizardStep, stepIndex: number) => {
    const isLastStep = stepIndex === totalSteps - 1

    return (
      <div className="space-y-4">
        {/* Step Counter */}
        <p
          className="font-semibold text-sm uppercase tracking-wider"
          style={{ color: styles.typography.stepCounterColor }}
        >
          {stepIndex + 1} / {totalSteps}
          {step.label && ` – ${step.label}`}
        </p>

        {/* Title */}
        <h2
          className="font-playfair text-xl font-bold leading-tight"
          style={{ color: styles.typography.headingColor }}
        >
          {step.title}
          {step.subtitle && (
            <>
              <br />
              <span style={{ color: styles.typography.bodyTextColor }}>{step.subtitle}</span>
            </>
          )}
        </h2>

        {/* Description */}
        <p className="text-sm leading-relaxed" style={{ color: styles.typography.bodyTextColor }}>
          {step.description}
        </p>

        {/* Features */}
        {step.features && step.features.length > 0 && (
          <div className="grid grid-cols-2 gap-2">
            {step.features.map((feature, idx) => {
              const FeatureIcon = getIcon(feature.icon)
              return (
                <div
                  key={idx}
                  className="flex items-start gap-2 p-2 rounded-lg bg-white/60 border"
                  style={{ borderColor: styles.card.borderColor }}
                >
                  <div
                    className="flex-shrink-0 w-8 h-8 rounded flex items-center justify-center"
                    style={{ backgroundColor: styles.button.backgroundColor }}
                  >
                    <FeatureIcon className="w-4 h-4" style={{ color: styles.button.textColor }} />
                  </div>
                  <div>
                    <p
                      className="font-semibold text-xs"
                      style={{ color: styles.typography.headingColor }}
                    >
                      {feature.text}
                    </p>
                    {feature.subtext && (
                      <p className="text-xs" style={{ color: styles.typography.bodyTextColor }}>
                        {feature.subtext}
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Pricing (Last Step) */}
        {isLastStep && (
          <div
            className="rounded-xl p-4 border"
            style={{ borderColor: styles.card.borderColor, backgroundColor: 'white' }}
          >
            <div className="flex items-end justify-center gap-4 mb-4">
              <div className="text-center">
                <p className="text-xs mb-1" style={{ color: styles.typography.bodyTextColor }}>
                  Felnőtt
                </p>
                <p className="text-2xl font-bold" style={{ color: styles.pricing.adultPriceColor }}>
                  {pricing.adultPrice}
                  <span className="text-sm" style={{ color: styles.pricing.currencyColor }}>
                    {pricing.currency}
                  </span>
                </p>
              </div>
              <div className="h-8 w-px" style={{ backgroundColor: styles.pricing.dividerColor }} />
              <div className="text-center">
                <p className="text-xs mb-1" style={{ color: styles.typography.bodyTextColor }}>
                  Gyermek
                </p>
                <p className="text-xl font-bold" style={{ color: styles.pricing.childPriceColor }}>
                  {pricing.childPrice}
                  <span className="text-sm">{pricing.currency}</span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* CTA Button */}
        <button
          type="button"
          onClick={() => (isLastStep ? goToStep(1) : paginate(1))}
          className="inline-flex items-center gap-2 px-4 py-2 font-semibold text-sm transition-all"
          style={{
            backgroundColor: styles.button.backgroundColor,
            color: styles.button.textColor,
            borderRadius: `${Math.min(styles.button.borderRadius, 9999)}px`,
          }}
        >
          {step.ctaText}
          {!isLastStep && <ArrowRight className="w-4 h-4" />}
        </button>

        {/* Privacy Note (Last Step) */}
        {isLastStep && (
          <p className="text-xs text-center" style={{ color: styles.typography.labelColor }}>
            {pricing.privacyNote}
          </p>
        )}
      </div>
    )
  }

  return (
    <div className="sticky top-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-900">Élő előnézet</h3>
        <button
          type="button"
          onClick={() => goToStep(1)}
          className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
      </div>

      {/* Preview Container */}
      <div
        className={`overflow-hidden ${shadowClass}`}
        style={{
          background: cardBackground,
          borderRadius: `${styles.card.borderRadius}px`,
          border: `1px solid ${styles.card.borderColor}`,
        }}
      >
        <div className="flex flex-col md:flex-row h-[500px]">
          {/* Left Side - Journey Visualization */}
          <div
            className="relative w-full md:w-2/5 h-24 md:h-auto overflow-hidden flex-shrink-0"
            style={{ backgroundColor: styles.card.backgroundColor }}
          >
            {/* Journey Path */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="hidden md:flex relative w-full h-full flex-col items-center py-8 px-6">
                {/* Curved path SVG */}
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

                {/* Checkpoint dots */}
                {steps.map((step, idx) => {
                  const topPercent = 10 + (idx * 80) / (steps.length - 1)
                  return (
                    <div
                      key={step.id}
                      className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2"
                      style={{ top: `${topPercent}%` }}
                    >
                      <div
                        className="w-3 h-3 rounded-full border-2 border-white shadow-sm transition-all"
                        style={{
                          backgroundColor:
                            idx + 1 <= currentStep
                              ? styles.timeline.dotColorActive
                              : styles.timeline.dotColorInactive,
                          width: `${styles.timeline.dotSize}px`,
                          height: `${styles.timeline.dotSize}px`,
                        }}
                      />
                      <span
                        className="absolute left-6 whitespace-nowrap text-xs font-medium"
                        style={{
                          color:
                            idx + 1 <= currentStep
                              ? styles.typography.headingColor
                              : styles.typography.labelColor,
                        }}
                      >
                        {step.label}
                      </span>
                    </div>
                  )
                })}

                {/* Animated Boat */}
                <motion.div
                  className="absolute left-1/2 -translate-x-1/2"
                  initial={{ top: '10%' }}
                  animate={{
                    top: `${10 + ((currentStep - 1) * 80) / (steps.length - 1)}%`,
                  }}
                  transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                  style={{ marginLeft: '-20px' }}
                >
                  <motion.div
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-2 border-white"
                      style={{ backgroundColor: styles.journeyBoatBackground }}
                    >
                      <Ship className="w-5 h-5 text-white" />
                    </div>

                    {/* Wave */}
                    <motion.div
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2"
                      animate={{ opacity: [0.5, 1, 0.5], scale: [0.9, 1.1, 0.9] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <svg width="36" height="10" viewBox="0 0 36 10">
                        <path
                          d="M0 5 Q9 1, 18 5 T36 5"
                          fill="none"
                          stroke={styles.journeyWaveColor}
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </motion.div>
                  </motion.div>
                </motion.div>
              </div>

              {/* Mobile horizontal layout */}
              <div className="md:hidden relative w-full h-full px-6 py-4 flex items-center">
                {steps.map((step, idx) => {
                  const leftPercent = 10 + (idx * 80) / (steps.length - 1)
                  return (
                    <div
                      key={step.id}
                      className="absolute top-1/2 -translate-y-1/2"
                      style={{ left: `${leftPercent}%`, marginLeft: '-6px' }}
                    >
                      <div
                        className="w-3 h-3 rounded-full border-2 border-white shadow-sm"
                        style={{
                          backgroundColor:
                            idx + 1 <= currentStep
                              ? styles.timeline.dotColorActive
                              : styles.timeline.dotColorInactive,
                        }}
                      />
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Branding Badge */}
            <div className="absolute bottom-2 left-2">
              <div className="flex items-center gap-1.5 bg-white/90 rounded-full px-2 py-1 text-xs shadow">
                <Anchor className="w-3 h-3" style={{ color: styles.timeline.boatIconColor }} />
                <span style={{ color: styles.typography.bodyTextColor }}>Szajna túra</span>
              </div>
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4" style={{ backgroundColor: styles.card.backgroundColor }}>
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentStep}
                  custom={direction}
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.2, ease: 'easeInOut' }}
                >
                  {renderStepContent(activeStep, currentStep - 1)}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Progress Bar */}
            <div className="p-3 border-t" style={{ borderColor: styles.card.borderColor, backgroundColor: styles.card.backgroundColor }}>
              <div className="relative h-5">
                {/* Track */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-1 rounded-full"
                  style={{ backgroundColor: styles.timeline.lineColorInactive }}
                >
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: styles.timeline.lineColorActive }}
                    initial={{ width: '0%' }}
                    animate={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>

                {/* Step Dots */}
                <div className="absolute inset-0 flex justify-between items-center">
                  {steps.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => goToStep(idx + 1)}
                      className="relative z-10 w-2.5 h-2.5 rounded-full transition-all hover:scale-125"
                      style={{
                        backgroundColor:
                          idx + 1 <= currentStep
                            ? styles.timeline.dotColorActive
                            : styles.timeline.dotColorInactive,
                      }}
                    />
                  ))}
                </div>

                {/* Ship Indicator */}
                <motion.div
                  className="absolute top-1/2 -translate-y-1/2 z-20"
                  initial={{ left: '0%' }}
                  animate={{ left: `calc(${((currentStep - 1) / (totalSteps - 1)) * 100}%)` }}
                  transition={{ duration: 0.3 }}
                  style={{ marginLeft: '-8px' }}
                >
                  <div
                    className="w-4 h-4 rounded-full flex items-center justify-center shadow border border-white"
                    style={{ backgroundColor: styles.timeline.boatIconColor }}
                  >
                    <Ship className="w-2 h-2 text-white" />
                  </div>
                </motion.div>
              </div>

              {/* Step Labels */}
              <div className="flex justify-between mt-1.5 text-[10px]">
                {steps.map((step, idx) => (
                  <span
                    key={step.id}
                    style={{
                      color:
                        currentStep >= idx + 1
                          ? styles.typography.headingColor
                          : styles.typography.labelColor,
                      fontWeight: currentStep === idx + 1 ? 600 : 400,
                    }}
                  >
                    {step.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Controls */}
      <div className="mt-4 flex items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => paginate(-1)}
          disabled={currentStep === 1}
          className="px-3 py-1.5 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Előző
        </button>
        <span className="text-sm text-slate-500">
          {currentStep} / {totalSteps}
        </span>
        <button
          type="button"
          onClick={() => paginate(1)}
          disabled={currentStep === totalSteps}
          className="px-3 py-1.5 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Következő
        </button>
      </div>
    </div>
  )
}
