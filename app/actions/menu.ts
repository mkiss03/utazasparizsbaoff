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

export async function updateMenuSettingLabel(
  menuKey: string,
  label: string,
  href: string,
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('menu_settings')
    .update({ label: label.trim(), href: href.trim() })
    .eq('menu_key', menuKey)
  if (error) return { success: false, error: error.message }
  revalidatePath('/', 'layout')
  return { success: true }
}

export async function addMenuSetting(item: {
  menu_key: string
  label: string
  href: string
  parent_group: string
  sort_order: number
}): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { error } = await supabase.from('menu_settings').insert({
    menu_key: item.menu_key,
    label: item.label.trim(),
    href: item.href.trim(),
    parent_group: item.parent_group,
    sort_order: item.sort_order,
    is_active: true,
  })
  if (error) return { success: false, error: error.message }
  revalidatePath('/', 'layout')
  return { success: true }
}

export async function deleteMenuSetting(
  menuKey: string,
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('menu_settings')
    .delete()
    .eq('menu_key', menuKey)
  if (error) return { success: false, error: error.message }
  revalidatePath('/', 'layout')
  return { success: true }
}
