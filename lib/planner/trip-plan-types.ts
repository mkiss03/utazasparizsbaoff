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

export type TemplateBudget = 'economy' | 'mid' | 'premium'

export type TemplateDisneyIntensity = 'none' | 'one_day_one_park' | 'one_day_two_parks' | 'two_days_two_parks'

export interface TripPlan {
  id: string
  destinationId: string
  guestName: string
  guestEmail: string
  guestNotes: string
  // A vendég által a checklistán kiválasztott nevezetesség-tag-ek
  // strukturáltan, hogy az admin szerkesztő ezekből konkrét
  // "add hozzá a X. naphoz" gombokat tudjon építeni.
  guestHighlights: string[]
  dateRangeLabel: string
  accommodation: string
  headcount: number | null
  days: TripPlanDay[]
  curatorMessage: string
  isPublished: boolean
  shareToken: string
  isTemplate: boolean
  templateTitle: string
  templateTeaser: string
  templateImage: string
  sortOrder: number
  // Illesztési mezők a /programtervezo kérdőívéhez -- null = a sablon
  // bármelyik válaszra illik ebben a szempontban.
  templateBudget: TemplateBudget | null
  templateDisneyIntensity: TemplateDisneyIntensity | null
  templateExtraNight: boolean | null
  templateHighlights: string[]
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
    guestEmail: '',
    guestNotes: '',
    guestHighlights: [],
    dateRangeLabel: '',
    accommodation: '',
    headcount: null,
    days: [createEmptyTripPlanDay('1. nap -- Érkezés')],
    curatorMessage: DEFAULT_CURATOR_MESSAGE,
    isPublished: false,
    isTemplate: false,
    templateTitle: '',
    templateTeaser: '',
    templateImage: '',
    sortOrder: 0,
    templateBudget: null,
    templateDisneyIntensity: null,
    templateExtraNight: null,
    templateHighlights: [],
  }
}
