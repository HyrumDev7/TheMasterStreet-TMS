/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      { source: '/favicon.ico', destination: '/images/logo-tmas.png' },
    ]
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.in',
      },
    ],
    // Más anchos en srcset = imágenes más nítidas en móvil (2x/3x) y escritorio (2x/4K)
    deviceSizes: [640, 750, 828, 1080, 1200, 1242, 1280, 1536, 1920, 2048, 2560, 3840],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
}

module.exports = nextConfig
