import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.srisailadevasthanam.org',
      },
    ],
  },
};

export default nextConfig;
