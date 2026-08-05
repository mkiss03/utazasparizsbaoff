import type { FlowEdge, FlowGraph, FlowNode } from '@/lib/planner/flow-types'

// A mostani, kézzel megépített /programtervezo flow gráfként kódolva -- ez az
// editor kezdőállapota, hogy Viktória ne nulláról induljon, hanem a meglévő,
// éles folyamatot finomítsa tovább vizuálisan.
//
// Egyszerűsítés a kézzel írt verzióhoz képest: az érdeklődés-mélyítés utáni
// "étkezési preferencia" kérdés itt mindig megjelenik (nem csak gasztro
// választásnál) -- egy statikus gráfban ez a legegyszerűbb, még mindig
// természetes megoldás (a "Nincs megkötés" opció mindig érvényes válasz).

function node(id: string, type: FlowNode['type'], x: number, y: number, data: FlowNode['data']): FlowNode {
  return { id, type, position: { x, y }, data }
}

function edge(source: string, target: string, sourceHandle?: string): FlowEdge {
  return { id: `${source}-${target}-${sourceHandle ?? 'default'}`, source, target, sourceHandle }
}

const INTEREST_OPTIONS = [
  { id: 'muveszet', label: 'Művészet', value: 'muveszet' },
  { id: 'gasztro', label: 'Gasztronómia', value: 'gasztro' },
  { id: 'kultura', label: 'Kultúra és történelem', value: 'kultura' },
  { id: 'kilatas', label: 'Panoráma és kilátás', value: 'kilatas' },
  { id: 'termeszet', label: 'Parkok, természet', value: 'termeszet' },
  { id: 'romantikus', label: 'Romantikus helyszínek', value: 'romantikus' },
  { id: 'kave', label: 'Kávéházi hangulat', value: 'kave' },
]

const INTEREST_SUBOPTIONS: Record<string, string[]> = {
  muveszet: ['Impresszionizmus', 'Klasszikus mesterek', 'Kortárs / utcaművészet', 'Építészet'],
  gasztro: ['Bisztró / hagyományos', 'Fine dining', 'Piacok és pékségek', 'Kávéházi kultúra'],
  kultura: ['Ókor és középkor', 'Forradalom és köztársaság', 'Modern történelem', 'Vallási emlékek'],
  kilatas: ['Magas kilátópontok', 'Folyóparti panoráma', 'Naplemente-helyszínek', 'Rejtett pontok'],
  termeszet: ['Nagy parkok', 'Kis rejtett kertek', 'Botanikus kertek', 'Folyóparti séták'],
  romantikus: ['Naplemente-programok', 'Intim kis utcák', 'Esti séta', 'Meglepetés-vacsora'],
  kave: ['Történelmi kávéházak', 'Modern specialty coffee', 'Pékség-kávézók', 'Rejtett kedvenc'],
}

export function buildSeedFlow(): FlowGraph {
  const nodes: FlowNode[] = [
    node('opening', 'hero', 0, 500, {
      kind: 'hero',
      title: 'Tervezzük meg együtt a párizsi utadat',
      subtitle:
        'Néhány kérdés az utazásodról és az érdeklődésedről -- a végén Viktória személyesen állítja össze a végleges tervet',
      backgroundImage: '/images/stock1.jpeg',
      ctaLabel: 'Kezdjük el',
    }),
    node('flight-status', 'single-select', 500, 500, {
      kind: 'single-select',
      title: 'Van már repjegyed?',
      subtitle: 'Ez segít pontosan beütemezni a napjaidat -- a nyitvatartásokkal együtt',
      binding: 'none',
      autoAdvance: false,
      options: [
        { id: 'booked', label: 'Megvan a repjegyem', description: 'Pontosan tudom az érkezés és a hazautazás időpontját', icon: 'plane-takeoff' },
        { id: 'planning-self', label: 'Még nincs, magam intézem', description: 'Van egy hozzávetőleges időszak, amit tervezek', icon: 'compass' },
        { id: 'wants-help', label: 'Még nincs, kérnék segítséget', description: 'Szívesen kérnék tanácsot a jegy- és szállásfoglaláshoz', icon: 'life-buoy' },
      ],
    }),
    node('flight-dates', 'datetime-range', 1020, 120, {
      kind: 'datetime-range',
      title: 'Mikor vagytok kint Párizsban?',
      subtitle: 'A pontos időpontok alapján a nyitvatartásokhoz igazítjuk a napokat',
      startLabel: 'Érkezés Párizsba',
      endLabel: 'Hazautazás',
      binding: 'days-exact',
    }),
    node('airport', 'single-select', 1560, 120, {
      kind: 'single-select',
      title: 'Melyik reptérre érkezel?',
      binding: 'none',
      autoAdvance: false,
      options: [
        { id: 'cdg', label: 'Charles de Gaulle (CDG)' },
        { id: 'orly', label: 'Orly' },
        { id: 'beauvais', label: 'Beauvais' },
        { id: 'other', label: 'Más / még nem tudom' },
      ],
    }),
    node('transport', 'single-select', 2100, 120, {
      kind: 'single-select',
      title: 'Hogy jutnál be a városba?',
      binding: 'none',
      autoAdvance: false,
      options: [
        { id: 'taxi', label: 'Taxi / Uber', icon: 'car' },
        { id: 'metro', label: 'Metró / RER', icon: 'train-front' },
        { id: 'transfer', label: 'Szervezett transzfer', icon: 'users' },
        { id: 'unsure', label: 'Még nem tudom', icon: 'help-circle' },
      ],
    }),
    node('travel-window', 'month-counter', 1020, 900, {
      kind: 'month-counter',
      title: 'Nagyjából mikorra tervezed?',
      subtitle: 'Ha még nincs pontos dátum, egy hozzávetőleges hónap is elég',
      monthLabel: 'Célhónap (opcionális)',
      minDays: 1,
      maxDays: 14,
      binding: 'days-approx',
    }),
    node('budget', 'single-select', 2680, 500, {
      kind: 'single-select',
      title: 'Milyen költségkeretben gondolkodsz?',
      subtitle: 'A repjegyen és szálláson felüli napi programokra értve -- ez irányár',
      binding: 'budgetBand',
      autoAdvance: false,
      options: [
        { id: 'gazdasagos', label: 'Gazdaságos', description: 'Ingyenes és olcsó programok, helyi bisztrók', value: 'gazdasagos', icon: 'wallet' },
        { id: 'kozepkategoria', label: 'Középkategória', description: 'Kényelmes egyensúly élmény és ár között', value: 'kozepkategoria', icon: 'coins' },
        { id: 'premium', label: 'Prémium', description: 'A legjobb helyek, exkluzív élmények', value: 'premium', icon: 'gem' },
        { id: 'nem-tudom', label: 'Még nem tudom', description: 'Viktória vegyesen javasol majd', value: 'nem-tudom', icon: 'help-circle' },
      ],
    }),
    node('companion', 'single-select', 3260, 500, {
      kind: 'single-select',
      title: 'Kikkel utazol?',
      binding: 'none',
      autoAdvance: true,
      options: [
        { id: 'paar', label: 'Párban', icon: 'heart' },
        { id: 'csalad', label: 'Családdal', icon: 'users' },
        { id: 'baratok', label: 'Barátokkal', icon: 'party-popper' },
        { id: 'egyedul', label: 'Egyedül', icon: 'user' },
      ],
    }),
    node('family-details', 'single-select', 3840, 900, {
      kind: 'single-select',
      title: 'Hány évesek a gyerekek?',
      binding: 'none',
      autoAdvance: true,
      options: [
        { id: 'baba', label: 'Csecsemő / kisgyerek (0-4)' },
        { id: 'kisiskolas', label: 'Kisiskolás (5-11)' },
        { id: 'tizenéves', label: 'Tizenéves (12-17)' },
        { id: 'felnott', label: 'Felnőtt gyerekek' },
      ],
    }),
    node('interests', 'multi-select', 3840, 120, {
      kind: 'multi-select',
      title: 'Mi érdekel?',
      subtitle: 'Válassz annyit, amennyi igaz rád',
      binding: 'interests',
      minSelected: 1,
      options: INTEREST_OPTIONS,
    }),
    ...Object.entries(INTEREST_SUBOPTIONS).map(([category, subs], index) =>
      node(`interest-detail-${category}`, 'multi-select', 4440, -80 + index * 420, {
        kind: 'multi-select',
        title: `${INTEREST_OPTIONS.find((o) => o.id === category)?.label} -- mi áll hozzád közelebb?`,
        binding: 'none',
        minSelected: 0,
        options: subs.map((label, i) => ({ id: `${category}-sub-${i}`, label })),
      })
    ),
    node('dietary', 'multi-select', 5040, 120, {
      kind: 'multi-select',
      title: 'Van étkezési preferenciád?',
      subtitle: 'Erre külön figyelünk az étterem-ajánlásoknál',
      binding: 'none',
      minSelected: 0,
      options: [
        { id: 'vegetarianus', label: 'Vegetáriánus' },
        { id: 'vegan', label: 'Vegán' },
        { id: 'glutenmentes', label: 'Gluténmentes' },
        { id: 'tejmentes', label: 'Tejmentes' },
        { id: 'nincs', label: 'Nincs megkötés' },
      ],
    }),
    node('place-preview', 'swipe-cards', 5620, 120, {
      kind: 'swipe-cards',
      title: 'Ez a stílus tetszik?',
      subtitle: 'Néhány konkrét helyszín az érdeklődésed alapján',
      cardCount: 6,
    }),
    node('pace', 'single-select', 6160, 120, {
      kind: 'single-select',
      title: 'Milyen tempóban szeretnél haladni?',
      binding: 'pace',
      autoAdvance: false,
      options: [
        { id: 'relaxed', label: 'Ráérős flâneur', description: 'Kevesebb program, több idő élvezni a pillanatot', value: 'relaxed' },
        { id: 'moderate', label: 'Kiegyensúlyozott', description: 'Jó arányban látnivaló és pihenés', value: 'moderate' },
        { id: 'packed', label: 'Mindent látni akarok', description: 'Sűrű, aktív napok, tele élményekkel', value: 'packed' },
      ],
    }),
    node('dream', 'free-text', 6700, 120, {
      kind: 'free-text',
      title: 'Van valami, amit mindenképp szeretnél átélni Párizsban?',
      subtitle: 'Ez a rész kizárólag Viktóriához kerül',
      placeholder: 'Pl. szeretnék napfelkeltekor lenni a Sacré-Cœurnél…',
      maxLength: 300,
    }),
    node('contact', 'contact-form', 7240, 120, {
      kind: 'contact-form',
      title: 'Hova küldjük a programtervedet?',
      subtitle: 'Az elképzeléseid alapján személyesen összeállítjuk a végleges tervet, és emailben küldjük el.',
      namePlaceholder: 'Neved (opcionális)',
      emailPlaceholder: 'Email címed',
      submitLabel: 'Ízelítő kérése',
      privacyNote: 'Csak a programtervedhez használjuk -- spamet sosem küldünk.',
    }),
    node('closing', 'closing', 7780, 120, {
      kind: 'closing',
      title: 'Ez biztosan benne lesz…',
      subtitle: 'Ízelítő a leendő párizsi programodból',
      curatorMessage:
        'Az elképzeléseid alapján most személyesen összeállítom a végleges programtervedet -- 24 órán belül emailben megkapod.',
      curatorName: 'Viktória',
      curatorPhoto: '/images/viktoriaprofillouvre.jpg',
    }),
  ]

  const edges: FlowEdge[] = [
    edge('opening', 'flight-status'),
    edge('flight-status', 'flight-dates', 'booked'),
    edge('flight-status', 'travel-window', 'planning-self'),
    edge('flight-status', 'travel-window', 'wants-help'),
    edge('flight-dates', 'airport'),
    edge('airport', 'transport'),
    edge('transport', 'budget'),
    edge('travel-window', 'budget'),
    edge('budget', 'companion'),
    edge('companion', 'family-details', 'csalad'),
    edge('companion', 'interests', 'paar'),
    edge('companion', 'interests', 'baratok'),
    edge('companion', 'interests', 'egyedul'),
    edge('family-details', 'interests'),
    ...Object.keys(INTEREST_SUBOPTIONS).map((category) => edge('interests', `interest-detail-${category}`, category)),
    edge('interests', 'dietary'),
    ...Object.keys(INTEREST_SUBOPTIONS).map((category) => edge(`interest-detail-${category}`, 'dietary')),
    edge('dietary', 'place-preview'),
    edge('place-preview', 'pace'),
    edge('pace', 'dream'),
    edge('dream', 'contact'),
    edge('contact', 'closing'),
  ]

  return { nodes, edges }
}
