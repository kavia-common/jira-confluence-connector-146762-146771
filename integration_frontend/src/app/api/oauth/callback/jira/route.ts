import { NextRequest, NextResponse } from "next/server";

// This route participates in static export by disallowing dynamic rendering at build time.
export const dynamic = "error";
export const revalidate = 0;

/**
 * PUBLIC_INTERFACE
 * GET /api/oauth/callback/jira
 * UX helper only. The backend handles token exchange at /api/oauth/callback/atlassian
 * using ATLASSIAN_REDIRECT_URI. This route simply normalizes query and redirects to /connect.
 */
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const err = url.searchParams.get("error");
  const errDesc = url.searchParams.get("error_description");

  // If code missing or error present, redirect with error status for UX.
  if (!code || err) {
    const redirectErr = new URL("/connect", url.origin);
    redirectErr.searchParams.set("provider", "jira");
    redirectErr.searchParams.set("status", "error");
    const message = err ? `${err}${errDesc ? `: ${errDesc}` : ""}` : "Missing code";
    redirectErr.searchParams.set("message", message);
    return NextResponse.redirect(redirectErr.toString(), { status: 302 });
  }

  // Success path: the real exchange is done on backend via ATLASSIAN_REDIRECT_URI callback.
  const redirectOk = new URL("/connect", url.origin);
  redirectOk.searchParams.set("provider", "jira");
  redirectOk.searchParams.set("status", "success");
  return NextResponse.redirect(redirectOk.toString(), { status: 302 });
}
