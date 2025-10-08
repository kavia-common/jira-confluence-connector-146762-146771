import type { NextConfig } from "next";

/**
 * Server runtime is required for OAuth callbacks and backend API calls behind a reverse proxy.
 * Avoid using `output: "export"` which forces static export and breaks dynamic flows.
 */
const nextConfig: NextConfig = {
  // Intentionally left without `output: "export"` to run with next start server.
  // You can add other server-compatible options here if needed.
};

export default nextConfig;
