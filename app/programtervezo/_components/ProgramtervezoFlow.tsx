'use client'

import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import type { DateRange } from 'react-day-picker'
import { CalendarDays, CalendarRange, Gem, HelpCircle, Mail, Sparkles, Tags, Wallet } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { TripPlan } from '@/lib/planner/trip-plan-types'
import type { GuideContent } from '@/lib/planner/guide-content-types'
import {
  DISNEYLAND_ATTRACTION_TAG,
  type AccommodationLocation,
  type AccommodationType,
  type QuizConfig,
} from '@/lib/planner/quiz-config-types'
import { EMPTY_TEMPLATE_ANSWERS, matchTemplate, type TemplateAnswers } from '@/lib/planner/template-match'
import { submitTripPlanRequest } from '@/lib/actions/trip-plans'
import QuestionStep, { type QuestionOption } from './QuestionStep'
import DateRangeStep, { countNights, formatDateRangeLabel } from './DateRangeStep'
import { adjustDaysToDateRange } from '@/lib/planner/day-label'
import FlightStep, { type FlightStatus } from './FlightStep'
import InfoStep from './InfoStep'
import ChecklistStep from './ChecklistStep'
import ContactStep from './ContactStep'
import TemplateCardGrid from './TemplateCardGrid'
import ProgressDots from './ProgressDots'

type Mode = 'quiz' | 'submitted'
type Step = 'when' | 'flight' | 'hotel' | 'budget' | 'highlights' | 'disney' | 'preview' | 'contact'

// Az ikonok kódban maradnak (JSON-ban nem tárolhatók) -- csak a
// cím/leírás szövegek jönnek az admin-szerkeszthető configból.
const BUDGET_ICONS: Record<string, LucideIcon> = { economy: Wallet, mid: Tags, premium: Gem }
const DISNEY_ICONS: Record<string, LucideIcon> = {
  one_day_one_park: Sparkles,
  one_day_two_parks: CalendarDays,
  two_days_two_parks: CalendarRange,
}

interface ProgramtervezoFlowProps {
  templates: TripPlan[]
  error?: string
  guideContent: GuideContent
  quizConfig: QuizConfig
}

export default function ProgramtervezoFlow({ templates, error, guideContent, quizConfig }: ProgramtervezoFlowProps) {
  const [mode, setMode] = useState<Mode>('quiz')
  const [stepIndex, setStepIndex] = useState(0)
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)
  const [flightStatus, setFlightStatus] = useState<FlightStatus | null>(null)
  const [accommodationChoice, setAccommodationChoice] = useState<AccommodationType | null>(null)
  const [locationChoice, setLocationChoice] = useState<AccommodationLocation | null>(null)
  const [answers, setAnswers] = useState<TemplateAnswers>(EMPTY_TEMPLATE_ANSWERS)
  const [contactName, setContactName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const budgetOptions: QuestionOption<TemplateAnswers['budget']>[] = useMemo(
    () =>
      quizConfig.budget.options.map((o) => ({
        value: o.value,
        title: o.title,
        description: o.description,
        icon: (o.value && BUDGET_ICONS[o.value]) || HelpCircle,
      })),
    [quizConfig.budget.options]
  )

  const disneyOptions: QuestionOption<TemplateAnswers['disneyIntensity']>[] = useMemo(
    () =>
      quizConfig.disney.options.map((o) => ({
        value: o.value,
        title: o.title,
        description: o.description,
        icon: (o.value && DISNEY_ICONS[o.value]) || HelpCircle,
      })),
    [quizConfig.disney.options]
  )

  // A "hány éjszakát töltenétek" külön kérdés felesleges, ha a naptárban
  // már kijelölték az érkezés/hazautazás napját -- azt a dateRange-ből
  // vezetjük le. A Disneyland-intenzitás kérdés pedig csak akkor jelenik
  // meg, ha a nevezetesség-listánál kiválasztották a Disneylandet.
  const wantsDisneyland = answers.highlights.includes(DISNEYLAND_ATTRACTION_TAG)
  const steps = useMemo(() => {
    const base: Step[] = ['when', 'flight', 'hotel', 'budget', 'highlights']
    if (wantsDisneyland) base.push('disney')
    base.push('preview', 'contact')
    return base
  }, [wantsDisneyland])

  const step: Step = steps[stepIndex]
  const recommendation = useMemo(() => matchTemplate(templates, answers), [templates, answers])
  const nights = useMemo(() => countNights(dateRange), [dateRange])

  useEffect(() => {
    setAnswers((current) => ({ ...current, extraNight: nights === null ? null : nights > 3 }))
  }, [nights])

  function goNext() {
    if (stepIndex < steps.length - 1) {
      setStepIndex(stepIndex + 1)
    }
  }

  function goBack() {
    if (stepIndex === 0) return
    setStepIndex(stepIndex - 1)
  }

  function toggleHighlight(tag: string) {
    setAnswers((current) => ({
      ...current,
      highlights: current.highlights.includes(tag)
        ? current.highlights.filter((t) => t !== tag)
        : [...current.highlights, tag],
    }))
  }

  function resetToQuiz() {
    setAnswers(EMPTY_TEMPLATE_ANSWERS)
    setDateRange(undefined)
    setFlightStatus(null)
    setAccommodationChoice(null)
    setLocationChoice(null)
    setContactName('')
    setContactEmail('')
    setSubmitError(null)
    setStepIndex(0)
    setMode('quiz')
  }

  const travelWindow = formatDateRangeLabel(dateRange)
  const dateRangeLabel = travelWindow ? `${travelWindow}${nights !== null ? ` (${nights} éjszaka)` : ''}` : ''

  function buildGuestNotes(): string {
    const lines: string[] = []
    if (dateRangeLabel) lines.push(`Utazási időszak: ${dateRangeLabel}`)
    if (flightStatus) {
      const label = quizConfig.flight.options.find((o) => o.value === flightStatus)?.label
      if (label) lines.push(`Repülőjegy: ${label}`)
    }
    if (accommodationChoice) {
      const label = quizConfig.hotel.typeOptions.find((o) => o.value === accommodationChoice)?.label
      if (label) lines.push(`Szállástípus: ${label}`)
    }
    if (locationChoice) {
      const label = quizConfig.hotel.locationOptions.find((o) => o.value === locationChoice)?.label
      if (label) lines.push(`Szállás helye: ${label}`)
    }
    if (answers.budget) {
      const label = quizConfig.budget.options.find((o) => o.value === answers.budget)?.title
      if (label) lines.push(`Költségkeret: ${label}`)
    }
    if (answers.highlights.length > 0) {
      const labels = quizConfig.attractions.filter((o) => answers.highlights.includes(o.tag)).map((o) => o.label)
      lines.push(`Kiemelt nevezetességek: ${labels.join(', ')}`)
    }
    if (answers.disneyIntensity) {
      const label = quizConfig.disney.options.find((o) => o.value === answers.disneyIntensity)?.title
      if (label) lines.push(`Disneyland: ${label}`)
    }
    return lines.join('\n')
  }

  async function handleSubmit() {
    if (!recommendation) return
    setIsSubmitting(true)
    setSubmitError(null)

    const result = await submitTripPlanRequest({
      templateId: recommendation.id,
      guestName: contactName,
      guestEmail: contactEmail,
      guestNotes: buildGuestNotes(),
      guestHighlights: answers.highlights,
      dateRangeLabel,
      days: adjustDaysToDateRange(recommendation.days, dateRange?.from),
    })

    setIsSubmitting(false)

    if (!result.success) {
      setSubmitError(result.error ?? 'Ismeretlen hiba')
      return
    }

    setMode('submitted')
  }

  const hasEnoughTemplates = templates.length > 1
  const isFinalScreen = mode === 'submitted' || (mode === 'quiz' && (step === 'preview' || step === 'contact'))

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-white via-parisian-cream-50 to-parisian-beige-50">
      {/* Halvány, lassan lebegő háttér-akcentek -- ez adja a "kitöltött tér"
          érzetét a hosszú kérdőív alatt, animáció nélkül üresnek hatna. */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-1/3 h-96 w-96 rounded-full bg-parisian-beige-200/40 blur-3xl"
        animate={{ y: [0, 30, 0], x: [0, 20, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-2/3 h-80 w-80 rounded-full bg-parisian-cream-300/40 blur-3xl"
        animate={{ y: [0, -24, 0], x: [0, -16, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative overflow-hidden bg-parisian-grey-900 py-20 text-center text-white">
        <motion.div
          initial={{ scale: 1.1, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 0.35 }}
          transition={{ duration: 1.4 }}
          className="absolute inset-0"
        >
          <Image src="/images/stock1.jpeg" alt="" fill sizes="100vw" className="object-cover" />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-parisian-grey-900 via-parisian-grey-900/70 to-parisian-grey-900/40" />

        <div className="relative z-10 mx-auto max-w-2xl px-4">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 inline-block rounded-full bg-white/15 px-5 py-2 font-montserrat text-sm font-medium backdrop-blur-sm"
          >
            Programtervező
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-4 font-playfair text-4xl font-bold sm:text-5xl"
          >
            Találjuk meg a hozzátok illő programtervet
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-montserrat text-white/80"
          >
            Pár kérdés, és rögtön mutatjuk a hozzátok illő kész párizsi tervet.
          </motion.p>
        </div>
      </div>

      <div className="relative mx-auto max-w-3xl px-4 py-12 sm:py-16">
        {error && (
          <div className="mb-8 rounded-xl border-2 border-french-red-200 bg-french-red-50 px-4 py-3 text-center font-montserrat text-sm text-french-red-600">
            {error}
          </div>
        )}

        {!error && templates.length === 0 && (
          <div className="rounded-2xl border-2 border-dashed border-parisian-beige-300 p-10 text-center">
            <p className="font-montserrat text-sm text-parisian-grey-500">
              Egyelőre nincs elérhető programterv-sablon -- nézz vissza hamarosan!
            </p>
          </div>
        )}

        {!error && hasEnoughTemplates && (
          <div className="overflow-hidden rounded-[2rem] border-2 border-parisian-beige-200 bg-white/90 shadow-xl backdrop-blur-sm">
            {mode === 'quiz' && !isFinalScreen && (
              <div className="border-b-2 border-parisian-beige-100 px-8 pb-5 pt-8 sm:px-12">
                <ProgressDots current={stepIndex} total={steps.length - 2} />
              </div>
            )}

            <div className="px-8 py-12 sm:px-12 sm:py-14">
              <AnimatePresence mode="wait">
              {mode === 'quiz' && step === 'when' && (
                <DateRangeStep
                  key="when"
                  title={quizConfig.when.title}
                  subtitle={quizConfig.when.subtitle}
                  range={dateRange}
                  onChange={setDateRange}
                  onNext={goNext}
                />
              )}

              {mode === 'quiz' && step === 'flight' && (
                <FlightStep
                  key="flight"
                  title={quizConfig.flight.title}
                  subtitle={quizConfig.flight.subtitle}
                  options={quizConfig.flight.options}
                  status={flightStatus}
                  onChange={setFlightStatus}
                  tips={guideContent.flightTips}
                  onBack={goBack}
                  onNext={goNext}
                />
              )}

              {mode === 'quiz' && step === 'hotel' && (
                <InfoStep
                  key="hotel"
                  title={quizConfig.hotel.title}
                  subtitle={quizConfig.hotel.subtitle}
                  tips={guideContent.hotelTips}
                  skipLabel="Már van szállásunk, ez nem kell"
                  onSkip={goNext}
                  onBack={goBack}
                  onNext={goNext}
                  extra={
                    <div className="mb-6 space-y-3">
                      <ChoiceRow
                        label={quizConfig.hotel.typeQuestionLabel}
                        options={quizConfig.hotel.typeOptions}
                        selected={accommodationChoice}
                        onSelect={(value) => setAccommodationChoice(value as AccommodationType)}
                      />
                      <ChoiceRow
                        label={quizConfig.hotel.locationQuestionLabel}
                        options={quizConfig.hotel.locationOptions}
                        selected={locationChoice}
                        onSelect={(value) => setLocationChoice(value as AccommodationLocation)}
                      />
                    </div>
                  }
                />
              )}

              {mode === 'quiz' && step === 'budget' && (
                <QuestionStep
                  key="budget"
                  title={quizConfig.budget.title}
                  subtitle={quizConfig.budget.subtitle}
                  options={budgetOptions}
                  selected={answers.budget}
                  onSelect={(value) => setAnswers((current) => ({ ...current, budget: value }))}
                  onBack={goBack}
                  onNext={goNext}
                />
              )}

              {mode === 'quiz' && step === 'highlights' && (
                <ChecklistStep
                  key="highlights"
                  title={quizConfig.highlights.title}
                  subtitle={quizConfig.highlights.subtitle}
                  options={quizConfig.attractions}
                  selected={answers.highlights}
                  onToggle={toggleHighlight}
                  onBack={goBack}
                  onNext={goNext}
                />
              )}

              {mode === 'quiz' && step === 'disney' && (
                <QuestionStep
                  key="disney"
                  title={quizConfig.disney.title}
                  options={disneyOptions}
                  selected={answers.disneyIntensity}
                  onSelect={(value) => setAnswers((current) => ({ ...current, disneyIntensity: value }))}
                  onBack={goBack}
                  onNext={goNext}
                />
              )}

              {mode === 'quiz' && step === 'preview' && recommendation && (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.25 }}
                  className="mx-auto max-w-lg text-center"
                >
                  <p className="mb-2 font-montserrat text-sm font-medium text-parisian-beige-600">
                    Ez illik hozzátok{dateRangeLabel ? ` -- ${dateRangeLabel}` : ''}
                  </p>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1, duration: 0.3 }}
                    className="overflow-hidden rounded-3xl border-2 border-parisian-beige-200 bg-white shadow-lg"
                  >
                    <div className="relative h-52 w-full overflow-hidden bg-parisian-beige-100">
                      <Image
                        src={recommendation.templateImage || '/images/stock1.jpeg'}
                        alt={recommendation.templateTitle || 'Programterv'}
                        fill
                        sizes="512px"
                        className="object-cover"
                      />
                    </div>
                    <div className="p-6 text-left">
                      <h2 className="mb-2 font-playfair text-2xl font-bold text-parisian-grey-800">
                        {recommendation.templateTitle || 'Programterv'}
                      </h2>
                      {recommendation.templateTeaser && (
                        <p className="mb-4 font-montserrat text-sm leading-relaxed text-parisian-grey-500">
                          {recommendation.templateTeaser}
                        </p>
                      )}
                      {dateRangeLabel && (
                        <span className="flex items-center gap-1.5 font-montserrat text-xs font-medium text-parisian-grey-400">
                          <CalendarDays className="h-3.5 w-3.5" />
                          {dateRangeLabel}
                        </span>
                      )}
                    </div>
                  </motion.div>
                  <p className="mt-4 font-montserrat text-xs text-parisian-grey-400">
                    Ez egy induló javaslat -- Viktória a válaszaid alapján személyre szabja, mielőtt elküldi.
                  </p>
                  <div className="mt-6 flex items-center justify-center gap-6">
                    <button
                      type="button"
                      onClick={goBack}
                      className="font-montserrat text-sm font-medium text-parisian-grey-500 hover:text-parisian-grey-700"
                    >
                      Vissza
                    </button>
                    <motion.button
                      type="button"
                      onClick={goNext}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="rounded-full bg-parisian-beige-400 px-8 py-3 font-montserrat text-sm font-semibold text-white transition-colors hover:bg-parisian-beige-500"
                    >
                      Igénylem ezt a tervet
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {mode === 'quiz' && step === 'contact' && (
                <ContactStep
                  key="contact"
                  name={contactName}
                  email={contactEmail}
                  onNameChange={setContactName}
                  onEmailChange={setContactEmail}
                  onBack={goBack}
                  onSubmit={handleSubmit}
                  isSubmitting={isSubmitting}
                  error={submitError}
                />
              )}

              {mode === 'submitted' && (
                <motion.div
                  key="submitted"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -24 }}
                  className="mx-auto max-w-md py-8 text-center"
                >
                  <motion.span
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 16, delay: 0.1 }}
                    className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-parisian-beige-100 text-parisian-beige-600"
                  >
                    <Mail className="h-7 w-7" />
                  </motion.span>
                  <h1 className="mb-3 font-playfair text-3xl font-bold text-parisian-grey-800">Köszönjük!</h1>
                  <p className="mb-8 font-montserrat text-parisian-grey-500">
                    Viktória hamarosan átnézi az igényedet, és emailben elküldi a nektek személyre szabott
                    programtervet.
                  </p>
                  <button
                    type="button"
                    onClick={resetToQuiz}
                    className="font-montserrat text-sm font-medium text-parisian-grey-500 hover:text-parisian-grey-700"
                  >
                    Új igény indítása
                  </button>
                </motion.div>
              )}

            </AnimatePresence>
            </div>
          </div>
        )}

        {!error && templates.length === 1 && (
          <div className="py-6">
            <TemplateCardGrid templates={templates} />
          </div>
        )}
      </div>
    </div>
  )
}

function ChoiceRow<T extends string>({
  label,
  options,
  selected,
  onSelect,
}: {
  label: string
  options: { value: T; label: string }[]
  selected: T | null
  onSelect: (value: T) => void
}) {
  return (
    <div className="rounded-2xl border-2 border-parisian-beige-100 bg-parisian-cream-50 p-4 text-left">
      <p className="mb-2 font-montserrat text-sm font-medium text-parisian-grey-700">{label}</p>
      <div className="flex gap-2">
        {options.map((option) => (
          <motion.button
            key={option.value}
            type="button"
            onClick={() => onSelect(option.value)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            className={`rounded-full border-2 px-4 py-1.5 font-montserrat text-sm font-medium transition-colors ${
              selected === option.value
                ? 'border-parisian-beige-400 bg-white text-parisian-grey-800'
                : 'border-parisian-beige-200 bg-white text-parisian-grey-500 hover:border-parisian-beige-300'
            }`}
          >
            {option.label}
          </motion.button>
        ))}
      </div>
    </div>
  )
}
