import type { WeekdayKey } from './types'

const WEEKDAYS: WeekdayKey[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']

export function parseTimeToMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

export function formatMinutesToTime(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60) % 24
  const m = totalMinutes % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

export function weekdayForDate(isoDate: string, dayOffset: number): WeekdayKey {
  const base = new Date(isoDate + 'T00:00:00Z')
  base.setUTCDate(base.getUTCDate() + dayOffset)
  return WEEKDAYS[base.getUTCDay()]
}

/**
 * Ellenőrzi, hogy egy program nyitva van-e az adott napon és időpontban.
 * Ha nincs nyitvatartás megadva (opening_hours üres), nyitva vagunk feltételezzük.
 */
export function isOpenAt(
  openingHours: Partial<Record<WeekdayKey, string>> | undefined,
  weekday: WeekdayKey,
  startMinutes: number,
  endMinutes: number
): boolean {
  if (!openingHours || Object.keys(openingHours).length === 0) return true

  const range = openingHours[weekday]
  if (!range || range === 'closed') return false

  const [openStr, closeStr] = range.split('-')
  const openMinutes = parseTimeToMinutes(openStr)
  const closeMinutes = parseTimeToMinutes(closeStr)

  return startMinutes >= openMinutes && endMinutes <= closeMinutes
}
