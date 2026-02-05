'use client';

import { useState, useRef, useEffect } from 'react';
import { MapPin, TrainFront, Ticket, Info, X, ShieldCheck, Smartphone, Users, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { fallbackMapPoints, type MapPoint } from './draggable-map-data';

/**
 * FlipCard Component
 * 3D flip card with correct backface-visibility handling.
 */
function FlipCard({ front, back }: { front: string; back: string }) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="relative h-52 cursor-pointer"
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
            bg-gradient-to-br from-french-blue-50 to-white
            border-2 border-french-blue-200
            flex items-center justify-center text-center shadow-lg"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div>
            <p className="text-lg font-bold text-slate-800 leading-relaxed">
              {front}
            </p>
            <p className="text-sm text-slate-500 mt-3">
              Kattints a válaszért
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
 * Fetches points from the `map_points` Supabase table.
 */
export default function DraggableMapSection() {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [activePoint, setActivePoint] = useState<MapPoint | null>(null);
  const [points, setPoints] = useState<MapPoint[]>(fallbackMapPoints);

  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  /**
   * Fetch map points from database
   */
  useEffect(() => {
    const fetchPoints = async () => {
      const { data, error } = await supabase
        .from('map_points')
        .select('*')
        .order('id');

      if (!error && data && data.length > 0) {
        setPoints(data as MapPoint[]);
      }
    };

    fetchPoints();
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
      case 'situation':
        return MessageCircle;
      default:
        return MapPin;
    }
  };

  const MAP_WIDTH = 1536;
  const MAP_HEIGHT = 1024;

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

  const clampPosition = (x: number, y: number) => {
    const bounds = getBounds();
    return {
      x: Math.max(bounds.minX, Math.min(bounds.maxX, x)),
      y: Math.max(bounds.minY, Math.min(bounds.maxY, y)),
    };
  };

  const handlePointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setDragStart({ x: clientX - position.x, y: clientY - position.y });
    e.preventDefault();
  };

  const handlePointerMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setPosition(clampPosition(clientX - dragStart.x, clientY - dragStart.y));
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const containerHeight = containerRef.current.offsetHeight;
      setPosition(clampPosition((containerWidth - MAP_WIDTH) / 2, (containerHeight - MAP_HEIGHT) / 2));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => { if (!isDragging) return; handlePointerMove(e as any); };
    const handleTouchMove = (e: TouchEvent) => { if (!isDragging) return; handlePointerMove(e as any); };
    const handleUp = () => handlePointerUp();

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('mouseup', handleUp);
      window.addEventListener('touchend', handleUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('mouseup', handleUp);
      window.removeEventListener('touchend', handleUp);
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
            hogy többet tudj meg a párizsi közlekedésről!
          </p>
        </div>

        {/* Draggable Map Container */}
        <div className="relative max-w-6xl mx-auto">
          <div
            ref={containerRef}
            className={`
              relative h-[500px] w-full overflow-hidden rounded-2xl
              shadow-2xl border-4 border-parisian-grey-200
              ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}
            `}
            onMouseDown={handlePointerDown}
            onTouchStart={handlePointerDown}
          >
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
              <img
                src="/images/ujmetro.png"
                alt="Paris Metro Map"
                className="w-full h-full object-cover pointer-events-none"
                draggable={false}
              />

              {/* Interactive Point Markers */}
              {points.map((point) => {
                const IconComponent = getIcon(point.type);
                return (
                  <div
                    key={point.id}
                    className="absolute z-10 transform -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${point.x}%`, top: `${point.y}%` }}
                  >
                    <button
                      className={`relative group pointer-events-auto ${isDragging ? 'cursor-grabbing' : 'cursor-pointer'}`}
                      onClick={(e) => { e.stopPropagation(); if (!isDragging) setActivePoint(point); }}
                      onMouseDown={(e) => e.stopPropagation()}
                      onTouchStart={(e) => e.stopPropagation()}
                    >
                      <div className={`
                        w-12 h-12 rounded-full ${point.color} shadow-lg
                        flex items-center justify-center transition-all duration-200 hover:scale-110
                        ${activePoint?.id === point.id ? 'ring-4 ring-white scale-110' : ''}
                      `}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div className={`
                        absolute left-1/2 -translate-x-1/2 bottom-full mb-2
                        px-3 py-2 rounded-lg bg-parisian-grey-900 text-white text-sm
                        whitespace-nowrap pointer-events-none transition-opacity duration-200
                        ${!isDragging ? 'opacity-0 group-hover:opacity-100' : 'opacity-0'}
                      `}>
                        <div className="font-semibold">{point.title}</div>
                        <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0
                          border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-parisian-grey-900" />
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Drag Instructions */}
            {!isDragging && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full
                bg-white/90 backdrop-blur-sm shadow-lg border border-parisian-grey-200 pointer-events-none animate-pulse">
                <p className="text-sm font-medium text-parisian-grey-700">
                  Kattints és húzd a térképet
                </p>
              </div>
            )}
          </div>

          {/* ===== MODAL ===== */}
          <AnimatePresence>
            {activePoint && (
              <>
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                  onClick={() => setActivePoint(null)}
                />

                {/* Modal */}
                <div
                  className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none overflow-y-auto"
                  onClick={() => setActivePoint(null)}
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ duration: 0.3, type: 'spring' }}
                    className="rounded-2xl shadow-2xl max-w-2xl w-full pointer-events-auto my-8 overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Deep Blue Header */}
                    <div className="relative bg-slate-900 p-6">
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-full ${activePoint.color}
                          flex items-center justify-center flex-shrink-0`}>
                          {(() => {
                            const IconComp = getIcon(activePoint.type);
                            return <IconComp className="w-6 h-6 text-white" />;
                          })()}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-white">
                            {activePoint.title}
                          </h3>
                          <p className="text-sm text-slate-400 mt-1">
                            Kattints a kártyára a válaszért
                          </p>
                        </div>
                        <button
                          onClick={() => setActivePoint(null)}
                          className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20
                            flex items-center justify-center transition-colors duration-200"
                          aria-label="Bezárás"
                        >
                          <X className="w-5 h-5 text-white" />
                        </button>
                      </div>
                    </div>

                    {/* Light Body */}
                    <div className="bg-gray-50 p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                      {/* Flip Card */}
                      {activePoint.question && (
                        <FlipCard
                          front={activePoint.question}
                          back={activePoint.answer || ''}
                        />
                      )}

                      {/* Details Section */}
                      {activePoint.details && (
                        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                          <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                            {activePoint.details}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="bg-gray-50 px-6 pb-6 pt-0">
                      <button
                        onClick={() => setActivePoint(null)}
                        className="w-full py-3 px-6 rounded-xl
                          bg-slate-900 hover:bg-slate-800
                          text-white font-semibold
                          transition-colors duration-200
                          shadow-lg hover:shadow-xl"
                      >
                        Rendben, értem!
                      </button>
                    </div>
                  </motion.div>
                </div>
              </>
            )}
          </AnimatePresence>

          {/* Map Legend */}
          <div className="mt-6 flex flex-wrap gap-4 justify-center">
            {points.map((point) => {
              const IconComponent = getIcon(point.type);
              return (
                <button
                  key={point.id}
                  onClick={() => {
                    setActivePoint(point);
                    if (containerRef.current) {
                      const cw = containerRef.current.offsetWidth;
                      const ch = containerRef.current.offsetHeight;
                      setPosition(clampPosition(
                        cw / 2 - (point.x / 100) * MAP_WIDTH,
                        ch / 2 - (point.y / 100) * MAP_HEIGHT
                      ));
                    }
                  }}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200
                    ${activePoint?.id === point.id
                      ? 'bg-slate-900 text-white shadow-lg scale-105 border-2 border-slate-900'
                      : 'bg-white text-parisian-grey-700 hover:bg-parisian-beige-100 border-2 border-parisian-grey-200'
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
