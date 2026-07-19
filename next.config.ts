import type { NextConfig } from "next";

// Lets the dev server accept requests from another device on your LAN (e.g.
// testing on a phone), without hardcoding a personal IP into tracked config.
// Set in .env.local (gitignored): DEV_LAN_ORIGIN=192.168.1.16
const devLanOrigin = process.env.DEV_LAN_ORIGIN;

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 80],
  },
  ...(devLanOrigin ? { allowedDevOrigins: [devLanOrigin] } : {}),
};

export default nextConfig;
