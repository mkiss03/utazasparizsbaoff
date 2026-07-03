import { createBrowserClient } from '@supabase/ssr'

/**
 * Dedikált Supabase kliens a `planner` sémához (böngésző oldal).
 *
 * A modul teljes adatrétege a `planner` sémában él, a `public` sémától
 * elkülönítve -- lásd a tervdokumentum 3. fejezetét. Emiatt ez a kliens
 * mindig expliciten a `planner` sémát célozza meg; a meglévő
 * `lib/supabase/client.ts` (public séma) érintetlen marad.
 */
export function createPlannerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'

  return createBrowserClient(supabaseUrl, supabaseAnonKey, {
    db: { schema: 'planner' },
  })
}
