'use client'

import { useState } from 'react'
import { saveDraftAsRequest } from '@/lib/actions/planner'
import { generateItinerary } from '@/lib/planner/engine'
import { mockCatalog, mockDestinationId, mockRules } from '@/lib/planner/mock-catalog'
import type { ItineraryDraft, Pace, TravelerPreferences } from '@/lib/planner/types'

const ALL_INTERESTS = Array.from(
  new Set(mockCatalog.items.flatMap((item) => [item.category, ...item.tags]))
).sort()

const PACE_OPTIONS: { value: Pace; label: string }[] = [
  { value: 'relaxed', label: 'Ráérős flâneur' },
  { value: 'moderate', label: 'Mérsékelt tempó' },
  { value: 'packed', label: 'Mindent látni akarok' },
]

export default function PlannerLabsPage() {
  const [days, setDays] = useState(4)
  const [pace, setPace] = useState<Pace>('moderate')
  const [interests, setInterests] = useState<string[]>(['muveszet', 'gasztro'])
  const [weatherFallback, setWeatherFallback] = useState(false)
  const [startDate, setStartDate] = useState('')

  const [draft, setDraft] = useState<ItineraryDraft | null>(null)
  const [view, setView] = useState<'list' | 'json'>('list')

  const [email, setEmail] = useState('')
  const [saveResult, setSaveResult] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  function toggleInterest(interest: string) {
    setInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    )
  }

  function handleGenerate() {
    const preferences: TravelerPreferences = {
      days,
      pace,
      interests,
      startDate: startDate || undefined,
      weatherFallback,
    }
    const result = generateItinerary(mockCatalog, mockRules, preferences)
    setDraft(result)
    setSaveResult(null)
  }

  async function handleSaveAsRequest() {
    if (!draft || !email) return
    setSaving(true)
    setSaveResult(null)
    const result = await saveDraftAsRequest({
      destinationSlug: mockDestinationId,
      contactEmail: email,
      draft,
    })
    setSaving(false)
    setSaveResult(
      result.success
        ? `Mentve. request_id=${result.requestId} itinerary_id=${result.itineraryId}`
        : `Hiba: ${result.error}`
    )
  }

  return (
    <main className="min-h-screen bg-parisian-grey-50 p-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-2xl font-bold text-parisian-grey-900">
          Programszervező -- fejlesztői playground
        </h1>
        <p className="mt-1 text-sm text-parisian-grey-600">
          A motor mock katalógussal fut kliens oldalon. A produkciós adatréteg
          a `planner` sémában él -- lásd a tervdokumentumot.
        </p>

        <section className="mt-6 grid grid-cols-1 gap-6 rounded-lg bg-white p-6 shadow md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-parisian-grey-700">
              Napok száma
            </label>
            <input
              type="number"
              min={1}
              max={10}
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="mt-1 w-24 rounded border border-parisian-grey-300 px-3 py-1.5"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-parisian-grey-700">Tempó</label>
            <select
              value={pace}
              onChange={(e) => setPace(e.target.value as Pace)}
              className="mt-1 rounded border border-parisian-grey-300 px-3 py-1.5"
            >
              {PACE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-parisian-grey-700">
              Kezdő dátum (opcionális -- nyitvatartás-validációhoz)
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1 rounded border border-parisian-grey-300 px-3 py-1.5"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              id="weatherFallback"
              type="checkbox"
              checked={weatherFallback}
              onChange={(e) => setWeatherFallback(e.target.checked)}
            />
            <label htmlFor="weatherFallback" className="text-sm text-parisian-grey-700">
              Esős nap fallback (beltéri programok priorizálása)
            </label>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-parisian-grey-700">
              Érdeklődési kör
            </label>
            <div className="mt-2 flex flex-wrap gap-2">
              {ALL_INTERESTS.map((interest) => (
                <button
                  key={interest}
                  type="button"
                  onClick={() => toggleInterest(interest)}
                  className={`rounded-full border px-3 py-1 text-sm ${
                    interests.includes(interest)
                      ? 'border-french-blue-600 bg-french-blue-600 text-white'
                      : 'border-parisian-grey-300 bg-white text-parisian-grey-700'
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>
        </section>

        <div className="mt-4">
          <button
            type="button"
            onClick={handleGenerate}
            className="rounded bg-french-blue-700 px-5 py-2 font-semibold text-white hover:bg-french-blue-800"
          >
            Draft generálása
          </button>
        </div>

        {draft && (
          <section className="mt-8">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-parisian-grey-900">Generált draft</h2>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setView('list')}
                  className={`rounded px-3 py-1 text-sm ${view === 'list' ? 'bg-parisian-grey-900 text-white' : 'bg-parisian-grey-200'}`}
                >
                  Lista nézet
                </button>
                <button
                  type="button"
                  onClick={() => setView('json')}
                  className={`rounded px-3 py-1 text-sm ${view === 'json' ? 'bg-parisian-grey-900 text-white' : 'bg-parisian-grey-200'}`}
                >
                  Nyers JSON
                </button>
              </div>
            </div>

            {view === 'list' ? (
              <div className="mt-4 space-y-6">
                {draft.days.map((day) => (
                  <div key={day.dayIndex} className="rounded-lg bg-white p-4 shadow">
                    <h3 className="font-semibold text-parisian-grey-900">
                      {day.dayIndex + 1}. nap {day.date ? `-- ${day.date}` : ''}
                    </h3>
                    <ul className="mt-2 space-y-2">
                      {day.slots.map((slot) => (
                        <li key={slot.id} className="border-l-2 border-french-blue-500 pl-3">
                          <div className="text-sm text-parisian-grey-500">
                            {slot.startTime}-{slot.endTime} · {slot.timeOfDay}
                          </div>
                          <div className="font-medium text-parisian-grey-900">
                            {slot.item.title}
                          </div>
                          <div className="text-sm text-parisian-grey-600">{slot.reason}</div>
                          {slot.alternatives.length > 0 && (
                            <div className="mt-1 text-xs text-parisian-grey-500">
                              Alternatívák: {slot.alternatives.map((a) => a.title).join(', ')}
                            </div>
                          )}
                        </li>
                      ))}
                      {day.slots.length === 0 && (
                        <li className="text-sm text-parisian-grey-500">
                          Nincs illeszkedő program erre a napra.
                        </li>
                      )}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <pre className="mt-4 max-h-[600px] overflow-auto rounded-lg bg-parisian-grey-900 p-4 text-xs text-parisian-grey-100">
                {JSON.stringify(draft, null, 2)}
              </pre>
            )}

            <div className="mt-6 rounded-lg bg-white p-4 shadow">
              <h3 className="font-semibold text-parisian-grey-900">
                Draft mentése requestként (dev DB)
              </h3>
              <p className="mt-1 text-sm text-parisian-grey-600">
                Végigviszi az adatutat: planner.requests + planner.itineraries insert.
              </p>
              <div className="mt-3 flex items-center gap-2">
                <input
                  type="email"
                  placeholder="vendeg@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded border border-parisian-grey-300 px-3 py-1.5"
                />
                <button
                  type="button"
                  onClick={handleSaveAsRequest}
                  disabled={!email || saving}
                  className="rounded bg-parisian-grey-900 px-4 py-1.5 font-medium text-white disabled:opacity-50"
                >
                  {saving ? 'Mentés...' : 'Draft mentése requestként'}
                </button>
              </div>
              {saveResult && <p className="mt-2 text-sm text-parisian-grey-700">{saveResult}</p>}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
