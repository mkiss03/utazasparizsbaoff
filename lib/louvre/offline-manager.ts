'use client'

import type { AudioSegment, TourManifest } from './types'

export const ASSET_CACHE_NAME = 'louvre-assets-v1'

export interface TourAsset {
  url: string
  stationId: string | null
  /** Approximate size in bytes -- used only for the progress UI, not for integrity. */
  estimatedBytes: number
}

// Placeholder hangfájlok kb. 44 KB/s-al számolnak (22.05 kHz, 16 bit, mono
// PCM WAV). Éles narrációnál (AAC, 48-64 kbps) ez az érték jóval kisebb lesz,
// de amíg nincsenek végleges felvételek, ez adja a legpontosabb becslést.
const BYTES_PER_SECOND_ESTIMATE = 44100 * 2

export function collectAssets(manifest: TourManifest): TourAsset[] {
  const assets: TourAsset[] = []

  for (const station of manifest.stations) {
    if (station.coverImage) {
      assets.push({ url: station.coverImage, stationId: station.id, estimatedBytes: 150_000 })
    }
    for (const segment of station.segments) {
      if (segment.type === 'audio') {
        const audio = segment as AudioSegment
        assets.push({
          url: audio.src,
          stationId: station.id,
          estimatedBytes: audio.duration * BYTES_PER_SECOND_ESTIMATE,
        })
      }
    }
  }

  assets.push({
    url: manifest.bonus.audio,
    stationId: null,
    estimatedBytes: (manifest.bonus.duration ?? 15) * BYTES_PER_SECOND_ESTIMATE,
  })

  return assets
}

export interface DownloadProgress {
  downloadedAssets: number
  totalAssets: number
  downloadedBytes: number
  totalBytes: number
  currentStationsReady: number
  totalStations: number
  done: boolean
}

export async function downloadTourAssets(
  manifest: TourManifest,
  onProgress: (progress: DownloadProgress) => void
): Promise<void> {
  const assets = collectAssets(manifest)
  const cache = await caches.open(ASSET_CACHE_NAME)
  const totalBytes = assets.reduce((sum, a) => sum + a.estimatedBytes, 0)
  const stationIds = manifest.stations.map((s) => s.id)
  const readyStations = new Set<string>()

  let downloadedAssets = 0
  let downloadedBytes = 0

  const emit = () => {
    const currentStationsReady = stationIds.filter((id) =>
      assets
        .filter((a) => a.stationId === id)
        .every((a) => readyStations.has(`${id}::${a.url}`))
    ).length

    onProgress({
      downloadedAssets,
      totalAssets: assets.length,
      downloadedBytes,
      totalBytes,
      currentStationsReady,
      totalStations: stationIds.length,
      done: downloadedAssets === assets.length,
    })
  }

  emit()

  for (const asset of assets) {
    const alreadyCached = await cache.match(asset.url)
    if (!alreadyCached) {
      const response = await fetch(asset.url)
      if (!response.ok) {
        throw new Error(`Nem sikerült letölteni: ${asset.url} (${response.status})`)
      }
      await cache.put(asset.url, response)
    }
    if (asset.stationId) readyStations.add(`${asset.stationId}::${asset.url}`)
    downloadedAssets += 1
    downloadedBytes += asset.estimatedBytes
    emit()
  }

  // A manifest JSON-t és a webmanifestet is a cache-be tesszük, hogy a
  // következő nyitáskor a Service Worker teljesen offline ki tudja szolgálni.
  await cache.put('/louvre/tour-manifest.json', new Response(JSON.stringify(manifest), {
    headers: { 'Content-Type': 'application/json' },
  }))
}

export async function checkIntegrity(manifest: TourManifest): Promise<{ ok: boolean; missing: string[] }> {
  if (typeof caches === 'undefined') return { ok: false, missing: [] }
  const cache = await caches.open(ASSET_CACHE_NAME)
  const assets = collectAssets(manifest)
  const missing: string[] = []

  for (const asset of assets) {
    const match = await cache.match(asset.url)
    if (!match) missing.push(asset.url)
  }

  return { ok: missing.length === 0, missing }
}

export function formatMB(bytes: number): string {
  return (bytes / (1024 * 1024)).toFixed(1)
}
