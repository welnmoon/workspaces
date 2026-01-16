const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true }, // TODO: временно - Удалить после стабилизации проекта
  async rewrites() {
    return {
      afterFiles: [
        {
          source: '/spa/:path*',
          destination: '/spa/index.html',
        },
      ],
    };
  },
};
module.exports = nextConfig;
