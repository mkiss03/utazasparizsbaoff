// Egyszerű, fix programterv-sablon típusai -- lásd a
// supabase/migrations/007_create_planner_trip_plans.sql fejlécét.
// Szándékosan szabad szöveges, nem a motor (ProgramItem) struktúráját
// követi: Viktória kézzel írja/szerkeszti a tartalmat.

export interface TripPlanItem {
  id: string
  time?: string
  text: string
  confirmed: boolean
}

export interface TripPlanDay {
  id: string
  dateLabel: string
  note?: string
  items: TripPlanItem[]
}

export interface TripPlan {
  id: string
  destinationId: string
  guestName: string
  dateRangeLabel: string
  accommodation: string
  headcount: number | null
  days: TripPlanDay[]
  curatorMessage: string
  isPublished: boolean
  shareToken: string
  createdAt: string
  updatedAt: string
}

export type TripPlanDraft = Omit<TripPlan, 'id' | 'destinationId' | 'shareToken' | 'createdAt' | 'updatedAt'>

export function createEmptyTripPlanItem(): TripPlanItem {
  return { id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, text: '', confirmed: false }
}

export function createEmptyTripPlanDay(dateLabel = 'Új nap'): TripPlanDay {
  return {
    id: `day-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    dateLabel,
    items: [createEmptyTripPlanItem()],
  }
}

export const DISNEYLAND_DAY_TEMPLATE: Omit<TripPlanDay, 'id'> = {
  dateLabel: 'Disneyland-nap',
  note: 'Egész napos program -- a jegyeket előre lefoglaljuk.',
  items: [
    { id: 'disney-1', time: '8:30', text: 'Indulás a szállásról', confirmed: false },
    { id: 'disney-2', time: '9:30', text: 'Belépés a Disneyland Parkba', confirmed: true },
    { id: 'disney-3', text: 'Egész napos szabad program a parkban', confirmed: false },
    { id: 'disney-4', time: '20:00', text: 'Esti fényshow / tűzijáték', confirmed: false },
  ],
}

export const DEFAULT_CURATOR_MESSAGE =
  'A többi napot mindig este beszéljük meg -- ha bármi változna, csak szólj! 😊'

export function emptyTripPlanDraft(): TripPlanDraft {
  return {
    guestName: '',
    dateRangeLabel: '',
    accommodation: '',
    headcount: null,
    days: [createEmptyTripPlanDay('1. nap -- Érkezés')],
    curatorMessage: DEFAULT_CURATOR_MESSAGE,
    isPublished: false,
  }
}
