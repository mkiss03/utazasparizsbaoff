'use client'

import { logLouvreEvent, type LouvreEventType } from '@/lib/actions/louvre'

// Csendes, "fire-and-forget" eseménynapló. Ha épp nincs net (a múzeumban),
// egyszerűen elnyeljük a hibát -- ez csak analitika, nem befolyásolhatja
// az offline lejátszást.
export function track(clientId: string, eventType: LouvreEventType, stationId?: string, manifestVersion?: string) {
  if (typeof navigator !== 'undefined' && !navigator.onLine) return
  logLouvreEvent(clientId, eventType, stationId, manifestVersion).catch(() => {})
}
