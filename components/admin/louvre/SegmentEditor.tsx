'use client'

import { ArrowUp, ArrowDown, Trash2, Plus } from 'lucide-react'
import type { Segment } from '@/lib/louvre/types'
import AudioUploadField from './AudioUploadField'

interface Props {
  segment: Segment
  index: number
  total: number
  stationId: string
  availableAudioIds: string[]
  onChange: (segment: Segment) => void
  onRemove: () => void
  onMove: (direction: -1 | 1) => void
}

const inputClass =
  'w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-louvre-gold-500 focus:ring-1 focus:ring-louvre-gold-500'

export default function SegmentEditor({
  segment,
  index,
  total,
  stationId,
  availableAudioIds,
  onChange,
  onRemove,
  onMove,
}: Props) {
  const typeLabel = { audio: 'Hangszegmens', pause: 'Csend / feladat', choice: 'Elágazás' }[segment.type]

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="rounded-full bg-louvre-navy-50 px-3 py-1 text-xs font-semibold text-louvre-navy-700">
          {index + 1}. {typeLabel}
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={index === 0}
            onClick={() => onMove(-1)}
            className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30"
            aria-label="Feljebb"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
          <button
            type="button"
            disabled={index === total - 1}
            onClick={() => onMove(1)}
            className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30"
            aria-label="Lejjebb"
          >
            <ArrowDown className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="rounded p-1.5 text-red-400 hover:bg-red-50 hover:text-red-600"
            aria-label="Törlés"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {segment.type === 'audio' && (
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-500">
              Szegmens azonosító (ez alapján hivatkoznak rá az elágazások)
            </label>
            <input
              className={inputClass}
              value={segment.id}
              placeholder="pl. a01, a02, a03-szembol"
              onChange={(e) => onChange({ ...segment, id: e.target.value.trim() })}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-500">Felirat / narráció szövege</label>
            <textarea
              className={inputClass}
              rows={3}
              value={segment.caption ?? ''}
              onChange={(e) => onChange({ ...segment, caption: e.target.value })}
            />
          </div>
          <AudioUploadField
            src={segment.src}
            duration={segment.duration}
            pathHint={`${stationId || 'allomas'}-${segment.id || 'segment'}`}
            onChange={(src, duration) => onChange({ ...segment, src, duration })}
          />
        </div>
      )}

      {segment.type === 'pause' && (
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-500">Csend hossza (másodperc)</label>
            <input
              type="number"
              min={1}
              className={inputClass}
              value={segment.sec}
              onChange={(e) => onChange({ ...segment, sec: Number(e.target.value) || 0 })}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-500">Feladat szövege</label>
            <textarea
              className={inputClass}
              rows={2}
              value={segment.prompt}
              placeholder="pl. Számold meg, hány lába van!"
              onChange={(e) => onChange({ ...segment, prompt: e.target.value })}
            />
          </div>
        </div>
      )}

      {segment.type === 'choice' && (
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-500">Kérdés</label>
            <input
              className={inputClass}
              value={segment.question}
              onChange={(e) => onChange({ ...segment, question: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-500">Válaszlehetőségek</label>
            {segment.options.map((opt, i) => (
              <div key={i} className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <input
                  className={`${inputClass} sm:flex-1`}
                  placeholder="Gomb felirata"
                  value={opt.label}
                  onChange={(e) => {
                    const options = [...segment.options]
                    options[i] = { ...opt, label: e.target.value }
                    onChange({ ...segment, options })
                  }}
                />
                <div className="flex items-center gap-2">
                  <select
                    className={`${inputClass} flex-1 sm:flex-none`}
                    value={opt.goto}
                    onChange={(e) => {
                      const options = [...segment.options]
                      options[i] = { ...opt, goto: e.target.value }
                      onChange({ ...segment, options })
                    }}
                  >
                    <option value="">-- ugrás célja --</option>
                    {availableAudioIds.map((id) => (
                      <option key={id} value={id}>
                        {id}
                      </option>
                    ))}
                  </select>
                  {segment.options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => onChange({ ...segment, options: segment.options.filter((_, oi) => oi !== i) })}
                      className="flex-shrink-0 rounded p-1.5 text-red-400 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => onChange({ ...segment, options: [...segment.options, { label: '', goto: '' }] })}
              className="flex items-center gap-1 text-xs font-semibold text-louvre-navy-700 hover:underline"
            >
              <Plus className="h-3.5 w-3.5" />
              Válasz hozzáadása
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
