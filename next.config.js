/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com', 'p7.hiclipart.com'],
  },
  reactStrictMode: true,
  concurrentFeatures: true,
}

module.exports = nextConfig
