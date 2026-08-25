import type { Metadata, Viewport } from 'next'
import ServiceWorkerRegister from '@/components/louvre/ServiceWorkerRegister'

export const metadata: Metadata = {
  title: 'Louvre hangos túra – Utazás Párizsba',
  description:
    'Ingyenes, 3 állomásos interaktív hangos túra a Louvre-ban. Offline is működik -- töltsd le wifin, indulás előtt.',
  manifest: '/louvre/site.webmanifest',
  icons: {
    icon: [
      { url: '/louvre/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/louvre/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/louvre/icons/icon-180.png', sizes: '180x180', type: 'image/png' }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Louvre túra',
  },
}

export const viewport: Viewport = {
  themeColor: '#002147',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function LouvreLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ServiceWorkerRegister />
      {children}
    </>
  )
}
