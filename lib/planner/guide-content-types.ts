// Repülőjegy- és szállás-tanácsok a /programtervezo info-lépéseihez --
// Viktória írja/szerkeszti az admin panelből, desztináció-szintű tartalom
// (nem sablononkénti), a planner.configs.guide_content JSONB oszlopban.

export interface GuideTip {
  title: string
  description: string
}

export interface GuideContent {
  flightTips: GuideTip[]
  hotelTips: GuideTip[]
}

export function emptyGuideContent(): GuideContent {
  return { flightTips: [], hotelTips: [] }
}

export function createEmptyGuideTip(): GuideTip {
  return { title: '', description: '' }
}
