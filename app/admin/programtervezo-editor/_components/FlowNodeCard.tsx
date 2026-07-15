'use client'

import { Handle, Position, type NodeProps } from '@xyflow/react'
import { NODE_TYPE_LABELS, type FlowNodeData } from '@/lib/planner/flow-types'

const TYPE_COLOR: Record<string, string> = {
  hero: 'border-parisian-grey-800 bg-parisian-grey-800 text-white',
  'single-select': 'border-parisian-beige-400',
  'multi-select': 'border-parisian-beige-500',
  'datetime-range': 'border-french-blue-400',
  'month-counter': 'border-french-blue-400',
  'free-text': 'border-parisian-cream-300',
  'swipe-cards': 'border-french-red-400',
  'contact-form': 'border-parisian-grey-500',
  closing: 'border-parisian-grey-800 bg-parisian-grey-800 text-white',
}

export default function FlowNodeCard({ data, selected }: NodeProps & { data: FlowNodeData }) {
  const hasOptions = data.kind === 'single-select' || data.kind === 'multi-select'
  const colorClass = TYPE_COLOR[data.kind] ?? 'border-parisian-grey-300'
  const isDark = data.kind === 'hero' || data.kind === 'closing'

  return (
    <div
      className={`min-w-[220px] rounded-2xl border-2 bg-white p-4 shadow-md ${colorClass} ${
        selected ? 'ring-2 ring-offset-2 ring-parisian-beige-400' : ''
      }`}
    >
      <Handle type="target" position={Position.Left} className="!h-3 !w-3 !bg-parisian-grey-400" />

      <span
        className={`mb-1.5 block font-montserrat text-[10px] font-semibold uppercase tracking-wider ${
          isDark ? 'text-white/70' : 'text-parisian-grey-400'
        }`}
      >
        {NODE_TYPE_LABELS[data.kind as keyof typeof NODE_TYPE_LABELS]}
      </span>
      <p className={`font-montserrat text-sm font-semibold leading-snug ${isDark ? 'text-white' : 'text-parisian-grey-800'}`}>
        {data.title}
      </p>

      {hasOptions && 'options' in data && (
        <div className="mt-3 space-y-1.5 border-t border-parisian-beige-100 pt-3">
          {data.options.map((option) => (
            <div key={option.id} className="relative flex items-center justify-between rounded-lg bg-parisian-beige-50 px-2.5 py-1.5">
              <span className="font-montserrat text-xs text-parisian-grey-700">{option.label}</span>
              <Handle
                type="source"
                position={Position.Right}
                id={option.id}
                className="!static !h-2.5 !w-2.5 !translate-x-0 !bg-parisian-beige-500"
                style={{ position: 'relative', transform: 'none' }}
              />
            </div>
          ))}
        </div>
      )}

      {!hasOptions && data.kind !== 'closing' && (
        <Handle type="source" position={Position.Right} className="!h-3 !w-3 !bg-parisian-grey-400" />
      )}
    </div>
  )
}
