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
import CuratorBadge from './_components/CuratorBadge'
import DietaryStep from './_components/DietaryStep'
import DreamMomentStep from './_components/DreamMomentStep'
import FamilyDetailsStep from './_components/FamilyDetailsStep'
import FlightDatesStep from './_components/FlightDatesStep'
import FlightStatusStep from './_components/FlightStatusStep'
import InterestsStep from './_components/InterestsStep'
import OpeningStep from './_components/OpeningStep'
import PaceStep from './_components/PaceStep'
import TravelWindowStep from './_components/TravelWindowStep'
import {
  COMPANION_TAG,
  INITIAL_WIZARD_STATE,
  computeTripDays,
  deriveWeatherFallback,
  nextStepAfter,
  tripStartDateOnly,
  type FlightStatus,
  type StepKey,
  type WizardState,
} from './_components/types'
import { ProgressBar, WizardLogo, stepTransition, stepVariants } from './_components/WizardShell'

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
  const [history, setHistory] = useState<StepKey[]>(['opening'])
  const [state, setState] = useState<WizardState>(INITIAL_WIZARD_STATE)
  const [highlights, setHighlights] = useState<ProgramItem[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const step = history[history.length - 1]

  const goNext = useCallback(() => {
    setHistory((current) => {
      const currentStep = current[current.length - 1]
      return [...current, nextStepAfter(currentStep, state)]
    })
  }, [state])

  const goBack = useCallback(() => {
    setHistory((current) => (current.length > 1 ? current.slice(0, -1) : current))
  }, [])

  // A "kikkel utazol" és a "van repjegyed" válaszok új ágat nyithatnak, ezért
  // a léptetésnek a FRISS értékkel kell döntenie, nem a még el nem évült
  // React state-tel -- egy atomi handler garantálja ezt mindkét mezőnél.
  const selectCompanion = useCallback(
    (companion: WizardState['companion']) => {
      setState((current) => ({ ...current, companion }))
      setHistory((current) => [...current, nextStepAfter('companion', { ...state, companion })])
    },
    [state]
  )

  const selectFlightStatus = useCallback((flightStatus: FlightStatus) => {
    setState((current) => ({ ...current, flightStatus }))
  }, [])

  const toggleInterest = useCallback((interest: string) => {
    setState((current) => ({
      ...current,
      interests: current.interests.includes(interest)
        ? current.interests.filter((i) => i !== interest)
        : [...current.interests, interest],
    }))
  }, [])

  const toggleDietary = useCallback((option: string) => {
    setState((current) => ({
      ...current,
      dietary: current.dietary.includes(option)
        ? current.dietary.filter((d) => d !== option)
        : [...current.dietary, option],
    }))
  }, [])

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true)

    const companionTag = state.companion ? COMPANION_TAG[state.companion] : undefined
    const interests = companionTag
      ? Array.from(new Set([...state.interests, companionTag]))
      : state.interests

    const preferences: TravelerPreferences = {
      days: computeTripDays(state),
      pace: state.pace,
      interests,
      startDate: tripStartDateOnly(state),
      weatherFallback: deriveWeatherFallback(state),
    }

    const draft = generateItinerary(mockCatalog, mockRules, preferences)
    setHighlights(pickHighlights(draft.days))

    try {
      await saveDraftAsRequest({
        destinationSlug: mockDestinationId,
        contactEmail: state.email,
        contactName: state.name || undefined,
        draft,
        guestContext: {
          flightStatus: state.flightStatus,
          tripStart: state.tripStart || undefined,
          tripEnd: state.tripEnd || undefined,
          approxMonth: state.approxMonth || undefined,
          companion: state.companion,
          kidsAge: state.kidsAge,
          dietary: state.dietary,
          dreamMoment: state.dreamMoment || undefined,
        },
      })
    } catch {
      // A dev DB elérhetetlensége nem szabad, hogy megakassza a vendégélményt --
      // a kérés később manuálisan is pótolható a review queue-ból (2. fázis).
    }

    setIsSubmitting(false)
    setHistory((current) => [...current, 'closing'])
  }, [state])

  const isDarkStep = step === 'opening'
  const showCuratorBadge = step !== 'opening' && step !== 'closing'

  return (
    <div className="fixed inset-0 h-screen w-screen bg-gradient-to-br from-white via-parisian-cream-50 to-parisian-beige-50">
      <WizardLogo isDark={isDarkStep} />
      <ProgressBar step={step} isDark={isDarkStep} />
      {showCuratorBadge && <CuratorBadge />}

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
          {step === 'opening' && <OpeningStep onNext={goNext} />}
          {step === 'flight-status' && (
            <FlightStatusStep
              value={state.flightStatus}
              onSelect={selectFlightStatus}
              onNext={goNext}
              onBack={goBack}
            />
          )}
          {step === 'flight-dates' && (
            <FlightDatesStep
              tripStart={state.tripStart}
              tripEnd={state.tripEnd}
              onChangeStart={(tripStart) => setState((current) => ({ ...current, tripStart }))}
              onChangeEnd={(tripEnd) => setState((current) => ({ ...current, tripEnd }))}
              onNext={goNext}
              onBack={goBack}
            />
          )}
          {step === 'travel-window' && (
            <TravelWindowStep
              approxMonth={state.approxMonth}
              approxDays={state.approxDays}
              onChangeMonth={(approxMonth) => setState((current) => ({ ...current, approxMonth }))}
              onChangeDays={(approxDays) => setState((current) => ({ ...current, approxDays }))}
              onNext={goNext}
              onBack={goBack}
            />
          )}
          {step === 'companion' && (
            <CompanionStep value={state.companion} onSelect={selectCompanion} onBack={goBack} />
          )}
          {step === 'family' && (
            <FamilyDetailsStep
              value={state.kidsAge}
              onSelect={(kidsAge) => setState((current) => ({ ...current, kidsAge }))}
              onNext={goNext}
              onBack={goBack}
            />
          )}
          {step === 'interests' && (
            <InterestsStep
              selected={state.interests}
              onToggle={toggleInterest}
              onNext={goNext}
              onBack={goBack}
            />
          )}
          {step === 'dietary' && (
            <DietaryStep
              selected={state.dietary}
              onToggle={toggleDietary}
              onNext={goNext}
              onBack={goBack}
            />
          )}
          {step === 'pace' && (
            <PaceStep
              value={state.pace}
              onChange={(pace) => setState((current) => ({ ...current, pace }))}
              onNext={goNext}
              onBack={goBack}
            />
          )}
          {step === 'dream' && (
            <DreamMomentStep
              value={state.dreamMoment}
              onChange={(dreamMoment) => setState((current) => ({ ...current, dreamMoment }))}
              onNext={goNext}
              onBack={goBack}
            />
          )}
          {step === 'contact' && (
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
          {step === 'closing' && <ClosingStep name={state.name} highlights={highlights} />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
