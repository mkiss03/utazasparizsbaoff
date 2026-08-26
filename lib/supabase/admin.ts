import { createClient as createSupabaseClient } from '@supabase/supabase-js'

/**
 * Service-role Supabase kliens -- KIZÁRÓLAG szerver oldali kódból ('use
 * server' action) szabad importálni, soha kliens komponensből. Megkerüli az
 * RLS-t, ezért csak olyan műveletekhez használjuk, ahol a jogosultság-
 * ellenőrzést maga a szerver kód végzi (pl. voucher aktiválás: nem
 * bejelentkezett látogató, de a kód ismerete maga az "engedély" -- ahogy egy
 * ajándékkártyánál is).
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY nincs beállítva -- ez a művelet nem tud lefutni.')
  }

  return createSupabaseClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}
