import type { NextApiRequest, NextApiResponse } from "next";

/**
 * PUBLIC_INTERFACE
 * Simple health endpoint for the frontend container to aid preview proxy checks.
 * GET /api/health -> { status: "ok", message: "integration_frontend running" }
 */
export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Cache-Control", "no-store");
  res.status(200).json({ status: "ok", message: "integration_frontend running" });
}
