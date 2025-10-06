import { NextRequest, NextResponse } from "next/server";

// Configure for compatibility with static export.
export const dynamic = "error";
export const revalidate = 0;

/**
 * PUBLIC_INTERFACE
 * GET /auth/jira/login
 * Thin proxy that redirects to backend PKCE start endpoint /api/oauth/atlassian/login.
 * Preserves state/scope/return_url query params and does NOT embed redirect_uri here.
 */
export async function GET(req: NextRequest) {
  const incoming = new URL(req.url);
  const backendBase =
    (process.env.NEXT_PUBLIC_BACKEND_URL ||
      (process.env as Record<string, string | undefined>).BACKEND_URL ||
      ""
    )
      .trim()
      .replace(/\/*$/, "");

  if (!backendBase) {
    // If backend base is not configured, still construct relative path so same-origin reverse proxy can handle it.
    const rel = new URL("/api/oauth/atlassian/login", incoming.origin);
    // passthrough params
    incoming.searchParams.forEach((v, k) => rel.searchParams.set(k, v));
    return NextResponse.redirect(rel.toString(), { status: 307 });
  }

  const target = new URL("/api/oauth/atlassian/login", backendBase);
  incoming.searchParams.forEach((v, k) => target.searchParams.set(k, v));
  return NextResponse.redirect(target.toString(), { status: 307 });
}
