'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Copy, Plus } from 'lucide-react'
import { createTripPlan, getTripPlan, updateTripPlan } from '@/lib/actions/trip-plans'
import { mockDestinationId } from '@/lib/planner/mock-catalog'
import { createEmptyTripPlanDay, emptyTripPlanDraft, type TripPlanDraft } from '@/lib/planner/trip-plan-types'
import DayEditor from '../_components/DayEditor'

export default function TripPlanEditorPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const isNew = params.id === 'new'

  const [draft, setDraft] = useState<TripPlanDraft | null>(isNew ? emptyTripPlanDraft() : null)
  const [planId, setPlanId] = useState<string | null>(isNew ? null : params.id)
  const [shareToken, setShareToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(!isNew)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    if (isNew) return
    getTripPlan(params.id).then((result) => {
      if (result.plan) {
        const { id, destinationId, shareToken: token, createdAt, updatedAt, ...rest } = result.plan
        setDraft(rest)
        setPlanId(id)
        setShareToken(token)
      } else {
        setMessage(`Hiba: ${result.error}`)
      }
      setIsLoading(false)
    })
  }, [isNew, params.id])

  function updateDraft(patch: Partial<TripPlanDraft>) {
    setDraft((current) => (current ? { ...current, ...patch } : current))
  }

  function updateDay(index: number, day: TripPlanDraft['days'][number]) {
    if (!draft) return
    updateDraft({ days: draft.days.map((d, i) => (i === index ? day : d)) })
  }

  function addDay() {
    if (!draft) return
    updateDraft({ days: [...draft.days, createEmptyTripPlanDay(`${draft.days.length + 1}. nap`)] })
  }

  function removeDay(index: number) {
    if (!draft) return
    updateDraft({ days: draft.days.filter((_, i) => i !== index) })
  }

  function moveDay(index: number, direction: -1 | 1) {
    if (!draft) return
    const target = index + direction
    if (target < 0 || target >= draft.days.length) return
    const days = [...draft.days]
    ;[days[index], days[target]] = [days[target], days[index]]
    updateDraft({ days })
  }

  async function handleSave(publish?: boolean) {
    if (!draft) return
    setIsSaving(true)
    setMessage(null)

    const toSave: TripPlanDraft = publish === undefined ? draft : { ...draft, isPublished: publish }

    const result = planId ? await updateTripPlan(planId, toSave) : await createTripPlan(mockDestinationId, toSave)

    setIsSaving(false)

    if (!result.success) {
      setMessage(`Hiba: ${result.error}`)
      return
    }

    setDraft(toSave)
    if (result.id) setPlanId(result.id)
    if (result.shareToken) setShareToken(result.shareToken)
    setMessage('Mentve.')

    if (isNew && result.id) {
      router.replace(`/admin/programtervek/${result.id}`)
    }
  }

  if (isLoading || !draft) {
    return <p className="font-montserrat text-sm text-parisian-grey-500">Betöltés...</p>
  }

  const shareUrl = shareToken ? `${typeof window !== 'undefined' ? window.location.origin : ''}/programterv/${shareToken}` : null

  return (
    <div className="mx-auto max-w-3xl pb-16">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-playfair text-2xl font-bold text-parisian-grey-800">
          {isNew ? 'Új programterv' : 'Programterv szerkesztése'}
        </h1>
        {message && <span className="font-montserrat text-sm text-parisian-grey-500">{message}</span>}
      </div>

      <div className="mb-6 flex items-center justify-between rounded-2xl border-2 border-parisian-beige-200 bg-parisian-cream-50 p-5">
        <div>
          <p className="font-montserrat text-sm font-semibold text-parisian-grey-800">Ez egy újrafelhasználható sablon</p>
          <p className="mt-0.5 font-montserrat text-xs text-parisian-grey-500">
            Sablon esetén a /programtervezo oldalon kártyaként jelenik meg, bárki kiválaszthatja. Ha kikapcsolod, ez egy
            adott foglaláshoz tartozó egyedi terv lesz, amit privát linken küldesz ki.
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={draft.isTemplate}
          onClick={() => updateDraft({ isTemplate: !draft.isTemplate })}
          className={`relative h-7 w-12 flex-shrink-0 rounded-full transition-colors ${
            draft.isTemplate ? 'bg-parisian-beige-400' : 'bg-parisian-grey-200'
          }`}
        >
          <span
            className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-transform ${
              draft.isTemplate ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {draft.isTemplate && (
        <div className="mb-6 space-y-4 rounded-2xl border-2 border-parisian-beige-200 bg-white p-6">
          <label className="block">
            <span className="mb-1.5 block font-montserrat text-sm font-medium text-parisian-grey-700">
              Sablon címe (a kártyán jelenik meg)
            </span>
            <input
              type="text"
              value={draft.templateTitle}
              onChange={(e) => updateDraft({ templateTitle: e.target.value })}
              placeholder="Klasszikus 3 éj / 4 nap"
              className="w-full rounded-xl border-2 border-parisian-beige-200 px-4 py-2.5 font-montserrat text-sm outline-none focus:border-parisian-beige-400"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block font-montserrat text-sm font-medium text-parisian-grey-700">Rövid leírás a kártyán</span>
            <textarea
              value={draft.templateTeaser}
              onChange={(e) => updateDraft({ templateTeaser: e.target.value })}
              rows={2}
              placeholder="A klasszikus párizsi kőrút -- Eiffel-torony, Louvre, Montmartre."
              className="w-full rounded-xl border-2 border-parisian-beige-200 px-4 py-3 font-montserrat text-sm outline-none focus:border-parisian-beige-400"
            />
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="mb-1.5 block font-montserrat text-sm font-medium text-parisian-grey-700">Kép URL a kártyához</span>
              <input
                type="text"
                value={draft.templateImage}
                onChange={(e) => updateDraft({ templateImage: e.target.value })}
                placeholder="/images/stock1.jpeg"
                className="w-full rounded-xl border-2 border-parisian-beige-200 px-4 py-2.5 font-montserrat text-sm outline-none focus:border-parisian-beige-400"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block font-montserrat text-sm font-medium text-parisian-grey-700">Sorrend</span>
              <input
                type="number"
                value={draft.sortOrder}
                onChange={(e) => updateDraft({ sortOrder: Number(e.target.value) || 0 })}
                className="w-full rounded-xl border-2 border-parisian-beige-200 px-4 py-2.5 font-montserrat text-sm outline-none focus:border-parisian-beige-400"
              />
            </label>
          </div>
        </div>
      )}

      <div className="space-y-6 rounded-2xl border-2 border-parisian-beige-200 bg-white p-6">
        {!draft.isTemplate && (
          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="mb-1.5 block font-montserrat text-sm font-medium text-parisian-grey-700">Vendég neve</span>
              <input
                type="text"
                value={draft.guestName}
                onChange={(e) => updateDraft({ guestName: e.target.value })}
                className="w-full rounded-xl border-2 border-parisian-beige-200 px-4 py-2.5 font-montserrat text-sm outline-none focus:border-parisian-beige-400"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block font-montserrat text-sm font-medium text-parisian-grey-700">Létszám</span>
              <input
                type="number"
                min={1}
                value={draft.headcount ?? ''}
                onChange={(e) => updateDraft({ headcount: e.target.value ? Number(e.target.value) : null })}
                className="w-full rounded-xl border-2 border-parisian-beige-200 px-4 py-2.5 font-montserrat text-sm outline-none focus:border-parisian-beige-400"
              />
            </label>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="mb-1.5 block font-montserrat text-sm font-medium text-parisian-grey-700">
              {draft.isTemplate ? 'Időtartam (pl. "3 éjszaka / 4 nap")' : 'Dátumtartomány'}
            </span>
            <input
              type="text"
              value={draft.dateRangeLabel}
              onChange={(e) => updateDraft({ dateRangeLabel: e.target.value })}
              placeholder={draft.isTemplate ? '3 éjszaka / 4 nap' : '2026.07.11-07.14.'}
              className="w-full rounded-xl border-2 border-parisian-beige-200 px-4 py-2.5 font-montserrat text-sm outline-none focus:border-parisian-beige-400"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block font-montserrat text-sm font-medium text-parisian-grey-700">Szállás</span>
            <input
              type="text"
              value={draft.accommodation}
              onChange={(e) => updateDraft({ accommodation: e.target.value })}
              className="w-full rounded-xl border-2 border-parisian-beige-200 px-4 py-2.5 font-montserrat text-sm outline-none focus:border-parisian-beige-400"
            />
          </label>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <h2 className="font-montserrat text-sm font-semibold uppercase tracking-wider text-parisian-beige-600">Napok</h2>
        {draft.days.map((day, index) => (
          <DayEditor
            key={day.id}
            day={day}
            index={index}
            isFirst={index === 0}
            isLast={index === draft.days.length - 1}
            onChange={(d) => updateDay(index, d)}
            onRemove={() => removeDay(index)}
            onMoveUp={() => moveDay(index, -1)}
            onMoveDown={() => moveDay(index, 1)}
          />
        ))}
        <button
          type="button"
          onClick={addDay}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-parisian-beige-300 py-4 font-montserrat text-sm font-medium text-parisian-grey-500 hover:border-parisian-beige-400 hover:text-parisian-grey-700"
        >
          <Plus className="h-4 w-4" />
          Nap hozzáadása
        </button>
      </div>

      <div className="mt-6 rounded-2xl border-2 border-parisian-beige-200 bg-white p-6">
        <label className="block">
          <span className="mb-1.5 block font-montserrat text-sm font-medium text-parisian-grey-700">
            Kurátori záró üzenet (a programterv alján jelenik meg)
          </span>
          <textarea
            value={draft.curatorMessage}
            onChange={(e) => updateDraft({ curatorMessage: e.target.value })}
            rows={2}
            className="w-full rounded-xl border-2 border-parisian-beige-200 px-4 py-3 font-montserrat text-sm outline-none focus:border-parisian-beige-400"
          />
        </label>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3 rounded-2xl border-2 border-parisian-beige-200 bg-parisian-cream-50 p-6">
        <button
          type="button"
          onClick={() => handleSave()}
          disabled={isSaving}
          className="rounded-full border-2 border-parisian-beige-300 px-6 py-2.5 font-montserrat text-sm font-semibold text-parisian-grey-700 hover:border-parisian-beige-400 disabled:opacity-50"
        >
          {isSaving ? 'Mentés...' : 'Vázlat mentése'}
        </button>
        <button
          type="button"
          onClick={() => handleSave(true)}
          disabled={isSaving}
          className="rounded-full bg-parisian-beige-400 px-6 py-2.5 font-montserrat text-sm font-semibold text-white hover:bg-parisian-beige-500 disabled:opacity-50"
        >
          {isSaving ? 'Mentés...' : draft.isPublished ? 'Frissítés' : 'Közzététel'}
        </button>

        {draft.isPublished && shareUrl && (
          <div className="flex flex-1 items-center gap-2 rounded-full bg-white px-4 py-2">
            <span className="min-w-0 flex-1 truncate font-montserrat text-xs text-parisian-grey-500">{shareUrl}</span>
            <button
              type="button"
              onClick={() => navigator.clipboard.writeText(shareUrl)}
              className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-parisian-grey-400 hover:bg-parisian-beige-50 hover:text-parisian-grey-700"
              aria-label="Link másolása"
            >
              <Copy className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
