/** @type {import('next').NextConfig} */
const nextConfig = {
  // Minimal configuration to avoid compilation issues
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  // Remove experimental features that might cause issues
  experimental: {},
  // Configure external image domains
  images: {
    domains: ['images.unsplash.com'],
  },
}

module.exports = nextConfig