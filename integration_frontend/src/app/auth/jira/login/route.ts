import { NextRequest, NextResponse } from "next/server";

// Configure for compatibility with static export.
export const dynamic = "error";
export const revalidate = 0;

/**
 * PUBLIC_INTERFACE
 * GET /auth/jira/login
 * Start Jira OAuth 2.0 authorization by redirecting the browser to Atlassian authorize endpoint.
 *
 * Query parameters:
 * - state (optional): Opaque string for CSRF correlation, echoed by Atlassian.
 * - scope (optional): Space separated scopes. Defaults to "read:jira-user offline_access".
 * - return_url (optional): Where to return the user in the frontend UI after the backend callback completes.
 *
 * Environment variables (server-side):
 * - JIRA_CLIENT_ID: Atlassian OAuth 2.0 client ID.
 * - JIRA_OAUTH_REDIRECT_URI: Absolute redirect URI registered with Atlassian (e.g., https://<host>/api/oauth/callback/jira).
 * - NEXT_PUBLIC_FRONTEND_BASE_URL (optional): Used to build a default return_url when not provided.
 *
 * Behavior:
 * - If env vars are missing, returns a 400 JSON error.
 * - Otherwise constructs https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=...&scope=...&redirect_uri=...&state=...&response_type=code&prompt=consent
 * - Issues a 302 redirect to Atlassian.
 */
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const state = url.searchParams.get("state") || undefined;
    const scope =
      url.searchParams.get("scope") ||
      "read:jira-user offline_access";
    const returnUrlParam = url.searchParams.get("return_url") || undefined;

    const clientId = process.env.JIRA_CLIENT_ID;
    const redirectUri = process.env.JIRA_OAUTH_REDIRECT_URI;
    const frontendBase = process.env.NEXT_PUBLIC_FRONTEND_BASE_URL;

    if (!clientId || !redirectUri) {
      return NextResponse.json(
        {
          error: "missing_env",
          message:
            "JIRA_CLIENT_ID and JIRA_OAUTH_REDIRECT_URI must be set on the server.",
        },
        { status: 400 }
      );
    }

    // Derive a default return_url for UX navigation after the backend callback finishes
    const defaultReturnUrl = frontendBase
      ? `${frontendBase.replace(/\/*$/, "")}/oauth/jira`
      : undefined;

    // Build Atlassian authorize URL
    const authorize = new URL("https://auth.atlassian.com/authorize");
    authorize.searchParams.set("audience", "api.atlassian.com");
    authorize.searchParams.set("client_id", clientId);
    authorize.searchParams.set("scope", scope);
    authorize.searchParams.set("redirect_uri", redirectUri);
    authorize.searchParams.set("response_type", "code");
    authorize.searchParams.set("prompt", "consent");
    if (state) authorize.searchParams.set("state", state);

    // If a return_url is provided, propagate it through 'state' by appending to the state value,
    // or alternatively append as a passthrough parameter if your backend echoes it.
    // Here we add it as 'state' suffix if not provided, so backend can parse it. Keep simple: if state exists, don't modify.
    if (!state && (returnUrlParam || defaultReturnUrl)) {
      // Use a simple prefix to make parsing possible if backend desires.
      authorize.searchParams.set(
        "state",
        `ret:${encodeURIComponent(returnUrlParam || defaultReturnUrl!)}`
      );
    }

    return NextResponse.redirect(authorize.toString(), { status: 302 });
  } catch (e) {
    let message = "Failed to initiate Jira OAuth login.";
    if (e && typeof e === "object" && "message" in e) {
      const maybeMsg = (e as { message?: unknown }).message;
      if (typeof maybeMsg === "string") {
        message = maybeMsg;
      }
    }
    return NextResponse.json(
      {
        error: "unexpected_error",
        message,
      },
      { status: 500 }
    );
  }
}
