'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useState } from 'react'
import { saveDraftAsRequest } from '@/lib/actions/planner'
import { generateItinerary } from '@/lib/planner/engine'
import { mockDestinationId, mockRules } from '@/lib/planner/mock-catalog'
import type { ItineraryDay, ProgramItem, TravelerPreferences } from '@/lib/planner/types'
import ArrivalLogisticsStep from './_components/ArrivalLogisticsStep'
import BudgetStep from './_components/BudgetStep'
import { buildAdjustedCatalog } from './_components/catalogAdjust'
import CompanionStep from './_components/CompanionStep'
import ClosingStep from './_components/ClosingStep'
import ContactStep from './_components/ContactStep'
import CuratorBadge from './_components/CuratorBadge'
import DietaryStep from './_components/DietaryStep'
import DreamMomentStep from './_components/DreamMomentStep'
import FamilyDetailsStep from './_components/FamilyDetailsStep'
import FlightDatesStep from './_components/FlightDatesStep'
import FlightStatusStep from './_components/FlightStatusStep'
import InterestDetailStep from './_components/InterestDetailStep'
import InterestsStep from './_components/InterestsStep'
import OpeningStep from './_components/OpeningStep'
import PaceStep from './_components/PaceStep'
import PlacePreviewStep from './_components/PlacePreviewStep'
import TravelWindowStep from './_components/TravelWindowStep'
import {
  COMPANION_TAG,
  INITIAL_WIZARD_STATE,
  computeTripDays,
  deriveWeatherFallback,
  nextStepAfter,
  tripStartDateOnly,
  type StepKey,
  type WizardState,
} from './_components/types'
import { ProgressBar, WizardLogo, stepTransition, stepVariants } from './_components/WizardShell'

const HIGHLIGHT_COUNT = 3

type Patch = Partial<WizardState> | ((state: WizardState) => Partial<WizardState>)

/**
 * Minden bejárt lépés a saját teljes state-pillanatképét viszi magával.
 * Ez teszi lehetővé, hogy a "Vissza" gomb ne csak a képernyőt, hanem a
 * hozzá tartozó adatokat (pl. az érdeklődés-mélyítő hátralévő sorát) is
 * pontosan visszaállítsa -- egy közös state + külön step-history korábban
 * ezt elrontotta volna a hurkoknál.
 */
interface WizardSnapshot {
  step: StepKey
  state: WizardState
}

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

function resolvePatch(patch: Patch, state: WizardState): Partial<WizardState> {
  return typeof patch === 'function' ? patch(state) : patch
}

export default function ProgramtervezoPage() {
  const [history, setHistory] = useState<WizardSnapshot[]>([
    { step: 'opening', state: INITIAL_WIZARD_STATE },
  ])
  const [highlights, setHighlights] = useState<ProgramItem[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const current = history[history.length - 1]
  const { step, state } = current

  /** Adatot ír a JELENLEGI lépéshez, lépés-váltás nélkül (pl. gépelés, checkbox). */
  const updateCurrent = useCallback((patch: Patch) => {
    setHistory((h) => {
      const last = h[h.length - 1]
      const updatedState = { ...last.state, ...resolvePatch(patch, last.state) }
      return [...h.slice(0, -1), { step: last.step, state: updatedState }]
    })
  }, [])

  /** Elmenti a patch-et ÉS új lépésre lép -- a döntés mindig a friss (patch utáni) adaton alapul. */
  const advance = useCallback((patch: Patch = {}) => {
    setHistory((h) => {
      const last = h[h.length - 1]
      const updatedState = { ...last.state, ...resolvePatch(patch, last.state) }
      const nextStep = nextStepAfter(last.step, updatedState)
      return [...h, { step: nextStep, state: updatedState }]
    })
  }, [])

  const goBack = useCallback(() => {
    setHistory((h) => (h.length > 1 ? h.slice(0, -1) : h))
  }, [])

  const toggleInterest = useCallback(
    (interest: string) => {
      updateCurrent((s) => ({
        interests: s.interests.includes(interest)
          ? s.interests.filter((i) => i !== interest)
          : [...s.interests, interest],
      }))
    },
    [updateCurrent]
  )

  const finishInterests = useCallback(() => {
    advance((s) => ({ interestQueue: [...s.interests] }))
  }, [advance])

  const answerInterestDetail = useCallback(
    (subcategories: string[]) => {
      advance((s) => {
        const [category, ...rest] = s.interestQueue
        return {
          interestQueue: rest,
          interestDetails: { ...s.interestDetails, [category]: subcategories },
        }
      })
    },
    [advance]
  )

  const toggleDietary = useCallback(
    (option: string) => {
      updateCurrent((s) => ({
        dietary: s.dietary.includes(option)
          ? s.dietary.filter((d) => d !== option)
          : [...s.dietary, option],
      }))
    },
    [updateCurrent]
  )

  const finishPlacePreview = useCallback(
    (liked: string[], disliked: string[]) => {
      advance({ likedItemIds: liked, dislikedItemIds: disliked })
    },
    [advance]
  )

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

    const adjustedCatalog = buildAdjustedCatalog(state)
    const draft = generateItinerary(adjustedCatalog, mockRules, preferences)
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
          airport: state.airport,
          arrivalTransport: state.arrivalTransport,
          approxMonth: state.approxMonth || undefined,
          budgetBand: state.budgetBand,
          companion: state.companion,
          kidsAge: state.kidsAge,
          interestDetails: state.interestDetails,
          dietary: state.dietary,
          likedItemIds: state.likedItemIds,
          dislikedItemIds: state.dislikedItemIds,
          dreamMoment: state.dreamMoment || undefined,
        },
      })
    } catch {
      // A dev DB elérhetetlensége nem szabad, hogy megakassza a vendégélményt --
      // a kérés később manuálisan is pótolható a review queue-ból (2. fázis).
    }

    setIsSubmitting(false)
    advance()
  }, [state, advance])

  const isDarkStep = step === 'opening'
  const showCuratorBadge = step !== 'opening' && step !== 'closing'

  const currentInterestCategory = state.interestQueue[0]
  const animationKey = step === 'interest-detail' ? `interest-detail-${currentInterestCategory}` : step

  return (
    <div className="fixed inset-0 h-screen w-screen bg-gradient-to-br from-white via-parisian-cream-50 to-parisian-beige-50">
      <WizardLogo isDark={isDarkStep} />
      <ProgressBar step={step} isDark={isDarkStep} />
      {showCuratorBadge && <CuratorBadge />}

      <AnimatePresence mode="wait">
        <motion.div
          key={animationKey}
          variants={stepVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={stepTransition}
          className="h-full w-full"
        >
          {step === 'opening' && <OpeningStep onNext={() => advance()} />}
          {step === 'flight-status' && (
            <FlightStatusStep
              value={state.flightStatus}
              onSelect={(flightStatus) => updateCurrent({ flightStatus })}
              onNext={() => advance()}
              onBack={goBack}
            />
          )}
          {step === 'flight-dates' && (
            <FlightDatesStep
              tripStart={state.tripStart}
              tripEnd={state.tripEnd}
              onChangeStart={(tripStart) => updateCurrent({ tripStart })}
              onChangeEnd={(tripEnd) => updateCurrent({ tripEnd })}
              onNext={() => advance()}
              onBack={goBack}
            />
          )}
          {step === 'arrival-logistics' && (
            <ArrivalLogisticsStep
              airport={state.airport}
              transport={state.arrivalTransport}
              onChangeAirport={(airport) => updateCurrent({ airport })}
              onChangeTransport={(arrivalTransport) => updateCurrent({ arrivalTransport })}
              onNext={() => advance()}
              onBack={goBack}
            />
          )}
          {step === 'travel-window' && (
            <TravelWindowStep
              approxMonth={state.approxMonth}
              approxDays={state.approxDays}
              onChangeMonth={(approxMonth) => updateCurrent({ approxMonth })}
              onChangeDays={(approxDays) => updateCurrent({ approxDays })}
              onNext={() => advance()}
              onBack={goBack}
            />
          )}
          {step === 'budget' && (
            <BudgetStep
              value={state.budgetBand}
              onSelect={(budgetBand) => updateCurrent({ budgetBand })}
              onNext={() => advance()}
              onBack={goBack}
            />
          )}
          {step === 'companion' && (
            <CompanionStep
              value={state.companion}
              onSelect={(companion) => advance({ companion })}
              onBack={goBack}
            />
          )}
          {step === 'family' && (
            <FamilyDetailsStep
              value={state.kidsAge}
              onSelect={(kidsAge) => updateCurrent({ kidsAge })}
              onNext={() => advance()}
              onBack={goBack}
            />
          )}
          {step === 'interests' && (
            <InterestsStep
              selected={state.interests}
              onToggle={toggleInterest}
              onNext={finishInterests}
              onBack={goBack}
            />
          )}
          {step === 'interest-detail' && currentInterestCategory && (
            <InterestDetailStep
              key={currentInterestCategory}
              category={currentInterestCategory}
              positionInQueue={state.interests.length - state.interestQueue.length + 1}
              totalInQueue={state.interests.length}
              onSubmit={answerInterestDetail}
              onBack={goBack}
            />
          )}
          {step === 'dietary' && (
            <DietaryStep
              selected={state.dietary}
              onToggle={toggleDietary}
              onNext={() => advance()}
              onBack={goBack}
            />
          )}
          {step === 'place-preview' && (
            <PlacePreviewStep state={state} onFinish={finishPlacePreview} onBack={goBack} />
          )}
          {step === 'pace' && (
            <PaceStep
              value={state.pace}
              onChange={(pace) => updateCurrent({ pace })}
              onNext={() => advance()}
              onBack={goBack}
            />
          )}
          {step === 'dream' && (
            <DreamMomentStep
              value={state.dreamMoment}
              onChange={(dreamMoment) => updateCurrent({ dreamMoment })}
              onNext={() => advance()}
              onBack={goBack}
            />
          )}
          {step === 'contact' && (
            <ContactStep
              name={state.name}
              email={state.email}
              onChangeName={(name) => updateCurrent({ name })}
              onChangeEmail={(email) => updateCurrent({ email })}
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
