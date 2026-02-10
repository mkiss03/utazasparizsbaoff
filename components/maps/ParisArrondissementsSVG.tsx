'use client'

import { motion } from 'framer-motion'

interface ParisArrondissementsSVGProps {
  activeDistrict: number | null
  onDistrictClick: (district: number) => void
  onDistrictHover?: (district: number | null) => void
  className?: string
}

// Exact polygon coordinates from official Paris arrondissements SVG
// Original coordinate system preserved for accuracy
const districtPolygons: Record<number, string> = {
  1: "2.344559181,48.8539929 2.332852283,48.85930633 2.320781394,48.86307866 2.325768441,48.86954617 2.327877417,48.86986381 2.350848136,48.86334445 2.350088494,48.86195533",
  2: "2.350848136,48.86334445 2.327877417,48.86986381 2.347826239,48.87063069 2.354114163,48.8692798 2.350848136,48.86334445",
  3: "2.368415354,48.85574003 2.350088494,48.86195533 2.350848136,48.86334445 2.354114163,48.8692798 2.363856759,48.86743437 2.368415354,48.85574003",
  4: "2.364320761,48.84616721 2.344559181,48.8539929 2.350088494,48.86195533 2.368415354,48.85574003 2.369018231,48.85322503 2.364320761,48.84616721",
  5: "2.365957645,48.8449078 2.351573383,48.83683535 2.342045196,48.83830325 2.336591299,48.83969413 2.344559181,48.8539929 2.364320761,48.84616721",
  6: "2.336591299,48.83969413 2.324660773,48.84352162 2.316633528,48.84675871 2.329309954,48.85283817 2.332852283,48.85930633 2.344559181,48.8539929",
  7: "2.316633528,48.84675871 2.307341121,48.84770357 2.289783728,48.85812315 2.3015562,48.86348063 2.320781394,48.86307866 2.332852283,48.85930633 2.329309954,48.85283817",
  8: "2.320781394,48.86307866 2.3015562,48.86348063 2.295145331,48.87386648 2.301813413,48.87886991 2.327115255,48.88348449 2.325768441,48.86954617",
  9: "2.325768441,48.86954617 2.327115255,48.88348449 2.349545307,48.88362643 2.347826239,48.87063069 2.327877417,48.86986381",
  10: "2.363856759,48.86743437 2.354114163,48.8692798 2.347826239,48.87063069 2.349545307,48.88362643 2.364673565,48.88429223 2.369294401,48.8833274 2.377012647,48.87191932",
  11: "2.399073509,48.84809156 2.369018231,48.85322503 2.368415354,48.85574003 2.363856759,48.86743437 2.377012647,48.87191932",
  12: "2.461247497,48.81834904 2.436690798,48.81846971 2.42988222,48.82335702 2.419985644,48.82408288 2.403295661,48.8292441 2.390069238,48.82569681 2.365957645,48.8449078 2.364320761,48.84616721 2.369018231,48.85322503 2.399073509,48.84809156 2.415973775,48.84662837 2.413654005,48.83722773 2.416543512,48.83468767 2.423034714,48.84272345 2.427516512,48.84157582 2.447852027,48.84481015 2.467259567,48.83908833 2.465755861,48.82628372",
  13: "2.343909438,48.81575715 2.342045196,48.83830325 2.351573383,48.83683535 2.365957645,48.8449078 2.390069238,48.82569681 2.364139036,48.81638808 2.356354375,48.8159597 2.352867224,48.81821631",
  14: "2.343909438,48.81575715 2.331908932,48.81701279 2.314148424,48.82229055 2.301320806,48.82513029 2.324660773,48.84352162 2.336591299,48.83969413 2.342045196,48.83830325",
  15: "2.301320806,48.82513029 2.289399238,48.82835178 2.280857988,48.83133163 2.27192834,48.82888526 2.267617156,48.83420125 2.262798259,48.83392881 2.289783728,48.85812315 2.307341121,48.84770357 2.316633528,48.84675871 2.324660773,48.84352162",
  16: "2.262798259,48.83392881 2.253560441,48.83685745 2.248055951,48.84632036 2.22422457,48.85351605 2.225677067,48.8594073 2.231736346,48.86906948 2.245698309,48.876461 2.255286342,48.87435361 2.259988953,48.88019253 2.279946531,48.8785785 2.295145331,48.87386648 2.3015562,48.86348063 2.289783728,48.85812315",
  17: "2.295145331,48.87386648 2.279946531,48.8785785 2.284458221,48.88563837 2.303777114,48.894152 2.319884459,48.90045887 2.32998325,48.9011633 2.327115255,48.88348449 2.301813413,48.87886991",
  18: "2.327115255,48.88348449 2.32998325,48.9011633 2.351872525,48.90152657 2.365853595,48.9016104 2.370286444,48.90165178 2.371273107,48.89563155 2.364673565,48.88429223 2.349545307,48.88362643",
  19: "2.377012647,48.87191932 2.369294401,48.8833274 2.364673565,48.88429223 2.371273107,48.89563155 2.370286444,48.90165178 2.389444303,48.90115742 2.396499648,48.896193 2.398651171,48.88941398 2.40033933,48.88374772 2.410694437,48.87847513",
  20: "2.415973775,48.84662837 2.399073509,48.84809156 2.377012647,48.87191932 2.410694437,48.87847513 2.413277246,48.87311881 2.415319163,48.85517799 2.416339717,48.84923827",
}

// Calculate center points for each district
function calculateCenter(points: string): { x: number; y: number } {
  const coords = points.split(' ').map(p => {
    const [x, y] = p.split(',').map(Number)
    return { x, y }
  })
  const sumX = coords.reduce((acc, c) => acc + c.x, 0)
  const sumY = coords.reduce((acc, c) => acc + c.y, 0)
  return { x: sumX / coords.length, y: sumY / coords.length }
}

const districtCenters: Record<number, { x: number; y: number }> = Object.fromEntries(
  Object.entries(districtPolygons).map(([k, v]) => [parseInt(k), calculateCenter(v)])
)

export default function ParisArrondissementsSVG({
  activeDistrict,
  onDistrictClick,
  onDistrictHover,
  className = '',
}: ParisArrondissementsSVGProps) {
  // Use original SVG coordinate system
  const viewBox = "2.22422457 48.81575715 0.243034997 0.0858946299999985"

  return (
    <svg
      viewBox={viewBox}
      preserveAspectRatio="xMidYMid meet"
      className={`w-full h-full ${className}`}
      style={{ maxWidth: '100%', maxHeight: '100%' }}
    >
      {/* Background */}
      <rect
        x="2.22422457"
        y="48.81575715"
        width="0.243034997"
        height="0.0858946299999985"
        fill="#FAF7F2"
      />

      {/* Flip Y-axis to match standard map orientation (north up) */}
      <g transform="translate(0,97.71740893) scale(1,-1)">
        {/* Seine River (stylized) */}
        <path
          d="M 2.24 48.855 Q 2.30 48.860, 2.35 48.850 Q 2.40 48.845, 2.45 48.835"
          fill="none"
          stroke="#cbd5e1"
          strokeWidth="0.003"
          strokeLinecap="round"
          opacity="0.5"
        />

        {/* District polygons */}
        {Object.entries(districtPolygons).map(([district, points]) => {
          const districtNum = parseInt(district)
          const isActive = activeDistrict === districtNum

          return (
            <motion.polygon
              key={district}
              points={points}
              initial={false}
              animate={{
                fill: isActive ? '#1e293b' : '#ffffff',
              }}
              whileHover={{
                fill: isActive ? '#1e293b' : '#f5f5f4',
              }}
              transition={{ duration: 0.2 }}
              stroke="#94a3b8"
              strokeWidth={isActive ? 0.0025 : 0.0015}
              style={{
                cursor: 'pointer',
                filter: isActive ? 'drop-shadow(0 0.002px 0.003px rgba(30, 41, 59, 0.4))' : 'none',
              }}
              onClick={() => onDistrictClick(districtNum)}
              onMouseEnter={() => onDistrictHover?.(districtNum)}
              onMouseLeave={() => onDistrictHover?.(null)}
            />
          )
        })}

        {/* District number labels */}
        {Object.entries(districtCenters).map(([district, center]) => {
          const districtNum = parseInt(district)
          const isActive = activeDistrict === districtNum

          return (
            <g key={`label-${district}`}>
              {/* Background circle */}
              <motion.circle
                cx={center.x}
                cy={center.y}
                r={isActive ? 0.006 : 0.0045}
                fill={isActive ? '#1e293b' : '#ffffff'}
                stroke={isActive ? '#ffffff' : '#94a3b8'}
                strokeWidth={isActive ? 0.0008 : 0.0005}
                style={{ cursor: 'pointer' }}
                onClick={() => onDistrictClick(districtNum)}
              />
              {/* Number text - needs to be flipped back since parent is flipped */}
              <g transform={`translate(${center.x}, ${center.y}) scale(1,-1)`}>
                <text
                  x="0"
                  y="0"
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="pointer-events-none select-none"
                  style={{
                    fontSize: isActive ? '0.004px' : '0.003px',
                    fontWeight: 600,
                    fill: isActive ? '#ffffff' : '#475569',
                  }}
                >
                  {district}
                </text>
              </g>
            </g>
          )
        })}
      </g>
    </svg>
  )
}
