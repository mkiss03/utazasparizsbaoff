export interface MetroStation {
  id: string
  letter: string
  title: string
  description: string
  details: string[] // Detailed bullet points
  icon: string
  // Position as percentage (0-100) for absolute positioning
  x: number // left position %
  y: number // top position %
}

// Desktop positions (mathematically aligned to SVG path)
// Y positions calculated to sit perfectly on the quadratic Bezier curve
// Path: M 100 300 Q 300 220, 500 280 Q 700 340, 900 300
export const stationsDesktop: MetroStation[] = [
  {
    id: '1',
    letter: 'T',
    title: 'Ticket t+ Vonaljegy',
    description: 'A legegyszerűbb megoldás kezdőknek. Egy jegy szinte mindenhová érvényes!',
    details: [
      'Ár: 2,55 € / utazás (4–9 éves korig: 1,30 €)',
      'Használható: Metró, busz, villamos, RER a teljes Île-de-France régióban',
      '✨ Újdonság: Versailles-ba és Disneylandbe is érvényes!',
      'Átszállás: 2 órán belül ingyenes a metróhálózaton belül',
      '⚠️ FONTOS: Papírjegy már nincs, csak digitális'
    ],
    icon: 'Ticket',
    x: 13,
    y: 48,
  },
  {
    id: '2',
    letter: 'J',
    title: 'Jegyvétel módjai',
    description: 'Okostelefonnal vagy Navigo Easy kártyával egyszerűen vehetsz jegyet.',
    details: [
      '📱 Okostelefonnal: Töltsd le az Île-de-France Mobilités appot',
      'Vedd meg a jegyet az appban (bankkártya/Apple Pay/Google Pay)',
      'Használat: Érintsd a telefonod a kapuhoz (NFC)',
      '💳 Navigo Easy kártya: 2 € az ára, töltsd fel az automatáknál',
      'Szabály: 1 kártya = 1 ember'
    ],
    icon: 'Smartphone',
    x: 31,
    y: 42,
  },
  {
    id: '3',
    letter: 'R',
    title: 'Repülőtéri transzfer',
    description: 'Vigyázat! A repülőtér kivétel. Ne használj sima jegyet!',
    details: [
      '✈️ Ár: Egységesen 14,00 € (CDG és Orly)',
      '❌ Sima jeggyel a kapu nem enged ki',
      'Az ellenőrök azonnal büntetnek 50-60 €-val',
      'Vedd meg a speciális repülőtéri jegyet',
      'A heti bérlet (Navigo Semaine) tartalmazza a repteret is'
    ],
    icon: 'Plane',
    x: 50,
    y: 47,
  },
  {
    id: '4',
    letter: 'H',
    title: 'Gyakori hibák',
    description: 'Így kerüld el a 50-60 € bírságot!',
    details: [
      '⚠️ Mindig érvényesíts: Buszon és villamoson is érintsd fel',
      '⚠️ Ne dobd ki/töröld le: A jegy az utazás végéig kell',
      '⚠️ Gyerekjegy: Csak 9 éves korig, 10 évtől teljes ár',
      '⚠️ Láb az ülésen: Szigorúan büntetik (60 €)',
      '⚠️ Más után bemenni: A kamerák és ellenőrök figyelik'
    ],
    icon: 'AlertTriangle',
    x: 69,
    y: 52,
  },
  {
    id: '5',
    letter: 'B',
    title: 'Bérletek & Tippek',
    description: 'Megéri bérletet venni? Napi vagy heti bérlet?',
    details: [
      '📆 Napi jegy (Day Pass): 12,30 € - 5+ utazásnál megéri',
      '🎫 Heti bérlet (Navigo Semaine): 32,40 €',
      'Előny: Tartalmazza a repülőtereket is',
      'Hátrány: Fixen hétfőtől vasárnapig érvényes',
      '🗺️ Tipp: Irányok a végállomás nevével jelölve (pl. La Défense felé)',
      '🚦 Csúcsidő: 7:30-9:30 és 16:30-18:30 között nagy a tömeg'
    ],
    icon: 'Calendar',
    x: 87,
    y: 51,
  },
]

// Mobile positions (vertical smooth curve)
export const stationsMobile: MetroStation[] = [
  {
    id: '1',
    letter: 'T',
    title: 'Ticket t+ Vonaljegy',
    description: 'A legegyszerűbb megoldás kezdőknek. Egy jegy szinte mindenhová érvényes!',
    details: [
      'Ár: 2,55 € / utazás (4–9 éves korig: 1,30 €)',
      'Használható: Metró, busz, villamos, RER a teljes Île-de-France régióban',
      '✨ Újdonság: Versailles-ba és Disneylandbe is érvényes!',
      'Átszállás: 2 órán belül ingyenes a metróhálózaton belül',
      '⚠️ FONTOS: Papírjegy már nincs, csak digitális'
    ],
    icon: 'Ticket',
    x: 50,
    y: 12,
  },
  {
    id: '2',
    letter: 'J',
    title: 'Jegyvétel módjai',
    description: 'Okostelefonnal vagy Navigo Easy kártyával egyszerűen vehetsz jegyet.',
    details: [
      '📱 Okostelefonnal: Töltsd le az Île-de-France Mobilités appot',
      'Vedd meg a jegyet az appban (bankkártya/Apple Pay/Google Pay)',
      'Használat: Érintsd a telefonod a kapuhoz (NFC)',
      '💳 Navigo Easy kártya: 2 € az ára, töltsd fel az automatáknál',
      'Szabály: 1 kártya = 1 ember'
    ],
    icon: 'Smartphone',
    x: 60,
    y: 28,
  },
  {
    id: '3',
    letter: 'R',
    title: 'Repülőtéri transzfer',
    description: 'Vigyázat! A repülőtér kivétel. Ne használj sima jegyet!',
    details: [
      '✈️ Ár: Egységesen 14,00 € (CDG és Orly)',
      '❌ Sima jeggyel a kapu nem enged ki',
      'Az ellenőrök azonnal büntetnek 50-60 €-val',
      'Vedd meg a speciális repülőtéri jegyet',
      'A heti bérlet (Navigo Semaine) tartalmazza a repteret is'
    ],
    icon: 'Plane',
    x: 50,
    y: 48,
  },
  {
    id: '4',
    letter: 'H',
    title: 'Gyakori hibák',
    description: 'Így kerüld el a 50-60 € bírságot!',
    details: [
      '⚠️ Mindig érvényesíts: Buszon és villamoson is érintsd fel',
      '⚠️ Ne dobd ki/töröld le: A jegy az utazás végéig kell',
      '⚠️ Gyerekjegy: Csak 9 éves korig, 10 évtől teljes ár',
      '⚠️ Láb az ülésen: Szigorúan büntetik (60 €)',
      '⚠️ Más után bemenni: A kamerák és ellenőrök figyelik'
    ],
    icon: 'AlertTriangle',
    x: 40,
    y: 68,
  },
  {
    id: '5',
    letter: 'B',
    title: 'Bérletek & Tippek',
    description: 'Megéri bérletet venni? Napi vagy heti bérlet?',
    details: [
      '📆 Napi jegy (Day Pass): 12,30 € - 5+ utazásnál megéri',
      '🎫 Heti bérlet (Navigo Semaine): 32,40 €',
      'Előny: Tartalmazza a repülőtereket is',
      'Hátrány: Fixen hétfőtől vasárnapig érvényes',
      '🗺️ Tipp: Irányok a végállomás nevével jelölve (pl. La Défense felé)',
      '🚦 Csúcsidő: 7:30-9:30 és 16:30-18:30 között nagy a tömeg'
    ],
    icon: 'Calendar',
    x: 50,
    y: 88,
  },
]
