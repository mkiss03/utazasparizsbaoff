'use client'

import { useEffect, useState } from 'react'
import { Plus, Save, Rocket, AlertTriangle, History, CheckCircle2, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Station, TourBonus } from '@/lib/louvre/types'
import { emptyStation, emptyBonus, nextVersionString } from '@/lib/louvre/manifest-admin'
import StationEditor from './StationEditor'
import BonusEditor from './BonusEditor'

interface VersionRow {
  id: string
  version: string
  title: string
  is_published: boolean
  created_at: string
  data: { stations: Station[]; bonus: TourBonus }
}

export default function ManifestEditor() {
  const supabase = createClient()

  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [versions, setVersions] = useState<VersionRow[]>([])

  const [title, setTitle] = useState('')
  const [stations, setStations] = useState<Station[]>([])
  const [bonus, setBonus] = useState<TourBonus>(emptyBonus())

  const [saving, setSaving] = useState<'draft' | 'publish' | null>(null)
  const [notice, setNotice] = useState<{ kind: 'success' | 'error'; text: string } | null>(null)
  const [dragIndex, setDragIndex] = useState<number | null>(null)

  useEffect(() => {
    void load()
  }, [])

  async function load() {
    setLoading(true)
    setLoadError(null)
    const { data, error } = await supabase
      .from('louvre_manifest_versions')
      .select('id, version, title, is_published, created_at, data')
      .order('created_at', { ascending: false })

    if (error) {
      setLoadError(
        `Nem sikerült betölteni a túra-verziókat (${error.message}). Ha ez az első futtatás, ellenőrizd, hogy lefuttattad-e a supabase-louvre-manifest-schema.sql migrációt.`
      )
      setLoading(false)
      return
    }

    const rows = (data as VersionRow[]) ?? []
    setVersions(rows)

    if (rows.length > 0) {
      loadIntoEditor(rows[0])
    } else {
      setTitle('Hét tárgy, amely hazudik neked')
      setStations([emptyStation()])
      setBonus(emptyBonus())
    }
    setLoading(false)
  }

  function loadIntoEditor(row: VersionRow) {
    setTitle(row.title)
    setStations(row.data.stations ?? [])
    setBonus(row.data.bonus ?? emptyBonus())
  }

  function validate(): string[] {
    const errors: string[] = []
    if (!title.trim()) errors.push('A túra címe nem lehet üres.')
    if (stations.length === 0) errors.push('Legalább egy állomás kell.')

    const stationIds = new Set<string>()
    for (const station of stations) {
      const label = station.title || '(névtelen állomás)'
      if (!station.id.trim()) errors.push(`"${label}": hiányzik az azonosító.`)
      if (stationIds.has(station.id)) errors.push(`"${label}": ismétlődő azonosító (${station.id}).`)
      stationIds.add(station.id)
      if (!station.title.trim()) errors.push('Egy állomásnak nincs címe.')
      if (!station.navigation.trim()) errors.push(`"${label}": hiányzik a navigációs leírás.`)
      if (!station.codeword.trim()) errors.push(`"${label}": hiányzik a kódszó.`)
      if (station.segments.length === 0) errors.push(`"${label}": nincs egy szegmense sem.`)

      const audioIds = new Set<string>()
      for (const segment of station.segments) {
        if (segment.type === 'audio') {
          if (!segment.id.trim()) errors.push(`"${label}": egy hangszegmensnek nincs azonosítója.`)
          if (audioIds.has(segment.id)) errors.push(`"${label}": ismétlődő szegmens-azonosító (${segment.id}).`)
          audioIds.add(segment.id)
          if (!segment.src) errors.push(`"${label}" / ${segment.id || '?'}: nincs feltöltött hangfájl.`)
        }
        if (segment.type === 'choice') {
          for (const opt of segment.options) {
            if (!opt.label.trim()) errors.push(`"${label}": egy elágazás gombjának nincs felirata.`)
            if (!opt.goto) errors.push(`"${label}": egy elágazás célja nincs kiválasztva.`)
          }
        }
      }
      for (const segment of station.segments) {
        if (segment.type === 'choice') {
          for (const opt of segment.options) {
            if (opt.goto && !audioIds.has(opt.goto)) {
              errors.push(`"${label}": az elágazás "${opt.goto}" célja nem létező szegmens.`)
            }
          }
        }
      }
    }

    if (!bonus.unlockPhrase.trim()) errors.push('A bónuszsáv jelszava nem lehet üres.')
    if (!bonus.audio) errors.push('A bónuszsávhoz nincs feltöltve hangfájl.')

    return errors
  }

  async function persist(publish: boolean) {
    setSaving(publish ? 'publish' : 'draft')
    setNotice(null)

    if (publish) {
      const errors = validate()
      if (errors.length > 0) {
        setNotice({ kind: 'error', text: `Élesítés előtt javítsd: ${errors[0]} (+${errors.length - 1} további probléma)` })
        setSaving(null)
        return
      }
    }

    const version = nextVersionString(versions.map((v) => v.version))

    if (publish) {
      await supabase.from('louvre_manifest_versions').update({ is_published: false }).eq('is_published', true)
    }

    const { error } = await supabase.from('louvre_manifest_versions').insert({
      version,
      title,
      data: { stations, bonus },
      is_published: publish,
      published_at: publish ? new Date().toISOString() : null,
    })

    setSaving(null)

    if (error) {
      setNotice({ kind: 'error', text: `Mentés sikertelen: ${error.message}` })
      return
    }

    setNotice({
      kind: 'success',
      text: publish ? `Élesítve -- ${version} a mostantól élő verzió.` : `Piszkozat elmentve (${version}).`,
    })
    await load()
  }

  async function publishExisting(row: VersionRow) {
    if (row.is_published) return
    setSaving('publish')
    await supabase.from('louvre_manifest_versions').update({ is_published: false }).eq('is_published', true)
    const { error } = await supabase
      .from('louvre_manifest_versions')
      .update({ is_published: true, published_at: new Date().toISOString() })
      .eq('id', row.id)
    setSaving(null)
    if (error) {
      setNotice({ kind: 'error', text: `Élesítés sikertelen: ${error.message}` })
      return
    }
    setNotice({ kind: 'success', text: `${row.version} visszaállítva élesként.` })
    await load()
  }

  const handleStationDrop = (targetIndex: number) => {
    if (dragIndex === null || dragIndex === targetIndex) return
    const next = [...stations]
    const [moved] = next.splice(dragIndex, 1)
    next.splice(targetIndex, 0, moved)
    setStations(next)
    setDragIndex(null)
  }

  if (loading) {
    return <div className="p-8 text-slate-500">Betöltés...</div>
  }

  if (loadError) {
    return (
      <div className="m-8 flex items-start gap-2 rounded-lg bg-red-50 p-4 text-sm text-red-700">
        <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" />
        {loadError}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <label className="mb-1 block text-xs font-semibold text-slate-500">Túra címe</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 font-playfair text-lg font-bold text-louvre-navy-700 outline-none focus:border-louvre-gold-500 sm:max-w-md"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            disabled={saving !== null}
            onClick={() => persist(false)}
            className="flex flex-1 items-center justify-center gap-2 rounded-full border-2 border-louvre-navy-700 px-4 py-2.5 text-sm font-semibold text-louvre-navy-700 hover:bg-louvre-navy-50 disabled:opacity-50 sm:flex-none sm:px-5"
          >
            {saving === 'draft' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            <span className="sm:hidden">Piszkozat</span>
            <span className="hidden sm:inline">Piszkozat mentése</span>
          </button>
          <button
            type="button"
            disabled={saving !== null}
            onClick={() => persist(true)}
            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-louvre-gold-500 px-4 py-2.5 text-sm font-semibold text-louvre-navy-700 hover:opacity-90 disabled:opacity-50 sm:flex-none sm:px-5"
          >
            {saving === 'publish' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Rocket className="h-4 w-4" />}
            Élesítés
          </button>
        </div>
      </div>

      {notice && (
        <div
          className={`flex items-center gap-2 rounded-lg p-3 text-sm ${
            notice.kind === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}
        >
          {notice.kind === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
          {notice.text}
        </div>
      )}

      <div className="space-y-4">
        {stations.map((station, i) => (
          <div
            key={i}
            draggable
            onDragStart={() => setDragIndex(i)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleStationDrop(i)}
          >
            <StationEditor
              station={station}
              onChange={(s) => {
                const next = [...stations]
                next[i] = s
                setStations(next)
              }}
              onRemove={() => setStations(stations.filter((_, si) => si !== i))}
            />
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setStations([...stations, emptyStation()])}
        className="flex items-center gap-2 rounded-full border-2 border-dashed border-slate-300 px-5 py-3 text-sm font-semibold text-slate-500 hover:border-louvre-gold-500 hover:text-louvre-navy-700"
      >
        <Plus className="h-4 w-4" />
        Új állomás
      </button>

      <BonusEditor bonus={bonus} stations={stations} onChange={setBonus} />

      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <h3 className="mb-3 flex items-center gap-2 font-semibold text-louvre-navy-700">
          <History className="h-4 w-4" />
          Verziótörténet
        </h3>
        <div className="space-y-1">
          {versions.map((v) => (
            <div key={v.id} className="flex flex-col gap-2 rounded-lg px-3 py-2 text-sm hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 flex-wrap items-center gap-2">
                <span className="font-mono text-xs text-slate-500">{v.version}</span>
                <span className="truncate text-slate-700">{v.title}</span>
                {v.is_published && (
                  <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">élő</span>
                )}
                <span className="text-xs text-slate-400 sm:hidden">{new Date(v.created_at).toLocaleDateString('hu-HU')}</span>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="hidden text-xs text-slate-400 sm:inline">{new Date(v.created_at).toLocaleString('hu-HU')}</span>
                <button
                  type="button"
                  onClick={() => loadIntoEditor(v)}
                  className="text-xs font-semibold text-louvre-navy-700 hover:underline"
                >
                  Betöltés szerkesztésre
                </button>
                {!v.is_published && (
                  <button
                    type="button"
                    onClick={() => publishExisting(v)}
                    className="text-xs font-semibold text-louvre-gold-700 hover:underline"
                  >
                    Élesítés
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
