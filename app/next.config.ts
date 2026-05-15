import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  pageExtensions: ["ts", "tsx"],
  typescript: {
    tsconfigPath: "./tsconfig.json",
  },
};

export default nextConfig;
