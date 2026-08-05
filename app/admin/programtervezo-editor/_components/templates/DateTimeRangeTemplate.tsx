'use client'

import { motion } from 'framer-motion'
import type { DateTimeRangeNodeData } from '@/lib/planner/flow-types'

function computeDays(start: string, end: string): number | null {
  if (!start || !end) return null
  const s = new Date(start).getTime()
  const e = new Date(end).getTime()
  if (!Number.isFinite(s) || !Number.isFinite(e) || e <= s) return null
  return Math.max(1, Math.ceil((e - s) / (1000 * 60 * 60 * 24)))
}

export default function DateTimeRangeTemplate({
  data,
  start,
  end,
  onChangeStart,
  onChangeEnd,
  onNext,
  onBack,
}: {
  data: DateTimeRangeNodeData
  start: string
  end: string
  onChangeStart: (value: string) => void
  onChangeEnd: (value: string) => void
  onNext: () => void
  onBack: () => void
}) {
  const days = computeDays(start, end)

  return (
    <div className="flex h-full flex-col items-center justify-center px-4">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-3 text-center font-playfair text-3xl font-bold text-parisian-grey-800 sm:text-4xl md:text-5xl"
      >
        {data.title}
      </motion.h2>
      {data.subtitle && (
        <p className="mb-10 text-center font-montserrat text-parisian-grey-500">{data.subtitle}</p>
      )}

      <div className="w-full max-w-md space-y-4">
        <label className="block">
          <span className="mb-2 block font-montserrat text-sm font-medium text-parisian-grey-700">
            {data.startLabel}
          </span>
          <input
            type="datetime-local"
            value={start}
            onChange={(e) => onChangeStart(e.target.value)}
            className="w-full rounded-2xl border-2 border-parisian-beige-200 bg-white px-5 py-3.5 font-montserrat text-parisian-grey-800 outline-none focus:border-parisian-beige-400"
          />
        </label>
        <label className="block">
          <span className="mb-2 block font-montserrat text-sm font-medium text-parisian-grey-700">
            {data.endLabel}
          </span>
          <input
            type="datetime-local"
            value={end}
            onChange={(e) => onChangeEnd(e.target.value)}
            min={start || undefined}
            className="w-full rounded-2xl border-2 border-parisian-beige-200 bg-white px-5 py-3.5 font-montserrat text-parisian-grey-800 outline-none focus:border-parisian-beige-400"
          />
        </label>
        {days && (
          <p className="text-center font-montserrat text-sm font-medium text-parisian-beige-700">{days} nap Párizsban</p>
        )}
      </div>

      <div className="mt-6 flex items-center gap-6">
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
          disabled={!days}
          onClick={onNext}
          className="rounded-full bg-parisian-beige-400 px-10 py-4 font-montserrat text-base font-semibold text-white shadow-lg transition-colors hover:bg-parisian-beige-500 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Tovább
        </motion.button>
      </div>
    </div>
  )
}
