import { NextResponse } from "next/server";

/**
 * PUBLIC_INTERFACE
 * GET /api/health
 * Simple readiness/liveness endpoint for the frontend.
 * Returns:
 *   200 JSON: { status: "ok", uptime: <seconds>, timestamp: <iso> }
 */
export async function GET() {
  const payload = {
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  };
  return NextResponse.json(payload, { status: 200 });
}
