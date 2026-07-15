import type { Pace } from '@/lib/planner/types'

export type CompanionType = 'paar' | 'csalad' | 'baratok' | 'egyedul'
export type Season = 'tavasz' | 'nyar' | 'osz' | 'tel' | null

/** A step-gráf csomópontjai. A tényleges bejárt útvonal a válaszoktól függ. */
export type StepKey =
  | 'opening'
  | 'season'
  | 'companion'
  | 'family'
  | 'interests'
  | 'dietary'
  | 'pace'
  | 'dream'
  | 'contact'
  | 'closing'

export interface WizardState {
  days: number
  season: Season
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
  days: 4,
  season: null,
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
      return 'season'
    case 'season':
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
  season: 1,
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
