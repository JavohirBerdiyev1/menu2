// next.config.mjs - ES module sintaksisi bilan
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ['uz', 'ru', 'en'],
    defaultLocale: 'uz',
  },
  // Static export uchun (agar kerak bo'lsa)
  // output: 'export',
  // trailingSlash: true,
  
  // Upload uchun qo'shimcha sozlamalar
  images: {
    domains: ['localhost', 'nargile.uz'],
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'nargile.uz',
        port: '',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/uploads/**',
      },
    ],
  },
  
  // Server-side rendering uchun
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
}

export default nextConfig
