# Integration Frontend (Next.js)

Modern dashboard UI for JIRA–Confluence integration following the Ocean Professional style.

## Quick start

1. Install dependencies
   - npm install

2. Configure environment
   - Create a .env.local file and set:
     - NEXT_PUBLIC_BACKEND_URL=https://vscode-internal-14593-beta.beta01.cloud.kavia.ai:3001
     - NEXT_PUBLIC_JIRA_REDIRECT_URI=https://vscode-internal-37302-beta.beta01.cloud.kavia.ai:3001/auth/jira/callback
   - If NEXT_PUBLIC_BACKEND_URL is omitted, the app calls the backend via same origin using the "/api" prefix (suitable when a reverse proxy maps frontend /api/* to the backend).
   - The backend is authoritative for redirect_uri during the OAuth flow and reads JIRA_REDIRECT_URI (preferred) or falls back to the same default.

3. Run
   - npm run dev
   - open http://localhost:3000

## Path aliases

- We use the @/* alias pointing to src/* (configured in tsconfig.json). Example: import { buildBackendUrl } from "@/lib/api"

## Routes

- /                Overview
- /connect         Connect JIRA and Confluence (opens /auth/{jira|confluence}/login on backend)
- /jira            JIRA projects (GET /integrations/jira/projects/fetch)
- /confluence      Confluence pages (GET /integrations/confluence/pages/fetch)
- /settings        App settings

## Notes

- This frontend expects the backend API described by the provided OpenAPI (FastAPI).
- Authorization bearer token is stored in localStorage (demo only).
- Styling uses CSS variables and utility classes aligned with Ocean Professional theme.
