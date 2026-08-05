'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'
import { getGuideContent, saveGuideContent } from '@/lib/actions/guide-content'
import { mockDestinationId } from '@/lib/planner/mock-catalog'
import { createEmptyGuideTip, emptyGuideContent, type GuideContent } from '@/lib/planner/guide-content-types'

export default function GuideContentPage() {
  const [content, setContent] = useState<GuideContent | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    getGuideContent(mockDestinationId)
      .then((result) => setContent(result.content))
      .catch(() => setContent(emptyGuideContent()))
  }, [])

  function updateFlightTip(index: number, patch: Partial<GuideContent['flightTips'][number]>) {
    if (!content) return
    setContent({
      ...content,
      flightTips: content.flightTips.map((tip, i) => (i === index ? { ...tip, ...patch } : tip)),
    })
  }

  function updateHotelTip(index: number, patch: Partial<GuideContent['hotelTips'][number]>) {
    if (!content) return
    setContent({
      ...content,
      hotelTips: content.hotelTips.map((tip, i) => (i === index ? { ...tip, ...patch } : tip)),
    })
  }

  async function handleSave() {
    if (!content) return
    setIsSaving(true)
    setMessage(null)
    const result = await saveGuideContent(mockDestinationId, content)
    setIsSaving(false)
    setMessage(result.success ? 'Mentve.' : `Hiba: ${result.error}`)
  }

  if (!content) {
    return <p className="font-montserrat text-sm text-parisian-grey-500">Betöltés...</p>
  }

  return (
    <div className="mx-auto max-w-3xl pb-16">
      <Link
        href="/admin/programtervek"
        className="mb-4 flex items-center gap-1.5 font-montserrat text-sm text-parisian-grey-500 hover:text-parisian-grey-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Vissza a programtervekhez
      </Link>

      <h1 className="mb-1 font-playfair text-2xl font-bold text-parisian-grey-800">Repülőjegy- és szállás-útmutató</h1>
      <p className="mb-6 font-montserrat text-sm text-parisian-grey-500">
        Ez a tartalom jelenik meg a /programtervezo kérdéssorában, a repülőjegy- és szállásfoglalás lépésnél --
        tippek, tanácsok, amit a vendégnek mondanál el, mielőtt lefoglalja.
      </p>

      {message && (
        <div
          className={`mb-6 rounded-xl border-2 px-4 py-3 font-montserrat text-sm ${
            message.startsWith('Hiba')
              ? 'border-french-red-200 bg-french-red-50 text-french-red-600'
              : 'border-green-200 bg-green-50 text-green-700'
          }`}
        >
          {message}
        </div>
      )}

      <TipListEditor
        title="Repülőjegy-tippek"
        tips={content.flightTips}
        onChange={(tips) => setContent({ ...content, flightTips: tips })}
        onUpdate={updateFlightTip}
      />

      <div className="mt-6">
        <TipListEditor
          title="Szállás-tippek"
          tips={content.hotelTips}
          onChange={(tips) => setContent({ ...content, hotelTips: tips })}
          onUpdate={updateHotelTip}
        />
      </div>

      <div className="mt-6">
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="rounded-full bg-parisian-beige-400 px-6 py-2.5 font-montserrat text-sm font-semibold text-white hover:bg-parisian-beige-500 disabled:opacity-50"
        >
          {isSaving ? 'Mentés...' : 'Mentés'}
        </button>
      </div>
    </div>
  )
}

function TipListEditor({
  title,
  tips,
  onChange,
  onUpdate,
}: {
  title: string
  tips: GuideContent['flightTips']
  onChange: (tips: GuideContent['flightTips']) => void
  onUpdate: (index: number, patch: Partial<GuideContent['flightTips'][number]>) => void
}) {
  return (
    <div className="rounded-2xl border-2 border-parisian-beige-200 bg-white p-6">
      <h2 className="mb-4 font-montserrat text-sm font-semibold uppercase tracking-wider text-parisian-beige-600">
        {title}
      </h2>
      <div className="space-y-4">
        {tips.map((tip, index) => (
          <div key={index} className="rounded-xl border-2 border-parisian-beige-100 p-4">
            <div className="mb-2 flex items-center justify-between gap-2">
              <input
                type="text"
                value={tip.title}
                onChange={(e) => onUpdate(index, { title: e.target.value })}
                placeholder="Tipp címe"
                className="flex-1 rounded-lg border-2 border-parisian-beige-200 px-3 py-2 font-montserrat text-sm font-medium outline-none focus:border-parisian-beige-400"
              />
              <button
                type="button"
                onClick={() => onChange(tips.filter((_, i) => i !== index))}
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-parisian-grey-400 hover:bg-french-red-50 hover:text-french-red-600"
                aria-label="Tipp törlése"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <textarea
              value={tip.description}
              onChange={(e) => onUpdate(index, { description: e.target.value })}
              rows={2}
              placeholder="Rövid tanács..."
              className="w-full rounded-lg border-2 border-parisian-beige-200 px-3 py-2 font-montserrat text-sm outline-none focus:border-parisian-beige-400"
            />
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => onChange([...tips, createEmptyGuideTip()])}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-parisian-beige-300 py-3 font-montserrat text-sm font-medium text-parisian-grey-500 hover:border-parisian-beige-400 hover:text-parisian-grey-700"
      >
        <Plus className="h-4 w-4" />
        Tipp hozzáadása
      </button>
    </div>
  )
}
