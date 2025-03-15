import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode:true,
  output:'standalone',
  assetPrefix:'.next/public'
};

export default nextConfig;