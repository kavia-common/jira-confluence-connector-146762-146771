import type { NextConfig } from "next";

/**
 * Next.js configuration
 * - Default SSR/server mode, no static export.
 * - Do not set basePath/assetPrefix; keep root at "/" so nginx proxying remains simple.
 * - Next binds to 0.0.0.0:3000 in container environments (scripts enforce host/port).
 */
const nextConfig: NextConfig = {
  // Intentionally empty: use Next defaults for server mode
  // basePath: undefined,
  // assetPrefix: undefined,
};

export default nextConfig;
