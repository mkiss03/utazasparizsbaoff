// A /programtervezo kérdéssorának teljes tartalma -- kérdésszövegek,
// válaszlehetőségek címei/leírásai, és a nevezetesség-lista -- innentől
// nem kódba égetett, hanem a planner.configs.quiz_options JSONB
// oszlopában tárolt, admin panelból szerkeszthető adat (lásd
// /admin/programtervek/kerdesek). A `value` mezők a meglévő adatbázis-
// enumokhoz vannak kötve (TemplateBudget, TemplateDisneyIntensity,
// FlightStatus) -- ezeket admin nem vehet fel/törölhet szabadon, csak a
// hozzájuk tartozó szöveget szerkesztheti. A nevezetesség-lista viszont
// valódi CRUD: a tag szabad string, bármennyi vehető fel/törölhető.

import type { TemplateBudget, TemplateDisneyIntensity } from './trip-plan-types'

export type AttractionCategory = 'ticketed' | 'free' | 'disneyland'

export interface AttractionConfigItem {
  tag: string
  label: string
  category: AttractionCategory
}

export interface TextOption<T> {
  value: T
  title: string
  description: string
}

export interface SimpleOption<T> {
  value: T
  label: string
}

export type FlightStatus = 'have' | 'not_yet' | 'need_help'
export type AccommodationType = 'hotel' | 'apartment'
export type AccommodationLocation = 'paris' | 'disneyland'

export interface QuizConfig {
  attractions: AttractionConfigItem[]
  when: { title: string; subtitle: string }
  flight: {
    title: string
    subtitle: string
    options: SimpleOption<FlightStatus>[]
  }
  hotel: {
    title: string
    subtitle: string
    typeQuestionLabel: string
    typeOptions: SimpleOption<AccommodationType>[]
    locationQuestionLabel: string
    locationOptions: SimpleOption<AccommodationLocation>[]
  }
  budget: {
    title: string
    subtitle: string
    options: TextOption<TemplateBudget | null>[]
  }
  highlights: { title: string; subtitle: string }
  disney: {
    title: string
    options: TextOption<TemplateDisneyIntensity | null>[]
  }
}

export const DISNEYLAND_ATTRACTION_TAG = 'disneyland'

export function defaultQuizConfig(): QuizConfig {
  return {
    attractions: [
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
    ],
    when: {
      title: 'Mikor terveznétek utazni?',
      subtitle: 'Jelöld ki a naptárban az érkezés és a hazautazás napját',
    },
    flight: {
      title: 'Van már repülőjegyetek?',
      subtitle: 'Ha kell, szívesen segítünk a foglalásban',
      options: [
        { value: 'have', label: 'Van már repülőjegyünk' },
        { value: 'not_yet', label: 'Még nincs' },
        { value: 'need_help', label: 'Még nincs, segítséget kérünk' },
      ],
    },
    hotel: {
      title: 'És a szállás?',
      subtitle: 'A megfelelő szállás mindig a legnagyobb kérdés -- segítünk dönteni',
      typeQuestionLabel: 'Hotel vagy apartman?',
      typeOptions: [
        { value: 'hotel', label: 'Hotel' },
        { value: 'apartment', label: 'Apartman' },
      ],
      locationQuestionLabel: 'Párizs vagy Disneyland?',
      locationOptions: [
        { value: 'paris', label: 'Párizs' },
        { value: 'disneyland', label: 'Disneyland' },
      ],
    },
    budget: {
      title: 'Milyen költségkeretben gondolkodsz?',
      subtitle: 'A repjegyen és szálláson felüli napi programokra értve -- ez irányár',
      options: [
        { value: 'economy', title: 'Gazdaságos', description: 'Ingyenes és olcsó programok, helyi bisztrók' },
        { value: 'mid', title: 'Középkategória', description: 'Kényelmes egyensúly élmény és ár között' },
        { value: 'premium', title: 'Prémium', description: 'A legjobb helyek, exkluzív élmények' },
        { value: null, title: 'Még nem tudom', description: 'Mutasd a legjobb ajánlatunkat' },
      ],
    },
    highlights: {
      title: 'Melyik nevezetességeket szeretnétek biztosan látni?',
      subtitle: 'Bármennyit kiválaszthattok -- ez alapján ajánljuk a legjobban illő tervet',
    },
    disney: {
      title: 'Mennyi időt töltenétek a Disneylandben?',
      options: [
        { value: 'one_day_one_park', title: '1 nap, 1 park', description: 'Egy egész nap az egyik Disneyland parkban' },
        { value: 'one_day_two_parks', title: '1 nap, 2 park', description: 'Egy nap alatt mindkét parkba benézünk' },
        { value: 'two_days_two_parks', title: '2 nap, 2 park', description: 'Két teljes nap, mindkét park alaposan' },
        { value: null, title: 'Még nem tudjuk', description: 'Bármelyik jó, Viktória döntse el' },
      ],
    },
  }
}

// Az adatbázisban tárolt config lehet részleges (régebbi mentés, vagy még
// egyáltalán nincs elmentve) -- alapértékekkel egészítjük ki, hogy egy
// jövőbeli mezőbővítés se törje el a meglévő, korábban mentett configokat.
export function mergeQuizConfig(stored: Partial<QuizConfig> | null | undefined): QuizConfig {
  const defaults = defaultQuizConfig()
  if (!stored) return defaults
  return {
    attractions: stored.attractions?.length ? stored.attractions : defaults.attractions,
    when: { ...defaults.when, ...stored.when },
    flight: {
      ...defaults.flight,
      ...stored.flight,
      options: stored.flight?.options?.length ? stored.flight.options : defaults.flight.options,
    },
    hotel: {
      ...defaults.hotel,
      ...stored.hotel,
      typeOptions: stored.hotel?.typeOptions?.length ? stored.hotel.typeOptions : defaults.hotel.typeOptions,
      locationOptions: stored.hotel?.locationOptions?.length ? stored.hotel.locationOptions : defaults.hotel.locationOptions,
    },
    budget: {
      ...defaults.budget,
      ...stored.budget,
      options: stored.budget?.options?.length ? stored.budget.options : defaults.budget.options,
    },
    highlights: { ...defaults.highlights, ...stored.highlights },
    disney: {
      ...defaults.disney,
      ...stored.disney,
      options: stored.disney?.options?.length ? stored.disney.options : defaults.disney.options,
    },
  }
}
