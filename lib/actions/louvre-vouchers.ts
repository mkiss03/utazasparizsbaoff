'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { generateVoucherCodes, ACTIVATION_WINDOW_HOURS, MAX_DEVICE_SWAPS } from '@/lib/louvre/voucher-codes'

type ActionResult<T = undefined> = { success: true; data: T } | { success: false; error: string }

interface GenerateInput {
  count: number
  email?: string
  batchSize?: number
  notes?: string
}

/** Admin-only: kódok kézi generálása (pl. banki utalás vagy személyes átadás után). */
export async function generateVouchers(input: GenerateInput): Promise<ActionResult<{ codes: string[] }>> {
  const count = Math.max(1, Math.min(20, Math.floor(input.count) || 0))
  if (count < 1) return { success: false, error: 'Legalább 1 kódot generálni kell.' }

  const supabase = await createClient()
  const codes = generateVoucherCodes(count)

  const { error } = await supabase.from('louvre_vouchers').insert(
    codes.map((code) => ({
      code,
      email: input.email?.trim().toLowerCase() || null,
      batch_size: input.batchSize ?? count,
      notes: input.notes?.trim() || null,
    }))
  )

  if (error) {
    console.error('Louvre voucher generation error:', error)
    return { success: false, error: `Nem sikerült létrehozni a kódokat (${error.message}).` }
  }

  return { success: true, data: { codes } }
}

/** Admin-only: kód visszavonása / visszaállítása. */
export async function setVoucherRevoked(code: string, revoked: boolean): Promise<ActionResult> {
  const supabase = await createClient()
  const { error } = await supabase.from('louvre_vouchers').update({ revoked }).eq('code', code)
  if (error) return { success: false, error: error.message }
  return { success: true, data: undefined }
}

/** Admin-only: kód végleges törlése. */
export async function deleteVoucher(code: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { error } = await supabase.from('louvre_vouchers').delete().eq('code', code)
  if (error) return { success: false, error: error.message }
  return { success: true, data: undefined }
}

interface ActivationResult {
  expiresAt: string
}

/**
 * Aktiválás / meglévő eszközön újranyitás. Service role klienssel fut, mert
 * ezt egy nem bejelentkezett látogató hívja (a jövőbeli publikus beváltó
 * felületről) -- a kód ismerete maga az engedély, az RLS-t itt szándékosan
 * kerüljük meg, minden szabályt ez a függvény kényszerít ki.
 */
export async function activateVoucher(code: string, deviceId: string): Promise<ActionResult<ActivationResult>> {
  const normalizedCode = code.trim().toUpperCase()
  if (!normalizedCode || !deviceId) {
    return { success: false, error: 'Hiányzó kód vagy eszközazonosító.' }
  }

  const supabase = createAdminClient()
  const { data: voucher, error } = await supabase
    .from('louvre_vouchers')
    .select('*')
    .eq('code', normalizedCode)
    .maybeSingle()

  if (error) return { success: false, error: error.message }
  if (!voucher) return { success: false, error: 'Érvénytelen voucherkód.' }
  if (voucher.revoked) return { success: false, error: 'Ez a voucherkód vissza lett vonva.' }

  const now = new Date()

  // Első aktiválás -- elindul a 48 órás ablak.
  if (!voucher.activated_at) {
    const expiresAt = new Date(now.getTime() + ACTIVATION_WINDOW_HOURS * 60 * 60 * 1000)
    const { error: updateError } = await supabase
      .from('louvre_vouchers')
      .update({ activated_at: now.toISOString(), expires_at: expiresAt.toISOString(), device_id: deviceId })
      .eq('code', normalizedCode)

    if (updateError) return { success: false, error: updateError.message }
    return { success: true, data: { expiresAt: expiresAt.toISOString() } }
  }

  // Már aktiválva -- lejárt-e?
  if (voucher.expires_at && new Date(voucher.expires_at) < now) {
    return { success: false, error: 'Ennek a voucherkódnak lejárt a 48 órás érvényességi ideje.' }
  }

  // Ugyanaz az eszköz -- egyszerű, ismételt megnyitás.
  if (voucher.device_id === deviceId) {
    return { success: true, data: { expiresAt: voucher.expires_at as string } }
  }

  // Másik eszköz próbálja aktiválni -- ehhez explicit eszközcsere kell.
  return {
    success: false,
    error: 'Ezt a kódot már egy másik eszközön aktiválták. Eszközváltáshoz használd az eszközcsere funkciót.',
  }
}

/** Egyszeri eszközcsere -- max. MAX_DEVICE_SWAPS alkalommal engedélyezett. */
export async function swapVoucherDevice(code: string, newDeviceId: string): Promise<ActionResult<ActivationResult>> {
  const normalizedCode = code.trim().toUpperCase()
  if (!normalizedCode || !newDeviceId) {
    return { success: false, error: 'Hiányzó kód vagy eszközazonosító.' }
  }

  const supabase = createAdminClient()
  const { data: voucher, error } = await supabase
    .from('louvre_vouchers')
    .select('*')
    .eq('code', normalizedCode)
    .maybeSingle()

  if (error) return { success: false, error: error.message }
  if (!voucher) return { success: false, error: 'Érvénytelen voucherkód.' }
  if (voucher.revoked) return { success: false, error: 'Ez a voucherkód vissza lett vonva.' }
  if (!voucher.activated_at) return { success: false, error: 'Ez a kód még nincs aktiválva.' }
  if (voucher.expires_at && new Date(voucher.expires_at) < new Date()) {
    return { success: false, error: 'Ennek a voucherkódnak lejárt az érvényességi ideje.' }
  }
  if ((voucher.device_swaps ?? 0) >= MAX_DEVICE_SWAPS) {
    return { success: false, error: 'Ehhez a kódhoz már felhasználtad az egyszeri eszközcserét.' }
  }

  const { error: updateError } = await supabase
    .from('louvre_vouchers')
    .update({ device_id: newDeviceId, device_swaps: (voucher.device_swaps ?? 0) + 1 })
    .eq('code', normalizedCode)

  if (updateError) return { success: false, error: updateError.message }
  return { success: true, data: { expiresAt: voucher.expires_at as string } }
}
