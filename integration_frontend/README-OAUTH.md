# OAuth Start Flow (Frontend)

To ensure the "Connect Now" button redirects correctly to Atlassian:

- Set NEXT_PUBLIC_BACKEND_URL to the backend preview base URL (port 3001). Example:
  NEXT_PUBLIC_BACKEND_URL=https://vscode-internal-22488-beta.beta01.cloud.kavia.ai:3001

- The frontend constructs:
  {NEXT_PUBLIC_BACKEND_URL}/api/oauth/start?return_url={window.location.origin}/api/oauth/callback/jira

- The backend returns 307 to /api/oauth/atlassian/login, which then returns a 302 to https://auth.atlassian.com/authorize.

If you see a 404 or missing redirect, verify the environment variable is set and that the backend is reachable from the browser.
