/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  // Note: Removed 'output: export' for dynamic admin functionality
  // The landing page will still work statically, admin requires server deployment
}

export default nextConfig;
