'use client'

import { useEffect } from 'react'

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return

    navigator.serviceWorker
      .register('/louvre-sw.js', { scope: '/louvre/' })
      .catch((err) => console.error('Louvre SW regisztráció sikertelen:', err))

    if (navigator.storage && navigator.storage.persist) {
      navigator.storage.persist().catch(() => {})
    }
  }, [])

  return null
}
