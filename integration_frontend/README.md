# Integration Frontend (Next.js)

Modern dashboard UI for JIRA–Confluence integration following the Ocean Professional style.

## Quick start

1. Install dependencies
   - npm install

2. Configure environment
   - Create a .env.local file and set:
     - NEXT_PUBLIC_BACKEND_URL=https://vscode-internal-28615-beta.beta01.cloud.kavia.ai:3001
     - NEXT_PUBLIC_FRONTEND_BASE_URL=https://vscode-internal-28615-beta.beta01.cloud.kavia.ai:4000
   - If omitted, the app will call the backend via same origin where applicable.

3. Run
   - npm run dev
   - open http://localhost:3000

Port notes:
- If port 3000 is already in use, Next.js will automatically choose the next available port (e.g., 3001 or 3002).
- To force dev on port 3000 (and fail if unavailable), use: npm run dev:port
- You can also set a custom port: PORT=4000 npm run dev

## Routes

- /                Overview
- /login           Demo sign-in (POST /auth/token)
- /connect         Connect JIRA and Confluence (POST /integrations/*/connect)
- /jira            JIRA projects (GET /integrations/jira/projects/fetch)
- /confluence      Confluence pages (GET /integrations/confluence/pages/fetch)
- /settings        App settings

## Backend Connectivity Diagnostics

- Visit /diagnostics in the running app to run a frontend-to-backend connectivity check.
- It resolves the backend base URL from:
  - NEXT_PUBLIC_BACKEND_URL (preferred)
  - NEXT_PUBLIC_BACKEND_BASE_URL
  - NEXT_PUBLIC_BACKEND_PUBLIC_BASE_URL
  - Fallback to same-origin or http://localhost:3001
- The page attempts GET `${BACKEND_URL}/health` and then `${BACKEND_URL}/` and shows status/payload snippets.
- If a CORS issue is suspected, configure backend CORS to allow the frontend origin (e.g., NEXT_PUBLIC_FRONTEND_BASE_URL).

## Notes

- This frontend expects the backend API described by the provided OpenAPI (FastAPI).
- Ensure NEXT_PUBLIC_BACKEND_URL is the backend origin only (no '/docs'). Example:
  NEXT_PUBLIC_BACKEND_URL=https://vscode-internal-28615-beta.beta01.cloud.kavia.ai:3001
  The backend will compute redirect_uri:
  https://vscode-internal-28615-beta.beta01.cloud.kavia.ai:3001/api/oauth/atlassian/callback
- Authorization bearer token is stored in localStorage (demo only).
- Styling uses CSS variables and utility classes aligned with Ocean Professional theme.
- Helpers:
  - `@/lib/api` exposes getApiBaseUrl, fetchJiraProjects, and fetchConfluencePages.
  - `@/lib/oauth` exposes getAtlassianAuthUrl used by the Connect page.

## OAuth Backend Endpoint
The frontend starts OAuth by navigating to:
`${NEXT_PUBLIC_BACKEND_URL}/api/oauth/atlassian/login` (or same-origin `/api/oauth/atlassian/login` if not set),
passing `return_url`, and optionally `state` and `scope`. Ensure `NEXT_PUBLIC_BACKEND_URL` points to the running backend (typically port 3001). Do not include a trailing slash.
