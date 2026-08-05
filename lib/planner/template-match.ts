import type { TemplateBudget, TemplateDisneyIntensity, TripPlan } from './trip-plan-types'

export interface TemplateAnswers {
  budget: TemplateBudget | null
  disneyIntensity: TemplateDisneyIntensity | null
  extraNight: boolean | null
  highlights: string[]
}

export const EMPTY_TEMPLATE_ANSWERS: TemplateAnswers = {
  budget: null,
  disneyIntensity: null,
  extraNight: null,
  highlights: [],
}

// Minden megválaszolt kérdésnél: pontos találat +2, "bármelyik/mindegy"
// sablon (nincs preferenciája) +1, ellentmondó válasz -2 -- így egy
// konkrétan más profilra írt sablon nem nyerhet egy semleges felett. A
// kipipált nevezetességeknél minden egyezés +1, hiányzó egyezés 0 (nem
// büntetjük, ha a sablon egyszerűen nincs megcímkézve).
export function matchTemplate(templates: TripPlan[], answers: TemplateAnswers): TripPlan | null {
  if (templates.length === 0) return null

  let best: TripPlan | null = null
  let bestScore = -Infinity

  for (const template of templates) {
    let score = 0
    score += scoreField(template.templateBudget, answers.budget)
    score += scoreField(template.templateDisneyIntensity, answers.disneyIntensity)
    score += scoreField(template.templateExtraNight, answers.extraNight)
    score += answers.highlights.filter((tag) => template.templateHighlights.includes(tag)).length

    if (best === null || score > bestScore || (score === bestScore && template.sortOrder < best.sortOrder)) {
      best = template
      bestScore = score
    }
  }

  return best
}

function scoreField<T>(templateValue: T | null, answerValue: T | null): number {
  if (answerValue === null) return 0
  if (templateValue === null) return 1
  return templateValue === answerValue ? 2 : -2
}
