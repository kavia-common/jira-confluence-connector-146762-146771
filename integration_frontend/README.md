# Integration Frontend (Next.js)

Modern dashboard UI for JIRA–Confluence integration following the Ocean Professional style.

## Quick start

1. Install dependencies
   - npm install

2. Configure environment
   - Copy .env.example to .env.local and adjust as needed:
     - NEXT_PUBLIC_BACKEND_URL=https://vscode-internal-36200-beta.beta01.cloud.kavia.ai:3001
   - If omitted, the app will call the backend via same origin.
   - Note: This value is read at build-time by Next.js for client-side usage. If you change it, rebuild the app.
   - OAuth note: The backend controls the Atlassian redirect_uri via JIRA_REDIRECT_URI (backend env). The frontend should not pass redirect_uri.
     Ensure Atlassian app Redirect URL uses exactly:
     https://vscode-internal-36200-beta.beta01.cloud.kavia.ai:3001/auth/jira/callback

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
- Backend URL resolution:
  - If NEXT_PUBLIC_BACKEND_URL is set, it is used.
  - Otherwise the app builds https://<current-host>:3001 for API calls (so frontend at :3000 talks to backend at :3001).
- OAuth flow:
  - Frontend calls backend /auth/{jira|confluence}/login with redirect=false to get JSON { url } and then navigates to that Atlassian URL.
  - The returned Atlassian URL already includes a server-generated state. Do not pass or override `state` from the frontend.
  - Backend uses redirect_uri on :3001 while return_url points back to the frontend (:3000) for post-callback routing.
- CSRF handling policy:
  - CSRF tokens are fetched via src/lib/auth.fetchCsrfToken(), stored only in memory (see src/lib/csrf.ts), and never rendered or logged.
  - Login POST sends the token via X-CSRF-Token header (see src/lib/auth.loginWithCredentials()).
  - Do not render raw JSON from CSRF endpoints or echo bodies that may contain { csrf }.

## Module path alias

- The `@` alias is configured to point to `src/` via `tsconfig.json` (`"paths": { "@/*": ["./src/*"] }`).
- If you see "Module not found: Can't resolve '@/...'", ensure you are importing from `@/` and that the file exists under `src/`.
- Shared helpers for backend calls are exposed under:
  - `@/lib/api` (buildBackendUrl, getApiBaseUrl, fetchJiraProjects, fetchConfluencePages)
  - `@/lib/oauth` (fetchOAuthAuthorizeUrl)
  - `@/lib/connectorsClient` (searchConnector, quickCreateConnector)
  - `@/lib/auth` (fetchCsrfToken, getCsrfToken, loginWithCredentials)

## Environment

Ensure the following variable is set at build time:
- NEXT_PUBLIC_BACKEND_URL: Base URL of the backend (e.g., https://vscode-internal-21156-beta.beta01.cloud.kavia.ai:3001)

You can verify the value at runtime in the Settings page, which logs the resolved base URL to the browser console.
