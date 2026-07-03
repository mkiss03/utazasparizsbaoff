import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Dedikált Supabase kliens a `planner` sémához (szerver oldal / server action).
 * Lásd a lib/planner/supabase/client.ts fejlécét.
 */
export async function createPlannerClient() {
  const cookieStore = await cookies()

  const supabaseUrl =
    process.env.NEXT_PUBLIC_PLANNER_SUPABASE_URL || 'https://placeholder.supabase.co'
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_PLANNER_SUPABASE_ANON_KEY || 'placeholder-anon-key'

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    db: { schema: 'planner' },
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        } catch {
          // A `setAll` Server Componentből hívva ignorálható, ha van
          // middleware, ami frissíti a session-t.
        }
      },
    },
  })
}
