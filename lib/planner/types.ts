// Programszervező motor — típusok
//
// Ez a modul desztináció-független: semmit nem tud Párizsról, mindent
// konfigurációként (DestinationCatalog) kap. Lásd a tervdokumentum 2.1 és
// 4. fejezetét.

export type TimeOfDay = 'morning' | 'afternoon' | 'evening'
export type IndoorOutdoor = 'indoor' | 'outdoor' | 'mixed'
export type Pace = 'relaxed' | 'moderate' | 'packed'

export interface TravelerPreferences {
  days: number
  pace: Pace
  interests: string[] // category / tag slugok, pl. ['muzeum', 'gasztro']
  startDate?: string // ISO date, csak nyitvatartás-validációhoz kell
  /** Ha true, a motor minden slothoz beltéri alternatívát priorizál (esős nap). */
  weatherFallback?: boolean
}

export interface ProgramItem {
  id: string
  title: string
  description?: string
  category: string
  durationMin: number
  energyLevel: 1 | 2 | 3
  timeOfDay: TimeOfDay[]
  indoorOutdoor: IndoorOutdoor
  zoneId: string
  openingHours?: Partial<Record<WeekdayKey, string>> // "09:00-18:00" | "closed"
  priceRange?: string
  bookingRequired?: boolean
  tags: string[]
  priority: number
}

export type WeekdayKey = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'

export interface Zone {
  id: string
  name: string
  centerLat: number
  centerLng: number
}

export interface DestinationCatalog {
  destinationId: string
  zones: Zone[]
  items: ProgramItem[]
}

export interface PlannerRules {
  maxZonesPerDay: number
  lunchWindow: { start: string; end: string } // "HH:MM"
  dailyEnergyCap: Record<Pace, number>
  bufferMinutes: number
}

export interface ItinerarySlot {
  id: string
  timeOfDay: TimeOfDay
  startTime: string // "HH:MM"
  endTime: string // "HH:MM"
  item: ProgramItem
  reason: string
  alternatives: ProgramItem[]
}

export interface ItineraryDay {
  dayIndex: number
  date?: string
  zoneIds: string[]
  slots: ItinerarySlot[]
}

export interface ItineraryDraft {
  destinationId: string
  preferences: TravelerPreferences
  days: ItineraryDay[]
  generatedAt: string
}
