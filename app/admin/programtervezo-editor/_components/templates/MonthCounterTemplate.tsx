'use client'

import { motion } from 'framer-motion'
import { Minus, Plus } from 'lucide-react'
import type { MonthCounterNodeData } from '@/lib/planner/flow-types'

export default function MonthCounterTemplate({
  data,
  month,
  days,
  onChangeMonth,
  onChangeDays,
  onNext,
  onBack,
}: {
  data: MonthCounterNodeData
  month: string
  days: number
  onChangeMonth: (value: string) => void
  onChangeDays: (days: number) => void
  onNext: () => void
  onBack: () => void
}) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-4">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-3 text-center font-playfair text-3xl font-bold text-parisian-grey-800 sm:text-4xl md:text-5xl"
      >
        {data.title}
      </motion.h2>
      {data.subtitle && <p className="mb-10 text-center font-montserrat text-parisian-grey-500">{data.subtitle}</p>}

      <div className="w-full max-w-sm">
        <label className="mb-8 block">
          <span className="mb-2 block font-montserrat text-sm font-medium text-parisian-grey-700">
            {data.monthLabel}
          </span>
          <input
            type="month"
            value={month}
            onChange={(e) => onChangeMonth(e.target.value)}
            className="w-full rounded-2xl border-2 border-parisian-beige-200 bg-white px-5 py-3.5 font-montserrat text-parisian-grey-800 outline-none focus:border-parisian-beige-400"
          />
        </label>

        <span className="mb-3 block text-center font-montserrat text-sm font-medium text-parisian-grey-700">
          Hány napra tervezed?
        </span>
        <div className="flex items-center justify-center gap-6 rounded-full bg-parisian-beige-50 px-6 py-4">
          <button
            type="button"
            onClick={() => onChangeDays(Math.max(data.minDays, days - 1))}
            disabled={days <= data.minDays}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-parisian-grey-800 shadow-sm disabled:opacity-30"
          >
            <Minus className="h-5 w-5" />
          </button>
          <span className="w-16 text-center font-playfair text-4xl font-bold text-parisian-grey-800">{days}</span>
          <button
            type="button"
            onClick={() => onChangeDays(Math.min(data.maxDays, days + 1))}
            disabled={days >= data.maxDays}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-parisian-grey-800 shadow-sm disabled:opacity-30"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="mt-10 flex items-center gap-6">
        <button
          type="button"
          onClick={onBack}
          className="font-montserrat text-sm font-medium text-parisian-grey-500 underline-offset-4 hover:underline"
        >
          Vissza
        </button>
        <motion.button
          type="button"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={onNext}
          className="rounded-full bg-parisian-beige-400 px-10 py-4 font-montserrat text-base font-semibold text-white shadow-lg transition-colors hover:bg-parisian-beige-500"
        >
          Tovább
        </motion.button>
      </div>
    </div>
  )
}
