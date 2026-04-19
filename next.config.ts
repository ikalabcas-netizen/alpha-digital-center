import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "cdn.alphacenter.vn" },
      { protocol: "https", hostname: "console.alphacenter.vn" },
    ],
  },
};

export default nextConfig;
