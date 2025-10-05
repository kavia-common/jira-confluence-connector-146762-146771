# Integration Frontend (Next.js)

Modern dashboard UI for JIRA–Confluence integration following the Ocean Professional style.

## Quick start

1. Install dependencies
   - npm install

2. Configure environment
   - Create a .env.local file and set:
     - NEXT_PUBLIC_BACKEND_URL=https://vscode-internal-14593-beta.beta01.cloud.kavia.ai:3001
   - If omitted, the app will call the backend via same origin.

3. Run
   - npm run dev
   - open http://localhost:3000

## Routes

- /                Overview
- /login           Demo sign-in (POST /auth/token)
- /connect         Connect JIRA and Confluence (POST /integrations/*/connect)
- /jira            JIRA projects (GET /integrations/jira/projects/fetch)
- /confluence      Confluence pages (GET /integrations/confluence/pages/fetch)
- /settings        App settings

## Notes

- This frontend expects the backend API described by the provided OpenAPI (FastAPI).
- Authorization bearer token is stored in localStorage (demo only).
- Styling uses CSS variables and utility classes aligned with Ocean Professional theme.
- Helpers:
  - `@/lib/api` exposes getApiBaseUrl, fetchJiraProjects, and fetchConfluencePages.
  - `@/lib/oauth` exposes buildOAuthLoginUrl used by the Connect page.
