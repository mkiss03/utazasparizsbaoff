'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useState } from 'react'
import { saveDraftAsRequest } from '@/lib/actions/planner'
import { generateItinerary } from '@/lib/planner/engine'
import { mockCatalog, mockDestinationId, mockRules } from '@/lib/planner/mock-catalog'
import type { ItineraryDay, ProgramItem, TravelerPreferences } from '@/lib/planner/types'
import CompanionStep from './_components/CompanionStep'
import ClosingStep from './_components/ClosingStep'
import ContactStep from './_components/ContactStep'
import InterestsStep from './_components/InterestsStep'
import OpeningStep from './_components/OpeningStep'
import PaceStep from './_components/PaceStep'
import { COMPANION_TAG, INITIAL_WIZARD_STATE, type WizardState } from './_components/types'
import { ProgressDots, WizardLogo, stepTransition, stepVariants } from './_components/WizardShell'

const HIGHLIGHT_COUNT = 3

function pickHighlights(draftDays: ItineraryDay[]): ProgramItem[] {
  const seen = new Set<string>()
  const items: ProgramItem[] = []

  for (const day of draftDays) {
    for (const slot of day.slots) {
      if (seen.has(slot.item.id)) continue
      seen.add(slot.item.id)
      items.push(slot.item)
    }
  }

  return items.sort((a, b) => b.priority - a.priority).slice(0, HIGHLIGHT_COUNT)
}

export default function ProgramtervezoPage() {
  const [step, setStep] = useState(0)
  const [state, setState] = useState<WizardState>(INITIAL_WIZARD_STATE)
  const [highlights, setHighlights] = useState<ProgramItem[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const goNext = useCallback(() => setStep((current) => Math.min(current + 1, 5)), [])
  const goBack = useCallback(() => setStep((current) => Math.max(current - 1, 0)), [])

  const toggleInterest = useCallback((interest: string) => {
    setState((current) => ({
      ...current,
      interests: current.interests.includes(interest)
        ? current.interests.filter((i) => i !== interest)
        : [...current.interests, interest],
    }))
  }, [])

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true)

    const companionTag = state.companion ? COMPANION_TAG[state.companion] : undefined
    const interests = companionTag
      ? Array.from(new Set([...state.interests, companionTag]))
      : state.interests

    const preferences: TravelerPreferences = {
      days: state.days,
      pace: state.pace,
      interests,
    }

    const draft = generateItinerary(mockCatalog, mockRules, preferences)
    setHighlights(pickHighlights(draft.days))

    try {
      await saveDraftAsRequest({
        destinationSlug: mockDestinationId,
        contactEmail: state.email,
        contactName: state.name || undefined,
        draft,
      })
    } catch {
      // A dev DB elérhetetlensége nem szabad, hogy megakassza a vendégélményt --
      // a kérés later manuálisan is pótolható a review queue-ból (2. fázis).
    }

    setIsSubmitting(false)
    setStep(5)
  }, [state])

  return (
    <div className="fixed inset-0 h-screen w-screen bg-gradient-to-br from-white via-parisian-cream-50 to-parisian-beige-50">
      <WizardLogo isDark={step === 0} />
      <ProgressDots step={step} isDark={step === 0} />

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          variants={stepVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={stepTransition}
          className="h-full w-full"
        >
          {step === 0 && (
            <OpeningStep
              days={state.days}
              onChangeDays={(days) => setState((current) => ({ ...current, days }))}
              onNext={goNext}
            />
          )}
          {step === 1 && (
            <CompanionStep
              value={state.companion}
              onSelect={(companion) => setState((current) => ({ ...current, companion }))}
              onNext={goNext}
              onBack={goBack}
            />
          )}
          {step === 2 && (
            <InterestsStep
              selected={state.interests}
              onToggle={toggleInterest}
              onNext={goNext}
              onBack={goBack}
            />
          )}
          {step === 3 && (
            <PaceStep
              value={state.pace}
              onChange={(pace) => setState((current) => ({ ...current, pace }))}
              onNext={goNext}
              onBack={goBack}
            />
          )}
          {step === 4 && (
            <ContactStep
              name={state.name}
              email={state.email}
              onChangeName={(name) => setState((current) => ({ ...current, name }))}
              onChangeEmail={(email) => setState((current) => ({ ...current, email }))}
              onSubmit={handleSubmit}
              onBack={goBack}
              isSubmitting={isSubmitting}
            />
          )}
          {step === 5 && <ClosingStep name={state.name} highlights={highlights} />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
