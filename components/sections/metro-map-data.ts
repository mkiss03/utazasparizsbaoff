export interface MetroStation {
  id: string
  letter: string
  title: string
  description: string
  icon: string
  // Position as percentage (0-100) for absolute positioning
  x: number // left position %
  y: number // top position %
}

// Desktop positions (evenly distributed along wide S-curve)
// Positioned to sit perfectly on the full-width path
export const stationsDesktop: MetroStation[] = [
  {
    id: '1',
    letter: 'A',
    title: 'App & Card',
    description: 'Use Bonjour RATP app or Navigo Easy card for seamless travel across Paris.',
    icon: 'Smartphone',
    x: 10,   // Left side (start of curve)
    y: 47,   // On the line at start point
  },
  {
    id: '2',
    letter: 'F',
    title: 'Fares',
    description: 'Flat €2.55 fare covers all Metro & RER within Paris region. Single tickets available at machines.',
    icon: 'Banknote',
    x: 27.5, // Quarter point (curve peak)
    y: 33,   // Top of the arc
  },
  {
    id: '3',
    letter: 'N',
    title: 'Navigation',
    description: 'Follow line number and Terminus station signs. Paris Metro is color-coded for easy navigation.',
    icon: 'Navigation',
    x: 50,   // Center point
    y: 43,   // Middle of curve
  },
  {
    id: '4',
    letter: 'W',
    title: 'Weekly Pass',
    description: '€32.40 Navigo (Mon-Sun) offers best value for tourists staying 4+ days in Paris.',
    icon: 'Calendar',
    x: 72.5, // Three-quarter point (curve valley)
    y: 53,   // Bottom of the arc
  },
  {
    id: '5',
    letter: 'Z',
    title: 'Zones & Airports',
    description: 'Line 14 connects to Orly, RER B serves CDG Airport. Check zone coverage for your pass.',
    icon: 'Plane',
    x: 90,   // Right side (end of curve)
    y: 47,   // On the line at end point
  },
]

// Mobile positions (vertical smooth curve)
export const stationsMobile: MetroStation[] = [
  {
    id: '1',
    letter: 'A',
    title: 'App & Card',
    description: 'Use Bonjour RATP app or Navigo Easy card for seamless travel across Paris.',
    icon: 'Smartphone',
    x: 50,
    y: 12,
  },
  {
    id: '2',
    letter: 'F',
    title: 'Fares',
    description: 'Flat €2.55 fare covers all Metro & RER within Paris region. Single tickets available at machines.',
    icon: 'Banknote',
    x: 60,
    y: 28,
  },
  {
    id: '3',
    letter: 'N',
    title: 'Navigation',
    description: 'Follow line number and Terminus station signs. Paris Metro is color-coded for easy navigation.',
    icon: 'Navigation',
    x: 50,
    y: 48,
  },
  {
    id: '4',
    letter: 'W',
    title: 'Weekly Pass',
    description: '€32.40 Navigo (Mon-Sun) offers best value for tourists staying 4+ days in Paris.',
    icon: 'Calendar',
    x: 40,
    y: 68,
  },
  {
    id: '5',
    letter: 'Z',
    title: 'Zones & Airports',
    description: 'Line 14 connects to Orly, RER B serves CDG Airport. Check zone coverage for your pass.',
    icon: 'Plane',
    x: 50,
    y: 88,
  },
]
