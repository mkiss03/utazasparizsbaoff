'use client'

import { Plus, Trash2 } from 'lucide-react'
import type { EngineBinding, FlowNode, FlowNodeData, FlowOption } from '@/lib/planner/flow-types'
import { NODE_TYPE_LABELS } from '@/lib/planner/flow-types'
import ImagePickerField from './ImagePickerField'
import { ICON_REGISTRY } from './templates/icons'

const BINDING_LABELS: Record<EngineBinding, string> = {
  none: 'Nincs -- csak Viktóriának szóló infó',
  'days-exact': 'Napok száma (pontos dátumból)',
  'days-approx': 'Napok száma (hozzávetőleges)',
  pace: 'Tempó',
  interests: 'Érdeklődés-tag-ek',
  budgetBand: 'Költségkeret-sáv',
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-parisian-beige-100 pt-6 first:border-t-0 first:pt-0">
      <h4 className="mb-4 font-montserrat text-xs font-semibold uppercase tracking-wider text-parisian-beige-600">
        {title}
      </h4>
      <div className="space-y-5">{children}</div>
    </section>
  )
}

function TextField({
  label,
  value,
  onChange,
  multiline,
  hint,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  multiline?: boolean
  hint?: string
}) {
  return (
    <label className="block">
      <span className="mb-2 block font-montserrat text-sm font-medium text-parisian-grey-700">{label}</span>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="w-full rounded-xl border-2 border-parisian-beige-200 px-4 py-3 font-montserrat text-sm leading-relaxed text-parisian-grey-800 outline-none transition-colors focus:border-parisian-beige-400"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl border-2 border-parisian-beige-200 px-4 py-2.5 font-montserrat text-sm text-parisian-grey-800 outline-none transition-colors focus:border-parisian-beige-400"
        />
      )}
      {hint && <span className="mt-1.5 block font-montserrat text-xs text-parisian-grey-400">{hint}</span>}
    </label>
  )
}

function BindingField({ value, onChange }: { value: EngineBinding; onChange: (v: EngineBinding) => void }) {
  return (
    <label className="block">
      <span className="mb-2 block font-montserrat text-sm font-medium text-parisian-grey-700">Mit befolyásol a motorban?</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as EngineBinding)}
        className="w-full rounded-xl border-2 border-parisian-beige-200 px-4 py-2.5 font-montserrat text-sm text-parisian-grey-800 outline-none transition-colors focus:border-parisian-beige-400"
      >
        {Object.entries(BINDING_LABELS).map(([key, label]) => (
          <option key={key} value={key}>
            {label}
          </option>
        ))}
      </select>
      <span className="mt-1.5 block font-montserrat text-xs text-parisian-grey-400">
        Ha nem tudod biztosan, hagyd "Nincs"-en -- Viktória akkor is látni fogja a választ.
      </span>
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
      <div className="mb-3 flex items-center justify-between">
        <span className="font-montserrat text-sm font-medium text-parisian-grey-700">Gombok / kártyák</span>
        <span className="font-montserrat text-xs text-parisian-grey-400">{options.length} db</span>
      </div>

      <div className="space-y-4">
        {options.map((option, index) => (
          <div key={option.id} className="rounded-2xl border-2 border-parisian-beige-200 bg-parisian-cream-50/40 p-4">
            <div className="mb-3 flex items-start gap-2">
              <span className="mt-2.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-parisian-beige-200 font-montserrat text-[10px] font-bold text-parisian-grey-600">
                {index + 1}
              </span>
              <div className="flex-1 space-y-3">
                <div>
                  <span className="mb-1 block font-montserrat text-xs font-medium text-parisian-grey-500">Felirat</span>
                  <input
                    type="text"
                    value={option.label}
                    onChange={(e) => update(index, { label: e.target.value })}
                    className="w-full rounded-lg border-2 border-parisian-beige-200 px-3 py-2 font-montserrat text-sm text-parisian-grey-800 outline-none focus:border-parisian-beige-400"
                  />
                </div>
                <div>
                  <span className="mb-1 block font-montserrat text-xs font-medium text-parisian-grey-500">Alszöveg (opcionális)</span>
                  <input
                    type="text"
                    value={option.description ?? ''}
                    onChange={(e) => update(index, { description: e.target.value })}
                    placeholder="Rövid magyarázat a kártya alatt"
                    className="w-full rounded-lg border-2 border-parisian-beige-200 px-3 py-2 font-montserrat text-sm text-parisian-grey-800 outline-none focus:border-parisian-beige-400"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="mb-1 block font-montserrat text-xs font-medium text-parisian-grey-500">Ikon</span>
                    <select
                      value={option.icon ?? ''}
                      onChange={(e) => update(index, { icon: e.target.value || undefined })}
                      className="w-full rounded-lg border-2 border-parisian-beige-200 px-2 py-2 font-montserrat text-xs text-parisian-grey-800 outline-none focus:border-parisian-beige-400"
                    >
                      <option value="">Nincs</option>
                      {Object.keys(ICON_REGISTRY).map((name) => (
                        <option key={name} value={name}>
                          {name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <span className="mb-1 block font-montserrat text-xs font-medium text-parisian-grey-500">Motor-érték</span>
                    <input
                      type="text"
                      value={option.value ?? ''}
                      onChange={(e) => update(index, { value: e.target.value })}
                      placeholder="pl. relaxed"
                      className="w-full rounded-lg border-2 border-parisian-beige-200 px-2 py-2 font-montserrat text-xs text-parisian-grey-800 outline-none focus:border-parisian-beige-400"
                    />
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => remove(index)}
                className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-parisian-grey-400 hover:bg-french-red-50 hover:text-french-red-500"
                aria-label="Opció törlése"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={add}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-parisian-beige-300 py-3 font-montserrat text-sm font-medium text-parisian-grey-500 transition-colors hover:border-parisian-beige-400 hover:text-parisian-grey-700"
      >
        <Plus className="h-4 w-4" />
        Új opció hozzáadása
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
    <div className="w-[26rem] flex-shrink-0 overflow-y-auto border-l border-parisian-beige-200 bg-white">
      <div className="sticky top-0 z-10 border-b border-parisian-beige-100 bg-white/95 px-6 py-4 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div>
            <span className="block font-montserrat text-[11px] font-semibold uppercase tracking-wider text-parisian-beige-600">
              {NODE_TYPE_LABELS[data.kind]}
            </span>
            <h3 className="font-playfair text-lg font-bold text-parisian-grey-800">Kártya szerkesztése</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-parisian-grey-400 hover:bg-parisian-beige-50 hover:text-parisian-grey-700"
            aria-label="Panel bezárása"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="space-y-6 px-6 py-6">
        <Section title="Szöveg">
          <TextField label="Cím" value={data.title} onChange={(v) => onChange({ ...data, title: v })} />
          {'subtitle' in data && (
            <TextField
              label="Alcím"
              value={data.subtitle ?? ''}
              onChange={(v) => onChange({ ...data, subtitle: v })}
              multiline
            />
          )}
        </Section>

        {data.kind === 'hero' && (
          <Section title="Nyitány">
            <ImagePickerField
              label="Háttérkép"
              value={data.backgroundImage}
              onChange={(v) => onChange({ ...data, backgroundImage: v })}
            />
            <TextField label="Gomb felirata" value={data.ctaLabel} onChange={(v) => onChange({ ...data, ctaLabel: v })} />
          </Section>
        )}

        {(data.kind === 'single-select' || data.kind === 'multi-select') && (
          <>
            <Section title="Motor-kötés">
              <BindingField value={data.binding} onChange={(binding) => onChange({ ...data, binding })} />
              {data.kind === 'single-select' && (
                <label className="flex items-center gap-2.5 rounded-xl bg-parisian-cream-50 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={data.autoAdvance}
                    onChange={(e) => onChange({ ...data, autoAdvance: e.target.checked })}
                    className="h-4 w-4"
                  />
                  <span className="font-montserrat text-sm text-parisian-grey-700">Kattintásra azonnal lépjen tovább</span>
                </label>
              )}
            </Section>
            <Section title="Gombok / kártyák">
              <OptionsEditor options={data.options} onChange={(options) => onChange({ ...data, options })} />
            </Section>
          </>
        )}

        {data.kind === 'datetime-range' && (
          <Section title="Mezők">
            <TextField label="Érkezés mező felirata" value={data.startLabel} onChange={(v) => onChange({ ...data, startLabel: v })} />
            <TextField label="Hazautazás mező felirata" value={data.endLabel} onChange={(v) => onChange({ ...data, endLabel: v })} />
          </Section>
        )}

        {data.kind === 'month-counter' && (
          <Section title="Mezők">
            <TextField label="Hónap mező felirata" value={data.monthLabel} onChange={(v) => onChange({ ...data, monthLabel: v })} />
          </Section>
        )}

        {data.kind === 'free-text' && (
          <Section title="Mezők">
            <TextField label="Placeholder" value={data.placeholder} onChange={(v) => onChange({ ...data, placeholder: v })} />
            <TextField
              label="Megjegyzés (kis szöveg a cím alatt)"
              value={data.noteLabel ?? ''}
              onChange={(v) => onChange({ ...data, noteLabel: v })}
            />
          </Section>
        )}

        {data.kind === 'swipe-cards' && (
          <Section title="Beállítások">
            <label className="block">
              <span className="mb-2 block font-montserrat text-sm font-medium text-parisian-grey-700">Kártyák száma</span>
              <input
                type="number"
                min={2}
                max={12}
                value={data.cardCount}
                onChange={(e) => onChange({ ...data, cardCount: Number(e.target.value) })}
                className="w-full rounded-xl border-2 border-parisian-beige-200 px-4 py-2.5 font-montserrat text-sm outline-none focus:border-parisian-beige-400"
              />
              <span className="mt-1.5 block font-montserrat text-xs text-parisian-grey-400">
                A katalógusból a legjobban illő programok kerülnek ide, automatikusan.
              </span>
            </label>
          </Section>
        )}

        {data.kind === 'contact-form' && (
          <Section title="Mezők">
            <TextField label="Név mező placeholder" value={data.namePlaceholder} onChange={(v) => onChange({ ...data, namePlaceholder: v })} />
            <TextField label="Email mező placeholder" value={data.emailPlaceholder} onChange={(v) => onChange({ ...data, emailPlaceholder: v })} />
            <TextField label="Beküldés gomb felirata" value={data.submitLabel} onChange={(v) => onChange({ ...data, submitLabel: v })} />
            <TextField label="Adatvédelmi mondat" value={data.privacyNote} onChange={(v) => onChange({ ...data, privacyNote: v })} />
          </Section>
        )}

        {data.kind === 'closing' && (
          <Section title="Kurátori üzenet">
            <TextField label="Üzenet" value={data.curatorMessage} onChange={(v) => onChange({ ...data, curatorMessage: v })} multiline />
            <TextField label="Kurátor neve" value={data.curatorName} onChange={(v) => onChange({ ...data, curatorName: v })} />
            <ImagePickerField
              label="Kurátor fotója"
              value={data.curatorPhoto}
              onChange={(v) => onChange({ ...data, curatorPhoto: v })}
            />
          </Section>
        )}

        <div className="border-t border-parisian-beige-100 pt-6">
          <button
            type="button"
            onClick={onDelete}
            className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-french-red-200 py-3 font-montserrat text-sm font-medium text-french-red-500 transition-colors hover:bg-french-red-50"
          >
            <Trash2 className="h-4 w-4" />
            Kártya törlése
          </button>
        </div>
      </div>
    </div>
  )
}
