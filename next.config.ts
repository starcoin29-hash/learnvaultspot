import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // eslint-config-next has flat config compatibility issues; lint separately via `npm run lint`
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default nextConfig;
