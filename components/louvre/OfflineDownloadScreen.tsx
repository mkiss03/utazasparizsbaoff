'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, WifiOff, Download, AlertTriangle } from 'lucide-react'
import type { TourManifest } from '@/lib/louvre/types'
import { downloadTourAssets, formatMB, type DownloadProgress } from '@/lib/louvre/offline-manager'

interface Props {
  manifest: TourManifest
  onComplete: () => void
}

export default function OfflineDownloadScreen({ manifest, onComplete }: Props) {
  const [progress, setProgress] = useState<DownloadProgress | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [downloading, setDownloading] = useState(false)

  const startDownload = async () => {
    setError(null)
    setDownloading(true)
    try {
      await downloadTourAssets(manifest, setProgress)
      onComplete()
    } catch (err) {
      console.error(err)
      setError(
        err instanceof Error
          ? err.message
          : 'Nem sikerült letölteni a túrát. Ellenőrizd a wifi-kapcsolatot, és próbáld újra.'
      )
      setDownloading(false)
    }
  }

  const percent = progress ? Math.round((progress.downloadedAssets / progress.totalAssets) * 100) : 0
  const done = progress?.done ?? false

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-4 py-10 sm:px-6 sm:py-16 text-center">
      {!downloading && !done && (
        <>
          <WifiOff className="mb-4 h-12 w-12 text-louvre-navy-500" />
          <h1 className="mb-3 font-playfair text-2xl font-bold text-louvre-navy-700">
            Töltsd le a túrát, mielőtt bemész
          </h1>
          <p className="mb-6 text-slate-600">
            A Louvre falai vastagok és a jel odabent foltos. Ez a mini túra teljesen internet
            nélkül szól, ha most, wifin letöltöd a {manifest.stations.length} állomás hanganyagát
            (~{formatMB(estimateTotal(manifest))} MB).
          </p>
          <button
            onClick={startDownload}
            className="flex items-center gap-2 rounded-full bg-louvre-navy-700 px-8 py-4 font-semibold text-white shadow-lg transition-all hover:bg-louvre-navy-500"
          >
            <Download className="h-5 w-5" />
            Offline letöltés indítása
          </button>
        </>
      )}

      {downloading && !done && progress && (
        <>
          <p className="mb-2 text-4xl font-bold text-louvre-navy-700">{percent}%</p>
          <div className="mb-3 h-3 w-full max-w-sm overflow-hidden rounded-full bg-slate-200">
            <motion.div
              className="h-full rounded-full bg-louvre-gold-500"
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            />
          </div>
          <p className="mb-1 text-sm text-slate-500">
            {progress.downloadedAssets}/{progress.totalAssets} fájl -- {formatMB(progress.downloadedBytes)} MB /{' '}
            {formatMB(progress.totalBytes)} MB
          </p>
          <p className="mb-6 text-slate-600">
            Offline készenlét: {progress.currentStationsReady}/{progress.totalStations} állomás
          </p>
        </>
      )}

      {done && (
        <>
          <CheckCircle2 className="mb-4 h-16 w-16 text-green-600" />
          <h2 className="mb-2 font-playfair text-2xl font-bold text-louvre-navy-700">
            Készen állsz, internet nélkül is!
          </h2>
          <p className="text-slate-600">Minden hangfájl a telefonodon van. Indulhat a túra.</p>
        </>
      )}

      {error && (
        <div className="mt-6 flex items-start gap-2 rounded-lg bg-red-50 p-4 text-left text-sm text-red-700">
          <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" />
          <div>
            {error}
            <button onClick={startDownload} className="mt-2 block font-semibold underline">
              Újrapróbálás
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function estimateTotal(manifest: TourManifest) {
  const BYTES_PER_SECOND = 44100 * 2
  let total = 0
  for (const station of manifest.stations) {
    for (const segment of station.segments) {
      if (segment.type === 'audio') total += segment.duration * BYTES_PER_SECOND
    }
  }
  total += (manifest.bonus.duration ?? 15) * BYTES_PER_SECOND
  return total
}
