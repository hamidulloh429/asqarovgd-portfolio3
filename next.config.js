/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Local uploads are served straight from /public/uploads, so no remote
    // patterns are needed by default. Add your production storage domain
    // here if you move uploads to S3 / R2 / a CDN later.
    remotePatterns: [],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "250mb",
    },
  },
};

module.exports = nextConfig;
