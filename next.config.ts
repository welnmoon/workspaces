// next.config.ts
import type { NextConfig } from 'next';

const nextConfig = {
  productionBrowserSourceMaps: false,

  webpack(config) {
    config.devtool = false;
    return config;
  },

  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

  async rewrites() {
    return {
      afterFiles: [{ source: '/spa/:path*', destination: '/spa/index.html' }],
    };
  },
} satisfies NextConfig;

export default nextConfig;
