# Integration Frontend (Next.js)

Modern dashboard UI for JIRA–Confluence integration following the Ocean Professional style.

## Quick start

1. Install dependencies
   - npm install

2. Configure environment
   - Copy `.env.example` to `.env.local` and adjust:
     - NEXT_PUBLIC_BACKEND_URL=https://vscode-internal-22588-beta.beta01.cloud.kavia.ai:3001
   - If omitted, the app will call the backend via same origin (relative URLs).

3. Run (dev)
   - npm run dev
   - open http://localhost:3000

4. Run (production)
   - npm run build && npm start
   - Next.js server listens on 0.0.0.0:3000 (suitable behind nginx/proxy)
   - Health endpoint: GET /api/health -> { status: "ok", uptime, timestamp }

## Routes

- /                Overview
- /connect         Connect JIRA and Confluence (starts OAuth via backend)
- /jira            JIRA projects (GET /integrations/jira/projects/fetch)
- /confluence      Confluence pages (GET /integrations/confluence/pages/fetch)
- /settings        App settings

## Environment

- NEXT_PUBLIC_BACKEND_URL: If provided, frontend calls this absolute backend URL (e.g., https://...:3001).
- If not provided, frontend uses same-origin relative paths.
- Do not hardcode external ports in code; proxies may expose 4000/other externally while the app listens on 3000 internally.

## Port and proxying (avoid 502)

- The app uses Next.js server (no static export).
- Start commands bind to 0.0.0.0:3000 for container environments:
  - dev: `next dev -p 3000 -H 0.0.0.0`
  - prod: `next start -p 3000 -H 0.0.0.0`
- If nginx/front proxy exposes the site on a different external port (e.g., 4000), ensure the proxy targets container port 3000.
- favicon: present at /favicon.ico to avoid noisy 404s.

## Troubleshooting 502 Bad Gateway

- Ensure a production build exists: `npm run build` then `npm start`.
- Confirm the server is listening on 0.0.0.0:3000 and proxy targets that port.
- Check /api/health returns 200.
- Review env: set NEXT_PUBLIC_BACKEND_URL when backend is on a different origin.
- Avoid referencing `window` during build/SSR unless guarded with `typeof window !== "undefined"`.
