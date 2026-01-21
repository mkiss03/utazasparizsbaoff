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

// Desktop positions (horizontal smooth arc matching Paris map)
// Positions following the Seine river's north bank (West to East)
export const stationsDesktop: MetroStation[] = [
  {
    id: '1',
    letter: 'A',
    title: 'App & Card',
    description: 'Use Bonjour RATP app or Navigo Easy card for seamless travel across Paris.',
    icon: 'Smartphone',
    x: 18,  // Western Paris (Arc de Triomphe/Champs-Élysées area)
    y: 42,
  },
  {
    id: '2',
    letter: 'F',
    title: 'Fares',
    description: 'Flat €2.55 fare covers all Metro & RER within Paris region. Single tickets available at machines.',
    icon: 'Banknote',
    x: 35,  // Opera/Louvre area (following Seine curve)
    y: 35,
  },
  {
    id: '3',
    letter: 'N',
    title: 'Navigation',
    description: 'Follow line number and Terminus station signs. Paris Metro is color-coded for easy navigation.',
    icon: 'Navigation',
    x: 50,  // Center (Châtelet/Île de la Cité area)
    y: 40,
  },
  {
    id: '4',
    letter: 'W',
    title: 'Weekly Pass',
    description: '€32.40 Navigo (Mon-Sun) offers best value for tourists staying 4+ days in Paris.',
    icon: 'Calendar',
    x: 65,  // Marais/République/Bastille area
    y: 38,
  },
  {
    id: '5',
    letter: 'Z',
    title: 'Zones & Airports',
    description: 'Line 14 connects to Orly, RER B serves CDG Airport. Check zone coverage for your pass.',
    icon: 'Plane',
    x: 82,  // Eastern Paris (Nation/Gare de Lyon direction)
    y: 45,
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
