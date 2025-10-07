import type { NextConfig } from "next";

/**
 * Next.js configuration
 * - compress: false in development to avoid double-compression issues behind reverse proxies that speak HTTP/2.
 * - Disable static export; use default server/dev to serve chunks properly under proxies.
 * - Set reactStrictMode true for consistency.
 * - Add basic security headers (non-cache/disable sniffing) to reduce proxy-induced anomalies.
 */
const nextConfig: NextConfig = {
  // Use standard server output. Removing "export" avoids serving pre-exported assets
  // via a static host which can trigger HTTP/2 protocol errors under certain proxies.
  // Default "output" is server; so we omit it completely.

  reactStrictMode: true,

  // Disable built-in compression in dev. Proxies in front of the app may already compress responses.
  // Double compression can cause net::ERR_HTTP2_PROTOCOL_ERROR.
  compress: process.env.NODE_ENV === "production",

  // Add consistent headers to all routes to reduce content sniffing and caching surprises under proxies.
  async headers() {
    return [
      {
        // Apply to all routes, including Next chunks.
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Cache-Control", value: process.env.NODE_ENV === "production" ? "public, max-age=300, must-revalidate" : "no-store" },
        ],
      },
    ];
  },
};

export default nextConfig;
