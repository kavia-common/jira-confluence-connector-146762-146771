# Integration Frontend (Next.js)

Modern dashboard UI for JIRA–Confluence integration following the Ocean Professional style.

## Quick start

1. Install dependencies
   - npm install

2. Configure environment
   - Copy .env.example to .env.local and adjust as needed:
     - NEXT_PUBLIC_BACKEND_URL=https://vscode-internal-21156-beta.beta01.cloud.kavia.ai:3001
   - If omitted, the app will call the backend via same origin.
   - Note: This value is read at build-time by Next.js for client-side usage. If you change it, rebuild the app.
   - OAuth note: The backend controls the Atlassian redirect_uri via ATLASSIAN_OAUTH_REDIRECT_URI; the frontend should not pass redirect_uri. Ensure Atlassian app uses:
     https://vscode-internal-21156-beta.beta01.cloud.kavia.ai:3001/api/oauth/atlassian/callback

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

## Module path alias

- The `@` alias is configured to point to `src/` via `tsconfig.json` (`"paths": { "@/*": ["./src/*"] }`).
- Shared helpers for backend calls are exposed under `@/lib/api` (buildBackendUrl, getApiBaseUrl) and `@/lib/oauth`.

## Environment

Ensure the following variable is set at build time:
- NEXT_PUBLIC_BACKEND_URL: Base URL of the backend (e.g., https://vscode-internal-21156-beta.beta01.cloud.kavia.ai:3001)

You can verify the value at runtime in the Settings page, which logs the resolved base URL to the browser console.
