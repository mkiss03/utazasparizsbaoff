import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

// A Programszervező modul (lásd a tervdokumentumot) minden route-ja csak a
// NEXT_PUBLIC_FEATURE_PLANNER flag mögött él. Flag nélkül 404-et adunk,
// mielőtt bármi más (session-frissítés, renderelés) lefutna.
//
// Az egyszerű, kézzel összeállított programterv (planner.trip_plans) egy
// KÜLÖN, önálló flaggel (NEXT_PUBLIC_FEATURE_TRIP_PLANS) fut -- ez a valós
// ügyfélfolyamat, a fenti wizard/flow-szerkesztő pedig önálló, később
// külön értékesíthető modulként marad meg, változatlanul.
const PLANNER_ROUTE_PREFIXES = ['/labs/planner', '/programtervezo-legacy', '/admin/programtervezo-editor']
const TRIP_PLAN_ROUTE_PREFIXES = ['/programterv/', '/admin/programtervek', '/programtervezo']

function isBlocked(pathname: string): boolean {
  if (PLANNER_ROUTE_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return process.env.NEXT_PUBLIC_FEATURE_PLANNER !== 'true'
  }
  if (TRIP_PLAN_ROUTE_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return process.env.NEXT_PUBLIC_FEATURE_TRIP_PLANS !== 'true'
  }
  return false
}

export async function middleware(request: NextRequest) {
  if (isBlocked(request.nextUrl.pathname)) {
    return new NextResponse(null, { status: 404 })
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
