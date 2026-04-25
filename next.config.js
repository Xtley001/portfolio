/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: false,
  },
  // Vercel auto-configures this; locally fonts load from HTML <link> tag
}

module.exports = nextConfig
