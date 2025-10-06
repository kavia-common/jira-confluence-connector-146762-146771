import { NextRequest, NextResponse } from "next/server";

// Next.js static export compatibility for App Router route handlers
export const dynamic = "force-static";
export const revalidate = 0;

/**
 * PUBLIC_INTERFACE
 * GET /auth/confluence/login
 * Thin proxy to backend PKCE start endpoint /api/oauth/atlassian/login.
 * Preserves optional query params: state, scope, return_url. Does not embed redirect_uri.
 */
export async function GET(req: NextRequest) {
  const incoming = new URL(req.url);
  const backendBase =
    (process.env.NEXT_PUBLIC_BACKEND_URL || (process.env as Record<string, string | undefined>).BACKEND_URL || "").trim().replace(/\/*$/, "");

  if (!backendBase) {
    // Same-origin relative path if backend base not configured
    const rel = new URL("/api/oauth/atlassian/login", incoming.origin);
    incoming.searchParams.forEach((v, k) => rel.searchParams.set(k, v));
    return NextResponse.redirect(rel.toString(), { status: 307 });
  }

  const target = new URL("/api/oauth/atlassian/login", backendBase);
  incoming.searchParams.forEach((v, k) => target.searchParams.set(k, v));
  return NextResponse.redirect(target.toString(), { status: 307 });
}
