'use client'

import { GripVertical, Trash2, Plus, Mic, Timer, GitBranch } from 'lucide-react'
import type { Segment, Station } from '@/lib/louvre/types'
import { audioSegmentIdsInStation, emptyAudioSegment, emptyChoiceSegment, emptyPauseSegment, slugify } from '@/lib/louvre/manifest-admin'
import SegmentEditor from './SegmentEditor'
import CoverImageUpload from './CoverImageUpload'

interface Props {
  station: Station
  onChange: (station: Station) => void
  onRemove: () => void
  dragHandleProps?: React.HTMLAttributes<HTMLButtonElement>
}

const inputClass =
  'w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-louvre-gold-500 focus:ring-1 focus:ring-louvre-gold-500'

export default function StationEditor({ station, onChange, onRemove, dragHandleProps }: Props) {
  const availableAudioIds = audioSegmentIdsInStation(station)

  const updateSegment = (index: number, segment: Segment) => {
    const segments = [...station.segments]
    segments[index] = segment
    onChange({ ...station, segments })
  }

  const removeSegment = (index: number) => {
    onChange({ ...station, segments: station.segments.filter((_, i) => i !== index) })
  }

  const moveSegment = (index: number, direction: -1 | 1) => {
    const segments = [...station.segments]
    const target = index + direction
    if (target < 0 || target >= segments.length) return
    ;[segments[index], segments[target]] = [segments[target], segments[index]]
    onChange({ ...station, segments })
  }

  const addSegment = (segment: Segment) => {
    onChange({ ...station, segments: [...station.segments, segment] })
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-4 py-3">
        <button
          type="button"
          {...dragHandleProps}
          className="cursor-grab text-slate-400 hover:text-slate-600 active:cursor-grabbing"
          aria-label="Húzd a sorrend módosításához"
        >
          <GripVertical className="h-5 w-5" />
        </button>
        <span className="flex-1 truncate font-semibold text-louvre-navy-700">
          {station.title || 'Névtelen állomás'}
        </span>
        <button
          type="button"
          onClick={onRemove}
          className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-red-500 hover:bg-red-50"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Állomás törlése
        </button>
      </div>

      <div className="space-y-4 p-4">
        <div className="grid gap-4 sm:grid-cols-[auto,1fr]">
          <CoverImageUpload value={station.coverImage ?? ''} onChange={(url) => onChange({ ...station, coverImage: url })} />

          <div className="grid gap-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-500">Cím</label>
              <input
                className={inputClass}
                value={station.title}
                onChange={(e) => {
                  const title = e.target.value
                  const shouldAutoSlug = !station.id || station.id === slugify(station.title)
                  onChange({ ...station, title, id: shouldAutoSlug ? slugify(title) : station.id })
                }}
                placeholder="pl. A szárnyas bika"
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-500">Azonosító (slug)</label>
                <input
                  className={inputClass}
                  value={station.id}
                  onChange={(e) => onChange({ ...station, id: slugify(e.target.value) })}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-500">Kódszó (a bónusz jelszó része)</label>
                <input
                  className={inputClass}
                  value={station.codeword}
                  onChange={(e) => onChange({ ...station, codeword: e.target.value.toUpperCase() })}
                />
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-500">
            Navigáció (terem / szárny -- ezt írja át Viktória, ha a Louvre átrendez)
          </label>
          <input
            className={inputClass}
            value={station.navigation}
            onChange={(e) => onChange({ ...station, navigation: e.target.value })}
            placeholder="pl. Richelieu szárny, földszint, 4. terem"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-500">
            Átirat (fallback szöveg -- akkor is olvasható, ha nem megy a hang, és SEO-hoz is kell)
          </label>
          <textarea
            className={inputClass}
            rows={4}
            value={station.transcript}
            onChange={(e) => onChange({ ...station, transcript: e.target.value })}
          />
        </div>

        <div className="border-t border-slate-100 pt-4">
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-400">
            Szegmensek (ebben a sorrendben szólal meg)
          </label>

          {station.segments.length === 0 && (
            <p className="mb-3 text-sm text-slate-400">Még nincs egy szegmens sem -- adj hozzá egyet lent.</p>
          )}

          <div className="space-y-3">
            {station.segments.map((segment, i) => (
              <SegmentEditor
                key={i}
                segment={segment}
                index={i}
                total={station.segments.length}
                stationId={station.id}
                availableAudioIds={availableAudioIds}
                onChange={(s) => updateSegment(i, s)}
                onRemove={() => removeSegment(i)}
                onMove={(dir) => moveSegment(i, dir)}
              />
            ))}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => addSegment(emptyAudioSegment())}
              className="flex items-center gap-1 rounded-full border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-louvre-gold-500 hover:text-louvre-navy-700"
            >
              <Mic className="h-3.5 w-3.5" /> Hangszegmens
            </button>
            <button
              type="button"
              onClick={() => addSegment(emptyPauseSegment())}
              className="flex items-center gap-1 rounded-full border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-louvre-gold-500 hover:text-louvre-navy-700"
            >
              <Timer className="h-3.5 w-3.5" /> Csend / feladat
            </button>
            <button
              type="button"
              onClick={() => addSegment(emptyChoiceSegment())}
              className="flex items-center gap-1 rounded-full border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-louvre-gold-500 hover:text-louvre-navy-700"
            >
              <GitBranch className="h-3.5 w-3.5" /> Elágazás
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
