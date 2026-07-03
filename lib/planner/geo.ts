import type { Zone } from './types'

/** Haversine távolság km-ben két koordináta közt. */
export function distanceKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
): number {
  const R = 6371
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const lat1 = toRad(a.lat)
  const lat2 = toRad(b.lat)

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2

  return 2 * R * Math.asin(Math.sqrt(h))
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180
}

/** A megadott zónához legközelebbi másik zóna (önmagát kizárva). */
export function nearestZone(zone: Zone, others: Zone[]): Zone | undefined {
  const candidates = others.filter((z) => z.id !== zone.id)
  if (candidates.length === 0) return undefined

  return candidates.reduce((closest, candidate) => {
    const dClosest = distanceKm(
      { lat: zone.centerLat, lng: zone.centerLng },
      { lat: closest.centerLat, lng: closest.centerLng }
    )
    const dCandidate = distanceKm(
      { lat: zone.centerLat, lng: zone.centerLng },
      { lat: candidate.centerLat, lng: candidate.centerLng }
    )
    return dCandidate < dClosest ? candidate : closest
  })
}
