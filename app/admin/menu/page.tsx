'use client'

import { useState, useTransition } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { updateMenuSetting } from '@/app/actions/menu'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Eye, EyeOff, Menu, Layers, ExternalLink, Info } from 'lucide-react'
import type { MenuSetting } from '@/lib/types/database'

const GROUP_LABELS: Record<string, string> = {
  parisian_experiences: 'Párizsi Élmények',
  inspiration: 'Inspiráció',
}

const GROUP_COLORS: Record<string, string> = {
  parisian_experiences: 'bg-french-blue-50 text-french-blue-600 border-french-blue-200',
  inspiration: 'bg-purple-50 text-purple-600 border-purple-200',
}

function ToggleSwitch({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-french-blue-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
        checked ? 'bg-green-500' : 'bg-slate-300'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out ${
          checked ? 'translate-x-5' : 'translate-x-0.5'
        }`}
      />
    </button>
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
    // Optimistic update
    queryClient.setQueryData<MenuSetting[]>(['menu-settings'], (old) =>
      old?.map((s) => (s.menu_key === menuKey ? { ...s, is_active: !currentValue } : s))
    )
    setErrors((prev) => ({ ...prev, [menuKey]: '' }))

    startTransition(async () => {
      const result = await updateMenuSetting(menuKey, !currentValue)
      if (!result.success) {
        // Revert on error
        queryClient.setQueryData<MenuSetting[]>(['menu-settings'], (old) =>
          old?.map((s) => (s.menu_key === menuKey ? { ...s, is_active: currentValue } : s))
        )
        setErrors((prev) => ({ ...prev, [menuKey]: result.error || 'Hiba történt' }))
      }
    })
  }

  const groups = ['parisian_experiences', 'inspiration'] as const

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-french-blue-100">
            <Menu className="h-5 w-5 text-french-blue-600" />
          </div>
          <div>
            <h1 className="font-playfair text-3xl font-bold text-french-blue-500">
              Menü beállítások
            </h1>
            <p className="text-sm text-slate-500">
              Szabályozd, hogy mely menüpontok jelenjenek meg a navigációs sávban
            </p>
          </div>
        </div>
      </div>

      {/* Info banner */}
      <div className="mb-6 flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4">
        <Info className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-500" />
        <div className="text-sm text-blue-700">
          <p className="font-semibold">Hogyan működik?</p>
          <p className="mt-1">
            Ha egy menüpontot kikapcsolsz, az eltűnik a navigációs sávból az összes oldalon.
            Ha egy csoport összes eleme ki van kapcsolva, a csoport fejléce sem jelenik meg.
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
              <code className="rounded bg-amber-100 px-1.5 py-0.5 font-mono text-xs">
                supabase-menu-settings-schema.sql
              </code>{' '}
              fájlt a Supabase SQL Editorban, majd frissítsd az oldalt.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {groups.map((group) => {
            const items = settings.filter((s) => s.parent_group === group)
            if (items.length === 0) return null
            return (
              <Card key={group} className="border-slate-200">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-3 text-lg text-slate-800">
                    <span
                      className={`rounded-full border px-3 py-1 text-sm font-semibold ${GROUP_COLORS[group]}`}
                    >
                      {GROUP_LABELS[group]}
                    </span>
                    <span className="text-sm font-normal text-slate-400">
                      {items.filter((i) => i.is_active).length}/{items.length} aktív
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {items.map((item) => (
                    <div
                      key={item.menu_key}
                      className={`flex items-center justify-between rounded-xl border p-4 transition-all ${
                        item.is_active
                          ? 'border-slate-200 bg-white'
                          : 'border-slate-100 bg-slate-50 opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        {item.is_active ? (
                          <Eye className="h-5 w-5 flex-shrink-0 text-green-500" />
                        ) : (
                          <EyeOff className="h-5 w-5 flex-shrink-0 text-slate-400" />
                        )}
                        <div>
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
                          {errors[item.menu_key] && (
                            <p className="mt-1 text-xs text-red-500">{errors[item.menu_key]}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge
                          variant={item.is_active ? 'default' : 'secondary'}
                          className={
                            item.is_active
                              ? 'bg-green-100 text-green-700 hover:bg-green-100'
                              : 'bg-slate-100 text-slate-500'
                          }
                        >
                          {item.is_active ? 'Aktív' : 'Rejtett'}
                        </Badge>
                        <ToggleSwitch
                          checked={item.is_active}
                          onChange={() => handleToggle(item.menu_key, item.is_active)}
                          disabled={isPending}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
