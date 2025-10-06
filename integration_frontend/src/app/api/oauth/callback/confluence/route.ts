import { NextRequest, NextResponse } from "next/server";

/**
 * Next.js static export compatibility for App Router route handlers
 */
export const dynamic = "force-static";
export const revalidate = 0;

/**
 * PUBLIC_INTERFACE
 * GET /api/oauth/callback/confluence
 * UX helper only. Backend handles code exchange at /api/oauth/callback/atlassian
 * using ATLASSIAN_REDIRECT_URI. This route normalizes query and redirects to /connect.
 */
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const err = url.searchParams.get("error");
  const errDesc = url.searchParams.get("error_description");

  if (!code || err) {
    const redirectErr = new URL("/connect", url.origin);
    redirectErr.searchParams.set("provider", "confluence");
    redirectErr.searchParams.set("status", "error");
    const message = err ? `${err}${errDesc ? `: ${errDesc}` : ""}` : "Missing code";
    redirectErr.searchParams.set("message", message);
    return NextResponse.redirect(redirectErr.toString(), { status: 302 });
  }

  const redirectOk = new URL("/connect", url.origin);
  redirectOk.searchParams.set("provider", "confluence");
  redirectOk.searchParams.set("status", "success");
  return NextResponse.redirect(redirectOk.toString(), { status: 302 });
}
