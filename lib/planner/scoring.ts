import type { ProgramItem, TravelerPreferences } from './types'

const INTEREST_MATCH_WEIGHT = 10
const PRIORITY_WEIGHT = 1
const WEATHER_FALLBACK_INDOOR_BONUS = 15

/**
 * Egy program pontszáma a vendég preferenciái alapján. Magasabb = jobban
 * illik. Az érdeklődési kör (interests) és a tag/category egyezés adja a
 * fő súlyt, ezt finomítja a kurátori priority és -- esős napra váltáskor --
 * a beltéri programok bónusza.
 */
export function scoreItem(item: ProgramItem, preferences: TravelerPreferences): number {
  let score = item.priority * PRIORITY_WEIGHT

  const matchableTags = new Set([item.category, ...item.tags])
  const interestMatches = preferences.interests.filter((interest) =>
    matchableTags.has(interest)
  ).length
  score += interestMatches * INTEREST_MATCH_WEIGHT

  if (preferences.weatherFallback && item.indoorOutdoor === 'indoor') {
    score += WEATHER_FALLBACK_INDOOR_BONUS
  }
  if (preferences.weatherFallback && item.indoorOutdoor === 'outdoor') {
    score -= WEATHER_FALLBACK_INDOOR_BONUS
  }

  return score
}

export function buildReason(item: ProgramItem, preferences: TravelerPreferences): string {
  const reasons: string[] = []

  const matchableTags = new Set([item.category, ...item.tags])
  const matchedInterest = preferences.interests.find((interest) => matchableTags.has(interest))
  if (matchedInterest) {
    reasons.push(`illik az érdeklődésedhez: ${matchedInterest}`)
  }

  if (item.priority >= 8) {
    reasons.push('kiemelt, must-see program')
  }

  if (preferences.weatherFallback && item.indoorOutdoor === 'indoor') {
    reasons.push('beltéri, jó választás esős napra')
  }

  if (reasons.length === 0) {
    reasons.push('jól illeszkedik a napi ritmusba és a zónába')
  }

  return reasons.join('; ')
}
