'use client'

import { Sparkles, Wand2 } from 'lucide-react'
import type { Station, TourBonus } from '@/lib/louvre/types'
import { suggestBonusPhrase } from '@/lib/louvre/manifest-admin'
import AudioUploadField from './AudioUploadField'

interface Props {
  bonus: TourBonus
  stations: Station[]
  onChange: (bonus: TourBonus) => void
}

const inputClass =
  'w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-louvre-gold-500 focus:ring-1 focus:ring-louvre-gold-500'

export default function BonusEditor({ bonus, stations, onChange }: Props) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-louvre-gold-500 bg-louvre-gold-50 p-4">
      <div className="mb-3 flex items-center gap-2 font-semibold text-louvre-navy-700">
        <Sparkles className="h-5 w-5 text-louvre-gold-700" />
        Bónuszsáv
      </div>

      <div className="mb-3">
        <label className="mb-1 block text-xs font-semibold text-slate-500">Feloldó jelszó</label>
        <div className="flex gap-2">
          <input
            className={inputClass}
            value={bonus.unlockPhrase}
            onChange={(e) => onChange({ ...bonus, unlockPhrase: e.target.value })}
            placeholder="pl. ŐRZŐ TOLVAJ TITOK"
          />
          <button
            type="button"
            onClick={() => onChange({ ...bonus, unlockPhrase: suggestBonusPhrase(stations) })}
            className="flex items-center gap-1 whitespace-nowrap rounded-lg border border-louvre-navy-700 px-3 py-2 text-xs font-semibold text-louvre-navy-700 hover:bg-louvre-navy-700 hover:text-white"
          >
            <Wand2 className="h-3.5 w-3.5" />
            Kitöltés kódszavakból
          </button>
        </div>
        <p className="mt-1 text-xs text-slate-500">Alapértelmezésben az állomások kódszavai sorrendben, szóközzel elválasztva.</p>
      </div>

      <AudioUploadField
        src={bonus.audio}
        duration={bonus.duration ?? 0}
        pathHint="bonus"
        onChange={(src, duration) => onChange({ ...bonus, audio: src, duration })}
      />
    </div>
  )
}
