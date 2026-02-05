'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Save, X } from 'lucide-react'

const TYPE_OPTIONS = [
  { value: 'transport', label: 'Közlekedés' },
  { value: 'ticket', label: 'Jegyek' },
  { value: 'info', label: 'Információ' },
  { value: 'survival', label: 'Túlélőtippek' },
  { value: 'apps', label: 'Appok' },
  { value: 'situations', label: 'Szituációk' },
  { value: 'situation', label: 'Szituáció (egyedi)' },
] as const

const COLOR_OPTIONS = [
  { value: 'bg-french-blue-600', label: 'Kék', preview: '#1e40af' },
  { value: 'bg-parisian-gold-500', label: 'Arany', preview: '#d4a843' },
  { value: 'bg-green-700', label: 'Zöld', preview: '#15803d' },
  { value: 'bg-orange-600', label: 'Piros/Narancs', preview: '#ea580c' },
  { value: 'bg-slate-700', label: 'Lila/Szürke', preview: '#334155' },
  { value: 'bg-blue-600', label: 'Királykék', preview: '#2563eb' },
  { value: 'bg-teal-600', label: 'Türkiz', preview: '#0d9488' },
  { value: 'bg-purple-600', label: 'Lila', preview: '#9333ea' },
] as const

export interface MapPointFormData {
  id?: string
  title: string
  x: number
  y: number
  type: string
  color: string
  question: string
  answer: string
  details: string
}

interface MapPointEditorProps {
  point: MapPointFormData | null
  onSave: (data: MapPointFormData) => void
  onCancel: () => void
  isSaving?: boolean
}

const emptyForm: MapPointFormData = {
  title: '',
  x: 50,
  y: 50,
  type: 'info',
  color: 'bg-french-blue-600',
  question: '',
  answer: '',
  details: '',
}

export default function MapPointEditor({ point, onSave, onCancel, isSaving }: MapPointEditorProps) {
  const [form, setForm] = useState<MapPointFormData>(emptyForm)

  useEffect(() => {
    if (point) {
      setForm(point)
    } else {
      setForm(emptyForm)
    }
  }, [point])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(form)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Cím</Label>
        <Input
          id="title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Pl. Mivel lehet utazni?"
          required
        />
      </div>

      {/* Type & Color side by side */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="type">Típus</Label>
          <select
            id="type"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            {TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="color">Szín</Label>
          <select
            id="color"
            value={form.color}
            onChange={(e) => setForm({ ...form, color: e.target.value })}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            {COLOR_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="flex items-center gap-2 mt-1">
            <div
              className="w-5 h-5 rounded-full border"
              style={{ backgroundColor: COLOR_OPTIONS.find(c => c.value === form.color)?.preview || '#666' }}
            />
            <span className="text-xs text-slate-500">Előnézet</span>
          </div>
        </div>
      </div>

      {/* X & Y coordinates */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="x">X pozíció (%)</Label>
          <Input
            id="x"
            type="number"
            min={0}
            max={100}
            value={form.x}
            onChange={(e) => setForm({ ...form, x: Number(e.target.value) })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="y">Y pozíció (%)</Label>
          <Input
            id="y"
            type="number"
            min={0}
            max={100}
            value={form.y}
            onChange={(e) => setForm({ ...form, y: Number(e.target.value) })}
          />
        </div>
      </div>

      {/* Question */}
      <div className="space-y-2">
        <Label htmlFor="question">Kérdés (kártya eleje)</Label>
        <Input
          id="question"
          value={form.question}
          onChange={(e) => setForm({ ...form, question: e.target.value })}
          placeholder="Pl. Mivel lehet utazni Párizsban?"
        />
      </div>

      {/* Answer */}
      <div className="space-y-2">
        <Label htmlFor="answer">Válasz (kártya hátulja)</Label>
        <Textarea
          id="answer"
          value={form.answer}
          onChange={(e) => setForm({ ...form, answer: e.target.value })}
          placeholder="A kártya megfordítása után megjelenő válasz..."
          rows={3}
        />
      </div>

      {/* Details */}
      <div className="space-y-2">
        <Label htmlFor="details">Részletek (kártya alatt)</Label>
        <Textarea
          id="details"
          value={form.details}
          onChange={(e) => setForm({ ...form, details: e.target.value })}
          placeholder="Bővebb leírás, ami a flip kártya alatt jelenik meg..."
          rows={5}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={isSaving} className="flex-1">
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? 'Mentés...' : point?.id ? 'Frissítés' : 'Létrehozás'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          <X className="h-4 w-4 mr-2" />
          Mégse
        </Button>
      </div>
    </form>
  )
}
