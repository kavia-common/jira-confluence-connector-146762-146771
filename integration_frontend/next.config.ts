import type { NextConfig } from "next";

/**
 * Next.js configuration
 * - Use default SSR/server mode so the app runs with `next start` on port 3000
 * - Avoid static export ("output: export") which would otherwise produce a purely static build
 *   and can lead to 502 when the runtime expects a server behind the proxy.
 */
const nextConfig: NextConfig = {
  // default config; Next will bind to 0.0.0.0:3000 in container environments
};

export default nextConfig;
