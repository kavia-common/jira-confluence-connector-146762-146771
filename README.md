# jira-confluence-connector-146762-146771

Frontend (Next.js)
- Configure NEXT_PUBLIC_BACKEND_URL to point to the backend.
- Do not hardcode OAuth redirect_uri in the frontend; the backend controls it via ATLASSIAN_OAUTH_REDIRECT_URI.
- To initiate Atlassian login, navigate the browser to backend endpoints such as:
  - GET <BACKEND>/auth/jira/login?redirect=true
  - or the /api-prefixed aliases if your proxy forwards /api unchanged.