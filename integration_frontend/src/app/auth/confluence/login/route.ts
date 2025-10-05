import { NextRequest, NextResponse } from "next/server";

// Next.js static export compatibility for App Router route handlers
export const dynamic = "force-static";
export const revalidate = 0;

/**
 * PUBLIC_INTERFACE
 * GET /auth/confluence/login
 * 
 * Starts the Confluence OAuth 2.0 Authorization Code flow with Atlassian.
 * - Reads CONFLUENCE_CLIENT_ID and CONFLUENCE_OAUTH_REDIRECT_URI from server env.
 * - Falls back to NEXT_PUBLIC_CONFLUENCE_CLIENT_ID and NEXT_PUBLIC_CONFLUENCE_OAUTH_REDIRECT_URI for preview or static environments.
 * - Preserves optional query params: state, scope, return_url.
 * - Builds an authorize URL to https://auth.atlassian.com (default) and 302 redirects.
 * 
 * Query params:
 * - state: optional anti-CSRF/random string
 * - scope: optional space-separated list; defaults to Confluence scopes if not provided
 * - return_url: optional URL to return to after completing flow (echoed via state or stored client-side)
 * 
 * Returns:
 * - 302 Redirect to Atlassian authorization endpoint
 * - 400 JSON if configuration is missing
 */
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const params = url.searchParams;

  // Read and normalize env values, trimming to avoid trailing spaces/newlines from env files
  const rawClientId =
    process.env.CONFLUENCE_CLIENT_ID?.trim() ||
    process.env.NEXT_PUBLIC_CONFLUENCE_CLIENT_ID?.trim() ||
    "";
  const rawRedirectUri =
    process.env.CONFLUENCE_OAUTH_REDIRECT_URI?.trim() ||
    process.env.NEXT_PUBLIC_CONFLUENCE_OAUTH_REDIRECT_URI?.trim() ||
    "";
  const rawAuthBase =
    process.env.JIRA_AUTH_BASE?.trim() || "https://auth.atlassian.com";

  // Validate configuration
  if (!rawClientId) {
    return NextResponse.json(
      {
        error: "Missing CONFLUENCE_CLIENT_ID",
        message:
          "Set CONFLUENCE_CLIENT_ID or NEXT_PUBLIC_CONFLUENCE_CLIENT_ID in environment.",
      },
      { status: 400 }
    );
  }
  if (!rawRedirectUri) {
    return NextResponse.json(
      {
        error: "Missing CONFLUENCE_OAUTH_REDIRECT_URI",
        message:
          "Set CONFLUENCE_OAUTH_REDIRECT_URI or NEXT_PUBLIC_CONFLUENCE_OAUTH_REDIRECT_URI in environment.",
      },
      { status: 400 }
    );
  }

  // Preserve incoming params
  const state = params.get("state")?.trim() || "";
  const incomingScope = params.get("scope")?.trim();
  const returnUrl = params.get("return_url")?.trim() || "";

  // Default Confluence scopes: include offline_access to obtain refresh token
  const defaultScopes = [
    "read:confluence-content.all",
    "write:confluence-content",
    "read:confluence-space.summary",
    "offline_access",
  ];
  const scopeStr =
    incomingScope && incomingScope.length > 0
      ? incomingScope
      : defaultScopes.join(" ");

  // Construct authorization URL
  const authorizeUrl = new URL("/authorize", rawAuthBase);
  authorizeUrl.searchParams.set("audience", "api.atlassian.com");
  authorizeUrl.searchParams.set("client_id", rawClientId);
  authorizeUrl.searchParams.set("scope", scopeStr);
  authorizeUrl.searchParams.set("redirect_uri", rawRedirectUri);
  authorizeUrl.searchParams.set("response_type", "code");
  authorizeUrl.searchParams.set("prompt", "consent");

  // Store state if provided. If return_url exists and state was not provided,
  // include return_url in state to allow the callback to route the user back.
  // We keep it simple: if both present, prefer provided state.
  if (state) {
    authorizeUrl.searchParams.set("state", state);
  } else if (returnUrl) {
    authorizeUrl.searchParams.set(
      "state",
      JSON.stringify({ return_url: returnUrl })
    );
  }

  return NextResponse.redirect(authorizeUrl.toString(), { status: 302 });
}
