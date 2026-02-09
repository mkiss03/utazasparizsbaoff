'use client'

import { motion } from 'framer-motion'

interface ParisArrondissementsSVGProps {
  activeDistrict: number | null
  onDistrictClick: (district: number) => void
  onDistrictHover?: (district: number | null) => void
  className?: string
}

// SVG paths for each Paris arrondissement (simplified but recognizable shapes)
// These are approximate paths representing the snail-like spiral layout of Paris
const districtPaths: Record<number, string> = {
  1: 'M 195 185 L 215 175 L 235 180 L 240 200 L 230 215 L 210 220 L 195 210 Z',
  2: 'M 215 175 L 240 165 L 260 175 L 255 190 L 235 180 Z',
  3: 'M 260 175 L 285 170 L 295 190 L 280 210 L 255 200 L 255 190 Z',
  4: 'M 230 215 L 255 200 L 280 210 L 285 235 L 260 250 L 235 240 L 230 220 Z',
  5: 'M 235 240 L 260 250 L 270 280 L 250 300 L 225 290 L 220 260 Z',
  6: 'M 195 210 L 220 220 L 220 260 L 200 290 L 170 280 L 165 240 L 175 215 Z',
  7: 'M 130 200 L 165 190 L 175 215 L 165 240 L 170 280 L 140 300 L 100 280 L 95 230 L 110 205 Z',
  8: 'M 130 145 L 175 135 L 195 150 L 195 185 L 165 190 L 130 200 L 110 175 Z',
  9: 'M 175 135 L 215 130 L 240 140 L 240 165 L 215 175 L 195 185 L 195 150 Z',
  10: 'M 240 140 L 280 135 L 310 155 L 305 175 L 285 170 L 260 175 L 240 165 Z',
  11: 'M 295 190 L 330 185 L 355 215 L 345 255 L 310 260 L 285 235 L 280 210 Z',
  12: 'M 310 260 L 345 255 L 380 290 L 375 345 L 330 365 L 290 340 L 270 300 L 270 280 L 285 260 Z',
  13: 'M 250 300 L 270 280 L 290 340 L 280 380 L 240 395 L 200 375 L 200 320 L 225 305 Z',
  14: 'M 170 280 L 200 290 L 200 320 L 200 375 L 160 390 L 120 365 L 115 310 L 140 300 Z',
  15: 'M 95 230 L 100 280 L 115 310 L 120 365 L 80 385 L 40 350 L 35 280 L 55 220 L 80 210 Z',
  16: 'M 35 155 L 80 130 L 110 140 L 110 175 L 80 210 L 55 220 L 35 200 L 25 175 Z',
  17: 'M 80 90 L 130 75 L 175 90 L 175 135 L 130 145 L 110 140 L 80 130 Z',
  18: 'M 175 90 L 230 80 L 275 95 L 280 135 L 240 140 L 215 130 L 175 135 Z',
  19: 'M 275 95 L 330 90 L 365 120 L 360 165 L 330 185 L 305 175 L 310 155 L 280 135 Z',
  20: 'M 330 185 L 360 165 L 390 195 L 385 250 L 355 215 L 330 195 Z',
}

// Center points for district labels
const districtCenters: Record<number, { x: number; y: number }> = {
  1: { x: 217, y: 197 },
  2: { x: 237, y: 177 },
  3: { x: 272, y: 190 },
  4: { x: 255, y: 230 },
  5: { x: 245, y: 270 },
  6: { x: 192, y: 250 },
  7: { x: 135, y: 245 },
  8: { x: 155, y: 165 },
  9: { x: 210, y: 152 },
  10: { x: 275, y: 155 },
  11: { x: 320, y: 225 },
  12: { x: 325, y: 310 },
  13: { x: 240, y: 345 },
  14: { x: 155, y: 335 },
  15: { x: 75, y: 305 },
  16: { x: 70, y: 170 },
  17: { x: 130, y: 110 },
  18: { x: 225, y: 110 },
  19: { x: 325, y: 130 },
  20: { x: 365, y: 200 },
}

export default function ParisArrondissementsSVG({
  activeDistrict,
  onDistrictClick,
  onDistrictHover,
  className = '',
}: ParisArrondissementsSVGProps) {
  return (
    <svg
      viewBox="0 0 420 420"
      className={`w-full h-full ${className}`}
      style={{ maxWidth: '100%', maxHeight: '100%' }}
    >
      {/* Background */}
      <rect x="0" y="0" width="420" height="420" fill="#FAF7F2" />

      {/* Seine River (simplified curve through the city) */}
      <path
        d="M 30 260 Q 100 220, 180 230 Q 250 240, 290 210 Q 340 175, 400 180"
        fill="none"
        stroke="#93c5fd"
        strokeWidth="12"
        strokeLinecap="round"
        opacity="0.4"
      />

      {/* District paths */}
      {Object.entries(districtPaths).map(([district, path]) => {
        const districtNum = parseInt(district)
        const isActive = activeDistrict === districtNum
        const isPast = activeDistrict !== null && districtNum < activeDistrict

        return (
          <motion.path
            key={district}
            d={path}
            initial={{ fill: '#f1f5f9' }}
            animate={{
              fill: isActive ? '#f59e0b' : isPast ? '#fcd34d' : '#f1f5f9',
              scale: isActive ? 1.02 : 1,
            }}
            whileHover={{
              fill: isActive ? '#f59e0b' : '#fde68a',
              scale: 1.03,
            }}
            transition={{ duration: 0.2 }}
            stroke="#94a3b8"
            strokeWidth={isActive ? 2 : 1}
            style={{
              cursor: 'pointer',
              transformOrigin: `${districtCenters[districtNum].x}px ${districtCenters[districtNum].y}px`,
              filter: isActive ? 'drop-shadow(0 4px 6px rgba(245, 158, 11, 0.4))' : 'none',
            }}
            onClick={() => onDistrictClick(districtNum)}
            onMouseEnter={() => onDistrictHover?.(districtNum)}
            onMouseLeave={() => onDistrictHover?.(null)}
          />
        )
      })}

      {/* District numbers */}
      {Object.entries(districtCenters).map(([district, center]) => {
        const districtNum = parseInt(district)
        const isActive = activeDistrict === districtNum

        return (
          <motion.text
            key={`label-${district}`}
            x={center.x}
            y={center.y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="pointer-events-none select-none"
            initial={{ opacity: 0.7 }}
            animate={{
              opacity: isActive ? 1 : 0.7,
              fontWeight: isActive ? 700 : 500,
            }}
            style={{
              fontSize: isActive ? '14px' : '11px',
              fill: isActive ? '#1e293b' : '#64748b',
            }}
          >
            {district}
          </motion.text>
        )
      })}

      {/* Title */}
      <text
        x="210"
        y="30"
        textAnchor="middle"
        className="text-sm font-semibold"
        fill="#1e293b"
      >
        Párizs Kerületei
      </text>

      {/* Compass rose */}
      <g transform="translate(375, 385)">
        <circle r="15" fill="white" stroke="#94a3b8" strokeWidth="1" />
        <text x="0" y="-5" textAnchor="middle" fontSize="8" fill="#64748b">
          É
        </text>
        <text x="0" y="10" textAnchor="middle" fontSize="8" fill="#64748b">
          D
        </text>
      </g>
    </svg>
  )
}
