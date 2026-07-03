import { createBrowserClient } from '@supabase/ssr'

/**
 * Dedikált Supabase kliens a `planner` sémához (böngésző oldal).
 *
 * A modul teljes adatrétege egy KÜLÖN Supabase projektben él (dev/preview),
 * elkülönítve a fő oldal production Supabase projektjétől -- lásd a
 * tervdokumentum 3. és 7. fejezetét. Emiatt ez a kliens saját
 * NEXT_PUBLIC_PLANNER_SUPABASE_* env változókat használ, NEM a fő oldal
 * NEXT_PUBLIC_SUPABASE_*-jét; a meglévő `lib/supabase/client.ts` érintetlen
 * marad.
 */
export function createPlannerClient() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_PLANNER_SUPABASE_URL || 'https://placeholder.supabase.co'
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_PLANNER_SUPABASE_ANON_KEY || 'placeholder-anon-key'

  return createBrowserClient(supabaseUrl, supabaseAnonKey, {
    db: { schema: 'planner' },
  })
}
