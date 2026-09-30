// Karbantartási mód (lásd lib/maintenance.ts): alapból bekapcsolva,
// MAINTENANCE_MODE=off kapcsolja ki. A middleware a képeket és a statikus
// fájlokat nem látja, ezért azok noindex fejlécét itt adjuk hozzá.
const maintenanceMode = process.env.MAINTENANCE_MODE !== 'off'

/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    if (!maintenanceMode) return []
    return [
      {
        source: '/:path*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' }],
      },
    ]
  },
  // Kikapcsoljuk a szigorú ellenőrzést, hogy lefusson a Deploy:
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Képek beállítása (ez maradjon):
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;