import { NextRequest, NextResponse } from "next/server";

/**
 * Next.js static export compatibility:
 * With "output: export", API routes must opt into a static mode.
 * We declare force-static and revalidate=0 so the file is emitted and runs at request time in the serverless/edge environment.
 */
export const dynamic = "force-static";
export const revalidate = 0;

/**
 * PUBLIC_INTERFACE
 * GET /api/oauth/callback/confluence
 *
 * Handles Atlassian redirect for Confluence OAuth:
 * - Parses query params (code, state, error).
 * - Optionally forwards the callback to backend if NEXT_PUBLIC_BACKEND_URL is set.
 * - Always redirects to /connect with a concise status to keep UX consistent.
 *
 * Environment handling:
 * - Trims env variables to avoid newline/space issues.
 * - NEXT_PUBLIC_BACKEND_URL (optional): if present, a GET to /auth/confluence/callback?code=...&state=... is attempted.
 *
 * Notes:
 * - This route allows the frontend to operate standalone (no backend required) while
 *   supporting a best-effort handoff to backend if configured.
 */
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code")?.trim() || "";
  const state = url.searchParams.get("state")?.trim() || "";
  const provider = "confluence";

  const backendBase =
    process.env.NEXT_PUBLIC_BACKEND_URL?.trim() ||
    process.env.BACKEND_URL?.trim() ||
    "";

  let status = "ok";
  let message = "";

  // If Atlassian returned an error, capture it
  const oauthError = url.searchParams.get("error")?.trim();
  const oauthErrorDesc = url.searchParams.get("error_description")?.trim();
  if (oauthError) {
    status = "error";
    message = `${oauthError}${oauthErrorDesc ? `: ${oauthErrorDesc}` : ""}`;
  }

  // Best-effort forward to backend if configured and we have a code
  if (backendBase && code && !oauthError) {
    try {
      const callbackUrl = new URL("/auth/confluence/callback", backendBase);
      callbackUrl.searchParams.set("code", code);
      if (state) callbackUrl.searchParams.set("state", state);

      // Prefer GET since the backend openapi shows GET is supported for callback.
      const resp = await fetch(callbackUrl.toString(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!resp.ok) {
        status = "error";
        message = `Backend callback failed (${resp.status})`;
      }
    } catch (err: unknown) {
      status = "error";
      let errMsg = "unknown error";
      if (err && typeof err === "object" && "message" in err) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        errMsg = (err as any).message ?? "unknown error";
      }
      message = `Backend callback exception: ${errMsg}`;
    }
  } else if (!backendBase) {
    // No backend configured, this is acceptable; frontend can still proceed to a connected screen.
    message = "No backend configured; skipped server callback.";
  }

  // Redirect to connect page with provider and status
  const redirect = new URL("/connect", url.origin);
  redirect.searchParams.set("provider", provider);
  redirect.searchParams.set("status", status);
  if (message) redirect.searchParams.set("message", message);
  return NextResponse.redirect(redirect.toString(), { status: 302 });
}
