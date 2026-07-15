import type { Pace } from '@/lib/planner/types'

export type CompanionType = 'paar' | 'csalad' | 'baratok' | 'egyedul'
export type FlightStatus = 'booked' | 'planning-self' | 'wants-help'

/** A step-gráf csomópontjai. A tényleges bejárt útvonal a válaszoktól függ. */
export type StepKey =
  | 'opening'
  | 'flight-status'
  | 'flight-dates'
  | 'travel-window'
  | 'companion'
  | 'family'
  | 'interests'
  | 'dietary'
  | 'pace'
  | 'dream'
  | 'contact'
  | 'closing'

export interface WizardState {
  flightStatus: FlightStatus | null
  /** datetime-local input értékek (pl. "2026-09-12T14:30"), csak ha van jegy. */
  tripStart: string
  tripEnd: string
  /** input[type=month] érték (pl. "2026-09"), csak ha még nincs jegy. */
  approxMonth: string
  approxDays: number
  companion: CompanionType | null
  kidsAge: string | null
  interests: string[]
  dietary: string[]
  pace: Pace
  dreamMoment: string
  name: string
  email: string
}

export const INITIAL_WIZARD_STATE: WizardState = {
  flightStatus: null,
  tripStart: '',
  tripEnd: '',
  approxMonth: '',
  approxDays: 4,
  companion: null,
  kidsAge: null,
  interests: [],
  dietary: [],
  pace: 'moderate',
  dreamMoment: '',
  name: '',
  email: '',
}

/** A "kikkel utazol" válasz automatikusan hozzáad egy hangulati tag-et az érdeklődéshez. */
export const COMPANION_TAG: Record<CompanionType, string> = {
  paar: 'romantikus',
  csalad: 'csalad',
  baratok: 'hangulat',
  egyedul: 'pihenes',
}

/**
 * Adaptív útvonal: minden csomópont eldönti, mi jöjjön utána a válaszok
 * alapján -- ez adja a "beszélgetés-érzetet", mert két vendég ritkán járja
 * be pontosan ugyanazt az utat.
 */
export function nextStepAfter(current: StepKey, state: WizardState): StepKey {
  switch (current) {
    case 'opening':
      return 'flight-status'
    case 'flight-status':
      return state.flightStatus === 'booked' ? 'flight-dates' : 'travel-window'
    case 'flight-dates':
      return 'companion'
    case 'travel-window':
      return 'companion'
    case 'companion':
      return state.companion === 'csalad' ? 'family' : 'interests'
    case 'family':
      return 'interests'
    case 'interests':
      return state.interests.includes('gasztro') ? 'dietary' : 'pace'
    case 'dietary':
      return 'pace'
    case 'pace':
      return 'dream'
    case 'dream':
      return 'contact'
    case 'contact':
      return 'closing'
    case 'closing':
      return 'closing'
  }
}

/** Kanonikus súlyok a folyamatjelzőhöz -- az elágazó lépések a szomszédjuk közelébe esnek. */
export const STEP_PROGRESS_WEIGHT: Record<StepKey, number> = {
  opening: 0,
  'flight-status': 1,
  'flight-dates': 1.5,
  'travel-window': 1.5,
  companion: 2,
  family: 2.5,
  interests: 3,
  dietary: 3.5,
  pace: 4,
  dream: 5,
  contact: 6,
  closing: 7,
}

export const MAX_PROGRESS_WEIGHT = 7

/** A repülési dátumokból (ha vannak) hány napra tervezzen a motor. */
export function computeTripDays(state: WizardState): number {
  if (state.flightStatus === 'booked' && state.tripStart && state.tripEnd) {
    const start = new Date(state.tripStart).getTime()
    const end = new Date(state.tripEnd).getTime()
    if (Number.isFinite(start) && Number.isFinite(end) && end > start) {
      return Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)))
    }
  }
  return state.approxDays
}

/** ISO dátum (YYYY-MM-DD) a motor nyitvatartás-validációjához, ha ismert a pontos érkezés. */
export function tripStartDateOnly(state: WizardState): string | undefined {
  if (state.flightStatus === 'booked' && state.tripStart) {
    return state.tripStart.slice(0, 10)
  }
  return undefined
}

/** Tél hónapokban (dec-feb) a motor beltéri programokat priorizál. */
export function deriveWeatherFallback(state: WizardState): boolean {
  const monthSource =
    state.flightStatus === 'booked' && state.tripStart ? state.tripStart.slice(5, 7) : state.approxMonth.slice(5, 7)

  const month = Number(monthSource)
  if (!month) return false
  return month === 12 || month === 1 || month === 2
}
