'use client';

import { useState, useRef, useEffect } from 'react';
import { MapPin, TrainFront, Ticket, Compass, X } from 'lucide-react';
import { mapPoints, type MapPoint } from './draggable-map-data';

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

  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  /**
   * Get the appropriate icon based on point type
   */
  const getIcon = (type: MapPoint['type']) => {
    switch (type) {
      case 'metro':
        return TrainFront;
      case 'ticket':
        return Ticket;
      case 'navigation':
        return Compass;
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
            hogy többet tudj meg a párizsi közlekedésről!
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
                    className="absolute transform -translate-x-1/2 -translate-y-1/2"
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
                          bg-white
                          shadow-lg
                          flex items-center justify-center
                          transition-all duration-200
                          hover:scale-110
                          ${activePoint?.id === point.id
                            ? 'ring-4 ring-french-blue-400 scale-110'
                            : ''
                          }
                        `}
                      >
                        <IconComponent className="w-6 h-6 text-french-blue-600" />
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

          {/* Info Card Modal */}
          {activePoint && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50
                  animate-in fade-in duration-200"
                onClick={() => setActivePoint(null)}
              />

              {/* Modal Card */}
              <div
                className="fixed inset-0 z-50 flex items-center justify-center p-4
                  pointer-events-none"
                onClick={() => setActivePoint(null)}
              >
                <div
                  className="bg-white rounded-2xl shadow-2xl max-w-lg w-full
                    pointer-events-auto
                    animate-in fade-in zoom-in duration-200"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Card Header */}
                  <div className="relative p-6 border-b border-parisian-grey-200">
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className="w-12 h-12 rounded-full bg-french-blue-100
                        flex items-center justify-center flex-shrink-0">
                        {(() => {
                          const IconComponent = getIcon(activePoint.type);
                          return <IconComponent className="w-6 h-6 text-french-blue-600" />;
                        })()}
                      </div>

                      {/* Title */}
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-parisian-grey-900">
                          {activePoint.title}
                        </h3>
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

                  {/* Card Content */}
                  <div className="p-6">
                    <p className="text-parisian-grey-700 leading-relaxed">
                      {activePoint.content}
                    </p>
                  </div>

                  {/* Card Footer */}
                  <div className="p-6 pt-0">
                    <button
                      onClick={() => setActivePoint(null)}
                      className="w-full py-3 px-6 rounded-xl
                        bg-french-blue-600 hover:bg-french-blue-700
                        text-white font-semibold
                        transition-colors duration-200
                        shadow-lg hover:shadow-xl"
                    >
                      Rendben
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

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
