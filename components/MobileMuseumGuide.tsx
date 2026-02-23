'use client'

import { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Building2,
  Layers,
  DoorOpen,
  Check,
  ChevronRight,
  Sparkles,
  Eye,
  Trophy,
  Map,
  Star,
  Route,
  Compass,
  Info,
  ArrowDown,
} from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────────────────────

interface Artwork {
  id: number
  title: string
  artist: string
  year: string
  wing: 'Denon' | 'Sully' | 'Richelieu'
  floor: string
  room: string
  location: string
  story: string
  funFact?: string
  mapPosition: { x: number; y: number }
}

// ─── Parisian Powder Palette (strictly NO orange) ────────────────────────────

const C = {
  bg: '#FAF7F2',
  card: '#FFFFFF',
  bgAccent: '#F5F0E8',
  text: '#1e293b',
  textMuted: '#64748b',
  textLight: '#94a3b8',
  gold: '#B8A472',
  goldLight: '#D4C49E',
  goldDark: '#8B7D55',
  goldBg: '#F8F4EC',
  border: '#E8E0D0',
  success: '#059669',
  successLight: '#D1FAE5',
  mapBg: '#2D2B28',
  mapAccent: '#D4C49E',
} as const

const WING_COLORS: Record<string, string> = {
  Denon: '#8B7D55',
  Sully: '#7D8B6E',
  Richelieu: '#6E7D8B',
}

// ─── Mock Data ───────────────────────────────────────────────────────────────

const artworks: Artwork[] = [
  {
    id: 1,
    title: 'Mona Lisa',
    artist: 'Leonardo da Vinci',
    year: '1503–1519',
    wing: 'Denon',
    floor: '1. emelet',
    room: '711. terem (Salle des États)',
    location: 'Denon szárny, 1. emelet',
    story:
      'A világ leghíresebb festménye, amit évente 10 millió ember néz meg – de igazából egy bűntény tette szupersztárrá. 1911-ben Vincenzo Peruggia, egy olasz üveges, aki korábban a Louvre-ban dolgozott, egyszerűen a kabátja alá rejtve lopta el. Két évig keresték a rendőrök szerte Európában, és pont a botrány miatt lett a Mona Lisa az, ami ma: a világ leghíresebb festménye. Amikor ránézel, figyeld meg a hátteret: a bal és jobb oldal nem illeszkedik – ez Leonardo szándékos trükkje, ami a titokzatosságot fokozza.',
    funFact:
      'Tudtad, hogy a festmény mérete mindössze 77 × 53 cm? Sokakat meglep, milyen kicsi valójában.',
    mapPosition: { x: 30, y: 58 },
  },
  {
    id: 2,
    title: 'Szamothrakéi Niké',
    artist: 'Ismeretlen görög mester',
    year: 'Kr. e. ~190',
    wing: 'Denon',
    floor: 'Lépcsőház',
    room: 'Daru-lépcső teteje',
    location: 'Denon szárny, lépcsőház',
    story:
      'Ez a 2,75 méteres márványszobor egy hajó orrán álló győzelem-istennőt ábrázol, és a Louvre egyik legdrámaibb látványa. A szobrot 1863-ban találták Szamothraké szigetén, több száz darabra törve. Az újraalkotása évtizedekig tartott. A szobor a győzelem és a szél erejét testesíti meg – figyeld meg, ahogy a ruha a testhez simul, mintha valódi szél fújná. Karja és feje hiányzik, de épp ez teszi tökéletessé: a képzelet befejezi azt, amit a kő nem.',
    funFact:
      'A lépcsőház tetejére helyezték, hogy alulról nézve még monumentálisabb legyen – pont úgy, ahogy egy hajó orrán állt volna.',
    mapPosition: { x: 22, y: 48 },
  },
  {
    id: 3,
    title: 'Milói Vénusz',
    artist: 'Alexandrosz (feltételezett)',
    year: 'Kr. e. ~130–100',
    wing: 'Sully',
    floor: 'Földszint',
    room: '346. terem',
    location: 'Sully szárny, földszint',
    story:
      'Egy görög paraszt találta Mélosz (Milosz) szigetén 1820-ban, miközben a földjét szántotta. A francia haditengerészet azonnal felismerte az értékét és Párizsba szállította. A karok hiánya a mai napig rejtély – van, aki szerint almát tartott, mások szerint egy pajzsba nézett. A szobor az ókori szépségideált testesíti meg, és a Louvre egyik legfontosabb kincse.',
    funFact:
      'A szobrot eredetileg színesre festették! Az ókori görögök szobrai mind élénk színűek voltak.',
    mapPosition: { x: 60, y: 52 },
  },
  {
    id: 4,
    title: 'A szabadság vezeti a népet',
    artist: 'Eugène Delacroix',
    year: '1830',
    wing: 'Denon',
    floor: '1. emelet',
    room: '700. terem',
    location: 'Denon szárny, 1. emelet',
    story:
      'Ez a festmény az 1830-as júliusi forradalmat ábrázolja. Marianne, a félmeztelen nő a francia trikolórral, a Szabadság allegóriája lett – őt látod minden francia euró érmén és bélyegen is. Delacroix állítólag saját magát is belefestette: ő a cilinderes férfi a barikádon. A kép egyszerre dokumentum és szimbólum, a francia identitás egyik legfontosabb vizuális ikonja.',
    mapPosition: { x: 35, y: 66 },
  },
  {
    id: 5,
    title: 'Hammurapi törvényoszlopa',
    artist: 'Babilóni mesterek',
    year: 'Kr. e. ~1792–1750',
    wing: 'Richelieu',
    floor: 'Földszint',
    room: '227. terem',
    location: 'Richelieu szárny, földszint',
    story:
      'Az emberiség egyik legrégebbi írott törvénygyűjteménye: 282 törvény, kőbe vésve, közel 4000 évvel ezelőtt. A tetején Hammurapi király áll Shamash, a napisten előtt, aki a törvényeket adja neki. Innen ered a „szemet szemért, fogat fogért" mondás. A 2,25 m magas diorit sztélé szinte tökéletes állapotban maradt fenn.',
    funFact:
      'A törvények között szerepel a minimálbér és a fogyasztóvédelem első formája is!',
    mapPosition: { x: 35, y: 22 },
  },
  {
    id: 6,
    title: 'Nagy Szfinx',
    artist: 'Egyiptomi mesterek',
    year: 'Kr. e. ~2600',
    wing: 'Sully',
    floor: 'Alagsor',
    room: 'Szfinx kripta',
    location: 'Sully szárny, alagsor',
    story:
      'Ez a gránit szfinx egyike a legjobb állapotban fennmaradt egyiptomi szfinxeknek. Az alagsorba lépve, a félhomályban megpillantani ezt az ősi szobrot – olyan élmény, mintha időutazáson vennél részt. A Louvre egyiptomi gyűjteménye a világon a második legnagyobb Kairó után, és ez a szfinx az egyik legrégebbi darabja.',
    mapPosition: { x: 65, y: 38 },
  },
]

// ─── Welcome Overlay ─────────────────────────────────────────────────────────

function ValueProp({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-start gap-3">
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{ backgroundColor: C.goldBg, color: C.gold }}
      >
        {icon}
      </div>
      <p className="text-sm leading-relaxed" style={{ color: C.text }}>
        {text}
      </p>
    </div>
  )
}

function WelcomeOverlay({ onStart }: { onStart: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto"
      style={{ backgroundColor: C.bg }}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-md w-full mx-4 px-6 py-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div
            className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center"
            style={{
              backgroundColor: C.goldBg,
              border: `2px solid ${C.goldLight}`,
            }}
          >
            <Compass className="w-8 h-8" style={{ color: C.gold }} />
          </div>

          <h1
            className="font-playfair text-3xl font-bold mb-2"
            style={{ color: C.text }}
          >
            Louvre Múzeum
          </h1>
          <p className="font-playfair text-lg mb-8" style={{ color: C.gold }}>
            Magyar Digitális Útikalauz
          </p>
        </motion.div>

        <motion.div
          className="space-y-4 mb-10 text-left"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <ValueProp
            icon={<Star className="w-4 h-4" />}
            text="Az első és egyetlen magyar nyelvű digitális Louvre-kalauz"
          />
          <ValueProp
            icon={<Route className="w-4 h-4" />}
            text="12–15 gondosan válogatott alkotás logikus útvonaltervvel"
          />
          <ValueProp
            icon={<Sparkles className="w-4 h-4" />}
            text="Nem száraz évszámok – sztorik, amikre 10 év múlva is emlékszel"
          />
          <ValueProp
            icon={<Trophy className="w-4 h-4" />}
            text="Spórolj: idegenvezetővel 50–60 €/fő, belépő viszont csak 22 €/fő"
          />
        </motion.div>

        <motion.button
          className="w-full py-4 px-6 rounded-2xl text-white font-semibold text-lg shadow-lg active:shadow-md"
          style={{ backgroundColor: C.gold }}
          onClick={onStart}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          whileTap={{ scale: 0.97 }}
        >
          <span className="flex items-center justify-center gap-2">
            Túra indítása
            <ChevronRight className="w-5 h-5" />
          </span>
        </motion.button>

        <motion.p
          className="mt-4 text-xs"
          style={{ color: C.textLight }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.6 }}
        >
          25 év alatt a belépő ingyenes!
        </motion.p>
      </div>
    </motion.div>
  )
}

// ─── Interactive Map ─────────────────────────────────────────────────────────

function MuseumMap({
  seen,
  activeId,
  onPinClick,
}: {
  seen: Set<number>
  activeId: number | null
  onPinClick: (id: number) => void
}) {
  return (
    <div className="relative w-full h-full" style={{ backgroundColor: C.mapBg }}>
      {/* Stylized Louvre floor plan */}
      <svg
        viewBox="0 0 100 80"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Louvre U-shape outline */}
        <g opacity="0.25" stroke={C.mapAccent} fill="none" strokeWidth="0.5">
          {/* Richelieu wing (top) */}
          <rect x="15" y="12" width="35" height="12" rx="1" />
          {/* Sully wing (right) */}
          <rect x="50" y="12" width="12" height="55" rx="1" />
          {/* Denon wing (bottom) */}
          <rect x="15" y="55" width="35" height="12" rx="1" />
          {/* Left connector */}
          <rect x="15" y="12" width="12" height="55" rx="1" />
          {/* Pyramid (center) */}
          <polygon points="40,38 45,30 50,38" strokeWidth="0.4" />
        </g>

        {/* Wing labels */}
        <text
          x="32"
          y="10"
          textAnchor="middle"
          fill={C.mapAccent}
          opacity="0.5"
          fontSize="3"
          fontWeight="500"
        >
          RICHELIEU
        </text>
        <text
          x="32"
          y="75"
          textAnchor="middle"
          fill={C.mapAccent}
          opacity="0.5"
          fontSize="3"
          fontWeight="500"
        >
          DENON
        </text>
        <text
          x="72"
          y="42"
          textAnchor="middle"
          fill={C.mapAccent}
          opacity="0.5"
          fontSize="3"
          fontWeight="500"
        >
          SULLY
        </text>

        {/* Route dashed line connecting pins in order */}
        <polyline
          points={artworks
            .map((a) => `${a.mapPosition.x},${a.mapPosition.y}`)
            .join(' ')}
          fill="none"
          stroke={C.mapAccent}
          strokeWidth="0.3"
          strokeDasharray="1.5 1"
          opacity="0.4"
        />
      </svg>

      {/* Numbered pins */}
      {artworks.map((artwork) => {
        const isActive = activeId === artwork.id
        const isSeen = seen.has(artwork.id)
        return (
          <button
            key={artwork.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
            style={{
              left: `${artwork.mapPosition.x}%`,
              top: `${artwork.mapPosition.y}%`,
            }}
            onClick={() => onPinClick(artwork.id)}
            aria-label={`${artwork.id}. ${artwork.title}`}
          >
            <motion.div
              className="flex items-center justify-center rounded-full text-xs font-bold shadow-lg"
              style={{
                width: isActive ? 32 : 26,
                height: isActive ? 32 : 26,
                backgroundColor: isSeen ? C.success : C.gold,
                color: '#FFFFFF',
                border: isActive
                  ? '3px solid #FFFFFF'
                  : '2px solid rgba(255,255,255,0.3)',
              }}
              animate={{ scale: isActive ? 1.15 : 1 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              {isSeen ? (
                <Check className="w-3.5 h-3.5" />
              ) : (
                artwork.id
              )}
            </motion.div>
          </button>
        )
      })}

      {/* Scroll hint */}
      <div
        className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 px-3 py-1 rounded-full"
        style={{
          backgroundColor: 'rgba(0,0,0,0.5)',
          color: '#FFFFFF',
          fontSize: 10,
        }}
      >
        <ArrowDown className="w-3 h-3 animate-bounce" />
        Görgess az alkotásokhoz
      </div>
    </div>
  )
}

// ─── Artwork Card ────────────────────────────────────────────────────────────

function ArtworkCard({
  artwork,
  isSeen,
  isActive,
  onToggleSeen,
}: {
  artwork: Artwork
  isSeen: boolean
  isActive: boolean
  onToggleSeen: () => void
}) {
  const [expanded, setExpanded] = useState(false)

  return (
    <motion.div
      id={`artwork-${artwork.id}`}
      className="rounded-2xl overflow-hidden shadow-sm"
      style={{
        backgroundColor: C.card,
        border: `1px solid ${isActive ? C.gold : C.border}`,
        opacity: isSeen && !isActive ? 0.75 : 1,
      }}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: isSeen && !isActive ? 0.75 : 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4 }}
    >
      {/* Image placeholder */}
      <div
        className="relative aspect-[16/9] flex items-center justify-center"
        style={{
          background: `linear-gradient(135deg, ${C.bgAccent} 0%, ${C.goldBg} 100%)`,
        }}
      >
        {/* Route number */}
        <div
          className="absolute top-3 left-3 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-md"
          style={{ backgroundColor: C.gold }}
        >
          {artwork.id}
        </div>

        {/* Wing badge */}
        <div
          className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-medium text-white"
          style={{ backgroundColor: WING_COLORS[artwork.wing] }}
        >
          {artwork.wing}
        </div>

        {/* Placeholder content */}
        <div className="text-center" style={{ color: C.goldLight }}>
          <Eye className="w-10 h-10 mx-auto mb-2 opacity-40" />
          <p className="text-xs opacity-40 font-medium">Kép helye</p>
        </div>

        {/* Seen overlay */}
        <AnimatePresence>
          {isSeen && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              style={{ backgroundColor: 'rgba(5, 150, 105, 0.15)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{ backgroundColor: C.success }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              >
                <Check className="w-7 h-7 text-white" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Card body */}
      <div className="p-4">
        {/* Title */}
        <h3
          className="font-playfair text-lg font-bold mb-0.5"
          style={{ color: C.text }}
        >
          {artwork.title}
        </h3>
        <p className="text-sm mb-3" style={{ color: C.textMuted }}>
          {artwork.artist} &middot; {artwork.year}
        </p>

        {/* Location pictograms */}
        <div className="flex flex-wrap gap-2 mb-3">
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium"
            style={{ backgroundColor: C.bgAccent, color: C.text }}
          >
            <Building2 className="w-3.5 h-3.5" style={{ color: C.gold }} />
            {artwork.wing} szárny
          </span>
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium"
            style={{ backgroundColor: C.bgAccent, color: C.text }}
          >
            <Layers className="w-3.5 h-3.5" style={{ color: C.gold }} />
            {artwork.floor}
          </span>
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium"
            style={{ backgroundColor: C.bgAccent, color: C.text }}
          >
            <DoorOpen className="w-3.5 h-3.5" style={{ color: C.gold }} />
            {artwork.room}
          </span>
        </div>

        {/* Story */}
        <div className="mb-3">
          <div
            className={`text-sm leading-relaxed ${!expanded ? 'line-clamp-3' : ''}`}
            style={{ color: C.text }}
          >
            <p>{artwork.story}</p>
          </div>

          {artwork.funFact && expanded && (
            <motion.div
              className="mt-2 p-3 rounded-xl text-sm"
              style={{ backgroundColor: C.goldBg, color: C.goldDark }}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
            >
              <Info className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
              {artwork.funFact}
            </motion.div>
          )}

          <button
            className="mt-1.5 text-xs font-medium"
            style={{ color: C.gold }}
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? '↑ Kevesebb' : 'Teljes sztori →'}
          </button>
        </div>

        {/* "Megnéztem" toggle */}
        <motion.button
          className="w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
          style={{
            backgroundColor: isSeen ? C.successLight : C.goldBg,
            color: isSeen ? C.success : C.gold,
            border: `1.5px solid ${isSeen ? C.success : C.goldLight}`,
          }}
          onClick={onToggleSeen}
          whileTap={{ scale: 0.97 }}
        >
          {isSeen ? (
            <>
              <Check className="w-4 h-4" />
              Megnézve!
            </>
          ) : (
            <>
              <Eye className="w-4 h-4" />
              Megnéztem
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function MobileMuseumGuide() {
  const [showWelcome, setShowWelcome] = useState(true)
  const [seen, setSeen] = useState<Set<number>>(new Set())
  const [activeId, setActiveId] = useState<number | null>(null)
  const activeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  const toggleSeen = useCallback((id: number) => {
    setSeen((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [])

  const scrollToCard = useCallback((id: number) => {
    setActiveId(id)
    const el = document.getElementById(`artwork-${id}`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
    // Clear active highlight after 2 seconds
    if (activeTimeout.current) clearTimeout(activeTimeout.current)
    activeTimeout.current = setTimeout(() => setActiveId(null), 2000)
  }, [])

  const progress = (seen.size / artworks.length) * 100
  const allSeen = seen.size === artworks.length

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: C.bg }}>
      {/* Welcome overlay */}
      <AnimatePresence>
        {showWelcome && (
          <WelcomeOverlay onStart={() => setShowWelcome(false)} />
        )}
      </AnimatePresence>

      {!showWelcome && (
        <motion.div
          className="flex flex-col flex-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {/* ── Sticky progress bar ── */}
          <div
            className="sticky top-0 z-40 px-4 py-2.5 backdrop-blur-md"
            style={{
              backgroundColor: `${C.bg}ee`,
              borderBottom: `1px solid ${C.border}`,
            }}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span
                className="text-xs font-semibold flex items-center gap-1"
                style={{ color: C.text }}
              >
                <Map className="w-3.5 h-3.5" style={{ color: C.gold }} />
                Látott művek: {seen.size} / {artworks.length}
              </span>
              <AnimatePresence>
                {allSeen && (
                  <motion.span
                    className="text-xs font-semibold flex items-center gap-1"
                    style={{ color: C.success }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <Trophy className="w-3.5 h-3.5" />
                    Gratulálok!
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
            <div
              className="w-full h-1.5 rounded-full overflow-hidden"
              style={{ backgroundColor: C.border }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{
                  backgroundColor: allSeen ? C.success : C.gold,
                }}
                animate={{ width: `${progress}%` }}
                transition={{ type: 'spring', stiffness: 100, damping: 20 }}
              />
            </div>
          </div>

          {/* ── Sticky map (top ~33vh) ── */}
          <div className="sticky top-[52px] z-30 h-[33vh] min-h-[200px] shadow-md">
            <MuseumMap
              seen={seen}
              activeId={activeId}
              onPinClick={scrollToCard}
            />
          </div>

          {/* ── Scrollable artwork cards ── */}
          <div className="flex-1 px-4 py-4 space-y-4 pb-8">
            {/* Section header */}
            <div className="text-center py-2">
              <h2
                className="font-playfair text-xl font-bold"
                style={{ color: C.text }}
              >
                Útvonalterv
              </h2>
              <p className="text-xs mt-1" style={{ color: C.textMuted }}>
                Érintsd meg a térkép pontjait vagy görgess végig
              </p>
            </div>

            {artworks.map((artwork) => (
              <ArtworkCard
                key={artwork.id}
                artwork={artwork}
                isSeen={seen.has(artwork.id)}
                isActive={activeId === artwork.id}
                onToggleSeen={() => toggleSeen(artwork.id)}
              />
            ))}

            {/* Completion banner */}
            <AnimatePresence>
              {allSeen && (
                <motion.div
                  className="text-center py-8 px-4 rounded-2xl"
                  style={{
                    backgroundColor: C.goldBg,
                    border: `1.5px solid ${C.goldLight}`,
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Trophy
                    className="w-10 h-10 mx-auto mb-3"
                    style={{ color: C.gold }}
                  />
                  <h3
                    className="font-playfair text-lg font-bold mb-1"
                    style={{ color: C.text }}
                  >
                    Szuper, mindent megnéztél!
                  </h3>
                  <p className="text-sm" style={{ color: C.textMuted }}>
                    Reméljük, felejthetetlen élmény volt a Louvre felfedezése.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </div>
  )
}
