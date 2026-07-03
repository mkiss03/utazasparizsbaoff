import { describe, expect, it } from 'vitest'
import { generateItinerary } from '../engine'
import { mockCatalog, mockRules } from '../mock-catalog'
import { isOpenAt } from '../time'
import type { TravelerPreferences } from '../types'

const basePreferences: TravelerPreferences = {
  days: 4,
  pace: 'moderate',
  interests: ['muveszet', 'gasztro'],
}

describe('generateItinerary — geo-koherencia', () => {
  it('minden nap legfeljebb annyi szomszédos zónát tartalmaz, amennyit a rules.maxZonesPerDay megenged', () => {
    const draft = generateItinerary(mockCatalog, mockRules, basePreferences, { seed: 1 })

    for (const day of draft.days) {
      expect(day.zoneIds.length).toBeLessThanOrEqual(mockRules.maxZonesPerDay)
    }
  })

  it('minden slot zónája szerepel a nap zoneIds listájában', () => {
    const draft = generateItinerary(mockCatalog, mockRules, basePreferences, { seed: 1 })

    for (const day of draft.days) {
      for (const slot of day.slots) {
        expect(day.zoneIds).toContain(slot.item.zoneId)
      }
    }
  })
})

describe('generateItinerary — energia-plafon', () => {
  it.each(['relaxed', 'moderate', 'packed'] as const)(
    'a napi energiaösszeg sosem lépi túl a %s tempóhoz tartozó plafont',
    (pace) => {
      const preferences: TravelerPreferences = { ...basePreferences, pace }
      const draft = generateItinerary(mockCatalog, mockRules, preferences, { seed: 2 })

      for (const day of draft.days) {
        const energyUsed = day.slots.reduce((sum, slot) => sum + slot.item.energyLevel, 0)
        expect(energyUsed).toBeLessThanOrEqual(mockRules.dailyEnergyCap[pace])
      }
    }
  )
})

describe('generateItinerary — nyitvatartás-validáció', () => {
  it('nulla nyitvatartás-sértéssel generál tervet, ha startDate meg van adva', () => {
    const preferences: TravelerPreferences = {
      ...basePreferences,
      days: 6,
      startDate: '2026-09-07', // hétfő
    }
    const draft = generateItinerary(mockCatalog, mockRules, preferences, { seed: 3 })

    for (const day of draft.days) {
      expect(day.date).toBeDefined()
      for (const slot of day.slots) {
        const weekday = new Date(day.date + 'T00:00:00Z').getUTCDay()
        const weekdayKey = (['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const)[weekday]
        const startMinutes = toMinutes(slot.startTime)
        const endMinutes = toMinutes(slot.endTime)

        expect(isOpenAt(slot.item.openingHours, weekdayKey, startMinutes, endMinutes)).toBe(true)
      }
    }
  })

  it('nem tesz be olyan programot, ami az adott napon zárva van', () => {
    // A Louvre keddenként zárva. Ha a nap 1 (dayIndex=1, offset a 2026-09-07
    // hétfőtől) keddre esik, a Louvre nem szerepelhet abban a napban.
    const preferences: TravelerPreferences = {
      days: 2,
      pace: 'relaxed',
      interests: ['muzeum'],
      startDate: '2026-09-07', // hétfő -> nap 2 (dayIndex 1) = kedd
    }
    const draft = generateItinerary(mockCatalog, mockRules, preferences, { seed: 4 })

    const tuesday = draft.days[1]
    expect(tuesday.slots.some((slot) => slot.item.id === 'louvre-museum')).toBe(false)
  })
})

describe('generateItinerary — a generated draft immutábilis', () => {
  it('a visszaadott draft mélyen le van fagyasztva, mutáció nem hat rá', () => {
    const draft = generateItinerary(mockCatalog, mockRules, basePreferences, { seed: 5 })

    expect(Object.isFrozen(draft)).toBe(true)
    expect(Object.isFrozen(draft.days)).toBe(true)
    expect(Object.isFrozen(draft.days[0])).toBe(true)
    expect(Object.isFrozen(draft.days[0].slots)).toBe(true)

    expect(() => {
      draft.days = []
    }).toThrow()
  })

  it('ugyanaz a bemenet (és seed) mindig ugyanazt a draftot adja -- determinisztikus', () => {
    const draftA = generateItinerary(mockCatalog, mockRules, basePreferences, { seed: 42 })
    const draftB = generateItinerary(mockCatalog, mockRules, basePreferences, { seed: 42 })

    const itemsA = draftA.days.flatMap((d) => d.slots.map((s) => s.item.id))
    const itemsB = draftB.days.flatMap((d) => d.slots.map((s) => s.item.id))

    expect(itemsA).toEqual(itemsB)
  })
})

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}
