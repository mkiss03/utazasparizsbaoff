// Louvre Audio Guide -- manifest-alapú interaktív túra típusai.
// A manifestet Viktória szerkeszti (Fázis 2-ben admin felületen); a lejátszó
// ezekre a típusokra épül, hogy a tartalom kódmódosítás nélkül bővíthető legyen.

export interface AudioSegment {
  type: 'audio'
  id: string
  src: string
  duration: number
  /** Rövid felirat -- amíg nincs végleges narráció, ez teszi követhetővé a demót. */
  caption?: string
}

export interface PauseSegment {
  type: 'pause'
  sec: number
  prompt: string
}

export interface ChoiceOption {
  label: string
  goto: string
}

export interface ChoiceSegment {
  type: 'choice'
  question: string
  options: ChoiceOption[]
}

export type Segment = AudioSegment | PauseSegment | ChoiceSegment

export interface Station {
  id: string
  title: string
  navigation: string
  coverImage?: string
  segments: Segment[]
  codeword: string
  transcript: string
}

export interface TourBonus {
  unlockPhrase: string
  audio: string
  duration?: number
}

export interface TourManifest {
  version: string
  title: string
  stations: Station[]
  bonus: TourBonus
}

export interface StationProgress {
  stationId: string
  completed: boolean
  codewordRevealed: boolean
  /** Az utoljára elért szegmens id/index -- audio szegmenseknél az id-t, egyébként az indexet tároljuk. */
  lastSegmentIndex: number
  choices: Record<string, string>
}

export interface TourState {
  manifestVersion: string
  clientId: string
  emailCaptured: boolean
  downloadComplete: boolean
  stations: Record<string, StationProgress>
  collectedCodewords: string[]
  bonusUnlocked: boolean
  updatedAt: number
}
