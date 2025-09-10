import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'creepy-fuchsia-horse.myfilebase.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
