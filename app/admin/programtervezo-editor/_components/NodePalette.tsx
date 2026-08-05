'use client'

import { NODE_TYPE_LABELS, type NodeType } from '@/lib/planner/flow-types'

const NODE_TYPES: NodeType[] = [
  'hero',
  'single-select',
  'multi-select',
  'datetime-range',
  'month-counter',
  'free-text',
  'swipe-cards',
  'contact-form',
  'closing',
]

export default function NodePalette({ onAdd }: { onAdd: (type: NodeType) => void }) {
  return (
    <div className="w-60 flex-shrink-0 border-r border-parisian-beige-200 bg-white p-4">
      <h3 className="mb-3 font-montserrat text-xs font-semibold uppercase tracking-wider text-parisian-grey-500">
        Új kártya hozzáadása
      </h3>
      <div className="space-y-2">
        {NODE_TYPES.map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => onAdd(type)}
            className="w-full rounded-xl border-2 border-parisian-beige-200 bg-parisian-cream-50 px-3 py-2.5 text-left font-montserrat text-sm font-medium text-parisian-grey-700 transition-colors hover:border-parisian-beige-400 hover:bg-parisian-beige-50"
          >
            + {NODE_TYPE_LABELS[type]}
          </button>
        ))}
      </div>

      <p className="mt-6 font-montserrat text-xs leading-relaxed text-parisian-grey-400">
        Kattints egy kártyára a felkerüléshez, majd a vászonon a kártya bal
        oldali pöttyéből húzd az összeköttetést egy másik kártya jobb oldali
        pöttyére.
      </p>
    </div>
  )
}
