import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    unoptimized: true, // Image optimization'u devre dışı bırak (development için)
    remotePatterns: [
      {
        protocol: "http",
        hostname: "*",
        port: "*",
        pathname: "/**",
      }
    ]
  }
};

export default nextConfig;
