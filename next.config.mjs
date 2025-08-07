// next.config.mjs - ES module sintaksisi bilan
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ['uz', 'ru', 'en'],
    defaultLocale: 'uz',
  },
  experimental: {
    // Hydration xatolari uchun
    serverActions: false,
  },
  // Static export uchun (agar kerak bo'lsa)
  // output: 'export',
  // trailingSlash: true,
}

export default nextConfig
