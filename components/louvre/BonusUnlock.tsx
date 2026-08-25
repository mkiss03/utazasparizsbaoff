'use client'

import { useState } from 'react'
import { Lock, Unlock, Play } from 'lucide-react'
import type { TourBonus } from '@/lib/louvre/types'

interface Props {
  bonus: TourBonus
  collectedCodewords: string[]
  unlocked: boolean
  onUnlock: () => void
}

function normalize(phrase: string) {
  return phrase
    .trim()
    .toUpperCase()
    .replace(/\s+/g, ' ')
}

export default function BonusUnlock({ bonus, collectedCodewords, unlocked, onUnlock }: Props) {
  const [input, setInput] = useState('')
  const [error, setError] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (normalize(input) === normalize(bonus.unlockPhrase)) {
      setError(false)
      onUnlock()
    } else {
      setError(true)
    }
  }

  return (
    <div className="mx-auto max-w-xl rounded-2xl border-2 border-louvre-navy-700 bg-louvre-navy-700 p-8 text-center text-white">
      {unlocked ? (
        <>
          <Unlock className="mx-auto mb-3 h-10 w-10 text-louvre-gold-500" />
          <h2 className="mb-4 font-playfair text-2xl font-bold">Bónuszsáv feloldva!</h2>
          <audio controls autoPlay src={bonus.audio} className="mx-auto w-full max-w-sm" />
        </>
      ) : (
        <>
          <Lock className="mx-auto mb-3 h-10 w-10 text-louvre-gold-500" />
          <h2 className="mb-2 font-playfair text-2xl font-bold">Bónuszsáv</h2>
          <p className="mb-4 text-sm text-louvre-navy-100">
            Írd be a 3 kódszót, amit az állomásokon gyűjtöttél, ebben a sorrendben:{' '}
            {'sarnyas-bika → mona-lisa → napoleon-koronazasa'}.
          </p>
          <p className="mb-6 text-xs text-louvre-navy-100">
            Eddig begyűjtött szavak: {collectedCodewords.length > 0 ? collectedCodewords.join(' · ') : '--'}
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col items-center gap-3">
            <input
              value={input}
              onChange={(e) => {
                setInput(e.target.value)
                setError(false)
              }}
              placeholder="pl. ŐRZŐ TOLVAJ TITOK"
              className="w-full rounded-full border-2 border-louvre-gold-500 bg-white/10 px-5 py-3 text-center font-semibold uppercase tracking-wide text-white placeholder:text-louvre-navy-100 focus:outline-none focus:ring-2 focus:ring-louvre-gold-500"
            />
            {error && <p className="text-sm text-red-300">Nem stimmel a jelszó -- próbáld újra.</p>}
            <button
              type="submit"
              className="flex items-center gap-2 rounded-full bg-louvre-gold-500 px-6 py-3 font-semibold text-louvre-navy-700 hover:opacity-90"
            >
              <Play className="h-4 w-4" />
              Feloldás
            </button>
          </form>
        </>
      )}
    </div>
  )
}
