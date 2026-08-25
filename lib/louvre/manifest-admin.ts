import type { AudioSegment, ChoiceSegment, PauseSegment, Segment, Station, TourBonus } from './types'

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

/** Verziószám formátum: YYYY-MM-DD-NNN. Az adott napi legnagyobb sorszámot növeli. */
export function nextVersionString(existingVersions: string[]): string {
  const today = new Date()
  const datePrefix = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(
    today.getDate()
  ).padStart(2, '0')}`

  const todaysSeqs = existingVersions
    .filter((v) => v.startsWith(datePrefix))
    .map((v) => parseInt(v.slice(datePrefix.length + 1), 10))
    .filter((n) => !Number.isNaN(n))

  const nextSeq = todaysSeqs.length > 0 ? Math.max(...todaysSeqs) + 1 : 1
  return `${datePrefix}-${String(nextSeq).padStart(3, '0')}`
}

export function emptyStation(): Station {
  return {
    id: '',
    title: '',
    navigation: '',
    coverImage: '',
    segments: [],
    codeword: '',
    transcript: '',
  }
}

export function emptyAudioSegment(): AudioSegment {
  return { type: 'audio', id: '', src: '', duration: 0, caption: '' }
}

export function emptyPauseSegment(): PauseSegment {
  return { type: 'pause', sec: 15, prompt: '' }
}

export function emptyChoiceSegment(): ChoiceSegment {
  return {
    type: 'choice',
    question: '',
    options: [
      { label: '', goto: '' },
      { label: '', goto: '' },
    ],
  }
}

export function emptyBonus(): TourBonus {
  return { unlockPhrase: '', audio: '', duration: 0 }
}

export function audioSegmentIdsInStation(station: Station): string[] {
  return station.segments.filter((s): s is AudioSegment => s.type === 'audio').map((s) => s.id)
}

export function suggestBonusPhrase(stations: Station[]): string {
  return stations
    .map((s) => s.codeword.trim())
    .filter(Boolean)
    .join(' ')
}

export type { Segment }
