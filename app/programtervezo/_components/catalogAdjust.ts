import { scoreItem } from '@/lib/planner/scoring'
import { mockCatalog } from '@/lib/planner/mock-catalog'
import type { DestinationCatalog, ProgramItem, TravelerPreferences } from '@/lib/planner/types'
import type { WizardState } from './types'

/**
 * Az érdeklődés-részletezés (interest-detail) alkategóriáit a katalógus
 * meglévő tag-jeire képezzük le, ahol van valódi egyezés -- így a wizard
 * mélyebb kérdései TÉNYLEGESEN befolyásolják a végeredményt, nem csak
 * díszítő adatok. Ahol nincs jó egyezés, a válasz akkor is bekerül a
 * guestContext-be Viktória számára, csak a motor pontozását nem módosítja.
 */
export const SUBCATEGORY_TAG_BOOST: Record<string, string[]> = {
  // Művészet
  'Impresszionizmus': ['muveszet'],
  'Klasszikus mesterek': ['muveszet', 'kultura'],
  'Kortárs / utcaművészet': ['muveszet', 'hangulat'],
  'Építészet': ['muveszet', 'kultura', 'fotozas'],
  // Gasztronómia
  'Bisztró / hagyományos': ['gasztro', 'helyi'],
  'Fine dining': ['gasztro'],
  'Piacok és pékségek': ['gasztro', 'helyi'],
  'Kávéházi kultúra': ['kave', 'hangulat'],
  // Kultúra és történelem
  'Ókor és középkor': ['kultura'],
  'Forradalom és köztársaság': ['kultura'],
  'Modern történelem': ['kultura'],
  'Vallási emlékek': ['kultura', 'beltéri'],
  // Panoráma és kilátás
  'Magas kilátópontok': ['kilatas', 'fotozas'],
  'Folyóparti panoráma': ['kilatas', 'romantikus'],
  'Naplemente-helyszínek': ['kilatas', 'esti', 'romantikus'],
  'Rejtett, kevésbé zsúfolt pontok': ['kilatas'],
  // Parkok, természet
  'Nagy parkok': ['termeszet', 'pihenes'],
  'Kis rejtett kertek': ['termeszet'],
  'Botanikus / tematikus kertek': ['termeszet'],
  'Folyóparti séták': ['termeszet', 'romantikus'],
  // Romantikus helyszínek
  'Naplemente-programok': ['romantikus', 'esti', 'kilatas'],
  'Intim kis utcák': ['romantikus', 'hangulat'],
  'Szajna-parti esti séta': ['romantikus', 'esti'],
  'Meglepetés-vacsora ötletek': ['romantikus', 'gasztro'],
  // Kávéházi hangulat
  'Történelmi kávéházak': ['kave', 'kultura'],
  'Modern specialty coffee': ['kave'],
  'Pékség-kávézók': ['kave', 'gasztro'],
  'Rejtett, helyi kedvenc': ['kave', 'helyi'],
}

export const INTEREST_SUBCATEGORIES: Record<string, string[]> = {
  muveszet: ['Impresszionizmus', 'Klasszikus mesterek', 'Kortárs / utcaművészet', 'Építészet'],
  gasztro: ['Bisztró / hagyományos', 'Fine dining', 'Piacok és pékségek', 'Kávéházi kultúra'],
  kultura: ['Ókor és középkor', 'Forradalom és köztársaság', 'Modern történelem', 'Vallási emlékek'],
  kilatas: ['Magas kilátópontok', 'Folyóparti panoráma', 'Naplemente-helyszínek', 'Rejtett, kevésbé zsúfolt pontok'],
  termeszet: ['Nagy parkok', 'Kis rejtett kertek', 'Botanikus / tematikus kertek', 'Folyóparti séták'],
  romantikus: ['Naplemente-programok', 'Intim kis utcák', 'Szajna-parti esti séta', 'Meglepetés-vacsora ötletek'],
  kave: ['Történelmi kávéházak', 'Modern specialty coffee', 'Pékség-kávézók', 'Rejtett, helyi kedvenc'],
}

export const INTEREST_CATEGORY_LABEL: Record<string, string> = {
  muveszet: 'Művészet',
  gasztro: 'Gasztronómia',
  kultura: 'Kultúra és történelem',
  kilatas: 'Panoráma és kilátás',
  termeszet: 'Parkok, természet',
  romantikus: 'Romantikus helyszínek',
  kave: 'Kávéházi hangulat',
}

const BUDGET_PRICE_BOOST: Record<string, Partial<Record<string, number>>> = {
  gazdasagos: { ingyenes: 8, '€': 4, '€€': -2, '€€€': -8 },
  kozepkategoria: { ingyenes: 2, '€': 4, '€€': 4, '€€€': -2 },
  premium: { ingyenes: -4, '€': -2, '€€': 4, '€€€': 8 },
}

function baseTravelerPreferences(state: WizardState): TravelerPreferences {
  const interests = Array.from(new Set(state.interests))
  return { days: state.approxDays, pace: state.pace, interests }
}

/** Az összegyűjtött alkategória- és költségkeret-válaszok priority-bónuszt adnak a megfelelő tag-ekhez. */
function boostedPriority(item: ProgramItem, state: WizardState): number {
  let boost = 0

  for (const subcategories of Object.values(state.interestDetails)) {
    for (const subcategory of subcategories) {
      const boostTags = SUBCATEGORY_TAG_BOOST[subcategory] ?? []
      if (boostTags.some((tag) => tag === item.category || item.tags.includes(tag))) {
        boost += 4
      }
    }
  }

  if (state.budgetBand && state.budgetBand !== 'nem-tudom' && item.priceRange) {
    boost += BUDGET_PRICE_BOOST[state.budgetBand]?.[item.priceRange] ?? 0
  }

  if (state.likedItemIds.includes(item.id)) boost += 12
  if (state.dislikedItemIds.includes(item.id)) boost -= 12

  return Math.max(0, item.priority + boost)
}

/** Rangsorolt, deduplikált jelöltek a "hely-előnézet" kártyákhoz. */
export function computePlacePreviewCandidates(state: WizardState, count = 6): ProgramItem[] {
  const preferences = baseTravelerPreferences(state)

  return [...mockCatalog.items]
    .map((item) => ({ item, score: scoreItem(item, preferences) + boostedPriority(item, state) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map((entry) => entry.item)
}

/** A végleges terv generálásához: a katalógus egy módosított priority-jú másolata. */
export function buildAdjustedCatalog(state: WizardState): DestinationCatalog {
  return {
    ...mockCatalog,
    items: mockCatalog.items.map((item) => ({
      ...item,
      priority: boostedPriority(item, state),
    })),
  }
}
