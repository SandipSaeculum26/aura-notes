import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/notes/:path*",
        destination: "http://localhost:5000/notes/:path*",
      },
    ];
  },
};

export default nextConfig;
