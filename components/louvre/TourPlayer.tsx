'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, MapPin, Circle } from 'lucide-react'
import type { Station, TourManifest, TourState } from '@/lib/louvre/types'
import { createInitialState, loadTourState, saveTourState } from '@/lib/louvre/db'
import { checkIntegrity } from '@/lib/louvre/offline-manager'
import { track } from '@/lib/louvre/analytics'
import OfflineDownloadScreen from './OfflineDownloadScreen'
import StationPlayer from './StationPlayer'
import BonusUnlock from './BonusUnlock'
import InstallInstructions from './InstallInstructions'

type View = { kind: 'list' } | { kind: 'station'; stationId: string } | { kind: 'bonus' }

export default function TourPlayer() {
  const [manifest, setManifest] = useState<TourManifest | null>(null)
  const [tourState, setTourState] = useState<TourState | null>(null)
  const [needsRedownload, setNeedsRedownload] = useState(false)
  const [view, setView] = useState<View>({ kind: 'list' })
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    void bootstrap()
  }, [])

  async function bootstrap() {
    try {
      const response = await fetch('/louvre/tour-manifest.json', { cache: 'no-store' })
      const data: TourManifest = await response.json()
      setManifest(data)

      let state = await loadTourState(data.version)

      if (state.manifestVersion !== data.version) {
        state = createInitialState(data.version)
        await saveTourState(state)
      }

      if (state.downloadComplete) {
        const integrity = await checkIntegrity(data)
        if (!integrity.ok) {
          state = { ...state, downloadComplete: false }
          await saveTourState(state)
          setNeedsRedownload(true)
        }
      }

      setTourState(state)
    } catch (err) {
      console.error(err)
      setLoadError('Nem sikerült betölteni a túrát. Ha éppen nincs internet, és korábban már letöltötted, próbáld frissíteni az oldalt.')
    } finally {
      setLoading(false)
    }
  }

  async function updateState(patch: Partial<TourState>) {
    setTourState((prev) => {
      if (!prev) return prev
      const next = { ...prev, ...patch }
      void saveTourState(next)
      return next
    })
  }

  if (loading) {
    return <div className="py-24 text-center text-slate-500">Betöltés...</div>
  }

  if (loadError || !manifest || !tourState) {
    return <div className="py-24 text-center text-red-600">{loadError}</div>
  }

  if (!tourState.downloadComplete) {
    return (
      <>
        {needsRedownload && (
          <p className="mx-auto mb-4 max-w-xl rounded-lg bg-amber-50 px-4 py-3 text-center text-sm text-amber-800">
            Egy vagy több hangfájl hiányzik a cache-ből (pl. a böngésző törölte). Töltsd le újra --
            ez csak egyszer fordul elő.
          </p>
        )}
        <OfflineDownloadScreen
          manifest={manifest}
          onComplete={() => {
            track(tourState.clientId, 'tour_started', undefined, manifest.version)
            void updateState({ downloadComplete: true })
          }}
        />
      </>
    )
  }

  const allCompleted = manifest.stations.every((s) => tourState.stations[s.id]?.completed)

  const viewKey = view.kind === 'station' ? `station-${view.stationId}` : view.kind
  let content: React.ReactNode = null

  if (view.kind === 'station') {
    const station = manifest.stations.find((s) => s.id === view.stationId) as Station
    const progress = tourState.stations[station.id]

    content = (
      <StationPlayer
        station={station}
        initialSegmentIndex={progress?.lastSegmentIndex ?? 0}
        alreadyCompleted={progress?.completed ?? false}
        onProgress={(segmentIndex) => {
          const stations = {
            ...tourState.stations,
            [station.id]: {
              stationId: station.id,
              completed: false,
              codewordRevealed: false,
              lastSegmentIndex: segmentIndex,
              choices: tourState.stations[station.id]?.choices ?? {},
            },
          }
          void updateState({ stations })
        }}
        onComplete={(codeword) => {
          const stations = {
            ...tourState.stations,
            [station.id]: {
              stationId: station.id,
              completed: true,
              codewordRevealed: true,
              lastSegmentIndex: station.segments.length,
              choices: tourState.stations[station.id]?.choices ?? {},
            },
          }
          const collectedCodewords = tourState.collectedCodewords.includes(codeword)
            ? tourState.collectedCodewords
            : [...tourState.collectedCodewords, codeword]

          track(tourState.clientId, 'station_completed', station.id, manifest.version)

          const allNowCompleted = manifest.stations.every((s) => stations[s.id]?.completed)
          if (allNowCompleted) track(tourState.clientId, 'tour_completed', undefined, manifest.version)

          void updateState({ stations, collectedCodewords })
        }}
        onBack={() => setView({ kind: 'list' })}
      />
    )
  } else if (view.kind === 'bonus') {
    content = (
      <div className="px-4 py-8">
        <button
          onClick={() => setView({ kind: 'list' })}
          className="mx-auto mb-6 block text-sm font-medium text-slate-500 hover:text-louvre-navy-700"
        >
          ← Vissza az állomásokhoz
        </button>
        <BonusUnlock
          bonus={manifest.bonus}
          collectedCodewords={tourState.collectedCodewords}
          unlocked={tourState.bonusUnlocked}
          onUnlock={() => {
            track(tourState.clientId, 'bonus_unlocked', undefined, manifest.version)
            void updateState({ bonusUnlocked: true })
          }}
        />
      </div>
    )
  } else {
    content = (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-2 text-center font-playfair text-3xl font-bold text-louvre-navy-700">{manifest.title}</h1>
      <p className="mb-8 text-center text-slate-600">
        Válassz egy állomást -- bármelyik sorrendben bejárhatod attól függően, merre jársz épp.
      </p>

      <div className="mb-8 space-y-3">
        {manifest.stations.map((station) => {
          const progress = tourState.stations[station.id]
          return (
            <button
              key={station.id}
              onClick={() => setView({ kind: 'station', stationId: station.id })}
              className="flex w-full items-start gap-3 rounded-xl border border-slate-200 bg-white p-5 text-left transition-all hover:border-louvre-gold-500 hover:shadow-md"
            >
              {progress?.completed ? (
                <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
              ) : (
                <Circle className="mt-0.5 h-5 w-5 flex-shrink-0 text-slate-300" />
              )}
              <div className="flex-1">
                <p className="font-semibold text-louvre-navy-700">{station.title}</p>
                <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                  <MapPin className="h-3.5 w-3.5" />
                  {station.navigation}
                </p>
                {progress?.completed && (
                  <p className="mt-2 text-xs font-semibold text-louvre-gold-700">
                    Kódszó: {station.codeword}
                  </p>
                )}
              </div>
            </button>
          )
        })}
      </div>

      <button
        onClick={() => setView({ kind: 'bonus' })}
        disabled={!allCompleted && !tourState.bonusUnlocked}
        className="mb-8 w-full rounded-xl border-2 border-dashed border-louvre-gold-500 p-5 text-center font-semibold text-louvre-navy-700 transition-all hover:bg-louvre-gold-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {tourState.bonusUnlocked
          ? 'Bónuszsáv meghallgatása'
          : allCompleted
          ? 'Bónuszsáv feloldása'
          : 'Bónuszsáv (teljesítsd mind a 3 állomást a feloldáshoz)'}
      </button>

      <InstallInstructions variant="banner" />
    </div>
    )
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={viewKey}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      >
        {content}
      </motion.div>
    </AnimatePresence>
  )
}
