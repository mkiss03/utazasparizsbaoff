'use client'

import { useState, useTransition } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { updateMenuSetting, updateMenuSettingLabel, addMenuSetting, deleteMenuSetting } from '@/app/actions/menu'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Eye, EyeOff, Menu, Layers, ExternalLink, Info, Pencil, Check, X, Plus, Trash2 } from 'lucide-react'
import type { MenuSetting } from '@/lib/types/database'

const GROUP_LABELS: Record<string, string> = {
  parisian_experiences: 'Párizsi Élmények',
  services: 'Szolgáltatások',
  inspiration: 'Inspiráció',
}

const GROUP_COLORS: Record<string, string> = {
  parisian_experiences: 'bg-french-blue-50 text-french-blue-600 border-french-blue-200',
  services: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  inspiration: 'bg-purple-50 text-purple-600 border-purple-200',
}

const GROUPS = ['parisian_experiences', 'services', 'inspiration'] as const

function ToggleSwitch({ checked, onChange, disabled }: { checked: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-french-blue-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${checked ? 'bg-green-500' : 'bg-slate-300'}`}
    >
      <span className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${checked ? 'translate-x-5' : 'translate-x-0.5'}`} />
    </button>
  )
}

function EditableRow({
  item,
  onToggle,
  onSaveLabel,
  onDelete,
  isPending,
}: {
  item: MenuSetting
  onToggle: () => void
  onSaveLabel: (label: string, href: string) => Promise<void>
  onDelete: () => Promise<void>
  isPending: boolean
}) {
  const [editing, setEditing] = useState(false)
  const [label, setLabel] = useState(item.label)
  const [href, setHref] = useState(item.href)
  const [saving, setSaving] = useState(false)

  const save = async () => {
    if (!label.trim()) return
    setSaving(true)
    await onSaveLabel(label, href)
    setSaving(false)
    setEditing(false)
  }

  const cancel = () => {
    setLabel(item.label)
    setHref(item.href)
    setEditing(false)
  }

  return (
    <div className={`flex items-start justify-between rounded-xl border p-4 transition-all ${item.is_active ? 'border-slate-200 bg-white' : 'border-slate-100 bg-slate-50 opacity-60'}`}>
      <div className="flex min-w-0 flex-1 items-start gap-4">
        {item.is_active ? (
          <Eye className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
        ) : (
          <EyeOff className="mt-0.5 h-5 w-5 flex-shrink-0 text-slate-400" />
        )}
        <div className="min-w-0 flex-1">
          {editing ? (
            <div className="space-y-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Megjelenő név</label>
                <input
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') save(); if (e.key === 'Escape') cancel() }}
                  className="w-full rounded-lg border border-french-blue-300 px-3 py-1.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-french-blue-400"
                  autoFocus
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Link (href)</label>
                <input
                  value={href}
                  onChange={(e) => setHref(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') save(); if (e.key === 'Escape') cancel() }}
                  className="w-full rounded-lg border border-slate-300 px-3 py-1.5 font-mono text-xs text-slate-600 focus:outline-none focus:ring-2 focus:ring-french-blue-400"
                  placeholder="/oldal vagy /#szekció"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={save}
                  disabled={saving || !label.trim()}
                  className="flex items-center gap-1 rounded-lg bg-green-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-600 disabled:opacity-50"
                >
                  <Check className="h-3 w-3" /> Mentés
                </button>
                <button
                  onClick={cancel}
                  className="flex items-center gap-1 rounded-lg bg-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-300"
                >
                  <X className="h-3 w-3" /> Mégse
                </button>
              </div>
            </div>
          ) : (
            <>
              <p className="font-semibold text-slate-800">{item.label}</p>
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-french-blue-500"
              >
                {item.href}
                <ExternalLink className="h-3 w-3" />
              </a>
            </>
          )}
        </div>
      </div>

      <div className="ml-4 flex flex-shrink-0 items-center gap-2">
        {!editing && (
          <>
            <button
              onClick={() => setEditing(true)}
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-french-blue-500"
              title="Szerkesztés"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              onClick={async () => { if (window.confirm(`Törlöd: "${item.label}"?`)) await onDelete() }}
              className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-500"
              title="Törlés"
            >
              <Trash2 className="h-4 w-4" />
            </button>
            <Badge
              variant={item.is_active ? 'default' : 'secondary'}
              className={item.is_active ? 'bg-green-100 text-green-700 hover:bg-green-100' : 'bg-slate-100 text-slate-500'}
            >
              {item.is_active ? 'Aktív' : 'Rejtett'}
            </Badge>
            <ToggleSwitch
              checked={item.is_active}
              onChange={onToggle}
              disabled={isPending}
            />
          </>
        )}
      </div>
    </div>
  )
}

function AddItemForm({
  group,
  maxSortOrder,
  onAdd,
}: {
  group: string
  maxSortOrder: number
  onAdd: (label: string, href: string) => Promise<{ success: boolean; error?: string }>
}) {
  const [open, setOpen] = useState(false)
  const [label, setLabel] = useState('')
  const [href, setHref] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const save = async () => {
    if (!label.trim() || !href.trim()) { setError('Név és link kötelező'); return }
    setSaving(true)
    const result = await onAdd(label, href)
    setSaving(false)
    if (result.success) {
      setLabel(''); setHref(''); setOpen(false); setError('')
    } else {
      setError(result.error || 'Hiba történt')
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 px-4 py-3 text-sm font-medium text-slate-500 transition-colors hover:border-french-blue-300 hover:text-french-blue-500"
      >
        <Plus className="h-4 w-4" /> Új menüpont hozzáadása
      </button>
    )
  }

  return (
    <div className="rounded-xl border-2 border-french-blue-200 bg-french-blue-50 p-4">
      <p className="mb-3 text-sm font-semibold text-french-blue-700">Új menüpont — {GROUP_LABELS[group]}</p>
      <div className="space-y-2">
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Megjelenő név (pl. Párizsi tömegközlekedés)"
          className="w-full rounded-lg border border-french-blue-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-french-blue-400"
          autoFocus
        />
        <input
          value={href}
          onChange={(e) => setHref(e.target.value)}
          placeholder="Link (pl. /#district-guide vagy /oldal)"
          className="w-full rounded-lg border border-french-blue-200 px-3 py-2 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-french-blue-400"
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
        <div className="flex gap-2">
          <button
            onClick={save}
            disabled={saving}
            className="flex items-center gap-1 rounded-lg bg-french-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-french-blue-600 disabled:opacity-50"
          >
            <Check className="h-4 w-4" /> Hozzáadás
          </button>
          <button
            onClick={() => { setOpen(false); setLabel(''); setHref(''); setError('') }}
            className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
          >
            Mégse
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AdminMenuPage() {
  const supabase = createClient()
  const queryClient = useQueryClient()
  const [isPending, startTransition] = useTransition()
  const [errors, setErrors] = useState<Record<string, string>>({})

  const { data: settings, isLoading } = useQuery<MenuSetting[]>({
    queryKey: ['menu-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('menu_settings')
        .select('*')
        .order('sort_order', { ascending: true })
      if (error) throw error
      return (data as MenuSetting[]) ?? []
    },
  })

  const handleToggle = (menuKey: string, currentValue: boolean) => {
    queryClient.setQueryData<MenuSetting[]>(['menu-settings'], (old) =>
      old?.map((s) => (s.menu_key === menuKey ? { ...s, is_active: !currentValue } : s))
    )
    setErrors((prev) => ({ ...prev, [menuKey]: '' }))
    startTransition(async () => {
      const result = await updateMenuSetting(menuKey, !currentValue)
      if (!result.success) {
        queryClient.setQueryData<MenuSetting[]>(['menu-settings'], (old) =>
          old?.map((s) => (s.menu_key === menuKey ? { ...s, is_active: currentValue } : s))
        )
        setErrors((prev) => ({ ...prev, [menuKey]: result.error || 'Hiba történt' }))
      }
    })
  }

  const handleSaveLabel = async (menuKey: string, label: string, href: string) => {
    const result = await updateMenuSettingLabel(menuKey, label, href)
    if (result.success) {
      queryClient.setQueryData<MenuSetting[]>(['menu-settings'], (old) =>
        old?.map((s) => (s.menu_key === menuKey ? { ...s, label, href } : s))
      )
    }
  }

  const handleDelete = async (menuKey: string) => {
    const result = await deleteMenuSetting(menuKey)
    if (result.success) {
      queryClient.setQueryData<MenuSetting[]>(['menu-settings'], (old) =>
        old?.filter((s) => s.menu_key !== menuKey)
      )
    }
  }

  const handleAdd = async (group: string, label: string, href: string, sortOrder: number) => {
    const menu_key = `custom_${Date.now()}`
    const result = await addMenuSetting({ menu_key, label, href, parent_group: group, sort_order: sortOrder })
    if (result.success) {
      queryClient.invalidateQueries({ queryKey: ['menu-settings'] })
    }
    return result
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-french-blue-100">
            <Menu className="h-5 w-5 text-french-blue-600" />
          </div>
          <div>
            <h1 className="font-playfair text-3xl font-bold text-french-blue-500">Menü beállítások</h1>
            <p className="text-sm text-slate-500">Szerkeszd a menüpontok nevét, linkjét és láthatóságát</p>
          </div>
        </div>
      </div>

      <div className="mb-6 flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4">
        <Info className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-500" />
        <div className="text-sm text-blue-700">
          <p className="font-semibold">Hogyan működik?</p>
          <p className="mt-1">
            A ceruzával szerkesztheted a nevet és a linket. A kapcsolóval elrejtheted/megjelenítheted az elemet. Az + gombbal új almenüpontot adhatsz hozzá.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-xl bg-slate-100" />
          ))}
        </div>
      ) : !settings || settings.length === 0 ? (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-8 text-center">
            <Layers className="mx-auto mb-3 h-12 w-12 text-amber-400" />
            <h3 className="mb-2 font-semibold text-amber-700">Az adatbázistábla még nem létezik</h3>
            <p className="text-sm text-amber-600">
              Futtasd a{' '}
              <code className="rounded bg-amber-100 px-1.5 py-0.5 font-mono text-xs">supabase-menu-settings-schema.sql</code>
              {' '}fájlt a Supabase SQL Editorban, majd frissítsd az oldalt.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {GROUPS.map((group) => {
            const items = settings.filter((s) => s.parent_group === group)
            const maxSort = Math.max(0, ...items.map((i) => i.sort_order))
            return (
              <Card key={group} className="border-slate-200">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-3 text-lg text-slate-800">
                    <span className={`rounded-full border px-3 py-1 text-sm font-semibold ${GROUP_COLORS[group] || 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                      {GROUP_LABELS[group] || group}
                    </span>
                    <span className="text-sm font-normal text-slate-400">
                      {items.filter((i) => i.is_active).length}/{items.length} aktív
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {items.map((item) => (
                    <EditableRow
                      key={item.menu_key}
                      item={item}
                      onToggle={() => handleToggle(item.menu_key, item.is_active)}
                      onSaveLabel={(label, href) => handleSaveLabel(item.menu_key, label, href)}
                      onDelete={() => handleDelete(item.menu_key)}
                      isPending={isPending}
                    />
                  ))}
                  <AddItemForm
                    group={group}
                    maxSortOrder={maxSort}
                    onAdd={(label, href) => handleAdd(group, label, href, maxSort + 1)}
                  />
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
