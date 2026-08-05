import type { TripPlanDay } from './trip-plan-types'

// A sablonok napcímkéi ("07.11. szombat -- Érkezés") a sablon saját,
// példa dátumára vannak írva -- ha egy vendég igénylése egy adott,
// naptárban kiválasztott dátumtartományra vonatkozik, a napcímkéket a
// VALÓS dátumokra kell átírni, a "-- Érkezés" / "-- Disneyland-nap" jellegű
// leíró toldalékot viszont meg kell tartani.

function formatDatePrefix(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const weekday = new Intl.DateTimeFormat('hu-HU', { weekday: 'long' }).format(date)
  return `${month}.${day}. ${weekday}`
}

function adjustDayLabel(originalLabel: string, date: Date): string {
  const separatorIndex = originalLabel.indexOf(' -- ')
  const suffix = separatorIndex >= 0 ? originalLabel.slice(separatorIndex) : ''
  return `${formatDatePrefix(date)}${suffix}`
}

export function adjustDaysToDateRange(days: TripPlanDay[], startDate: Date | undefined): TripPlanDay[] {
  if (!startDate) return days
  return days.map((day, index) => {
    const date = new Date(startDate)
    date.setDate(date.getDate() + index)
    return { ...day, dateLabel: adjustDayLabel(day.dateLabel, date) }
  })
}
