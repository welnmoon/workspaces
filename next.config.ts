const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  swcMinify: false,
  typescript: { ignoreBuildErrors: true }, // TODO: временно - Удалить после стабилизации проекта
};
module.exports = nextConfig;
