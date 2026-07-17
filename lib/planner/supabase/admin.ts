import { createClient } from '@supabase/supabase-js'

/**
 * Service-role kliens a `planner` sémához, csak szerver oldali admin
 * server actionökhöz (soha nem kerül a böngészőbe).
 *
 * Miért kell ez a createPlannerClient() (anon, cookie-alapú) helyett: az
 * admin panel bejelentkezése a FŐ oldal Supabase projektjén él, a planner
 * viszont egy KÜLÖN Supabase projekt -- így az admin session cookie-ja ott
 * sosem hitelesít, minden kérés anonként érkezik. A "admin full access"
 * RLS policy-k (auth.role() = 'authenticated') ezért soha nem engednek át
 * semmit az admin server actionöknek, még akkor sem, ha a hívó ténylegesen
 * be van jelentkezve a fő oldalon. A service-role kulcs megkerüli az
 * RLS-t -- ez biztonságos, mert ez a kliens csak szerver oldali, admin-only
 * route-ok mögötti server actionökben példányosul, sosem éri el a klienst.
 */
export function createPlannerAdminClient() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_PLANNER_SUPABASE_URL || 'https://placeholder.supabase.co'
  const serviceRoleKey =
    process.env.PLANNER_SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-role-key'

  return createClient(supabaseUrl, serviceRoleKey, {
    db: { schema: 'planner' },
    auth: { autoRefreshToken: false, persistSession: false },
  })
}
