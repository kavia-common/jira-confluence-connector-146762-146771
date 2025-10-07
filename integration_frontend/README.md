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

## Routes

- /                Overview
- /connect         Connect JIRA and Confluence (starts OAuth via backend)
- /jira            JIRA projects (GET /integrations/jira/projects/fetch)
- /confluence      Confluence pages (GET /integrations/confluence/pages/fetch)
- /settings        App settings

## Notes

- This frontend expects the backend API described by the provided OpenAPI (FastAPI).
- By default, API calls go to NEXT_PUBLIC_BACKEND_URL if set; otherwise relative to the frontend origin.
- Styling uses CSS variables and utility classes aligned with Ocean Professional theme.

## Troubleshooting 502 Bad Gateway

- Ensure the app is not using static export. This project runs the default Next.js server (no `output: "export"`).
- Verify the Next.js server process is running (npm start) and listening on 0.0.0.0:3000.
- Set NEXT_PUBLIC_BACKEND_URL to the running backend URL if frontend and backend are on different origins.
- If the backend is down or unreachable, pages that fetch data will show an error.
