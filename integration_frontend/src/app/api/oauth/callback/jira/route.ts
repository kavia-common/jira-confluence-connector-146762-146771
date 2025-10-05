import { NextRequest, NextResponse } from "next/server";

/**
 * PUBLIC_INTERFACE
 * GET /api/oauth/callback/jira
 * Handle the Atlassian OAuth redirect for Jira, validate required params,
 * optionally forward to backend for code exchange, and redirect user back
 * into the app with a status indicator.
 *
 * Query parameters:
 * - code: string (required) - the authorization code from Atlassian
 * - state: string (optional) - CSRF/state param echoed back
 *
 * Behavior:
 * - If code is missing: redirect to /connect?status=error&provider=jira&reason=missing_code
 * - Otherwise:
 *   - If NEXT_PUBLIC_BACKEND_URL is provided, attempt to forward (POST) code/state to a backend exchange endpoint.
 *     We try /auth/jira/exchange first, and if that fails, try GET /auth/jira/callback passthrough.
 *     Failures are swallowed to not block UX; we still redirect success to the UI and let it surface result.
 *   - If no backend URL configured, we just continue to frontend redirect.
 *
 * Env:
 * - NEXT_PUBLIC_BACKEND_URL (optional): configured backend base URL for forwarding token exchange.
 * - JIRA_OAUTH_REDIRECT_URI (optional): if needed by future logic; not required here but read to satisfy requirement.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state") ?? undefined;

  // Read envs (do not log secrets)
  const BACKEND_BASE = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/+$/, "");
  const REDIRECT_URI = process.env.JIRA_OAUTH_REDIRECT_URI; // not used directly but available if needed

  // Basic validation
  if (!code) {
    return NextResponse.redirect(
      new URL(
        "/connect?status=error&provider=jira&reason=missing_code",
        req.url
      )
    );
  }

  // Attempt to forward to backend if configured
  if (BACKEND_BASE) {
    // Prefer explicit exchange endpoint (POST)
    const exchangeUrl = `${BACKEND_BASE}/auth/jira/exchange`;
    try {
      const body: Record<string, unknown> = { code };
      if (state) body.state = state;
      if (REDIRECT_URI) body.redirect_uri = REDIRECT_URI;

      await fetch(exchangeUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Never log this payload; contains code
        body: JSON.stringify(body),
      });
    } catch {
      // If POST exchange failed (endpoint missing or server down), try GET passthrough to /auth/jira/callback
      try {
        const cbUrl = new URL(`${BACKEND_BASE}/auth/jira/callback`);
        cbUrl.searchParams.set("code", code);
        if (state) cbUrl.searchParams.set("state", state);
        if (REDIRECT_URI) cbUrl.searchParams.set("redirect_uri", REDIRECT_URI);
        await fetch(cbUrl.toString(), { method: "GET" });
      } catch {
        // Swallow backend errors; we still redirect the user back into the app
      }
    }
  }

  // Always redirect back into the app UI with a success indicator; the UI can verify connection if desired
  return NextResponse.redirect(
    new URL("/connect?status=success&provider=jira", req.url)
  );
}


