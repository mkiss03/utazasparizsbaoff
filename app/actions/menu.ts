'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { MenuSetting } from '@/lib/types/database'

export async function getMenuSettings(): Promise<MenuSetting[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('menu_settings')
    .select('*')
    .order('sort_order', { ascending: true })
  return (data as MenuSetting[]) ?? []
}

export async function updateMenuSetting(
  menuKey: string,
  isActive: boolean,
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('menu_settings')
    .update({ is_active: isActive })
    .eq('menu_key', menuKey)
  if (error) return { success: false, error: error.message }
  revalidatePath('/', 'layout')
  return { success: true }
}
