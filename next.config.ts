import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
      protocol: 'https',
      hostname: 'paluszny-travel-gallery.s3.us-east-1.amazonaws.com',
    },
    ],
  },
}

export default nextConfig;
