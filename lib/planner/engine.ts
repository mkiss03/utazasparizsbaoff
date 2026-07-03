import { nearestZone } from './geo'
import { createRng, hashStringToSeed, type Rng } from './rng'
import { buildReason, scoreItem } from './scoring'
import { formatMinutesToTime, isOpenAt, parseTimeToMinutes, weekdayForDate } from './time'
import type {
  DestinationCatalog,
  ItineraryDay,
  ItineraryDraft,
  ItinerarySlot,
  Pace,
  PlannerRules,
  ProgramItem,
  TimeOfDay,
  TravelerPreferences,
} from './types'

const SLOTS_PER_DAY: Record<Pace, number> = {
  relaxed: 2,
  moderate: 3,
  packed: 4,
}

const SLOT_TIME_SEQUENCES: Record<number, TimeOfDay[]> = {
  2: ['morning', 'afternoon'],
  3: ['morning', 'afternoon', 'evening'],
  4: ['morning', 'afternoon', 'afternoon', 'evening'],
}

const MORNING_START = parseTimeToMinutes('09:00')
const EVENING_START = parseTimeToMinutes('19:00')
const ALTERNATIVES_PER_SLOT = 2

/**
 * A tervezőmotor belépési pontja. Determinisztikus, szabályalapú --
 * NEM AI-generálás. A kimenet mindig draft: publikálni csak ember tud
 * (lásd a tervdokumentum 4. fejezetét).
 */
export function generateItinerary(
  catalog: DestinationCatalog,
  rules: PlannerRules,
  preferences: TravelerPreferences,
  options: { seed?: number } = {}
): ItineraryDraft {
  const seed = options.seed ?? hashStringToSeed(JSON.stringify(preferences))
  const rng = createRng(seed)

  const usedItemIds = new Set<string>()
  const zonesById = new Map(catalog.zones.map((z) => [z.id, z]))
  const orderedZones = rankZonesByScore(catalog, preferences)

  const days: ItineraryDay[] = []

  for (let dayIndex = 0; dayIndex < preferences.days; dayIndex++) {
    const primaryZone =
      orderedZones.length > 0 ? orderedZones[dayIndex % orderedZones.length] : undefined
    const dayZoneIds = primaryZone ? [primaryZone.id] : []

    const slotsPerDay = SLOTS_PER_DAY[preferences.pace]
    const timeSequence = SLOT_TIME_SEQUENCES[slotsPerDay]
    const energyCap = rules.dailyEnergyCap[preferences.pace]

    const day: ItineraryDay = {
      dayIndex,
      date: preferences.startDate
        ? addDaysToIsoDate(preferences.startDate, dayIndex)
        : undefined,
      zoneIds: dayZoneIds,
      slots: [],
    }

    let energyUsed = 0
    let cursorMinutes = MORNING_START
    let previousTimeOfDay: TimeOfDay | null = null

    for (const timeOfDay of timeSequence) {
      cursorMinutes = nextSlotStart(cursorMinutes, previousTimeOfDay, timeOfDay, rules)

      const candidates = findCandidates({
        catalog,
        preferences,
        zonesById,
        day,
        timeOfDay,
        usedItemIds,
        energyCap,
        energyUsed,
        weekday: day.date ? weekdayForDate(day.date, 0) : undefined,
        cursorMinutes,
        rng,
      })

      if (candidates.length === 0) {
        previousTimeOfDay = timeOfDay
        continue
      }

      const [chosen, ...rest] = candidates
      const durationMin = chosen.durationMin
      const endMinutes = cursorMinutes + durationMin

      const slot: ItinerarySlot = {
        id: `${dayIndex}-${timeOfDay}-${chosen.id}`,
        timeOfDay,
        startTime: formatMinutesToTime(cursorMinutes),
        endTime: formatMinutesToTime(endMinutes),
        item: chosen,
        reason: buildReason(chosen, preferences),
        alternatives: rest.slice(0, ALTERNATIVES_PER_SLOT),
      }

      day.slots.push(slot)
      usedItemIds.add(chosen.id)
      energyUsed += chosen.energyLevel
      cursorMinutes = endMinutes
      previousTimeOfDay = timeOfDay

      if (!day.zoneIds.includes(chosen.zoneId)) {
        day.zoneIds.push(chosen.zoneId)
      }
    }

    days.push(day)
  }

  const draft: ItineraryDraft = {
    destinationId: catalog.destinationId,
    preferences,
    days,
    generatedAt: new Date().toISOString(),
  }

  return deepFreeze(draft)
}

function rankZonesByScore(
  catalog: DestinationCatalog,
  preferences: TravelerPreferences
): typeof catalog.zones {
  const zoneScores = new Map<string, number>()

  for (const item of catalog.items) {
    const score = scoreItem(item, preferences)
    zoneScores.set(item.zoneId, (zoneScores.get(item.zoneId) ?? 0) + score)
  }

  return [...catalog.zones].sort(
    (a, b) => (zoneScores.get(b.id) ?? 0) - (zoneScores.get(a.id) ?? 0)
  )
}

interface FindCandidatesArgs {
  catalog: DestinationCatalog
  preferences: TravelerPreferences
  zonesById: Map<string, { id: string; name: string; centerLat: number; centerLng: number }>
  day: ItineraryDay
  timeOfDay: TimeOfDay
  usedItemIds: Set<string>
  energyCap: number
  energyUsed: number
  weekday: ReturnType<typeof weekdayForDate> | undefined
  cursorMinutes: number
  rng: Rng
}

/**
 * Megkeresi az adott sloth-hoz szóba jöhető programokat, rangsorolva.
 * Ha a nap elsődleges zónájában nincs elég találat, a legközelebbi szomszédos
 * zónával bővíti a napot (a rules.maxZonesPerDay korlátig).
 */
function findCandidates(args: FindCandidatesArgs): ProgramItem[] {
  const {
    catalog,
    preferences,
    zonesById,
    day,
    timeOfDay,
    usedItemIds,
    energyCap,
    energyUsed,
    weekday,
    cursorMinutes,
    rng,
  } = args

  const matches = (zoneIds: string[]) =>
    catalog.items.filter((item) => {
      if (usedItemIds.has(item.id)) return false
      if (!zoneIds.includes(item.zoneId)) return false
      if (!item.timeOfDay.includes(timeOfDay)) return false
      if (energyUsed + item.energyLevel > energyCap) return false
      if (preferences.weatherFallback && item.indoorOutdoor === 'outdoor') return false

      if (weekday) {
        const endMinutes = cursorMinutes + item.durationMin
        if (!isOpenAt(item.openingHours, weekday, cursorMinutes, endMinutes)) return false
      }

      return true
    })

  let pool = matches(day.zoneIds)

  const maxZonesPerDay = 2 // lásd rules.maxZonesPerDay a katalógus-szabályokban
  if (pool.length === 0 && day.zoneIds.length < maxZonesPerDay) {
    const primaryZone = zonesById.get(day.zoneIds[0])
    const neighbor = primaryZone
      ? nearestZone(primaryZone, catalog.zones)
      : undefined
    if (neighbor && !day.zoneIds.includes(neighbor.id)) {
      pool = matches([...day.zoneIds, neighbor.id])
      if (pool.length > 0) {
        day.zoneIds.push(neighbor.id)
      }
    }
  }

  return shuffleStableByScore(pool, preferences, rng)
}

/** Score szerint csökkenő sorrend; egyenlő pontszámnál determinisztikus, seed-elt tördelés. */
function shuffleStableByScore(
  items: ProgramItem[],
  preferences: TravelerPreferences,
  rng: Rng
): ProgramItem[] {
  return items
    .map((item) => ({ item, score: scoreItem(item, preferences), jitter: rng() }))
    .sort((a, b) => b.score - a.score || a.jitter - b.jitter || a.item.id.localeCompare(b.item.id))
    .map((entry) => entry.item)
}

function nextSlotStart(
  cursorMinutes: number,
  previousTimeOfDay: TimeOfDay | null,
  timeOfDay: TimeOfDay,
  rules: PlannerRules
): number {
  if (previousTimeOfDay === null) {
    return MORNING_START
  }

  const buffered = cursorMinutes + rules.bufferMinutes

  if (previousTimeOfDay === timeOfDay) {
    return buffered
  }

  if (timeOfDay === 'afternoon') {
    return Math.max(buffered, parseTimeToMinutes(rules.lunchWindow.end))
  }

  if (timeOfDay === 'evening') {
    return Math.max(buffered, EVENING_START)
  }

  return buffered
}

function addDaysToIsoDate(isoDate: string, offset: number): string {
  const date = new Date(isoDate + 'T00:00:00Z')
  date.setUTCDate(date.getUTCDate() + offset)
  return date.toISOString().slice(0, 10)
}

function deepFreeze<T>(value: T): T {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.values(value).forEach(deepFreeze)
    Object.freeze(value)
  }
  return value
}
