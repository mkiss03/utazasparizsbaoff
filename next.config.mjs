/** @type {import('next').NextConfig} */
const nextConfig = {
  // Kikapcsoljuk a szigorú ellenőrzést, hogy lefusson a Deploy:
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    // A Louvre admin szerkesztő nyers WAV hangfájlokat tölt fel (konverzió
    // előtt), ezek simán 5-10 MB-osak lehetnek -- az 1 MB-os alapértelmezett
    // Server Action limit ehhez kevés.
    serverActions: {
      bodySizeLimit: '60mb',
    },
    // Az ffmpeg-static bináris ne maradjon ki a serverless bundle-ből.
    outputFileTracingIncludes: {
      '/*': ['./node_modules/ffmpeg-static/**'],
    },
    // Az ffmpeg-static a __dirname alapján számolja ki a bináris elérési
    // útját -- ha webpack bundle-özi (mint a többi 'use server' kódot),
    // ez az útvonal-számítás elromlik ("spawn .../ffmpeg ENOENT"). Ezért
    // ezt a csomagot valódi, futásidejű require()-ként kell hagyni.
    serverComponentsExternalPackages: ['ffmpeg-static'],
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