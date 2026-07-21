'use client'

import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import type { DateRange } from 'react-day-picker'
import { CalendarDays, CalendarRange, Gem, HelpCircle, Mail, Sparkles, Tags, Wallet } from 'lucide-react'
import type { TripPlan } from '@/lib/planner/trip-plan-types'
import type { GuideContent } from '@/lib/planner/guide-content-types'
import { ATTRACTION_OPTIONS, DISNEYLAND_ATTRACTION_TAG } from '@/lib/planner/attraction-options'
import { EMPTY_TEMPLATE_ANSWERS, matchTemplate, type TemplateAnswers } from '@/lib/planner/template-match'
import { submitTripPlanRequest } from '@/lib/actions/trip-plans'
import QuestionStep, { type QuestionOption } from './QuestionStep'
import DateRangeStep, { countNights, formatDateRangeLabel } from './DateRangeStep'
import FlightStep, { type FlightStatus } from './FlightStep'
import InfoStep from './InfoStep'
import ChecklistStep from './ChecklistStep'
import ContactStep from './ContactStep'
import TemplateCardGrid from './TemplateCardGrid'

type Mode = 'quiz' | 'submitted' | 'gallery'
type Step = 'when' | 'flight' | 'hotel' | 'budget' | 'highlights' | 'disney' | 'preview' | 'contact'

const FLIGHT_STATUS_LABELS: Record<FlightStatus, string> = {
  have: 'Van már repülőjegyünk',
  not_yet: 'Még nincs',
  need_help: 'Még nincs, segítséget kérünk',
}

const BUDGET_OPTIONS: QuestionOption<TemplateAnswers['budget']>[] = [
  { value: 'economy', icon: Wallet, title: 'Gazdaságos', description: 'Ingyenes és olcsó programok, helyi bisztrók' },
  { value: 'mid', icon: Tags, title: 'Középkategória', description: 'Kényelmes egyensúly élmény és ár között' },
  { value: 'premium', icon: Gem, title: 'Prémium', description: 'A legjobb helyek, exkluzív élmények' },
  { value: null, icon: HelpCircle, title: 'Még nem tudom', description: 'Mutasd a legjobb ajánlatunkat' },
]

const DISNEY_OPTIONS: QuestionOption<TemplateAnswers['disneyIntensity']>[] = [
  { value: 'one_day_one_park', icon: Sparkles, title: '1 nap, 1 park', description: 'Egy egész nap az egyik Disneyland parkban' },
  { value: 'one_day_two_parks', icon: CalendarDays, title: '1 nap, 2 park', description: 'Egy nap alatt mindkét parkba benézünk' },
  { value: 'two_days_two_parks', icon: CalendarRange, title: '2 nap, 2 park', description: 'Két teljes nap, mindkét park alaposan' },
  { value: null, icon: HelpCircle, title: 'Még nem tudjuk', description: 'Bármelyik jó, Viktória döntse el' },
]

interface ProgramtervezoFlowProps {
  templates: TripPlan[]
  error?: string
  guideContent: GuideContent
}

export default function ProgramtervezoFlow({ templates, error, guideContent }: ProgramtervezoFlowProps) {
  const [mode, setMode] = useState<Mode>('quiz')
  const [stepIndex, setStepIndex] = useState(0)
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)
  const [flightStatus, setFlightStatus] = useState<FlightStatus | null>(null)
  const [accommodationChoice, setAccommodationChoice] = useState<'hotel' | 'apartment' | null>(null)
  const [locationChoice, setLocationChoice] = useState<'paris' | 'disneyland' | null>(null)
  const [answers, setAnswers] = useState<TemplateAnswers>(EMPTY_TEMPLATE_ANSWERS)
  const [contactName, setContactName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

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

  function buildGuestNotes(): string {
    const lines: string[] = []
    if (travelWindow) lines.push(`Utazási időszak: ${travelWindow}${nights !== null ? ` (${nights} éjszaka)` : ''}`)
    if (flightStatus) lines.push(`Repülőjegy: ${FLIGHT_STATUS_LABELS[flightStatus]}`)
    if (accommodationChoice) lines.push(`Szállástípus: ${accommodationChoice === 'hotel' ? 'hotel' : 'apartman'}`)
    if (locationChoice) lines.push(`Szállás helye: ${locationChoice === 'paris' ? 'Párizs' : 'Disneyland'}`)
    if (answers.budget) {
      const label = BUDGET_OPTIONS.find((o) => o.value === answers.budget)?.title
      if (label) lines.push(`Költségkeret: ${label}`)
    }
    if (answers.highlights.length > 0) {
      const labels = ATTRACTION_OPTIONS.filter((o) => answers.highlights.includes(o.tag)).map((o) => o.label)
      lines.push(`Kiemelt nevezetességek: ${labels.join(', ')}`)
    }
    if (answers.disneyIntensity) {
      const label = DISNEY_OPTIONS.find((o) => o.value === answers.disneyIntensity)?.title
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
    })

    setIsSubmitting(false)

    if (!result.success) {
      setSubmitError(result.error ?? 'Ismeretlen hiba')
      return
    }

    setMode('submitted')
  }

  const hasEnoughTemplates = templates.length > 1

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-parisian-cream-50 to-parisian-beige-50">
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

      <div className="mx-auto max-w-5xl px-4 py-8">
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
          <>
            <div className="mb-2 flex justify-end">
              <button
                type="button"
                onClick={() => setMode(mode === 'gallery' ? 'quiz' : 'gallery')}
                className="font-montserrat text-sm font-medium text-parisian-grey-500 underline-offset-2 hover:text-parisian-grey-700 hover:underline"
              >
                {mode === 'gallery' ? 'Vissza a kérdésekhez' : 'Az összes lehetőség megtekintése'}
              </button>
            </div>

            <AnimatePresence mode="wait">
              {mode === 'quiz' && step === 'when' && (
                <DateRangeStep key="when" range={dateRange} onChange={setDateRange} onNext={goNext} />
              )}

              {mode === 'quiz' && step === 'flight' && (
                <FlightStep
                  key="flight"
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
                  title="És a szállás?"
                  subtitle="A megfelelő szállás mindig a legnagyobb kérdés -- segítünk dönteni"
                  tips={guideContent.hotelTips}
                  skipLabel="Már van szállásunk, ez nem kell"
                  onSkip={goNext}
                  onBack={goBack}
                  onNext={goNext}
                  extra={
                    <div className="mb-6 space-y-3">
                      <ChoiceRow
                        label="Hotel vagy apartman?"
                        options={[
                          { value: 'hotel', label: 'Hotel' },
                          { value: 'apartment', label: 'Apartman' },
                        ]}
                        selected={accommodationChoice}
                        onSelect={(value) => setAccommodationChoice(value as 'hotel' | 'apartment')}
                      />
                      <ChoiceRow
                        label="Párizs vagy Disneyland?"
                        options={[
                          { value: 'paris', label: 'Párizs' },
                          { value: 'disneyland', label: 'Disneyland' },
                        ]}
                        selected={locationChoice}
                        onSelect={(value) => setLocationChoice(value as 'paris' | 'disneyland')}
                      />
                    </div>
                  }
                />
              )}

              {mode === 'quiz' && step === 'budget' && (
                <QuestionStep
                  key="budget"
                  title="Milyen költségkeretben gondolkodsz?"
                  subtitle="A repjegyen és szálláson felüli napi programokra értve -- ez irányár"
                  options={BUDGET_OPTIONS}
                  selected={answers.budget}
                  onSelect={(value) => setAnswers((current) => ({ ...current, budget: value }))}
                  onBack={goBack}
                  onNext={goNext}
                />
              )}

              {mode === 'quiz' && step === 'highlights' && (
                <ChecklistStep
                  key="highlights"
                  title="Melyik nevezetességeket szeretnétek biztosan látni?"
                  subtitle="Bármennyit kiválaszthattok -- ez alapján ajánljuk a legjobban illő tervet"
                  options={ATTRACTION_OPTIONS}
                  selected={answers.highlights}
                  onToggle={toggleHighlight}
                  onBack={goBack}
                  onNext={goNext}
                />
              )}

              {mode === 'quiz' && step === 'disney' && (
                <QuestionStep
                  key="disney"
                  title="Mennyi időt töltenétek a Disneylandben?"
                  options={DISNEY_OPTIONS}
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
                  className="mx-auto max-w-lg py-6 text-center"
                >
                  <p className="mb-2 font-montserrat text-sm font-medium text-parisian-beige-600">
                    Ez illik hozzátok{travelWindow ? ` -- ${travelWindow}` : ''}
                  </p>
                  <div className="overflow-hidden rounded-3xl border-2 border-parisian-beige-200 bg-white shadow-lg">
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
                      {recommendation.dateRangeLabel && (
                        <span className="flex items-center gap-1.5 font-montserrat text-xs font-medium text-parisian-grey-400">
                          <CalendarDays className="h-3.5 w-3.5" />
                          {recommendation.dateRangeLabel}
                        </span>
                      )}
                    </div>
                  </div>
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
                    <button
                      type="button"
                      onClick={goNext}
                      className="rounded-full bg-parisian-beige-400 px-8 py-3 font-montserrat text-sm font-semibold text-white transition-colors hover:bg-parisian-beige-500"
                    >
                      Igénylem ezt a tervet
                    </button>
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
                  className="mx-auto max-w-md py-16 text-center"
                >
                  <span className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-parisian-beige-100 text-parisian-beige-600">
                    <Mail className="h-6 w-6" />
                  </span>
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

              {mode === 'gallery' && (
                <motion.div key="gallery" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <TemplateCardGrid templates={templates} />
                </motion.div>
              )}
            </AnimatePresence>
          </>
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

function ChoiceRow({
  label,
  options,
  selected,
  onSelect,
}: {
  label: string
  options: { value: string; label: string }[]
  selected: string | null
  onSelect: (value: string) => void
}) {
  return (
    <div className="rounded-2xl border-2 border-parisian-beige-200 bg-white p-4 text-left">
      <p className="mb-2 font-montserrat text-sm font-medium text-parisian-grey-700">{label}</p>
      <div className="flex gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onSelect(option.value)}
            className={`rounded-full border-2 px-4 py-1.5 font-montserrat text-sm font-medium transition-colors ${
              selected === option.value
                ? 'border-parisian-beige-400 bg-parisian-cream-50 text-parisian-grey-800'
                : 'border-parisian-beige-200 bg-white text-parisian-grey-500 hover:border-parisian-beige-300'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}
