# Integration Frontend (Next.js)

Modern dashboard UI for JIRA–Confluence integration following the Ocean Professional style.

## Quick start

1. Install dependencies
   - npm install

2. Configure environment
   - Create a .env.local file and set at least:
     - NEXT_PUBLIC_BACKEND_URL=https://vscode-internal-28615-beta.beta01.cloud.kavia.ai:3001
   - Optional:
     - NEXT_PUBLIC_BACKEND_PUBLIC_BASE_URL=
     - NEXT_PUBLIC_BACKEND_BASE_URL=
     - NEXT_PUBLIC_FRONTEND_BASE_URL=https://vscode-internal-28615-beta.beta01.cloud.kavia.ai:3000
   - If none of the backend variables are set, the OAuth login pages will show a helpful message instead of redirecting to a possibly incorrect same-origin port.

3. Run
   - npm run dev
   - open http://localhost:3000

## Backend URL resolution

The frontend now centralizes backend base URL resolution in `@/lib/url`:

Resolution priority (first non-empty wins), with trailing slashes removed:
1) NEXT_PUBLIC_BACKEND_URL (preferred)
2) NEXT_PUBLIC_BACKEND_PUBLIC_BASE_URL
3) NEXT_PUBLIC_BACKEND_BASE_URL
4) BACKEND_URL (last resort)

We intentionally do NOT fall back to `window.location.origin` for backend URLs to avoid accidental same-origin usage on unintended ports.

## Routes

- /                Overview
- /connect         Connect JIRA and Confluence
- /jira            JIRA projects (GET /integrations/jira/projects/fetch)
- /confluence      Confluence pages (GET /integrations/confluence/pages/fetch)
- /settings        App settings
- /auth/jira/login         Starts OAuth login (redirects to backend)
- /auth/confluence/login   Starts OAuth login (redirects to backend)

## Notes

- Ensure NEXT_PUBLIC_BACKEND_URL is the backend origin only (no '/docs'). Example:
  NEXT_PUBLIC_BACKEND_URL=https://vscode-internal-28615-beta.beta01.cloud.kavia.ai:3001
- The backend will compute redirect_uri based on its own configuration.
- Styling uses CSS variables and utility classes aligned with the Ocean Professional theme.

## Helpers

- `@/lib/url`
  - `getBackendPublicBaseUrl()` resolves the backend base URL using the priority above.
  - `stripTrailingSlash(input)` normalizes URLs by removing trailing slashes.
- `@/lib/api`
  - Uses `getBackendPublicBaseUrl()` to make API calls (absolute when configured, otherwise relative).
- `@/lib/oauth`
  - Uses `getBackendPublicBaseUrl()` to construct `/api/oauth/atlassian/login` URLs without window-origin fallback.

## OAuth Backend Endpoint

The frontend starts OAuth by navigating to:
`${NEXT_PUBLIC_BACKEND_URL}/api/oauth/atlassian/login` (if configured; otherwise relative `/api/oauth/atlassian/login`),
passing `return_url`, and optionally `state` and `scope`. Ensure `NEXT_PUBLIC_BACKEND_URL` points to the running backend (typically port 3001). Do not include a trailing slash.
