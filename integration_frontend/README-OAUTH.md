# OAuth Start Flow (Frontend)

To ensure the "Connect Now" button redirects correctly to Atlassian:

- Set NEXT_PUBLIC_BACKEND_URL to the backend preview base URL (port 3001). Example:
  NEXT_PUBLIC_BACKEND_URL=https://vscode-internal-26162-beta.beta01.cloud.kavia.ai:3001

- The frontend constructs the backend login URL using the helper at `@/lib/oauth`:
  buildOAuthLoginUrl("jira" | "confluence", `${window.location.origin}/oauth/<service>`, "optional-state", "optional-scope")

  This results in:
  {NEXT_PUBLIC_BACKEND_URL}/auth/<service>/login?return_url={window.location.origin}/oauth/<service>[&state=...][&scope=...]

- The backend returns an HTTP redirect to Atlassian authorize.

If you see a 404 or missing redirect, verify the environment variable is set and that the backend is reachable from the browser.
