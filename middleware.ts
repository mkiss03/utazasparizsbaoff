import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

// A Programszervező modul (lásd a tervdokumentumot) minden route-ja csak a
// NEXT_PUBLIC_FEATURE_PLANNER flag mögött él. Flag nélkül 404-et adunk,
// mielőtt bármi más (session-frissítés, renderelés) lefutna.
function isPlannerRouteBlocked(pathname: string): boolean {
  const isPlannerRoute = pathname.startsWith('/labs/planner')
  return isPlannerRoute && process.env.NEXT_PUBLIC_FEATURE_PLANNER !== 'true'
}

export async function middleware(request: NextRequest) {
  if (isPlannerRouteBlocked(request.nextUrl.pathname)) {
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
