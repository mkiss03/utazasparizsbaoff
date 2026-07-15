'use client'

import { Handle, Position, type NodeProps } from '@xyflow/react'
import { ArrowRight } from 'lucide-react'
import { NODE_TYPE_LABELS, type FlowNodeData } from '@/lib/planner/flow-types'

const TYPE_ACCENT: Record<string, string> = {
  hero: 'border-parisian-grey-800',
  'single-select': 'border-parisian-beige-400',
  'multi-select': 'border-parisian-beige-500',
  'datetime-range': 'border-french-blue-400',
  'month-counter': 'border-french-blue-400',
  'free-text': 'border-parisian-cream-400',
  'swipe-cards': 'border-french-red-400',
  'contact-form': 'border-parisian-grey-500',
  closing: 'border-parisian-grey-800',
}

export default function FlowNodeCard({ data, selected }: NodeProps & { data: FlowNodeData }) {
  const hasOptions = data.kind === 'single-select' || data.kind === 'multi-select'
  const accent = TYPE_ACCENT[data.kind] ?? 'border-parisian-grey-300'
  const isDark = data.kind === 'hero' || data.kind === 'closing'
  // Egyválasztósnál/többválasztósnál a per-opció pöttyök adják az elágazást
  // -- egy külön, kártya-szintű kimenet csak ott kell, ahol nincs opciólista.
  const showDefaultOutput = data.kind !== 'closing' && !hasOptions

  return (
    <div
      className={`w-[300px] rounded-2xl border-2 bg-white shadow-md transition-shadow ${accent} ${
        selected ? 'shadow-xl ring-4 ring-parisian-beige-200' : ''
      }`}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!h-4 !w-4 !border-2 !border-white !bg-parisian-grey-400 !shadow"
      />

      <div className={`rounded-t-2xl px-4 py-3 ${isDark ? 'bg-parisian-grey-800' : 'bg-parisian-cream-50'}`}>
        <span
          className={`block font-montserrat text-[10px] font-semibold uppercase tracking-wider ${
            isDark ? 'text-white/60' : 'text-parisian-grey-400'
          }`}
        >
          {NODE_TYPE_LABELS[data.kind]}
        </span>
        <p className={`mt-0.5 font-montserrat text-sm font-semibold leading-snug ${isDark ? 'text-white' : 'text-parisian-grey-800'}`}>
          {data.title || 'Cím nélkül'}
        </p>
      </div>

      {hasOptions && 'options' in data && (
        <div className="space-y-1.5 p-3">
          {data.options.map((option) => (
            <div
              key={option.id}
              className="group relative flex items-center justify-between gap-2 rounded-xl bg-parisian-beige-50 py-2 pl-3 pr-1.5 transition-colors hover:bg-parisian-beige-100"
            >
              <span className="min-w-0 flex-1 truncate font-montserrat text-xs text-parisian-grey-700">
                {option.label || 'Névtelen opció'}
              </span>
              <div className="relative flex flex-shrink-0 items-center gap-1">
                <ArrowRight className="h-3 w-3 text-parisian-grey-300 opacity-0 transition-opacity group-hover:opacity-100" />
                <Handle
                  type="source"
                  position={Position.Right}
                  id={option.id}
                  className="!static !h-3.5 !w-3.5 !translate-x-0 !border-2 !border-white !bg-parisian-beige-500 !shadow transition-transform hover:!scale-125"
                  style={{ position: 'relative', transform: 'none' }}
                />
              </div>
            </div>
          ))}
          <p className="px-1 pt-1 font-montserrat text-[10px] leading-relaxed text-parisian-grey-400">
            Húzd az opció jobb oldali pöttyét egy másik kártyára az elágazáshoz.
          </p>
        </div>
      )}

      {!hasOptions && !isDark && (
        <div className="px-4 py-3">
          <p className="font-montserrat text-[11px] text-parisian-grey-400">Egy kimenet -- mindig ide vezet tovább.</p>
        </div>
      )}

      {showDefaultOutput && (
        <Handle
          type="source"
          position={Position.Right}
          className="!h-4 !w-4 !border-2 !border-white !bg-parisian-grey-400 !shadow"
        />
      )}

      {data.kind === 'multi-select' && (
        <Handle
          type="source"
          position={Position.Bottom}
          className="!h-4 !w-4 !border-2 !border-white !bg-parisian-grey-400 !shadow"
        />
      )}
    </div>
  )
}
