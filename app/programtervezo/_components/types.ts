import type { Pace } from '@/lib/planner/types'

export type CompanionType = 'paar' | 'csalad' | 'baratok' | 'egyedul'

export interface WizardState {
  days: number
  companion: CompanionType | null
  interests: string[]
  pace: Pace
  name: string
  email: string
}

export const INITIAL_WIZARD_STATE: WizardState = {
  days: 4,
  companion: null,
  interests: [],
  pace: 'moderate',
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
