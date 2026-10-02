import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import { handleMaintenance } from '@/lib/maintenance'

// A Programszervező modul (lásd a tervdokumentumot) minden route-ja csak a
// NEXT_PUBLIC_FEATURE_PLANNER flag mögött él. Flag nélkül 404-et adunk,
// mielőtt bármi más (session-frissítés, renderelés) lefutna.
function isPlannerRouteBlocked(pathname: string): boolean {
  const isPlannerRoute = pathname.startsWith('/labs/planner')
  return isPlannerRoute && process.env.NEXT_PUBLIC_FEATURE_PLANNER !== 'true'
}

// A flashcard-webbolt oldalai (lásd FLASHCARDS-FEATURE-FLAG.md) csak a
// NEXT_PUBLIC_ENABLE_FLASHCARDS flag mögött érhetők el, közvetlen URL-lel sem.
const FLASHCARD_ROUTE_PREFIXES = ['/pricing', '/city', '/bundles', '/checkout', '/my-passes', '/paris-flashcards', '/paris/']

function matchesPrefix(pathname: string, prefix: string): boolean {
  if (prefix.endsWith('/')) return pathname.startsWith(prefix)
  return pathname === prefix || pathname.startsWith(`${prefix}/`)
}

function isFlashcardRouteBlocked(pathname: string): boolean {
  const isFlashcardRoute = FLASHCARD_ROUTE_PREFIXES.some((prefix) => matchesPrefix(pathname, prefix))
  return isFlashcardRoute && process.env.NEXT_PUBLIC_ENABLE_FLASHCARDS !== 'true'
}

// A /map-demo fejlesztői oldal, élesben nem érhető el.
function isDevRouteBlocked(pathname: string): boolean {
  return matchesPrefix(pathname, '/map-demo') && process.env.NODE_ENV === 'production'
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (isPlannerRouteBlocked(pathname) || isFlashcardRouteBlocked(pathname) || isDevRouteBlocked(pathname)) {
    return new NextResponse(null, { status: 404 })
  }

  // Karbantartás alatt a nyilvános oldalak helyett a karbantartási oldal
  // jelenik meg; az /admin elérhető marad (lásd lib/maintenance.ts).
  const maintenanceResponse = handleMaintenance(request)
  if (maintenanceResponse) {
    return maintenanceResponse
  }

  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
