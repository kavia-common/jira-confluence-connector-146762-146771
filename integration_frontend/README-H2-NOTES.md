# HTTP/2 Protocol Error Troubleshooting Notes

This project previously experienced `net::ERR_HTTP2_PROTOCOL_ERROR` when loading Next.js chunks (e.g., main-app-*.js) and on API fetches while running behind a preview proxy.

Key mitigations applied:
- Disabled static `output: "export"` in Next.js config and use standard server/dev mode so `_next` assets are served by Next.
- Disabled Next.js compression in development (compress: false) to prevent double-compression by front proxies. In production, compression is enabled.
- Normalized fetch requests to avoid forcing `Content-Type: application/json` on GET, keeping only an `Accept` header to reduce content-type/encoding mismatches through proxies.
- Added light headers to reduce content sniffing and caching anomalies.

Operator tips if issues reappear:
- Ensure there is no custom reverse proxy performing both HTTP/2 and gzip/brotli on top of Next’s compression in dev.
- If a Service Worker is introduced later, clear it (`DevTools > Application > Service Workers > Unregister`) to avoid serving stale H2-pushed/preloaded assets.
- Verify `NEXT_PUBLIC_BACKEND_URL` is set to the backend public URL or leave empty to use same-origin.
- Confirm no asset `basePath` or `assetPrefix` misconfiguration is set.
- Use the Diagnostics page at /diagnostics to verify backend reachability and headers.

Environment variables (examples):
- NEXT_PUBLIC_BACKEND_URL=https://your-backend.example.com
- NEXT_PUBLIC_FRONTEND_BASE_URL=https://your-frontend.example.com
