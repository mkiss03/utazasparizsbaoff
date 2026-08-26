// Louvre Audio Guide -- kézzel írt Service Worker, csak a /louvre/ scope alá
// regisztrálva (lásd app/louvre/layout.tsx). NEM érinti a fő oldal többi részét.
//
// Stratégiák:
//  - /louvre/audio/*, /louvre/icons/*  -> cache-first, örökre (a fájlnév maga
//    a verzió -- lásd fájlnév-konvenció a manifestben)
//  - /louvre/tour-manifest.json        -> stale-while-revalidate
//  - navigáció (HTML) a /louvre alatt  -> network-first, cache fallback
//  - /_next/* (JS/CSS a scope-on belüli oldalakról) -> cache-first, runtime
//    feltöltéssel, hogy a lejátszó app shell-je is elérhető legyen jelszó-
//    ill. hálózat nélkül a múzeumban.
//
// A tényleges audio-letöltést és a haladásjelzést (lásd OfflineDownloadScreen)
// a főszál végzi explicit fetch()+cache.put() hívásokkal -- ez a SW csak a
// kiszolgálásért és egy runtime biztonsági hálóért felel.

// v2: a cache-nevek verziójának bumpolása minden felhasználón tiszta lappal
// indítja újra a cache-t -- a korábbi iterációkból esetleg bennragadt hibás
// bejegyzések (rossz cache-be mentett manifest, hiányzó app shell) helyett.
const ASSET_CACHE = 'louvre-assets-v2'
const SHELL_CACHE = 'louvre-shell-v2'

self.addEventListener('install', (event) => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys()
      await Promise.all(
        keys
          .filter((key) => key.startsWith('louvre-') && key !== ASSET_CACHE && key !== SHELL_CACHE)
          .map((key) => caches.delete(key))
      )
      await self.clients.claim()
    })()
  )
})

function isAssetRequest(url) {
  return (
    url.pathname.startsWith('/louvre/audio/') ||
    // Az admin szerkesztőben feltöltött hangok/borítóképek a Supabase
    // Storage-ból ezen a same-origin proxy-n át érkeznek -- lásd
    // app/louvre/media/[...path]/route.ts. A tényleges Storage domain
    // (*.supabase.co) sosem jutna el idáig, mert lejjebb csak a saját
    // origin kéréseit kezeljük.
    url.pathname.startsWith('/louvre/media/') ||
    url.pathname.startsWith('/louvre/icons/') ||
    url.pathname === '/louvre/site.webmanifest' ||
    url.pathname === '/images/louvre1.jpeg'
  )
}

function isManifestRequest(url) {
  return url.pathname === '/louvre/tour-manifest.json'
}

function isAppShellRequest(url) {
  return url.pathname.startsWith('/_next/') || url.pathname.startsWith('/fonts/')
}

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName)
  const cached = await cache.match(request)
  if (cached) return cached
  const response = await fetch(request)
  if (response.ok) cache.put(request, response.clone())
  return response
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName)
  const cached = await cache.match(request)
  const networkPromise = fetch(request)
    .then((response) => {
      if (response.ok) cache.put(request, response.clone())
      return response
    })
    .catch(() => undefined)

  return cached || (await networkPromise) || Response.error()
}

async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName)
  try {
    const response = await fetch(request)
    if (response.ok) cache.put(request, response.clone())
    return response
  } catch (err) {
    const cached = await cache.match(request)
    if (cached) return cached
    throw err
  }
}

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return

  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return

  if (isAssetRequest(url)) {
    event.respondWith(cacheFirst(request, ASSET_CACHE))
    return
  }

  if (isManifestRequest(url)) {
    event.respondWith(staleWhileRevalidate(request, SHELL_CACHE))
    return
  }

  if (request.mode === 'navigate' && url.pathname.startsWith('/louvre')) {
    event.respondWith(networkFirst(request, SHELL_CACHE))
    return
  }

  if (isAppShellRequest(url)) {
    event.respondWith(cacheFirst(request, SHELL_CACHE))
    return
  }
})
