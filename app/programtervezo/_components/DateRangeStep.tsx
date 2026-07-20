'use client'

import 'react-day-picker/style.css'
import { motion } from 'framer-motion'
import { DayPicker, type DateRange } from 'react-day-picker'
import { hu } from 'react-day-picker/locale'

interface DateRangeStepProps {
  range: DateRange | undefined
  onChange: (range: DateRange | undefined) => void
  onBack?: () => void
  onNext: () => void
}

export function formatDateRangeLabel(range: DateRange | undefined): string {
  if (!range?.from) return ''
  const formatter = new Intl.DateTimeFormat('hu-HU', { year: 'numeric', month: 'long', day: 'numeric' })
  if (!range.to || range.to.getTime() === range.from.getTime()) {
    return formatter.format(range.from)
  }
  const sameMonth = range.from.getMonth() === range.to.getMonth() && range.from.getFullYear() === range.to.getFullYear()
  if (sameMonth) {
    const monthFormatter = new Intl.DateTimeFormat('hu-HU', { year: 'numeric', month: 'long' })
    return `${monthFormatter.format(range.from)} ${range.from.getDate()}–${range.to.getDate()}.`
  }
  return `${formatter.format(range.from)} – ${formatter.format(range.to)}`
}

// Az érkezés/hazautazás napja közti éjszakák száma -- ebből derül ki
// automatikusan, hogy alap (3 éj) vagy hosszabb időtartamú sablon illik
// jobban, külön "hány éjszakát töltenétek" kérdés nélkül.
export function countNights(range: DateRange | undefined): number | null {
  if (!range?.from || !range?.to) return null
  const msPerDay = 24 * 60 * 60 * 1000
  return Math.round((range.to.getTime() - range.from.getTime()) / msPerDay)
}

export default function DateRangeStep({ range, onChange, onBack, onNext }: DateRangeStepProps) {
  const label = formatDateRangeLabel(range)
  const nights = countNights(range)

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.25 }}
      className="mx-auto max-w-md px-4 py-14 text-center"
    >
      <h1 className="mb-2 font-playfair text-3xl font-bold text-parisian-grey-800 sm:text-4xl">
        Mikor terveznétek utazni?
      </h1>
      <p className="mb-6 font-montserrat text-parisian-grey-500">Jelöld ki a naptárban az érkezés és a hazautazás napját</p>

      <div className="programtervezo-calendar mx-auto inline-block rounded-3xl border-2 border-parisian-beige-200 bg-white p-4 shadow-sm">
        <DayPicker
          mode="range"
          locale={hu}
          selected={range}
          onSelect={onChange}
          disabled={{ before: new Date() }}
          numberOfMonths={1}
          showOutsideDays
        />
      </div>

      <p className="mt-4 min-h-[1.25rem] font-montserrat text-sm font-medium text-parisian-beige-600">
        {label}
        {nights !== null && nights > 0 && ` -- ${nights} éjszaka`}
      </p>

      <div className="mt-6 flex items-center justify-center gap-6">
        {onBack && (
          <button type="button" onClick={onBack} className="font-montserrat text-sm font-medium text-parisian-grey-500 hover:text-parisian-grey-700">
            Vissza
          </button>
        )}
        <button
          type="button"
          onClick={onNext}
          className="rounded-full bg-parisian-beige-400 px-8 py-3 font-montserrat text-sm font-semibold text-white transition-colors hover:bg-parisian-beige-500"
        >
          Tovább
        </button>
      </div>
    </motion.div>
  )
}
