'use client'

import { Trash2 } from 'lucide-react'
import type { EngineBinding, FlowNode, FlowNodeData, FlowOption } from '@/lib/planner/flow-types'
import { ICON_REGISTRY } from './templates/icons'

const BINDING_LABELS: Record<EngineBinding, string> = {
  none: 'Nincs -- csak Viktóriának szóló infó',
  'days-exact': 'Napok száma (pontos dátumból)',
  'days-approx': 'Napok száma (hozzávetőleges)',
  pace: 'Tempó',
  interests: 'Érdeklődés-tag-ek',
  budgetBand: 'Költségkeret-sáv',
}

function TextField({ label, value, onChange, multiline }: { label: string; value: string; onChange: (v: string) => void; multiline?: boolean }) {
  return (
    <label className="block">
      <span className="mb-1 block font-montserrat text-xs font-medium text-parisian-grey-600">{label}</span>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={2}
          className="w-full rounded-lg border border-parisian-beige-200 px-3 py-2 font-montserrat text-sm text-parisian-grey-800 outline-none focus:border-parisian-beige-400"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg border border-parisian-beige-200 px-3 py-2 font-montserrat text-sm text-parisian-grey-800 outline-none focus:border-parisian-beige-400"
        />
      )}
    </label>
  )
}

function BindingField({ value, onChange }: { value: EngineBinding; onChange: (v: EngineBinding) => void }) {
  return (
    <label className="block">
      <span className="mb-1 block font-montserrat text-xs font-medium text-parisian-grey-600">Mit befolyásol a motorban?</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as EngineBinding)}
        className="w-full rounded-lg border border-parisian-beige-200 px-3 py-2 font-montserrat text-sm text-parisian-grey-800 outline-none focus:border-parisian-beige-400"
      >
        {Object.entries(BINDING_LABELS).map(([key, label]) => (
          <option key={key} value={key}>
            {label}
          </option>
        ))}
      </select>
    </label>
  )
}

function OptionsEditor({ options, onChange }: { options: FlowOption[]; onChange: (options: FlowOption[]) => void }) {
  function update(index: number, patch: Partial<FlowOption>) {
    onChange(options.map((o, i) => (i === index ? { ...o, ...patch } : o)))
  }
  function remove(index: number) {
    onChange(options.filter((_, i) => i !== index))
  }
  function add() {
    const id = `opt-${Date.now()}`
    onChange([...options, { id, label: 'Új opció', value: id }])
  }

  return (
    <div>
      <span className="mb-1 block font-montserrat text-xs font-medium text-parisian-grey-600">Gombok / kártyák</span>
      <div className="space-y-3">
        {options.map((option, index) => (
          <div key={option.id} className="rounded-lg border border-parisian-beige-200 p-2.5">
            <div className="mb-1.5 flex items-center gap-2">
              <input
                type="text"
                value={option.label}
                onChange={(e) => update(index, { label: e.target.value })}
                placeholder="Felirat"
                className="flex-1 rounded border border-parisian-beige-200 px-2 py-1 font-montserrat text-sm outline-none focus:border-parisian-beige-400"
              />
              <button
                type="button"
                onClick={() => remove(index)}
                className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded text-parisian-grey-400 hover:bg-french-red-50 hover:text-french-red-500"
                aria-label="Opció törlése"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
            <input
              type="text"
              value={option.description ?? ''}
              onChange={(e) => update(index, { description: e.target.value })}
              placeholder="Alszöveg (opcionális)"
              className="mb-1.5 w-full rounded border border-parisian-beige-200 px-2 py-1 font-montserrat text-xs outline-none focus:border-parisian-beige-400"
            />
            <div className="flex items-center gap-2">
              <select
                value={option.icon ?? ''}
                onChange={(e) => update(index, { icon: e.target.value || undefined })}
                className="flex-1 rounded border border-parisian-beige-200 px-2 py-1 font-montserrat text-xs outline-none focus:border-parisian-beige-400"
              >
                <option value="">Ikon nélkül</option>
                {Object.keys(ICON_REGISTRY).map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={option.value ?? ''}
                onChange={(e) => update(index, { value: e.target.value })}
                placeholder="Motor-érték (pl. relaxed)"
                className="flex-1 rounded border border-parisian-beige-200 px-2 py-1 font-montserrat text-xs outline-none focus:border-parisian-beige-400"
              />
            </div>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={add}
        className="mt-2 w-full rounded-lg border-2 border-dashed border-parisian-beige-300 py-1.5 font-montserrat text-xs font-medium text-parisian-grey-500 hover:border-parisian-beige-400 hover:text-parisian-grey-700"
      >
        + Új opció
      </button>
    </div>
  )
}

export default function PropertyPanel({
  node,
  onChange,
  onDelete,
  onClose,
}: {
  node: FlowNode
  onChange: (data: FlowNodeData) => void
  onDelete: () => void
  onClose: () => void
}) {
  const data = node.data

  return (
    <div className="w-80 flex-shrink-0 overflow-y-auto border-l border-parisian-beige-200 bg-white p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-montserrat text-xs font-semibold uppercase tracking-wider text-parisian-grey-500">
          Kártya szerkesztése
        </h3>
        <button type="button" onClick={onClose} className="font-montserrat text-xs text-parisian-grey-400 hover:text-parisian-grey-700">
          Bezár
        </button>
      </div>

      <div className="space-y-4">
        <TextField label="Cím" value={data.title} onChange={(v) => onChange({ ...data, title: v })} />

        {'subtitle' in data && (
          <TextField
            label="Alcím"
            value={data.subtitle ?? ''}
            onChange={(v) => onChange({ ...data, subtitle: v })}
            multiline
          />
        )}

        {data.kind === 'hero' && (
          <>
            <TextField label="Háttérkép útvonala" value={data.backgroundImage} onChange={(v) => onChange({ ...data, backgroundImage: v })} />
            <TextField label="Gomb felirata" value={data.ctaLabel} onChange={(v) => onChange({ ...data, ctaLabel: v })} />
          </>
        )}

        {(data.kind === 'single-select' || data.kind === 'multi-select') && (
          <>
            <BindingField value={data.binding} onChange={(binding) => onChange({ ...data, binding })} />
            <OptionsEditor options={data.options} onChange={(options) => onChange({ ...data, options })} />
          </>
        )}

        {data.kind === 'single-select' && (
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={data.autoAdvance}
              onChange={(e) => onChange({ ...data, autoAdvance: e.target.checked })}
            />
            <span className="font-montserrat text-xs text-parisian-grey-600">Kattintásra azonnal lépjen tovább</span>
          </label>
        )}

        {data.kind === 'datetime-range' && (
          <>
            <TextField label="Érkezés mező felirata" value={data.startLabel} onChange={(v) => onChange({ ...data, startLabel: v })} />
            <TextField label="Hazautazás mező felirata" value={data.endLabel} onChange={(v) => onChange({ ...data, endLabel: v })} />
          </>
        )}

        {data.kind === 'month-counter' && (
          <TextField label="Hónap mező felirata" value={data.monthLabel} onChange={(v) => onChange({ ...data, monthLabel: v })} />
        )}

        {data.kind === 'free-text' && (
          <>
            <TextField label="Placeholder" value={data.placeholder} onChange={(v) => onChange({ ...data, placeholder: v })} />
            <TextField label="Megjegyzés (kis szöveg alatta)" value={data.noteLabel ?? ''} onChange={(v) => onChange({ ...data, noteLabel: v })} />
          </>
        )}

        {data.kind === 'swipe-cards' && (
          <label className="block">
            <span className="mb-1 block font-montserrat text-xs font-medium text-parisian-grey-600">Kártyák száma</span>
            <input
              type="number"
              min={2}
              max={12}
              value={data.cardCount}
              onChange={(e) => onChange({ ...data, cardCount: Number(e.target.value) })}
              className="w-full rounded-lg border border-parisian-beige-200 px-3 py-2 font-montserrat text-sm outline-none focus:border-parisian-beige-400"
            />
          </label>
        )}

        {data.kind === 'contact-form' && (
          <>
            <TextField label="Név mező placeholder" value={data.namePlaceholder} onChange={(v) => onChange({ ...data, namePlaceholder: v })} />
            <TextField label="Email mező placeholder" value={data.emailPlaceholder} onChange={(v) => onChange({ ...data, emailPlaceholder: v })} />
            <TextField label="Beküldés gomb felirata" value={data.submitLabel} onChange={(v) => onChange({ ...data, submitLabel: v })} />
            <TextField label="Adatvédelmi mondat" value={data.privacyNote} onChange={(v) => onChange({ ...data, privacyNote: v })} />
          </>
        )}

        {data.kind === 'closing' && (
          <>
            <TextField label="Kurátori üzenet" value={data.curatorMessage} onChange={(v) => onChange({ ...data, curatorMessage: v })} multiline />
            <TextField label="Kurátor neve" value={data.curatorName} onChange={(v) => onChange({ ...data, curatorName: v })} />
            <TextField label="Kurátor fotó útvonala" value={data.curatorPhoto} onChange={(v) => onChange({ ...data, curatorPhoto: v })} />
          </>
        )}
      </div>

      <button
        type="button"
        onClick={onDelete}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg border-2 border-french-red-200 py-2 font-montserrat text-sm font-medium text-french-red-500 hover:bg-french-red-50"
      >
        <Trash2 className="h-4 w-4" />
        Kártya törlése
      </button>
    </div>
  )
}
