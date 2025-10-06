# OAuth Flow: Backend-driven PKCE (Frontend usage)

The frontend delegates Atlassian OAuth (Jira/Confluence) to the backend using PKCE.

What the frontend does:
- Calls the backend entrypoint GET {BACKEND}/api/oauth/atlassian/login to start the flow.
- Does not construct Atlassian authorize URLs or set redirect_uri.
- Does not exchange tokens in frontend callbacks. Backend handles token exchange at GET {BACKEND}/api/oauth/callback/atlassian using ATLASSIAN_REDIRECT_URI.

Environment variables:
- Frontend:
  - NEXT_PUBLIC_BACKEND_URL: Absolute base URL to the backend (e.g., https://localhost:3001).
- Backend (for reference):
  - ATLASSIAN_CLIENT_ID
  - ATLASSIAN_REDIRECT_URI
  - ATLASSIAN_SCOPES (optional)
  - FRONTEND_BASE_URL

Initiating login from the UI:
- Use the helper getAtlassianAuthUrl from `@/lib/oauth`:
  const url = await getAtlassianAuthUrl({ returnUrl: `${window.location.origin}/oauth/jira`, state: "optional", scope: "optional" });
  window.location.href = url;

Legacy routes:
- Frontend routes /auth/jira/login and /auth/confluence/login are thin proxies that 307-redirect to {BACKEND}/api/oauth/atlassian/login and preserve query params.
- Frontend callback routes under /api/oauth/callback/* are UX helpers only and will not exchange tokens.

Cleanup:
- Do not set or reference NEXT_PUBLIC_JIRA_OAUTH_REDIRECT_URI or JIRA_OAUTH_REDIRECT_URI on the frontend.
- Ensure NEXT_PUBLIC_BACKEND_URL is set in the frontend environment.

Troubleshooting:
- If clicking "Connect Now" does nothing, verify NEXT_PUBLIC_BACKEND_URL is correct and the backend exposes /api/oauth/atlassian/login.
- If after authorization you don't return to the app, verify the backend is configured with ATLASSIAN_REDIRECT_URI and redirects back to FRONTEND_BASE_URL pages.
