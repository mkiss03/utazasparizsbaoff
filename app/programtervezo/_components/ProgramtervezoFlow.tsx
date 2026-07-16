'use client'

import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { ArrowRight, Ban, CalendarDays, Gem, HelpCircle, Moon, Sparkles, Sun, Tags, Wallet } from 'lucide-react'
import type { TripPlan } from '@/lib/planner/trip-plan-types'
import { EMPTY_TEMPLATE_ANSWERS, matchTemplate, type TemplateAnswers } from '@/lib/planner/template-match'
import QuestionStep, { type QuestionOption } from './QuestionStep'
import TemplateCardGrid from './TemplateCardGrid'

type Mode = 'quiz' | 'result' | 'gallery'
type QuizStep = 0 | 1 | 2

const BUDGET_OPTIONS: QuestionOption<TemplateAnswers['budget']>[] = [
  { value: 'economy', icon: Wallet, title: 'Gazdaságos', description: 'Ingyenes és olcsó programok, helyi bisztrók' },
  { value: 'mid', icon: Tags, title: 'Középkategória', description: 'Kényelmes egyensúly élmény és ár között' },
  { value: 'premium', icon: Gem, title: 'Prémium', description: 'A legjobb helyek, exkluzív élmények' },
  { value: null, icon: HelpCircle, title: 'Még nem tudom', description: 'Mutasd a legjobb ajánlatunkat' },
]

const DISNEY_OPTIONS: QuestionOption<TemplateAnswers['disneyDay']>[] = [
  { value: true, icon: Sparkles, title: 'Igen, mindenképp', description: 'Szeretnénk egy egész napot a Disneylandben tölteni' },
  { value: false, icon: Ban, title: 'Nem feltétlenül', description: 'Inkább a párizsi klasszikusokra koncentrálnánk' },
  { value: null, icon: HelpCircle, title: 'Mindegy', description: 'Bármelyik jó, Viktória döntse el' },
]

const NIGHTS_OPTIONS: QuestionOption<TemplateAnswers['extraNight']>[] = [
  { value: false, icon: Sun, title: 'Alap időtartam elég', description: '3 éjszaka / 4 nap -- a klasszikus kőrúthoz pont elég' },
  { value: true, icon: Moon, title: 'Szívesen maradnánk tovább', description: 'Egy plusz éjszaka, kényelmesebb tempó' },
  { value: null, icon: HelpCircle, title: 'Még nem biztos', description: 'Nézzük meg, mit ajánlotok' },
]

export default function ProgramtervezoFlow({ templates, error }: { templates: TripPlan[]; error?: string }) {
  const [mode, setMode] = useState<Mode>('quiz')
  const [step, setStep] = useState<QuizStep>(0)
  const [answers, setAnswers] = useState<TemplateAnswers>(EMPTY_TEMPLATE_ANSWERS)

  const recommendation = useMemo(() => matchTemplate(templates, answers), [templates, answers])

  function handleNext() {
    if (step < 2) {
      setStep((step + 1) as QuizStep)
      return
    }
    setMode('result')
  }

  function handleBack() {
    if (step === 0) return
    setStep((step - 1) as QuizStep)
  }

  function resetToQuiz() {
    setAnswers(EMPTY_TEMPLATE_ANSWERS)
    setStep(0)
    setMode('quiz')
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
              {mode === 'quiz' && step === 0 && (
                <QuestionStep
                  key="budget"
                  title="Milyen költségkeretben gondolkodsz?"
                  subtitle="A repjegyen és szálláson felüli napi programokra értve -- ez irányár"
                  options={BUDGET_OPTIONS}
                  selected={answers.budget}
                  onSelect={(value) => setAnswers((current) => ({ ...current, budget: value }))}
                  onNext={handleNext}
                />
              )}
              {mode === 'quiz' && step === 1 && (
                <QuestionStep
                  key="disney"
                  title="Szeretnétek egy egész napot a Disneylandben tölteni?"
                  options={DISNEY_OPTIONS}
                  selected={answers.disneyDay}
                  onSelect={(value) => setAnswers((current) => ({ ...current, disneyDay: value }))}
                  onBack={handleBack}
                  onNext={handleNext}
                />
              )}
              {mode === 'quiz' && step === 2 && (
                <QuestionStep
                  key="nights"
                  title="Mennyi ideig maradnátok?"
                  options={NIGHTS_OPTIONS}
                  selected={answers.extraNight}
                  onSelect={(value) => setAnswers((current) => ({ ...current, extraNight: value }))}
                  onBack={handleBack}
                  onNext={handleNext}
                  isLast
                />
              )}

              {mode === 'result' && recommendation && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -24 }}
                  className="mx-auto max-w-lg py-6 text-center"
                >
                  <p className="mb-2 font-montserrat text-sm font-medium text-parisian-beige-600">Ez illik hozzátok</p>
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
                        <span className="mb-4 flex items-center gap-1.5 font-montserrat text-xs font-medium text-parisian-grey-400">
                          <CalendarDays className="h-3.5 w-3.5" />
                          {recommendation.dateRangeLabel}
                        </span>
                      )}
                      <Link
                        href={`/programterv/${recommendation.shareToken}`}
                        className="flex items-center justify-center gap-2 rounded-full bg-parisian-beige-400 px-6 py-3 font-montserrat text-sm font-semibold text-white transition-colors hover:bg-parisian-beige-500"
                      >
                        Megnézem a teljes tervet
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                  <div className="mt-6 flex items-center justify-center gap-6">
                    <button
                      type="button"
                      onClick={resetToQuiz}
                      className="font-montserrat text-sm font-medium text-parisian-grey-500 hover:text-parisian-grey-700"
                    >
                      Újra a kérdésektől
                    </button>
                    <button
                      type="button"
                      onClick={() => setMode('gallery')}
                      className="font-montserrat text-sm font-medium text-parisian-grey-500 hover:text-parisian-grey-700"
                    >
                      Az összes lehetőség megtekintése
                    </button>
                  </div>
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
