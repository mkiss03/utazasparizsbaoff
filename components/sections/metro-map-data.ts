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

// Desktop positions (PRECISELY aligned to curved metro line)
// SVG Path: M 80 280 Q 280 200, 500 250 Q 720 300, 920 250 (viewBox 0 0 1000 500)
// Percentage coordinates calculated from SVG coordinate system
// x% = (svg_x / 1000) * 100, y% = (svg_y / 500) * 100
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
    x: 8,     // 80/1000 * 100 = 8%
    y: 56,    // 280/500 * 100 = 56%
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
    x: 28,    // 280/1000 * 100 = 28%
    y: 40,    // 200/500 * 100 = 40%
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
    x: 50,    // 500/1000 * 100 = 50%
    y: 50,    // 250/500 * 100 = 50%
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
    x: 72,    // 720/1000 * 100 = 72%
    y: 60,    // 300/500 * 100 = 60%
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
    x: 92,    // 920/1000 * 100 = 92%
    y: 50,    // 250/500 * 100 = 50%
  },
]

// Mobile positions (PRECISELY aligned to vertical curved line)
// SVG Path: M 200 80 Q 250 240, 200 400 Q 150 560, 200 720 (viewBox 0 0 400 800)
// Percentage coordinates calculated from SVG coordinate system
// x% = (svg_x / 400) * 100, y% = (svg_y / 800) * 100
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
    x: 50,    // 200/400 * 100 = 50%
    y: 10,    // 80/800 * 100 = 10%
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
    x: 62.5,  // 250/400 * 100 = 62.5%
    y: 30,    // 240/800 * 100 = 30%
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
    x: 50,    // 200/400 * 100 = 50%
    y: 50,    // 400/800 * 100 = 50%
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
    x: 37.5,  // 150/400 * 100 = 37.5%
    y: 70,    // 560/800 * 100 = 70%
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
    x: 50,    // 200/400 * 100 = 50%
    y: 90,    // 720/800 * 100 = 90%
  },
]
