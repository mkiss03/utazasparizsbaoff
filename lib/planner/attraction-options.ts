// A /programtervezo kérdőívének nevezetesség-kipipálójához, és az admin
// összeállító "Kiemelt helyszínek" tag-választójához használt, közös,
// kézzel karbantartott lista -- szándékosan nem a program_items
// katalógusból generálva, mert ez a fix sablonok kézzel írt tartalmához
// illeszkedő, kis, stabil lista kell legyen.
//
// Három kategóriába rendezve (ügyfél-visszajelzés alapján): belépőjegyes,
// ingyenesen látogatható, és a Disneyland önálló kategóriaként -- ha ezt
// választják, a kérdéssor felteszi a Disneyland-intenzitás kérdést is,
// egyébként az a lépés ki van hagyva.

export type AttractionCategory = 'ticketed' | 'free' | 'disneyland'

export interface AttractionOption {
  tag: string
  label: string
  category: AttractionCategory
}

export const DISNEYLAND_ATTRACTION_TAG = 'disneyland'

export const ATTRACTION_OPTIONS: AttractionOption[] = [
  { tag: 'louvre', label: 'Louvre', category: 'ticketed' },
  { tag: 'notre-dame-torony', label: 'Notre-Dame -- torony', category: 'ticketed' },
  { tag: 'versailles', label: 'Versailles', category: 'ticketed' },
  { tag: 'eiffel-csucs', label: 'Eiffel-torony -- felvonó a csúcsra', category: 'ticketed' },
  { tag: 'opera-garnier-belso', label: 'Opera Garnier -- belső látogatás', category: 'ticketed' },

  { tag: 'eiffel-kivulrol', label: 'Eiffel-torony -- kívülről', category: 'free' },
  { tag: 'notre-dame-kivulrol', label: 'Notre-Dame -- kívülről', category: 'free' },
  { tag: 'montmartre', label: 'Montmartre / Sacré-Cœur', category: 'free' },
  { tag: 'champs-elysees', label: 'Champs-Élysées / Diadalív', category: 'free' },
  { tag: 'luxembourg', label: 'Luxemburg-kert', category: 'free' },
  { tag: 'seine-cruise', label: 'Szajna-part séta', category: 'free' },

  { tag: DISNEYLAND_ATTRACTION_TAG, label: 'Disneyland', category: 'disneyland' },
]

export const ATTRACTION_CATEGORY_LABELS: Record<AttractionCategory, string> = {
  ticketed: 'Belépőjegyes nevezetességek',
  free: 'Ingyenesen látogatható nevezetességek',
  disneyland: 'Disneyland',
}
