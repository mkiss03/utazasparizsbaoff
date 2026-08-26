'use client'

import type { AudioSegment, TourManifest } from './types'

export const ASSET_CACHE_NAME = 'louvre-assets-v1'
// FONTOS: ennek pontosan egyeznie kell a public/louvre-sw.js SHELL_CACHE
// konstansával -- külön build-lépés nélkül ez a két hardcode-olt string a
// "megosztott" definíció a főszál és a Service Worker között.
export const SHELL_CACHE_NAME = 'louvre-shell-v1'

export interface TourAsset {
  url: string
  stationId: string | null
  /** Becsült méret bájtban -- csak a haladásjelzőhöz, nem az integritás-ellenőrzéshez. */
  estimatedBytes: number
  cacheName: string
}

// Placeholder hangfájlok kb. 44 KB/s-al számolnak (22.05 kHz, 16 bit, mono
// PCM WAV). Éles narrációnál (AAC, 48-64 kbps) ez az érték jóval kisebb lesz,
// de amíg nincsenek végleges felvételek, ez adja a legpontosabb becslést.
const BYTES_PER_SECOND_ESTIMATE = 44100 * 2

function collectMediaAssets(manifest: TourManifest): TourAsset[] {
  const assets: TourAsset[] = []

  for (const station of manifest.stations) {
    if (station.coverImage) {
      assets.push({ url: station.coverImage, stationId: station.id, estimatedBytes: 150_000, cacheName: ASSET_CACHE_NAME })
    }
    for (const segment of station.segments) {
      if (segment.type === 'audio') {
        const audio = segment as AudioSegment
        assets.push({
          url: audio.src,
          stationId: station.id,
          estimatedBytes: audio.duration * BYTES_PER_SECOND_ESTIMATE,
          cacheName: ASSET_CACHE_NAME,
        })
      }
    }
  }

  assets.push({
    url: manifest.bonus.audio,
    stationId: null,
    estimatedBytes: (manifest.bonus.duration ?? 15) * BYTES_PER_SECOND_ESTIMATE,
    cacheName: ASSET_CACHE_NAME,
  })

  return assets
}

/**
 * Az app shell (a /louvre/tour HTML-je + a hozzá tartozó JS/CSS chunkok)
 * explicit előtöltése. Enélkül a telepített PWA-t offline megnyitva a
 * Service Worker nem tudna semmit kiszolgálni: a regisztráció csak a
 * KÖVETKEZŐ navigációtól fogva vezérli az oldalt, tehát az első betöltéskor
 * a fetch handler soha nem futott le, és semmi nem került cache-be -- innen
 * a "hálózati hiba" a telepített ikonra koppintva offline állapotban.
 * Mivel nincs build-idejű precache-manifestünk (Workbox), a jelenleg
 * betöltött oldal saját <script>/<link> tagjeit olvassuk ki futásidőben --
 * ezek pontosan azok a chunkok, amik a /louvre/tour megjelenítéséhez kellenek.
 */
function collectShellAssets(): TourAsset[] {
  const urls = new Set<string>(['/louvre/tour', '/louvre/site.webmanifest'])

  if (typeof document !== 'undefined') {
    document.querySelectorAll('script[src]').forEach((el) => {
      const src = (el as HTMLScriptElement).src
      if (!src) return
      const parsed = new URL(src, location.href)
      if (parsed.origin === location.origin) urls.add(parsed.pathname)
    })
    document.querySelectorAll('link[rel="stylesheet"][href]').forEach((el) => {
      const href = (el as HTMLLinkElement).href
      if (!href) return
      const parsed = new URL(href, location.href)
      if (parsed.origin === location.origin) urls.add(parsed.pathname)
    })
  }

  return Array.from(urls).map((url) => ({ url, stationId: null, estimatedBytes: 40_000, cacheName: SHELL_CACHE_NAME }))
}

export function collectAssets(manifest: TourManifest): TourAsset[] {
  return [...collectMediaAssets(manifest), ...collectShellAssets()]
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

async function openCaches(names: string[]): Promise<Map<string, Cache>> {
  const entries = await Promise.all(names.map(async (name) => [name, await caches.open(name)] as const))
  return new Map(entries)
}

export async function downloadTourAssets(
  manifest: TourManifest,
  onProgress: (progress: DownloadProgress) => void
): Promise<void> {
  const assets = collectAssets(manifest)
  const cacheHandles = await openCaches([ASSET_CACHE_NAME, SHELL_CACHE_NAME])
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

  // Néhány párhuzamos letöltés -- mobilnetes RTT mellett ez érezhetően
  // gyorsabb és a haladásjelző is sűrűbben, "élőbben" frissül, mintha
  // egyesével, sorban várnánk meg minden fájlt.
  const CONCURRENCY = 4
  let cursor = 0
  let firstError: Error | null = null

  async function worker() {
    while (cursor < assets.length) {
      const asset = assets[cursor++]
      if (firstError) return
      try {
        const cache = cacheHandles.get(asset.cacheName)!
        const alreadyCached = await cache.match(asset.url)
        let actualBytes = asset.estimatedBytes

        if (!alreadyCached) {
          const response = await fetch(asset.url)
          if (!response.ok) {
            throw new Error(`Nem sikerült letölteni: ${asset.url} (${response.status})`)
          }
          const contentLength = response.headers.get('content-length')
          if (contentLength) actualBytes = Number(contentLength)
          await cache.put(asset.url, response)
        }

        if (asset.stationId) readyStations.add(`${asset.stationId}::${asset.url}`)
        downloadedAssets += 1
        downloadedBytes += actualBytes
        emit()
      } catch (err) {
        firstError = err instanceof Error ? err : new Error(String(err))
      }
    }
  }

  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, assets.length) }, worker))

  if (firstError) throw firstError

  // A manifest JSON-t is a shell cache-be tesszük (ugyanoda, ahonnan a
  // Service Worker stale-while-revalidate módon kiszolgálja) -- így a
  // következő nyitáskor teljesen offline is elérhető.
  await cacheHandles.get(SHELL_CACHE_NAME)!.put(
    '/louvre/tour-manifest.json',
    new Response(JSON.stringify(manifest), { headers: { 'Content-Type': 'application/json' } })
  )
}

export async function checkIntegrity(manifest: TourManifest): Promise<{ ok: boolean; missing: string[] }> {
  if (typeof caches === 'undefined') return { ok: false, missing: [] }
  const assets = collectAssets(manifest)
  const cacheHandles = await openCaches([ASSET_CACHE_NAME, SHELL_CACHE_NAME])
  const missing: string[] = []

  for (const asset of assets) {
    const cache = cacheHandles.get(asset.cacheName)!
    const match = await cache.match(asset.url)
    if (!match) missing.push(asset.url)
  }

  return { ok: missing.length === 0, missing }
}

export function formatMB(bytes: number): string {
  return (bytes / (1024 * 1024)).toFixed(1)
}
