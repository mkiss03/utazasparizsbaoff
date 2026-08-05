'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'
import { getQuizConfig, saveQuizConfig } from '@/lib/actions/quiz-config'
import { mockDestinationId } from '@/lib/planner/mock-catalog'
import {
  defaultQuizConfig,
  type AttractionCategory,
  type QuizConfig,
} from '@/lib/planner/quiz-config-types'

const CATEGORY_LABELS: Record<AttractionCategory, string> = {
  ticketed: 'Belépőjegyes',
  free: 'Ingyenes',
  disneyland: 'Disneyland',
}

function slugify(label: string): string {
  const withoutDiacritics = label
    .normalize('NFD')
    .split('')
    .filter((char) => {
      const code = char.charCodeAt(0)
      return code < 0x0300 || code > 0x036f // kombináló ékezet-jelek kiszűrése
    })
    .join('')
  return withoutDiacritics
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export default function QuizConfigPage() {
  const [config, setConfig] = useState<QuizConfig | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    getQuizConfig(mockDestinationId)
      .then((result) => setConfig(result.config))
      .catch(() => setConfig(defaultQuizConfig()))
  }, [])

  async function handleSave() {
    if (!config) return
    setIsSaving(true)
    setMessage(null)
    const result = await saveQuizConfig(mockDestinationId, config)
    setIsSaving(false)
    setMessage(result.success ? 'Mentve.' : `Hiba: ${result.error}`)
  }

  function addAttraction() {
    if (!config) return
    const label = 'Új nevezetesség'
    let tag = slugify(label)
    let suffix = 2
    while (config.attractions.some((a) => a.tag === tag)) {
      tag = `${slugify(label)}-${suffix}`
      suffix += 1
    }
    setConfig({ ...config, attractions: [...config.attractions, { tag, label, category: 'ticketed' }] })
  }

  function updateAttraction(index: number, patch: Partial<QuizConfig['attractions'][number]>) {
    if (!config) return
    setConfig({
      ...config,
      attractions: config.attractions.map((a, i) => (i === index ? { ...a, ...patch } : a)),
    })
  }

  function removeAttraction(index: number) {
    if (!config) return
    setConfig({ ...config, attractions: config.attractions.filter((_, i) => i !== index) })
  }

  if (!config) {
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

      <h1 className="mb-1 font-playfair text-2xl font-bold text-parisian-grey-800">A kérdéssor szerkesztése</h1>
      <p className="mb-6 font-montserrat text-sm text-parisian-grey-500">
        Itt írhatod át a /programtervezo kérdéseinek szövegét, válaszlehetőségeit, és a
        nevezetesség-listát -- kódmódosítás nélkül.
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

      <Section title="1. Mikor terveznétek utazni? (naptár)">
        <TextField
          label="Cím"
          value={config.when.title}
          onChange={(v) => setConfig({ ...config, when: { ...config.when, title: v } })}
        />
        <TextField
          label="Alcím"
          value={config.when.subtitle}
          onChange={(v) => setConfig({ ...config, when: { ...config.when, subtitle: v } })}
        />
      </Section>

      <Section title="2. Repülőjegy">
        <TextField
          label="Cím"
          value={config.flight.title}
          onChange={(v) => setConfig({ ...config, flight: { ...config.flight, title: v } })}
        />
        <TextField
          label="Alcím"
          value={config.flight.subtitle}
          onChange={(v) => setConfig({ ...config, flight: { ...config.flight, subtitle: v } })}
        />
        <p className="mb-2 font-montserrat text-xs font-medium text-parisian-grey-700">Válaszlehetőségek</p>
        <div className="space-y-2">
          {config.flight.options.map((option, index) => (
            <TextField
              key={option.value}
              label={option.value}
              value={option.label}
              onChange={(v) =>
                setConfig({
                  ...config,
                  flight: {
                    ...config.flight,
                    options: config.flight.options.map((o, i) => (i === index ? { ...o, label: v } : o)),
                  },
                })
              }
            />
          ))}
        </div>
      </Section>

      <Section title="3. Szállás">
        <TextField
          label="Cím"
          value={config.hotel.title}
          onChange={(v) => setConfig({ ...config, hotel: { ...config.hotel, title: v } })}
        />
        <TextField
          label="Alcím"
          value={config.hotel.subtitle}
          onChange={(v) => setConfig({ ...config, hotel: { ...config.hotel, subtitle: v } })}
        />
        <TextField
          label="Hotel/apartman kérdés szövege"
          value={config.hotel.typeQuestionLabel}
          onChange={(v) => setConfig({ ...config, hotel: { ...config.hotel, typeQuestionLabel: v } })}
        />
        <div className="grid grid-cols-2 gap-3">
          {config.hotel.typeOptions.map((option, index) => (
            <TextField
              key={option.value}
              label={option.value}
              value={option.label}
              onChange={(v) =>
                setConfig({
                  ...config,
                  hotel: {
                    ...config.hotel,
                    typeOptions: config.hotel.typeOptions.map((o, i) => (i === index ? { ...o, label: v } : o)),
                  },
                })
              }
            />
          ))}
        </div>
        <TextField
          label="Párizs/Disneyland kérdés szövege"
          value={config.hotel.locationQuestionLabel}
          onChange={(v) => setConfig({ ...config, hotel: { ...config.hotel, locationQuestionLabel: v } })}
        />
        <div className="grid grid-cols-2 gap-3">
          {config.hotel.locationOptions.map((option, index) => (
            <TextField
              key={option.value}
              label={option.value}
              value={option.label}
              onChange={(v) =>
                setConfig({
                  ...config,
                  hotel: {
                    ...config.hotel,
                    locationOptions: config.hotel.locationOptions.map((o, i) =>
                      i === index ? { ...o, label: v } : o
                    ),
                  },
                })
              }
            />
          ))}
        </div>
      </Section>

      <Section title="4. Költségkeret">
        <TextField
          label="Cím"
          value={config.budget.title}
          onChange={(v) => setConfig({ ...config, budget: { ...config.budget, title: v } })}
        />
        <TextField
          label="Alcím"
          value={config.budget.subtitle}
          onChange={(v) => setConfig({ ...config, budget: { ...config.budget, subtitle: v } })}
        />
        <div className="space-y-3">
          {config.budget.options.map((option, index) => (
            <div key={option.value ?? 'any'} className="rounded-xl border-2 border-parisian-beige-100 p-3">
              <p className="mb-1.5 font-montserrat text-xs font-semibold text-parisian-grey-500">
                {option.value ?? 'bármelyik'}
              </p>
              <TextField
                label="Cím"
                value={option.title}
                onChange={(v) =>
                  setConfig({
                    ...config,
                    budget: {
                      ...config.budget,
                      options: config.budget.options.map((o, i) => (i === index ? { ...o, title: v } : o)),
                    },
                  })
                }
              />
              <TextField
                label="Leírás"
                value={option.description}
                onChange={(v) =>
                  setConfig({
                    ...config,
                    budget: {
                      ...config.budget,
                      options: config.budget.options.map((o, i) => (i === index ? { ...o, description: v } : o)),
                    },
                  })
                }
              />
            </div>
          ))}
        </div>
      </Section>

      <Section title="5. Nevezetességek">
        <TextField
          label="Cím"
          value={config.highlights.title}
          onChange={(v) => setConfig({ ...config, highlights: { ...config.highlights, title: v } })}
        />
        <TextField
          label="Alcím"
          value={config.highlights.subtitle}
          onChange={(v) => setConfig({ ...config, highlights: { ...config.highlights, subtitle: v } })}
        />
        <div className="space-y-2">
          {config.attractions.map((attraction, index) => (
            <div key={attraction.tag} className="flex items-center gap-2">
              <input
                type="text"
                value={attraction.label}
                onChange={(e) => updateAttraction(index, { label: e.target.value })}
                className="flex-1 rounded-lg border-2 border-parisian-beige-200 px-3 py-2 font-montserrat text-sm outline-none focus:border-parisian-beige-400"
              />
              <select
                value={attraction.category}
                onChange={(e) => updateAttraction(index, { category: e.target.value as AttractionCategory })}
                disabled={attraction.tag === 'disneyland'}
                className="rounded-lg border-2 border-parisian-beige-200 px-2 py-2 font-montserrat text-xs outline-none focus:border-parisian-beige-400 disabled:opacity-50"
              >
                {(Object.keys(CATEGORY_LABELS) as AttractionCategory[]).map((cat) => (
                  <option key={cat} value={cat}>
                    {CATEGORY_LABELS[cat]}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => removeAttraction(index)}
                className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-parisian-grey-400 hover:bg-french-red-50 hover:text-french-red-600"
                aria-label="Törlés"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addAttraction}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-parisian-beige-300 py-3 font-montserrat text-sm font-medium text-parisian-grey-500 hover:border-parisian-beige-400 hover:text-parisian-grey-700"
        >
          <Plus className="h-4 w-4" />
          Nevezetesség hozzáadása
        </button>
      </Section>

      <Section title="6. Disneyland-intenzitás (csak akkor jelenik meg, ha a vendég a Disneylandet választja)">
        <TextField
          label="Cím"
          value={config.disney.title}
          onChange={(v) => setConfig({ ...config, disney: { ...config.disney, title: v } })}
        />
        <div className="space-y-3">
          {config.disney.options.map((option, index) => (
            <div key={option.value ?? 'any'} className="rounded-xl border-2 border-parisian-beige-100 p-3">
              <p className="mb-1.5 font-montserrat text-xs font-semibold text-parisian-grey-500">
                {option.value ?? 'bármelyik'}
              </p>
              <TextField
                label="Cím"
                value={option.title}
                onChange={(v) =>
                  setConfig({
                    ...config,
                    disney: {
                      ...config.disney,
                      options: config.disney.options.map((o, i) => (i === index ? { ...o, title: v } : o)),
                    },
                  })
                }
              />
              <TextField
                label="Leírás"
                value={option.description}
                onChange={(v) =>
                  setConfig({
                    ...config,
                    disney: {
                      ...config.disney,
                      options: config.disney.options.map((o, i) => (i === index ? { ...o, description: v } : o)),
                    },
                  })
                }
              />
            </div>
          ))}
        </div>
      </Section>

      <button
        type="button"
        onClick={handleSave}
        disabled={isSaving}
        className="rounded-full bg-parisian-beige-400 px-6 py-2.5 font-montserrat text-sm font-semibold text-white hover:bg-parisian-beige-500 disabled:opacity-50"
      >
        {isSaving ? 'Mentés...' : 'Mentés'}
      </button>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6 space-y-3 rounded-2xl border-2 border-parisian-beige-200 bg-white p-6">
      <h2 className="font-montserrat text-sm font-semibold uppercase tracking-wider text-parisian-beige-600">{title}</h2>
      {children}
    </div>
  )
}

function TextField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="mb-1 block font-montserrat text-xs font-medium text-parisian-grey-700">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border-2 border-parisian-beige-200 px-3 py-2 font-montserrat text-sm outline-none focus:border-parisian-beige-400"
      />
    </label>
  )
}
