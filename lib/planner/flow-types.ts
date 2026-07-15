// Programszervező — vizuális flow-szerkesztő adatmodellje.
//
// Ez teszi lehetővé, hogy a wizard kérdéseit, kártyáit és elágazásait ne
// kódban, hanem egy Creator-stílusú (node + connection) szerkesztőben
// lehessen összerakni. A FlowGraph-ot a szerkesztő menti, a FlowRuntime
// játssza le vendég-nézetként.

export type NodeType =
  | 'hero'
  | 'single-select'
  | 'multi-select'
  | 'datetime-range'
  | 'month-counter'
  | 'free-text'
  | 'swipe-cards'
  | 'contact-form'
  | 'closing'

/**
 * Mihez köti a motort egy node válasza. Ez teszi lehetővé, hogy a
 * szerkesztőben Viktória (kód nélkül, egy legördülőből) megmondja, hogy egy
 * adott kérdés mit befolyásol a végleges tervben -- nem kell hozzá minden
 * flow-hoz újraírni az engine-wiringot.
 */
export type EngineBinding =
  | 'none'
  | 'days-exact'
  | 'days-approx'
  | 'pace'
  | 'interests'
  | 'budgetBand'

export interface FlowOption {
  id: string
  label: string
  description?: string
  icon?: string
  /** Az érték, ami a binding-en keresztül a motorba kerül (pl. 'relaxed', 'muveszet'). */
  value?: string
}

export interface HeroNodeData {
  kind: 'hero'
  title: string
  subtitle: string
  backgroundImage: string
  ctaLabel: string
}

export interface SingleSelectNodeData {
  kind: 'single-select'
  title: string
  subtitle?: string
  options: FlowOption[]
  binding: EngineBinding
  /** Ha true, kattintásra azonnal lép is tovább (nincs külön "Tovább" gomb). */
  autoAdvance: boolean
}

export interface MultiSelectNodeData {
  kind: 'multi-select'
  title: string
  subtitle?: string
  options: FlowOption[]
  binding: EngineBinding
  minSelected: number
}

export interface DateTimeRangeNodeData {
  kind: 'datetime-range'
  title: string
  subtitle?: string
  startLabel: string
  endLabel: string
  binding: EngineBinding
}

export interface MonthCounterNodeData {
  kind: 'month-counter'
  title: string
  subtitle?: string
  monthLabel: string
  minDays: number
  maxDays: number
  binding: EngineBinding
}

export interface FreeTextNodeData {
  kind: 'free-text'
  title: string
  subtitle?: string
  placeholder: string
  maxLength: number
  noteLabel?: string
}

export interface SwipeCardsNodeData {
  kind: 'swipe-cards'
  title: string
  subtitle?: string
  cardCount: number
}

export interface ContactFormNodeData {
  kind: 'contact-form'
  title: string
  subtitle?: string
  namePlaceholder: string
  emailPlaceholder: string
  submitLabel: string
  privacyNote: string
}

export interface ClosingNodeData {
  kind: 'closing'
  title: string
  subtitle?: string
  curatorMessage: string
  curatorName: string
  curatorPhoto: string
}

export type FlowNodeData =
  | HeroNodeData
  | SingleSelectNodeData
  | MultiSelectNodeData
  | DateTimeRangeNodeData
  | MonthCounterNodeData
  | FreeTextNodeData
  | SwipeCardsNodeData
  | ContactFormNodeData
  | ClosingNodeData

export interface FlowNode {
  id: string
  type: NodeType
  position: { x: number; y: number }
  data: FlowNodeData
}

export interface FlowEdge {
  id: string
  source: string
  target: string
  /**
   * single-select node-oknál: melyik opció (FlowOption.id) kimenetéről indul
   * az él -- ez adja a vizuális elágazást ("erre a gombra ez jön fel").
   * multi-select node-oknál: ha egy kiválasztott opcióhoz van ilyen él, az a
   * node egy "kitérő" lesz -- a runtime előbb azt (azokat) játssza le, majd
   * visszatér a fő ághoz. sourceHandle nélkül = alapértelmezett (mindig
   * követendő) kimenet.
   */
  sourceHandle?: string
}

export interface FlowGraph {
  nodes: FlowNode[]
  edges: FlowEdge[]
}

export const START_NODE_TYPE: NodeType = 'hero'

export const NODE_TYPE_LABELS: Record<NodeType, string> = {
  hero: 'Nyitány (hero)',
  'single-select': 'Egyválasztós kártyák',
  'multi-select': 'Többválasztós chipek',
  'datetime-range': 'Pontos dátum-idő',
  'month-counter': 'Hozzávetőleges időszak',
  'free-text': 'Szabad szöveg',
  'swipe-cards': 'Helyszín-előnézet (swipe)',
  'contact-form': 'Kapcsolat + beküldés',
  closing: 'Záró képernyő',
}

export function createDefaultNodeData(type: NodeType): FlowNodeData {
  switch (type) {
    case 'hero':
      return {
        kind: 'hero',
        title: 'Új kérdés',
        subtitle: '',
        backgroundImage: '/images/stock1.jpeg',
        ctaLabel: 'Kezdjük el',
      }
    case 'single-select':
      return {
        kind: 'single-select',
        title: 'Új egyválasztós kérdés',
        subtitle: '',
        options: [
          { id: 'opt-1', label: '1. opció', value: 'opt-1' },
          { id: 'opt-2', label: '2. opció', value: 'opt-2' },
        ],
        binding: 'none',
        autoAdvance: true,
      }
    case 'multi-select':
      return {
        kind: 'multi-select',
        title: 'Új többválasztós kérdés',
        subtitle: '',
        options: [
          { id: 'opt-1', label: '1. opció', value: 'opt-1' },
          { id: 'opt-2', label: '2. opció', value: 'opt-2' },
        ],
        binding: 'none',
        minSelected: 0,
      }
    case 'datetime-range':
      return {
        kind: 'datetime-range',
        title: 'Mikor vagytok kint?',
        subtitle: '',
        startLabel: 'Érkezés',
        endLabel: 'Hazautazás',
        binding: 'days-exact',
      }
    case 'month-counter':
      return {
        kind: 'month-counter',
        title: 'Nagyjából mikorra tervezed?',
        subtitle: '',
        monthLabel: 'Célhónap (opcionális)',
        minDays: 1,
        maxDays: 14,
        binding: 'days-approx',
      }
    case 'free-text':
      return {
        kind: 'free-text',
        title: 'Van még valami, amit szeretnél megosztani?',
        subtitle: '',
        placeholder: '',
        maxLength: 300,
        noteLabel: 'Ez a rész kizárólag Viktóriához kerül.',
      }
    case 'swipe-cards':
      return {
        kind: 'swipe-cards',
        title: 'Ez a stílus tetszik?',
        subtitle: '',
        cardCount: 6,
      }
    case 'contact-form':
      return {
        kind: 'contact-form',
        title: 'Hova küldjük a programtervedet?',
        subtitle: '',
        namePlaceholder: 'Neved (opcionális)',
        emailPlaceholder: 'Email címed',
        submitLabel: 'Ízelítő kérése',
        privacyNote: 'Csak a programtervedhez használjuk -- spamet sosem küldünk.',
      }
    case 'closing':
      return {
        kind: 'closing',
        title: 'Ez biztosan benne lesz…',
        subtitle: 'Ízelítő a leendő párizsi programodból',
        curatorMessage:
          'Az elképzeléseid alapján most személyesen összeállítom a végleges programtervedet -- 24 órán belül emailben megkapod.',
        curatorName: 'Viktória',
        curatorPhoto: '/images/viktoriaprofillouvre.jpg',
      }
  }
}
