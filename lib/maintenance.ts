import { NextResponse, type NextRequest } from 'next/server'

// Karbantartási mód: amíg be van kapcsolva, minden nyilvános oldal helyett egy
// "karbantartás alatt" oldal jelenik meg, a keresők felé noindex jelzéssel.
// Az /admin felület közben is elérhető marad, hogy a tartalmat javítani lehessen.
//
// Alapértelmezetten BE van kapcsolva. Újranyitás: MAINTENANCE_MODE=off a
// környezeti változók között, majd új deploy. (A next.config.mjs ugyanezt a
// változót olvassa a statikus fájlok noindex fejlécéhez.)
//
// Előnézet karbantartás közben: ha a MAINTENANCE_BYPASS_TOKEN be van állítva,
// a ?preview=<token> paraméterrel megnyitott link egy sütit ad, amellyel az
// adott böngészőben az oldal a szokásos módon látszik.

export const NOINDEX = 'noindex, nofollow, noarchive'
export const BYPASS_COOKIE = 'maintenance_bypass'
export const BYPASS_PARAM = 'preview'

export function isMaintenanceMode(): boolean {
  return process.env.MAINTENANCE_MODE !== 'off'
}

export type MaintenanceDecision = 'pass' | 'robots' | 'grant-bypass' | 'block'

export function getMaintenanceDecision(input: {
  enabled: boolean
  pathname: string
  bypassToken?: string
  cookieToken?: string
  queryToken?: string | null
}): MaintenanceDecision {
  const { enabled, pathname, bypassToken, cookieToken, queryToken } = input

  if (!enabled) return 'pass'
  if (pathname === '/robots.txt') return 'robots'
  if (pathname === '/admin' || pathname.startsWith('/admin/')) return 'pass'

  if (bypassToken) {
    if (queryToken === bypassToken) return 'grant-bypass'
    if (cookieToken === bypassToken) return 'pass'
  }

  return 'block'
}

// A feltérképezést engedjük, különben a keresők nem látnák a noindex jelzést,
// és a régi találatok bennmaradnának.
const ROBOTS_TXT = 'User-agent: *\nAllow: /\n'

const MAINTENANCE_HTML = `<!doctype html>
<html lang="hu">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="${NOINDEX}">
<title>Karbantartás – Utazás Párizsba</title>
<style>
  :root { --bg: #FAF4E8; --card: #FFFEF9; --ink: #1A1A1A; --muted: #4D4D4D; --rule: #E6D9AC; --accent: #8B7E73; color-scheme: light; }
  @media (prefers-color-scheme: dark) {
    :root { --bg: #1B1916; --card: #24211D; --ink: #F5EDD9; --muted: #C2AF90; --rule: #544D42; --accent: #D4C49E; color-scheme: dark; }
  }
  * { box-sizing: border-box; }
  body { margin: 0; min-height: 100vh; display: grid; place-items: center; padding: 24px 16px; background: var(--bg); color: var(--ink); font-family: "Montserrat", "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; }
  main { width: 100%; max-width: 520px; background: var(--card); border: 1px solid var(--rule); border-radius: 16px; padding: 40px 32px; text-align: center; }
  .brand { font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--accent); font-weight: 600; margin: 0 0 20px; }
  h1 { font-family: "Playfair Display", Georgia, "Times New Roman", serif; font-weight: 600; font-size: 28px; line-height: 1.25; margin: 0 0 12px; text-wrap: balance; }
  p { margin: 0 0 8px; color: var(--muted); }
  hr { border: 0; border-top: 1px solid var(--rule); margin: 28px 0; }
  .fr h2 { font-family: "Playfair Display", Georgia, "Times New Roman", serif; font-weight: 600; font-size: 20px; margin: 0 0 8px; }
  .contact { margin-top: 28px; font-size: 14px; }
  a { color: inherit; }
</style>
</head>
<body>
<main>
  <p class="brand">Utazás Párizsba</p>
  <h1>Az oldal jelenleg karbantartás alatt áll</h1>
  <p>Hamarosan újra elérhető. Köszönöm a türelmét!</p>
  <hr>
  <div class="fr" lang="fr">
    <h2>Site en maintenance</h2>
    <p>Le site est temporairement indisponible. Merci de votre patience.</p>
  </div>
  <p class="contact">Kapcsolat / Contact : <a href="mailto:utazasparizsba@gmail.com">utazasparizsba@gmail.com</a></p>
</main>
</body>
</html>`

const COMMON_HEADERS = {
  'Cache-Control': 'no-store, max-age=0',
  'X-Robots-Tag': NOINDEX,
}

// Karbantartás közben a megfelelő választ adja vissza, egyébként null-t
// (ilyenkor a kérés a szokásos úton megy tovább).
export function handleMaintenance(request: NextRequest): NextResponse | null {
  const bypassToken = process.env.MAINTENANCE_BYPASS_TOKEN || undefined
  const decision = getMaintenanceDecision({
    enabled: isMaintenanceMode(),
    pathname: request.nextUrl.pathname,
    bypassToken,
    cookieToken: request.cookies.get(BYPASS_COOKIE)?.value,
    queryToken: request.nextUrl.searchParams.get(BYPASS_PARAM),
  })

  switch (decision) {
    case 'pass':
      return null

    case 'robots':
      return new NextResponse(ROBOTS_TXT, {
        status: 200,
        headers: { ...COMMON_HEADERS, 'Content-Type': 'text/plain; charset=utf-8' },
      })

    case 'grant-bypass': {
      const url = request.nextUrl.clone()
      url.searchParams.delete(BYPASS_PARAM)
      const response = NextResponse.redirect(url)
      response.cookies.set(BYPASS_COOKIE, bypassToken!, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      })
      response.headers.set('Cache-Control', COMMON_HEADERS['Cache-Control'])
      return response
    }

    case 'block':
      return new NextResponse(MAINTENANCE_HTML, {
        status: 200,
        headers: { ...COMMON_HEADERS, 'Content-Type': 'text/html; charset=utf-8' },
      })
  }
}
