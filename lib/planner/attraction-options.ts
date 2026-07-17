// A /programtervezo kérdőívének nevezetesség-kipipálójához, és az admin
// összeállító "Kiemelt helyszínek" tag-választójához használt, közös,
// kézzel karbantartott lista -- szándékosan nem a program_items
// katalógusból generálva, mert ez a fix sablonok kézzel írt tartalmához
// illeszkedő, kis, stabil lista kell legyen.

export interface AttractionOption {
  tag: string
  label: string
}

export const ATTRACTION_OPTIONS: AttractionOption[] = [
  { tag: 'eiffel', label: 'Eiffel-torony' },
  { tag: 'louvre', label: 'Louvre' },
  { tag: 'notre-dame', label: 'Notre-Dame' },
  { tag: 'montmartre', label: 'Montmartre / Sacré-Cœur' },
  { tag: 'versailles', label: 'Versailles' },
  { tag: 'champs-elysees', label: 'Champs-Élysées / Diadalív' },
  { tag: 'luxembourg', label: 'Luxemburg-kert' },
  { tag: 'seine-cruise', label: 'Szajna-hajózás' },
  { tag: 'opera-garnier', label: 'Opera Garnier' },
]
