/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  i18n: {
    locales: ['en', 'fa', 'ar'],
    defaultLocale: 'en',
  },
  images: {
    domains: ['localhost'],
  },
}

module.exports = nextConfig
