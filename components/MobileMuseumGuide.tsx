'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence, type PanInfo } from 'framer-motion'
import {
  Building2,
  Layers,
  DoorOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Eye,
  Trophy,
  Map,
  Star,
  Route,
  Compass,
  Info,
  X,
  ArrowRight,
} from 'lucide-react'

/* ═══════════════════════════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════════════════════════ */

interface Artwork {
  id: number
  title: string
  artist: string
  year: string
  wing: 'Denon' | 'Sully' | 'Richelieu'
  floor: string
  room: string
  story: string
  funFact?: string
  mapPosition: { x: number; y: number }
  gradient: string
}

/* ═══════════════════════════════════════════════════════════════════════════════
   PARISIAN POWDER — Design Tokens  (strictly NO orange)
   ═══════════════════════════════════════════════════════════════════════════════ */

const C = {
  // Surfaces
  bg:          '#FAF7F2',
  card:        '#FFFFFF',
  bgSubtle:    '#F5F0E8',
  bgMuted:     '#EDE8DF',
  // Text
  text:        '#1a1a2e',
  textSub:     '#555770',
  textMuted:   '#8b8da3',
  textLight:   '#b0b2c3',
  // Gold accent family
  gold:        '#B8A472',
  goldLight:   '#D4C49E',
  goldDark:    '#8B7D55',
  goldBg:      '#F5F0E6',
  // Utility
  border:      '#E8E2D6',
  success:     '#059669',
  successBg:   '#ECFDF5',
  // Map
  mapBg:       '#23221F',
  mapLine:     '#D4C49E',
} as const

const WING_BADGE: Record<string, { bg: string; label: string }> = {
  Denon:     { bg: '#7B6F52', label: 'Denon szárny' },
  Sully:     { bg: '#6B7B5E', label: 'Sully szárny' },
  Richelieu: { bg: '#5E6B7B', label: 'Richelieu szárny' },
}

/* ═══════════════════════════════════════════════════════════════════════════════
   MOCK DATA — 6 artworks with unique gradients
   ═══════════════════════════════════════════════════════════════════════════════ */

const artworks: Artwork[] = [
  {
    id: 1,
    title: 'Mona Lisa',
    artist: 'Leonardo da Vinci',
    year: '1503–1519',
    wing: 'Denon',
    floor: '1. emelet',
    room: '711. terem',
    story:
      'A világ leghíresebb festménye, amit évente 10 millió ember néz meg – de igazából egy bűntény tette szupersztárrá.\n\n1911-ben Vincenzo Peruggia, egy olasz üveges, aki korábban a Louvre-ban dolgozott, egyszerűen a kabátja alá rejtve lopta el. Két évig keresték a rendőrök szerte Európában, és pont a botrány miatt lett a Mona Lisa az, ami ma: a világ leghíresebb festménye.\n\nAmikor ránézel, figyeld meg a hátteret: a bal és jobb oldal nem illeszkedik – ez Leonardo szándékos trükkje, ami a titokzatosságot fokozza.',
    funFact: 'A festmény mérete mindössze 77 × 53 cm — sokakat meglep, milyen kicsi valójában.',
    mapPosition: { x: 30, y: 58 },
    gradient: 'linear-gradient(160deg, #E8DDD0 0%, #D4C9BC 40%, #C4B8A8 100%)',
  },
  {
    id: 2,
    title: 'Szamothrakéi Niké',
    artist: 'Ismeretlen görög mester',
    year: 'Kr. e. ~190',
    wing: 'Denon',
    floor: 'Lépcsőház',
    room: 'Daru-lépcső',
    story:
      'Ez a 2,75 méteres márványszobor egy hajó orrán álló győzelem-istennőt ábrázol, és a Louvre egyik legdrámaibb látványa.\n\nA szobrot 1863-ban találták Szamothraké szigetén, több száz darabra törve. Az újraalkotása évtizedekig tartott.\n\nFigyeld meg, ahogy a ruha a testhez simul, mintha valódi szél fújná. Karja és feje hiányzik, de épp ez teszi tökéletessé: a képzelet befejezi azt, amit a kő nem.',
    funFact: 'A lépcsőház tetejére helyezték, hogy alulról nézve még monumentálisabb legyen — pont úgy, ahogy egy hajó orrán állt volna.',
    mapPosition: { x: 22, y: 48 },
    gradient: 'linear-gradient(160deg, #D6DDE4 0%, #C4CDD6 40%, #B0BBC6 100%)',
  },
  {
    id: 3,
    title: 'Milói Vénusz',
    artist: 'Alexandrosz (feltételezett)',
    year: 'Kr. e. ~130–100',
    wing: 'Sully',
    floor: 'Földszint',
    room: '346. terem',
    story:
      'Egy görög paraszt találta Mélosz szigetén 1820-ban, miközben a földjét szántotta. A francia haditengerészet azonnal felismerte az értékét és Párizsba szállította.\n\nA karok hiánya a mai napig rejtély — van, aki szerint almát tartott, mások szerint egy pajzsba nézett.\n\nA szobor az ókori szépségideált testesíti meg, és a Louvre egyik legfontosabb kincse.',
    funFact: 'A szobrot eredetileg színesre festették! Az ókori görögök szobrai mind élénk színűek voltak.',
    mapPosition: { x: 60, y: 52 },
    gradient: 'linear-gradient(160deg, #DDE4D6 0%, #C6D0BC 40%, #B4C0A8 100%)',
  },
  {
    id: 4,
    title: 'A szabadság vezeti a népet',
    artist: 'Eugène Delacroix',
    year: '1830',
    wing: 'Denon',
    floor: '1. emelet',
    room: '700. terem',
    story:
      'Ez a festmény az 1830-as júliusi forradalmat ábrázolja.\n\nMarianne, a félmeztelen nő a francia trikolórral, a Szabadság allegóriája lett — őt látod minden francia euró érmén és bélyegen is.\n\nDelacroix állítólag saját magát is belefestette: ő a cilinderes férfi a barikádon. A kép egyszerre dokumentum és szimbólum, a francia identitás egyik legfontosabb vizuális ikonja.',
    mapPosition: { x: 35, y: 66 },
    gradient: 'linear-gradient(160deg, #E4D6DD 0%, #D0BCC6 40%, #C0A8B4 100%)',
  },
  {
    id: 5,
    title: 'Hammurapi törvényoszlopa',
    artist: 'Babilóni mesterek',
    year: 'Kr. e. ~1792–1750',
    wing: 'Richelieu',
    floor: 'Földszint',
    room: '227. terem',
    story:
      'Az emberiség egyik legrégebbi írott törvénygyűjteménye: 282 törvény, kőbe vésve, közel 4000 évvel ezelőtt.\n\nA tetején Hammurapi király áll Shamash, a napisten előtt, aki a törvényeket adja neki. Innen ered a „szemet szemért, fogat fogért" mondás.\n\nA 2,25 m magas diorit sztélé szinte tökéletes állapotban maradt fenn.',
    funFact: 'A törvények között szerepel a minimálbér és a fogyasztóvédelem első formája is!',
    mapPosition: { x: 35, y: 22 },
    gradient: 'linear-gradient(160deg, #E4DED6 0%, #D0C8BC 40%, #C0B6A8 100%)',
  },
  {
    id: 6,
    title: 'Nagy Szfinx',
    artist: 'Egyiptomi mesterek',
    year: 'Kr. e. ~2600',
    wing: 'Sully',
    floor: 'Alagsor',
    room: 'Szfinx kripta',
    story:
      'Ez a gránit szfinx egyike a legjobb állapotban fennmaradt egyiptomi szfinxeknek.\n\nAz alagsorba lépve, a félhomályban megpillantani ezt az ősi szobrot — olyan élmény, mintha időutazáson vennél részt.\n\nA Louvre egyiptomi gyűjteménye a világon a második legnagyobb Kairó után, és ez a szfinx az egyik legrégebbi darabja.',
    mapPosition: { x: 65, y: 38 },
    gradient: 'linear-gradient(160deg, #D6E0E4 0%, #BCD0D4 40%, #A8C0C4 100%)',
  },
]

/* ═══════════════════════════════════════════════════════════════════════════════
   ANIMATION VARIANTS
   ═══════════════════════════════════════════════════════════════════════════════ */

const cardVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? '80%' : '-80%', opacity: 0, scale: 0.92 }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (dir: number) => ({ x: dir < 0 ? '80%' : '-80%', opacity: 0, scale: 0.92 }),
}

const SWIPE_THRESHOLD = 60

/* ═══════════════════════════════════════════════════════════════════════════════
   SPLASH SCREEN — auto-dismiss ~3.5s or tap to skip
   ═══════════════════════════════════════════════════════════════════════════════ */

function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0)
  const completed = useRef(false)

  const finish = useCallback(() => {
    if (completed.current) return
    completed.current = true
    onComplete()
  }, [onComplete])

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(timer)
          setTimeout(finish, 200)
          return 100
        }
        return p + 2
      })
    }, 65)
    return () => clearInterval(timer)
  }, [finish])

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center px-8"
      style={{ backgroundColor: C.bg }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      onClick={finish}
    >
      {/* Icon */}
      <motion.div
        className="w-20 h-20 rounded-3xl flex items-center justify-center mb-8"
        style={{ backgroundColor: C.goldBg, border: `2px solid ${C.goldLight}` }}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
      >
        <Compass className="w-10 h-10" style={{ color: C.gold }} />
      </motion.div>

      {/* Title */}
      <motion.h1
        className="font-playfair text-4xl font-bold mb-2 text-center"
        style={{ color: C.text }}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        Louvre Múzeum
      </motion.h1>
      <motion.p
        className="font-playfair text-lg text-center mb-10"
        style={{ color: C.gold }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        Magyar Digitális Útikalauz
      </motion.p>

      {/* 3 quick value props */}
      <motion.div
        className="space-y-3 max-w-xs w-full"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        {[
          { icon: <Star className="w-4 h-4" />, t: 'Egyedülálló magyar nyelvű kalauz' },
          { icon: <Route className="w-4 h-4" />, t: 'Logikus útvonalterv a legjobb alkotásokhoz' },
          { icon: <Sparkles className="w-4 h-4" />, t: 'Felejthetetlen sztorik, nem száraz évszámok' },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: C.goldBg, color: C.gold }}
            >
              {item.icon}
            </div>
            <span className="text-sm" style={{ color: C.textSub }}>{item.t}</span>
          </div>
        ))}
      </motion.div>

      {/* Progress bar + skip hint */}
      <div className="absolute bottom-12 left-8 right-8">
        <div className="h-1 rounded-full overflow-hidden" style={{ backgroundColor: C.border }}>
          <motion.div className="h-full rounded-full" style={{ backgroundColor: C.gold, width: `${progress}%` }} />
        </div>
        <p className="mt-3 text-center text-xs" style={{ color: C.textMuted }}>
          Érintsd a képernyőt az induláshoz
        </p>
      </div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════════
   STEP INDICATOR DOTS
   ═══════════════════════════════════════════════════════════════════════════════ */

function StepDots({
  total,
  current,
  seen,
  onDotClick,
}: {
  total: number
  current: number
  seen: Set<number>
  onDotClick: (i: number) => void
}) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => {
        const isActive = i === current
        const isSeen = seen.has(i + 1)
        return (
          <button
            key={i}
            onClick={() => onDotClick(i)}
            aria-label={`${i + 1}. alkotás`}
            className="relative flex items-center justify-center"
          >
            <motion.div
              className="rounded-full"
              style={{
                width: isActive ? 24 : 8,
                height: 8,
                backgroundColor: isActive ? C.gold : isSeen ? C.success : C.border,
              }}
              layout
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          </button>
        )
      })}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════════
   MAP MODAL — Full-screen overlay with the Louvre route
   ═══════════════════════════════════════════════════════════════════════════════ */

function MapModal({
  currentIndex,
  seen,
  onClose,
  onNavigate,
}: {
  currentIndex: number
  seen: Set<number>
  onClose: () => void
  onNavigate: (i: number) => void
}) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col"
      style={{ backgroundColor: C.mapBg }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <h2 className="font-playfair text-lg font-bold text-white">Útvonalterv</h2>
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
        >
          <X className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Map SVG */}
      <div className="flex-1 relative mx-5 mb-4 rounded-2xl overflow-hidden" style={{ backgroundColor: '#1C1B18' }}>
        <svg viewBox="0 0 100 80" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid meet">
          {/* Louvre U-shape */}
          <g opacity="0.2" stroke={C.mapLine} fill="none" strokeWidth="0.5">
            <rect x="15" y="12" width="35" height="12" rx="1" />
            <rect x="50" y="12" width="12" height="55" rx="1" />
            <rect x="15" y="55" width="35" height="12" rx="1" />
            <rect x="15" y="12" width="12" height="55" rx="1" />
            <polygon points="40,38 45,30 50,38" strokeWidth="0.4" />
          </g>
          {/* Wing labels */}
          {(['RICHELIEU', 32, 9] as const) && (
            <>
              <text x="32" y="9" textAnchor="middle" fill={C.mapLine} opacity="0.35" fontSize="2.8" fontWeight="600">RICHELIEU</text>
              <text x="32" y="75" textAnchor="middle" fill={C.mapLine} opacity="0.35" fontSize="2.8" fontWeight="600">DENON</text>
              <text x="72" y="42" textAnchor="middle" fill={C.mapLine} opacity="0.35" fontSize="2.8" fontWeight="600">SULLY</text>
            </>
          )}
          {/* Route line */}
          <polyline
            points={artworks.map((a) => `${a.mapPosition.x},${a.mapPosition.y}`).join(' ')}
            fill="none"
            stroke={C.mapLine}
            strokeWidth="0.4"
            strokeDasharray="2 1"
            opacity="0.3"
          />
        </svg>

        {/* Pins on map */}
        {artworks.map((artwork, i) => {
          const isCurrent = i === currentIndex
          const isSeen = seen.has(artwork.id)
          return (
            <button
              key={artwork.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
              style={{ left: `${artwork.mapPosition.x}%`, top: `${artwork.mapPosition.y}%` }}
              onClick={() => { onNavigate(i); onClose() }}
            >
              <motion.div
                className="rounded-full flex items-center justify-center text-xs font-bold shadow-xl"
                style={{
                  width: isCurrent ? 36 : 28,
                  height: isCurrent ? 36 : 28,
                  backgroundColor: isSeen ? C.success : isCurrent ? '#FFFFFF' : C.gold,
                  color: isSeen ? '#FFFFFF' : isCurrent ? C.text : '#FFFFFF',
                  border: isCurrent ? `3px solid ${C.gold}` : '2px solid rgba(255,255,255,0.25)',
                }}
                animate={{ scale: isCurrent ? 1.1 : 1 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                {isSeen ? <Check className="w-3.5 h-3.5" /> : artwork.id}
              </motion.div>
              {/* Label under current pin */}
              {isCurrent && (
                <motion.span
                  className="absolute top-full mt-1 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-medium px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: C.gold, color: '#FFFFFF' }}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {artwork.title}
                </motion.span>
              )}
            </button>
          )
        })}
      </div>

      {/* Legend */}
      <div className="px-5 pb-6 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: C.gold }} />
          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>Hátra van</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: C.success }} />
          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>Megnézve</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full border-2" style={{ backgroundColor: '#FFFFFF', borderColor: C.gold }} />
          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>Most itt vagy</span>
        </div>
      </div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════════
   ARTWORK STEP CARD — one artwork, full-screen scrollable
   ═══════════════════════════════════════════════════════════════════════════════ */

function ArtworkStep({
  artwork,
  isSeen,
  onToggleSeen,
  stepLabel,
}: {
  artwork: Artwork
  isSeen: boolean
  onToggleSeen: () => void
  stepLabel: string
}) {
  const wing = WING_BADGE[artwork.wing]

  return (
    <div className="flex flex-col h-full">
      {/* ── Image Area ── */}
      <div
        className="relative flex-shrink-0 flex items-end justify-center"
        style={{ background: artwork.gradient, minHeight: '36vh' }}
      >
        {/* Step number badge */}
        <div
          className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold tracking-wide"
          style={{ backgroundColor: 'rgba(255,255,255,0.85)', color: C.text }}
        >
          {stepLabel}
        </div>

        {/* Wing badge */}
        <div
          className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold text-white"
          style={{ backgroundColor: wing.bg }}
        >
          {wing.label}
        </div>

        {/* Large artwork number watermark */}
        <span
          className="font-playfair font-bold select-none pointer-events-none leading-none"
          style={{
            fontSize: '12rem',
            color: 'rgba(255,255,255,0.18)',
            lineHeight: 0.8,
            marginBottom: '-0.1em',
          }}
        >
          {artwork.id}
        </span>

        {/* Seen overlay on image */}
        <AnimatePresence>
          {isSeen && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              style={{ backgroundColor: 'rgba(5, 150, 105, 0.12)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg"
                style={{ backgroundColor: C.success }}
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              >
                <Check className="w-8 h-8 text-white" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Gradient fade to card */}
        <div
          className="absolute bottom-0 left-0 right-0 h-12"
          style={{ background: `linear-gradient(to top, ${C.bg}, transparent)` }}
        />
      </div>

      {/* ── Content Area (scrollable) ── */}
      <div className="flex-1 overflow-y-auto px-5 pt-2 pb-6 space-y-4" style={{ backgroundColor: C.bg }}>
        {/* Title */}
        <div>
          <h2 className="font-playfair text-2xl font-bold leading-tight" style={{ color: C.text }}>
            {artwork.title}
          </h2>
          <p className="text-sm mt-1" style={{ color: C.textSub }}>
            {artwork.artist} &middot; {artwork.year}
          </p>
        </div>

        {/* Location badges */}
        <div className="flex flex-wrap gap-2">
          <LocationBadge icon={<Building2 className="w-3.5 h-3.5" />} label={`${artwork.wing} szárny`} />
          <LocationBadge icon={<Layers className="w-3.5 h-3.5" />} label={artwork.floor} />
          <LocationBadge icon={<DoorOpen className="w-3.5 h-3.5" />} label={artwork.room} />
        </div>

        {/* Divider */}
        <div className="h-px" style={{ backgroundColor: C.border }} />

        {/* Story */}
        <div className="space-y-3">
          {artwork.story.split('\n\n').map((para, i) => (
            <p
              key={i}
              className="text-[15px] leading-[1.75]"
              style={{ color: C.text }}
            >
              {para}
            </p>
          ))}
        </div>

        {/* Fun Fact callout */}
        {artwork.funFact && (
          <div
            className="p-4 rounded-2xl flex gap-3"
            style={{ backgroundColor: C.goldBg, border: `1px solid ${C.goldLight}` }}
          >
            <Info className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: C.gold }} />
            <p className="text-sm leading-relaxed" style={{ color: C.goldDark }}>
              {artwork.funFact}
            </p>
          </div>
        )}

        {/* "Megnéztem" button */}
        <motion.button
          className="w-full py-3.5 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 shadow-sm"
          style={{
            backgroundColor: isSeen ? C.successBg : C.card,
            color: isSeen ? C.success : C.gold,
            border: `1.5px solid ${isSeen ? C.success : C.goldLight}`,
          }}
          onClick={onToggleSeen}
          whileTap={{ scale: 0.97 }}
        >
          <AnimatePresence mode="wait" initial={false}>
            {isSeen ? (
              <motion.span
                key="seen"
                className="flex items-center gap-2"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <Check className="w-4 h-4" />
                Kész, megnéztem!
              </motion.span>
            ) : (
              <motion.span
                key="unseen"
                className="flex items-center gap-2"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <Eye className="w-4 h-4" />
                Megnéztem
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </div>
  )
}

function LocationBadge({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium"
      style={{ backgroundColor: C.card, color: C.text, border: `1px solid ${C.border}` }}
    >
      <span style={{ color: C.gold }}>{icon}</span>
      {label}
    </span>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════════
   COMPLETION SCREEN
   ═══════════════════════════════════════════════════════════════════════════════ */

function CompletionScreen({ onRestart }: { onRestart: () => void }) {
  return (
    <motion.div
      className="flex-1 flex flex-col items-center justify-center px-8 text-center"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
        style={{ backgroundColor: C.goldBg, border: `2px solid ${C.goldLight}` }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
      >
        <Trophy className="w-10 h-10" style={{ color: C.gold }} />
      </motion.div>

      <motion.h2
        className="font-playfair text-2xl font-bold mb-2"
        style={{ color: C.text }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        Gratulálunk!
      </motion.h2>
      <motion.p
        className="text-sm leading-relaxed mb-8 max-w-xs"
        style={{ color: C.textSub }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        Végigmentél az útvonalterven! Reméljük, felejthetetlen élmény volt a Louvre felfedezése.
      </motion.p>

      <motion.button
        className="px-8 py-3 rounded-2xl text-sm font-semibold"
        style={{ backgroundColor: C.goldBg, color: C.gold, border: `1.5px solid ${C.goldLight}` }}
        onClick={onRestart}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        whileTap={{ scale: 0.97 }}
      >
        Újra megnézem
      </motion.button>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════════════════ */

export default function MobileMuseumGuide() {
  const [showSplash, setShowSplash] = useState(true)
  const [[currentIndex, direction], setPage] = useState([0, 0])
  const [seen, setSeen] = useState<Set<number>>(new Set())
  const [showMap, setShowMap] = useState(false)
  const [showCompletion, setShowCompletion] = useState(false)

  const artwork = artworks[currentIndex]
  const total = artworks.length
  const seenCount = seen.size

  // Navigation
  const navigate = useCallback((index: number) => {
    const dir = index > currentIndex ? 1 : -1
    setPage([index, dir])
  }, [currentIndex])

  const goNext = useCallback(() => {
    if (currentIndex < total - 1) {
      setPage([currentIndex + 1, 1])
    } else if (seenCount === total) {
      setShowCompletion(true)
    }
  }, [currentIndex, total, seenCount])

  const goPrev = useCallback(() => {
    if (currentIndex > 0) setPage([currentIndex - 1, -1])
  }, [currentIndex])

  // Swipe handler (only triggers on predominantly horizontal gesture)
  const handleDragEnd = useCallback((_: unknown, info: PanInfo) => {
    const { offset } = info
    if (Math.abs(offset.x) > SWIPE_THRESHOLD && Math.abs(offset.x) > Math.abs(offset.y) * 1.2) {
      if (offset.x < 0) goNext()
      else goPrev()
    }
  }, [goNext, goPrev])

  // Toggle seen
  const toggleSeen = useCallback(() => {
    const id = artworks[currentIndex].id
    setSeen((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [currentIndex])

  // Check completion after marking
  useEffect(() => {
    if (seenCount === total && currentIndex === total - 1) {
      const t = setTimeout(() => setShowCompletion(true), 800)
      return () => clearTimeout(t)
    }
  }, [seenCount, total, currentIndex])

  const restart = useCallback(() => {
    setShowCompletion(false)
    setSeen(new Set())
    setPage([0, 0])
  }, [])

  // Progress percentage
  const progressPct = (seenCount / total) * 100

  return (
    <div className="fixed inset-0 flex flex-col" style={{ backgroundColor: C.bg }}>
      {/* ── Splash ── */}
      <AnimatePresence>
        {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      </AnimatePresence>

      {/* ── Map Modal ── */}
      <AnimatePresence>
        {showMap && (
          <MapModal
            currentIndex={currentIndex}
            seen={seen}
            onClose={() => setShowMap(false)}
            onNavigate={navigate}
          />
        )}
      </AnimatePresence>

      {!showSplash && (
        <>
          {/* ═══ TOP BAR ═══ */}
          <div
            className="flex-shrink-0 px-4 pt-3 pb-2 space-y-2"
            style={{ backgroundColor: C.bg, borderBottom: `1px solid ${C.border}` }}
          >
            {/* Row: counter + dots + map button */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold tabular-nums" style={{ color: C.textSub }}>
                {currentIndex + 1} / {total}
              </span>

              <StepDots
                total={total}
                current={currentIndex}
                seen={seen}
                onDotClick={navigate}
              />

              <button
                onClick={() => setShowMap(true)}
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: C.goldBg, border: `1px solid ${C.goldLight}` }}
                aria-label="Térkép megnyitása"
              >
                <Map className="w-4 h-4" style={{ color: C.gold }} />
              </button>
            </div>

            {/* Progress bar */}
            <div className="h-1 rounded-full overflow-hidden" style={{ backgroundColor: C.border }}>
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: seenCount === total ? C.success : C.gold }}
                animate={{ width: `${progressPct}%` }}
                transition={{ type: 'spring', stiffness: 120, damping: 20 }}
              />
            </div>
          </div>

          {/* ═══ CARD AREA (swipeable, with AnimatePresence slide) ═══ */}
          {showCompletion ? (
            <CompletionScreen onRestart={restart} />
          ) : (
            <motion.div
              className="flex-1 min-h-0 relative overflow-hidden"
              onPanEnd={handleDragEnd}
            >
              <AnimatePresence initial={false} custom={direction} mode="popLayout">
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  variants={cardVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className="absolute inset-0"
                >
                  <ArtworkStep
                    artwork={artwork}
                    isSeen={seen.has(artwork.id)}
                    onToggleSeen={toggleSeen}
                    stepLabel={`${artwork.id}. alkotás`}
                  />
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}

          {/* ═══ BOTTOM NAV ═══ */}
          {!showCompletion && (
            <div
              className="flex-shrink-0 flex items-center justify-between px-5 py-3"
              style={{ backgroundColor: C.card, borderTop: `1px solid ${C.border}` }}
            >
              {/* Prev */}
              <button
                onClick={goPrev}
                disabled={currentIndex === 0}
                className="w-11 h-11 rounded-full flex items-center justify-center transition-opacity"
                style={{
                  backgroundColor: currentIndex === 0 ? C.bgSubtle : C.goldBg,
                  border: `1px solid ${currentIndex === 0 ? C.border : C.goldLight}`,
                  opacity: currentIndex === 0 ? 0.4 : 1,
                }}
                aria-label="Előző"
              >
                <ChevronLeft className="w-5 h-5" style={{ color: currentIndex === 0 ? C.textMuted : C.gold }} />
              </button>

              {/* Center: seen counter */}
              <div className="text-center">
                <p className="text-xs font-semibold" style={{ color: C.textSub }}>
                  Megnézve: {seenCount} / {total}
                </p>
              </div>

              {/* Next */}
              <button
                onClick={goNext}
                disabled={currentIndex === total - 1 && seenCount !== total}
                className="w-11 h-11 rounded-full flex items-center justify-center transition-opacity"
                style={{
                  backgroundColor:
                    currentIndex === total - 1
                      ? seenCount === total
                        ? C.success
                        : C.bgSubtle
                      : C.gold,
                  opacity: currentIndex === total - 1 && seenCount !== total ? 0.4 : 1,
                }}
                aria-label={currentIndex === total - 1 ? 'Befejezés' : 'Következő'}
              >
                {currentIndex === total - 1 && seenCount === total ? (
                  <Trophy className="w-5 h-5 text-white" />
                ) : (
                  <ChevronRight
                    className="w-5 h-5"
                    style={{
                      color:
                        currentIndex === total - 1 && seenCount !== total
                          ? C.textMuted
                          : '#FFFFFF',
                    }}
                  />
                )}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
