'use client'

import { ChevronDown, ChevronUp, Plus, Sparkles, Trash2 } from 'lucide-react'
import { createEmptyTripPlanItem, DISNEYLAND_DAY_TEMPLATE, type TripPlanDay, type TripPlanItem } from '@/lib/planner/trip-plan-types'

export default function DayEditor({
  day,
  index,
  isFirst,
  isLast,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
}: {
  day: TripPlanDay
  index: number
  isFirst: boolean
  isLast: boolean
  onChange: (day: TripPlanDay) => void
  onRemove: () => void
  onMoveUp: () => void
  onMoveDown: () => void
}) {
  function updateItem(itemIndex: number, patch: Partial<TripPlanItem>) {
    onChange({
      ...day,
      items: day.items.map((item, i) => (i === itemIndex ? { ...item, ...patch } : item)),
    })
  }

  function removeItem(itemIndex: number) {
    onChange({ ...day, items: day.items.filter((_, i) => i !== itemIndex) })
  }

  function addItem() {
    onChange({ ...day, items: [...day.items, createEmptyTripPlanItem()] })
  }

  function insertDisneyTemplate() {
    onChange({
      ...day,
      dateLabel: day.dateLabel.includes('Érkezés') || day.dateLabel.includes('Hazautazás') ? day.dateLabel : DISNEYLAND_DAY_TEMPLATE.dateLabel,
      note: DISNEYLAND_DAY_TEMPLATE.note,
      items: DISNEYLAND_DAY_TEMPLATE.items.map((item) => ({ ...item, id: `${item.id}-${Date.now()}` })),
    })
  }

  return (
    <div className="rounded-2xl border-2 border-parisian-beige-200 bg-white p-5">
      <div className="mb-4 flex items-start gap-3">
        <span className="mt-2.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-parisian-beige-400 font-montserrat text-xs font-bold text-white">
          {index + 1}
        </span>

        <div className="flex-1 space-y-3">
          <input
            type="text"
            value={day.dateLabel}
            onChange={(e) => onChange({ ...day, dateLabel: e.target.value })}
            placeholder='pl. "07.11. szombat -- Érkezés"'
            className="w-full rounded-xl border-2 border-parisian-beige-200 px-4 py-2.5 font-montserrat text-sm font-semibold text-parisian-grey-800 outline-none focus:border-parisian-beige-400"
          />
          <input
            type="text"
            value={day.note ?? ''}
            onChange={(e) => onChange({ ...day, note: e.target.value })}
            placeholder="Napi jegyzet (opcionális), pl. 'A sorrend mindegy, ahogy szeretnétek'"
            className="w-full rounded-xl border-2 border-parisian-beige-100 px-4 py-2 font-montserrat text-xs text-parisian-grey-600 outline-none focus:border-parisian-beige-400"
          />
        </div>

        <div className="flex flex-col gap-1">
          <button
            type="button"
            onClick={onMoveUp}
            disabled={isFirst}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-parisian-grey-400 hover:bg-parisian-beige-50 disabled:opacity-20"
            aria-label="Nap feljebb"
          >
            <ChevronUp className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            disabled={isLast}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-parisian-grey-400 hover:bg-parisian-beige-50 disabled:opacity-20"
            aria-label="Nap lejjebb"
          >
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>

        <button
          type="button"
          onClick={onRemove}
          className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-parisian-grey-400 hover:bg-french-red-50 hover:text-french-red-500"
          aria-label="Nap törlése"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-2 border-t border-parisian-beige-100 pt-4">
        {day.items.map((item, itemIndex) => (
          <div key={item.id} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={item.confirmed}
              onChange={(e) => updateItem(itemIndex, { confirmed: e.target.checked })}
              title="Lefoglalva / megerősítve"
              className="h-4 w-4 flex-shrink-0"
            />
            <input
              type="text"
              value={item.time ?? ''}
              onChange={(e) => updateItem(itemIndex, { time: e.target.value })}
              placeholder="idő"
              className="w-20 flex-shrink-0 rounded-lg border-2 border-parisian-beige-200 px-2.5 py-2 font-montserrat text-sm text-parisian-grey-800 outline-none focus:border-parisian-beige-400"
            />
            <input
              type="text"
              value={item.text}
              onChange={(e) => updateItem(itemIndex, { text: e.target.value })}
              placeholder="Program / helyszín"
              className="flex-1 rounded-lg border-2 border-parisian-beige-200 px-3 py-2 font-montserrat text-sm text-parisian-grey-800 outline-none focus:border-parisian-beige-400"
            />
            <button
              type="button"
              onClick={() => removeItem(itemIndex)}
              className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-parisian-grey-300 hover:bg-french-red-50 hover:text-french-red-500"
              aria-label="Tétel törlése"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={addItem}
          className="flex items-center gap-1.5 rounded-lg border-2 border-dashed border-parisian-beige-300 px-3 py-1.5 font-montserrat text-xs font-medium text-parisian-grey-500 hover:border-parisian-beige-400 hover:text-parisian-grey-700"
        >
          <Plus className="h-3.5 w-3.5" />
          Tétel hozzáadása
        </button>
        <button
          type="button"
          onClick={insertDisneyTemplate}
          className="flex items-center gap-1.5 rounded-lg border-2 border-dashed border-parisian-beige-300 px-3 py-1.5 font-montserrat text-xs font-medium text-parisian-grey-500 hover:border-parisian-beige-400 hover:text-parisian-grey-700"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Disneyland-sablon beszúrása
        </button>
      </div>
    </div>
  )
}
