'use client';

import { useState, useRef, useEffect } from 'react';
import { MapPin, TrainFront, Ticket, Info, X, Check, Lightbulb, ShieldCheck, Smartphone, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { mapPoints, type MapPoint } from './draggable-map-data';

/**
 * FLASHCARD CONTENT DATA
 * =====================
 * This is the central data structure for all modal content.
 * Client can easily edit all text content here.
 */
const MAP_CONTENT_DATA: Record<string, {
  flipCard: {
    front: string;
    back: string;
  };
  pros: string[];
  usage: string[];
  tip: string;
}> = {
  'point-1': { // Mivel lehet utazni?
    flipCard: {
      front: 'Mivel lehet utazni Párizsban?',
      back: 'Párizsban rengeteg közlekedési lehetőség áll rendelkezésedre: metró (16 vonal), RER (elővárosi vasút), buszok (több mint 60 vonal), villamosok, és még bicikli/roller is! Kombinálhatod őket, hogy bárhova eljuss.'
    },
    pros: [
      'Metró: 16 vonal, sűrű hálózat, gyakori járatok',
      'RER: Gyors kapcsolat a külvárosokkal és repülőtérrel',
      'Buszok: Felszíni közlekedés, látnivalók közben',
      'Vélib biciklik és e-rollerek bérelhetők'
    ],
    usage: [
      '🚇 Metró: Leggyorsabb a városon belül',
      '🚆 RER: Ideális a repülőtérre vagy Versailles-ba',
      '🚌 Busz: Ha látni szeretnéd a várost útközben',
      '🚲 Vélib: Rövid távokra tökéletes',
      '🚶 Gyalog: Sok látnivaló közel van egymáshoz'
    ],
    tip: 'Viktória titkos tippje: A Batobus (folyami busz) turistáknak drága, de a pont-pont metró gyorsabb és olcsóbb. Viszont ha van időd, a buszok (pl. 69-es, 96-os vonal) ingyen városnézést adnak útközben!'
  },
  'point-2': { // Jegyek - amit turistaként érdemes tudni
    flipCard: {
      front: 'Melyik jegyet vegyem Párizsban?',
      back: 'A T+ jegy az alapjegy - egyetlen utazásra metróra, buszra, villamosra. Ha több napot töltesz Párizsban, a Navigo bérlet sokkal kifizetődőbb és kényelmesebb!'
    },
    pros: [
      'T+ jegy: 2.10€ egyetlen útra, 10db csomag olcsóbb',
      'Navigo Découverte: heti bérlet ~30€, korlátlan utazás',
      'Paris Visite: 1-5 napos turistajegy, zónák szerint',
      'Gyerekeknek (4-10 év) kedvezmény, 4 év alatt ingyenes'
    ],
    usage: [
      '🏪 Vegyél jegyet metróállomáson (automata vagy pénztár)',
      '🎫 T+ jegy: nyomd be a kapunál, őrizd meg az út végéig',
      '💳 Navigo: érintsd a kártyát a sárga olvasón',
      '📱 Boomerang app: mobilon is vehetsz jegyet',
      '👮 Ellenőrök bármikor kérhetik - büntetés akár 50€'
    ],
    tip: 'Viktória titkos tippje: Ha 3+ napot töltesz Párizsban, azonnal vegyél Navigo Découverte bérletet. Vigyél magaddal egy útlevélképet hozzá! Megtérül már 15 utazás után, és nem kell mindig jegyet venned.'
  },
  'point-3': { // Hasznos tudnivalók
    flipCard: {
      front: 'Mire figyeljek a párizsi közlekedésben?',
      back: 'A párizsi metró színkódolt vonalakkal dolgozik - minden vonal más színű. Az állomásokon mindenhol van térkép, és a cégtáblák világosak. A "Correspondance" = átszállás, "Sortie" = kijárat!'
    },
    pros: [
      'Színes, egyszerű térképek minden állomáson',
      'Mobilappok valós idejű infóval (Citymapper, Google Maps)',
      'Üzemidő: ~5:30-tól 0:30-ig (hétvégén éjjel 2-ig)',
      'Akadálymentesített állomások: keresd a ♿ szimbólumot'
    ],
    usage: [
      '🗺️ Használj térképappot offline módban is (screenshot!)',
      '🎯 Nézd meg a végállomás nevét (ez az irány)',
      '🔄 Átszállásnál kövesd a "Correspondance + vonalszám" táblákat',
      '🚶 "Sortie" = kijárat, nézd meg előre melyik kijárat közelebb van',
      '📍 Châtelet-Les Halles és Montparnasse nagy - adj magadnak időt!'
    ],
    tip: 'Viktória titkos tippje: Screenshot-olj le térképeket OFFLINE használatra! A metróban gyakran nincs net. És ha eltévedsz, ne félj megkérdezni - "Pardon, où est...?" = Elnézést, hol van...?'
  },
  'point-4': { // Kis párizsi túlélőtippek
    flipCard: {
      front: 'Mik a legfontosabb párizsi közlekedési túlélőtippek?',
      back: 'Csúcsidőben (8-9h, 17-19h) tömeg van - kerüld, ha teheted! Vigyázz a táskádra (zsebtolvajok!), és ne blokkold a mozgólépcsőt (balra állj, jobbra menj). A helyi szokásokat kövesd!'
    },
    pros: [
      'Tartsd jobbra a mozgólépcsőn (baloldal a siető embereknek)',
      'Ne dohányozz a metróban vagy buszban (büntetés!)',
      'Engedd le előbb az embereket, aztán szállj fel',
      'Nyáron hidratálj - nincs légkondi a metróban'
    ],
    usage: [
      '🎒 Mindig vigyázz a táskádra! Főleg turistahelyeken',
      '⏰ Kerüld a csúcsidőt, ha teheted (8-9h, 17-19h)',
      '🚇 Line 1 és Line 4 a legzsúfoltabb csúcsban',
      '🪜 Nagy csomaggal nehéz lehet - sok lépcső van',
      '🚪 Állj az ajtótól távol, ha nem szállsz le hamarosan'
    ],
    tip: 'Viktória titkos tippje: Châtelet-Les Halles hatalmas labirintus - első alkalommal mindenki eltéved! Ha ott kell átszállnod, adj magadnak extra 10 percet. És óvatosan a táskáddal - ez a zsebtolvajok kedvenc helye!'
  },
  'point-5': { // Ajánlott appok
    flipCard: {
      front: 'Milyen appokat használjak Párizsban?',
      back: 'A megfelelő mobilappok megkönnyítik az életед! Valós idejű menetrendek, offline térképek, és jegyvásárlás - minden egy helyen. Ezek nélkül nehezebb lesz tájékozódni!'
    },
    pros: [
      'Citymapper: valós idejű menetrendek, alternatív útvonalak',
      'RATP/Boomerang: hivatalos app, jegyvásárlás',
      'Google Maps: offline térkép, pontos útvonalak',
      'Maps.me: teljesen offline navigáció'
    ],
    usage: [
      '📱 Citymapper: legjobb útvonaltervező, mutatja a késéseket',
      '🎫 Boomerang (RATP): vegyél mobilon jegyet',
      '🗺️ Google Maps: töltsd le a térképet offline használatra',
      '🚇 RATP: menetrend és metróinfók',
      '🚲 Vélib: bérelj biciklit'
    ],
    tip: 'Viktória titkos tippje: Töltsd le a Citymapper appot és a Google Maps offline térképét! Így ha nincs net a metróban, akkor is tudsz tájékozódni. És vegyél egy európai adatcsomagot - megéri!'
  },
  'point-6': { // Valós Szituációk
    flipCard: {
      front: 'Milyen valós helyzetekkel találkozhatok?',
      back: 'A párizsi közlekedés néha meglepetésekkel szolgál: sztrájkok, késések, tömeg, vagy épp eltévedsz egy hatalmas állomáson. Ne aggódj - mindenki átéli ezeket! Íme pár tipikus szituáció és megoldás.'
    },
    pros: [
      'Sztrájk: Az appok jelzik, van B terv (busz, taxi, gyalog)',
      'Eltévedés: Kérdezz meg valakit vagy kövesd a tömеget',
      'Tömeg: Várj a következő metrót, kevésbé lesz zsúfolt',
      'Jegyellenőrzés: Ha megvan a jegyed, nyugi - csak mutasd meg'
    ],
    usage: [
      '🚨 Ha sztrájk van: Nézd meg az appban, mely vonalak járnak',
      '🗺️ Ha eltévedtél: Ne stresszelj, menj vissza a térképhez',
      '👥 Ha tömeg van: Várj 3-5 percet, jön üresebb metró',
      '🚪 Ha rossz irányba mentél: Szállj le, menj át az átellenes peronra',
      '👮 Ha ellenőrök jönnek: Mutasd meg nyugodtan a jegyed'
    ],
    tip: 'Viktória titkos tippje: Egyszer a Châtelet-ben 20 percig keresteм a Line 7-et, míg rá nem jöttem, hogy rossz folyosón vagyok. Ne félj megkérdezni az embereket - sokan segítenek, ha látják, hogy turista vagy!'
  }
};

/**
 * FlipCard Component - Card 1
 * Interactive flip card with front/back content
 */
function FlipCard({ front, back }: { front: string; back: string }) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="relative h-48 cursor-pointer"
      style={{ perspective: '1000px' }}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
      >
        {/* Front Side */}
        <div
          className="absolute inset-0 rounded-xl p-6
            bg-[#0A1A2F]
            flex items-center justify-center text-center shadow-lg"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div>
            <p className="text-xl font-bold text-white leading-relaxed">
              {front}
            </p>
            <p className="text-sm text-white/60 mt-3">
              🔄 Kattints a válaszért
            </p>
          </div>
        </div>

        {/* Back Side */}
        <div
          className="absolute inset-0 rounded-xl p-6
            bg-[#0A1A2F]
            flex items-center justify-center text-center shadow-lg"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <p className="text-base text-white leading-relaxed">
            {back}
          </p>
        </div>
      </motion.div>
    </div>
  );
}

/**
 * Interactive Draggable Map Component
 * Users can click and drag to pan around a large map image
 * with fixed metro station markers
 */
export default function DraggableMapSection() {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [activePoint, setActivePoint] = useState<MapPoint | null>(null);
  const [contentData, setContentData] = useState<Record<string, {
    flipCard: { front: string; back: string };
    pros: string[];
    usage: string[];
    tip: string;
  }>>(MAP_CONTENT_DATA);

  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  /**
   * Fetch flashcard content from database
   */
  useEffect(() => {
    const fetchContent = async () => {
      const { data, error } = await supabase
        .from('map_flashcard_content')
        .select('*');

      if (!error && data && data.length > 0) {
        const contentMap: typeof contentData = {};
        data.forEach((item: any) => {
          contentMap[item.point_id] = {
            flipCard: {
              front: item.flip_front,
              back: item.flip_back,
            },
            pros: item.pros || [],
            usage: item.usage || [],
            tip: item.tip,
          };
        });
        setContentData(contentMap);
      }
      // If error or no data, fallback to hardcoded MAP_CONTENT_DATA
    };

    fetchContent();
  }, []);

  /**
   * Get the appropriate icon based on point type
   */
  const getIcon = (type: MapPoint['type']) => {
    switch (type) {
      case 'transport':
        return TrainFront;
      case 'ticket':
        return Ticket;
      case 'info':
        return Info;
      case 'survival':
        return ShieldCheck;
      case 'apps':
        return Smartphone;
      case 'situations':
        return Users;
      default:
        return MapPin;
    }
  };

  // Map image dimensions (actual size of ujmetro.png)
  const MAP_WIDTH = 1536;
  const MAP_HEIGHT = 1024;

  /**
   * Calculate boundaries to prevent over-dragging
   * Ensures the map doesn't drag beyond visible edges
   */
  const getBounds = () => {
    if (!containerRef.current || !mapRef.current) {
      return { minX: 0, maxX: 0, minY: 0, maxY: 0 };
    }

    const containerWidth = containerRef.current.offsetWidth;
    const containerHeight = containerRef.current.offsetHeight;

    return {
      minX: containerWidth - MAP_WIDTH,
      maxX: 0,
      minY: containerHeight - MAP_HEIGHT,
      maxY: 0,
    };
  };

  /**
   * Clamp position within bounds
   */
  const clampPosition = (x: number, y: number) => {
    const bounds = getBounds();
    return {
      x: Math.max(bounds.minX, Math.min(bounds.maxX, x)),
      y: Math.max(bounds.minY, Math.min(bounds.maxY, y)),
    };
  };

  /**
   * Mouse/Touch Down Handler
   */
  const handlePointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    setDragStart({
      x: clientX - position.x,
      y: clientY - position.y,
    });

    // Prevent text selection while dragging
    e.preventDefault();
  };

  /**
   * Mouse/Touch Move Handler
   */
  const handlePointerMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const newX = clientX - dragStart.x;
    const newY = clientY - dragStart.y;

    const clampedPosition = clampPosition(newX, newY);
    setPosition(clampedPosition);
  };

  /**
   * Mouse/Touch Up Handler
   */
  const handlePointerUp = () => {
    setIsDragging(false);
  };

  /**
   * Center the map on initial load
   */
  useEffect(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const containerHeight = containerRef.current.offsetHeight;

      const initialX = (containerWidth - MAP_WIDTH) / 2;
      const initialY = (containerHeight - MAP_HEIGHT) / 2;

      setPosition(clampPosition(initialX, initialY));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Add global event listeners for drag
   */
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      handlePointerMove(e as any);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      handlePointerMove(e as any);
    };

    const handleMouseUp = () => handlePointerUp();
    const handleTouchEnd = () => handlePointerUp();

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, dragStart, position]);

  return (
    <section className="py-16 bg-gradient-to-b from-parisian-beige-50 to-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-parisian-grey-900 mb-4">
            Fedezd fel Párizst
          </h2>
          <p className="text-lg text-parisian-grey-600 max-w-2xl mx-auto">
            Kattints és húzd a térképet, majd válaszd ki az információs ikonokat
            hogy többet tudj meg a párizsi tömegközlekedésről!
          </p>
        </div>

        {/* Draggable Map Container */}
        <div className="relative max-w-6xl mx-auto">
          <div
            ref={containerRef}
            className={`
              relative h-[500px] w-full
              overflow-hidden rounded-2xl
              shadow-2xl border-4 border-parisian-grey-200
              ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}
            `}
            onMouseDown={handlePointerDown}
            onTouchStart={handlePointerDown}
          >
            {/* The Draggable Canvas (Map + Markers) */}
            <div
              ref={mapRef}
              className="absolute"
              style={{
                width: `${MAP_WIDTH}px`,
                height: `${MAP_HEIGHT}px`,
                transform: `translate(${position.x}px, ${position.y}px)`,
                transition: isDragging ? 'none' : 'transform 0.2s ease-out',
                userSelect: 'none',
                WebkitUserSelect: 'none',
              }}
            >
              {/* Background Map Image */}
              <img
                src="/images/ujmetro.png"
                alt="Paris Metro Map"
                className="w-full h-full object-cover pointer-events-none"
                draggable={false}
              />

              {/* Interactive Point Markers */}
              {mapPoints.map((point) => {
                const IconComponent = getIcon(point.type);
                return (
                  <div
                    key={point.id}
                    className="absolute z-10 transform -translate-x-1/2 -translate-y-1/2"
                    style={{
                      left: `${point.x}%`,
                      top: `${point.y}%`,
                    }}
                  >
                    {/* Marker Button */}
                    <button
                      className={`
                        relative group pointer-events-auto
                        ${isDragging ? 'cursor-grabbing' : 'cursor-pointer'}
                      `}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isDragging) {
                          setActivePoint(point);
                        }
                      }}
                      onMouseDown={(e) => e.stopPropagation()}
                      onTouchStart={(e) => e.stopPropagation()}
                    >
                      {/* Custom Icon Marker */}
                      <div
                        className={`
                          w-12 h-12 rounded-full
                          ${point.color}
                          shadow-lg
                          flex items-center justify-center
                          transition-all duration-200
                          hover:scale-110
                          ${activePoint?.id === point.id
                            ? 'ring-4 ring-white scale-110'
                            : ''
                          }
                        `}
                      >
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>

                      {/* Tooltip on Hover */}
                      <div
                        className={`
                          absolute left-1/2 -translate-x-1/2 bottom-full mb-2
                          px-3 py-2 rounded-lg
                          bg-parisian-grey-900 text-white text-sm
                          whitespace-nowrap
                          pointer-events-none
                          transition-opacity duration-200
                          ${!isDragging ? 'opacity-0 group-hover:opacity-100' : 'opacity-0'}
                        `}
                      >
                        <div className="font-semibold">{point.title}</div>
                        {/* Tooltip Arrow */}
                        <div
                          className="absolute left-1/2 -translate-x-1/2 top-full
                          w-0 h-0 border-l-4 border-r-4 border-t-4
                          border-l-transparent border-r-transparent
                          border-t-parisian-grey-900"
                        />
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Instructions Overlay (appears when not dragging) */}
            {!isDragging && (
              <div
                className="absolute top-4 left-1/2 -translate-x-1/2
                px-6 py-3 rounded-full
                bg-white/90 backdrop-blur-sm
                shadow-lg border border-parisian-grey-200
                pointer-events-none
                animate-pulse"
              >
                <p className="text-sm font-medium text-parisian-grey-700">
                  🖐️ Kattints és húzd a térképet
                </p>
              </div>
            )}
          </div>

          {/* Enhanced 4-Card Flashcard Modal */}
          <AnimatePresence>
            {activePoint && (() => {
              const cardData = contentData[activePoint.id];
              if (!cardData) return null;

              return (
                <>
                  {/* Backdrop */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                    onClick={() => setActivePoint(null)}
                  />

                  {/* Modal Container */}
                  <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4
                      pointer-events-none overflow-y-auto"
                    onClick={() => setActivePoint(null)}
                  >
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: 20 }}
                      transition={{ duration: 0.3, type: 'spring' }}
                      className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full
                        pointer-events-auto my-8"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Header */}
                      <div className="relative p-6 border-b border-parisian-grey-200">
                        <div className="flex items-start gap-4">
                          {/* Icon */}
                          <div className={`w-12 h-12 rounded-full ${activePoint.color}
                            flex items-center justify-center flex-shrink-0`}>
                            {(() => {
                              const IconComponent = getIcon(activePoint.type);
                              return <IconComponent className="w-6 h-6 text-white" />;
                            })()}
                          </div>

                          {/* Title */}
                          <div className="flex-1">
                            <h3 className="text-2xl font-bold text-parisian-grey-900">
                              {activePoint.title}
                            </h3>
                            <p className="text-sm text-parisian-grey-500 mt-1">
                              Görgess le a részletekért 👇
                            </p>
                          </div>

                          {/* Close Button */}
                          <button
                            onClick={() => setActivePoint(null)}
                            className="w-8 h-8 rounded-full bg-parisian-grey-100
                              hover:bg-parisian-grey-200
                              flex items-center justify-center
                              transition-colors duration-200"
                            aria-label="Bezárás"
                          >
                            <X className="w-5 h-5 text-parisian-grey-600" />
                          </button>
                        </div>
                      </div>

                      {/* 4-Card Content Stack */}
                      <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                        {/* Card 1: The Concept (Flip Card) */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1, duration: 0.4 }}
                        >
                          <div className="mb-2">
                            <span className="inline-block px-3 py-1 text-xs font-semibold
                              bg-french-blue-100 text-french-blue-700 rounded-full">
                              1️⃣ A Koncepció
                            </span>
                          </div>
                          <FlipCard
                            front={cardData.flipCard.front}
                            back={cardData.flipCard.back}
                          />
                        </motion.div>

                        {/* Card 2: Pros (Full Width) */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2, duration: 0.4 }}
                        >
                          <div className="mb-2">
                            <span className="inline-block px-3 py-1 text-xs font-semibold
                              bg-green-100 text-green-700 rounded-full">
                              2️⃣ Amit érdemes tudni
                            </span>
                          </div>
                          <div className="bg-white rounded-xl border-2 border-parisian-grey-200
                            p-6 shadow-sm">
                            {/* Pros - Full Width */}
                            <div>
                              <h4 className="flex items-center gap-2 text-lg font-bold
                                text-green-700 mb-4">
                                <Check className="w-5 h-5" />
                                Előnyök
                              </h4>
                              <ul className="space-y-3">
                                {cardData.pros.map((pro, idx) => (
                                  <li key={idx} className="flex items-start gap-3">
                                    <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                    <span className="text-sm text-parisian-grey-700 leading-relaxed">
                                      {pro}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </motion.div>

                        {/* Card 3: How to Use */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3, duration: 0.4 }}
                        >
                          <div className="mb-2">
                            <span className="inline-block px-3 py-1 text-xs font-semibold
                              bg-purple-100 text-purple-700 rounded-full">
                              3️⃣ Hogyan használd
                            </span>
                          </div>
                          <div className="bg-white rounded-xl border-2 border-parisian-grey-200
                            p-6 shadow-sm">
                            <div className="space-y-3">
                              {cardData.usage.map((step, idx) => (
                                <div key={idx} className="flex items-start gap-3">
                                  <div className="w-6 h-6 rounded-full bg-purple-100
                                    flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-xs font-bold text-purple-700">
                                      {idx + 1}
                                    </span>
                                  </div>
                                  <p className="text-sm text-parisian-grey-700 leading-relaxed">
                                    {step}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </motion.div>

                        {/* Card 4: Guide's Secret Tip */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4, duration: 0.4 }}
                        >
                          <div className="mb-2">
                            <span className="inline-block px-3 py-1 text-xs font-semibold
                              bg-yellow-100 text-yellow-700 rounded-full">
                              4️⃣ Viktória Titkos Tippje
                            </span>
                          </div>
                          <div className="bg-gradient-to-br from-yellow-50 to-amber-50
                            rounded-xl border-2 border-yellow-200
                            p-6 shadow-sm">
                            <div className="flex items-start gap-4">
                              <div className="w-10 h-10 rounded-full bg-yellow-200
                                flex items-center justify-center flex-shrink-0">
                                <Lightbulb className="w-5 h-5 text-yellow-700" />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm text-parisian-grey-800 leading-relaxed italic">
                                  {cardData.tip}
                                </p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      </div>

                      {/* Footer */}
                      <div className="p-6 pt-0">
                        <button
                          onClick={() => setActivePoint(null)}
                          className="w-full py-3 px-6 rounded-xl
                            bg-french-blue-600 hover:bg-french-blue-700
                            text-white font-semibold
                            transition-colors duration-200
                            shadow-lg hover:shadow-xl"
                        >
                          Rendben, értem! 👍
                        </button>
                      </div>
                    </motion.div>
                  </div>
                </>
              );
            })()}
          </AnimatePresence>

          {/* Map Legend */}
          <div className="mt-6 flex flex-wrap gap-4 justify-center">
            {mapPoints.map((point) => {
              const IconComponent = getIcon(point.type);
              return (
                <button
                  key={point.id}
                  onClick={() => {
                    setActivePoint(point);

                    // Center the map on this point
                    if (containerRef.current) {
                      const containerWidth = containerRef.current.offsetWidth;
                      const containerHeight = containerRef.current.offsetHeight;

                      const pointX = (point.x / 100) * MAP_WIDTH;
                      const pointY = (point.y / 100) * MAP_HEIGHT;

                      const newX = containerWidth / 2 - pointX;
                      const newY = containerHeight / 2 - pointY;

                      setPosition(clampPosition(newX, newY));
                    }
                  }}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-full
                    transition-all duration-200
                    ${activePoint?.id === point.id
                      ? 'bg-french-blue-500 text-white shadow-lg scale-105'
                      : 'bg-white text-parisian-grey-700 hover:bg-parisian-beige-100'
                    }
                    border-2 ${activePoint?.id === point.id
                      ? 'border-french-blue-600'
                      : 'border-parisian-grey-200'
                    }
                  `}
                >
                  <IconComponent className="w-4 h-4" />
                  <span className="text-sm font-medium">{point.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
