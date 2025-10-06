"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import FeedbackAlert from "@/components/FeedbackAlert";
import { getAtlassianAuthUrl } from "@/lib/oauth";

/**
 * ConnectPage
 *
 * Starts OAuth by navigating to backend PKCE endpoint:
 * - GET {BACKEND}/api/oauth/atlassian/login
 *
 * Backend redirects the browser to Atlassian, and later to the configured backend callback
 * at `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/atlassian/callback` which will then
 * redirect back to frontend pages like /oauth/jira or /oauth/confluence.
 *
 * We surface transient UI state (loading + last outcome) based on query flags after callback.
 */
export default function ConnectPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <ConnectInner />
    </Suspense>
  );
}

function ConnectInner() {
  const params = useSearchParams();
  const safeParams = params ?? new URLSearchParams();

  const [loading, setLoading] = useState<"jira" | "confluence" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // If user returned here from callback with query flags, surface them.
  useEffect(() => {
    const status = safeParams.get("status");
    const provider = safeParams.get("provider");
    const message = safeParams.get("message");

    if (status === "success" && provider) {
      setSuccessMsg(`${provider === "jira" ? "JIRA" : "Confluence"} connected successfully.`);
    } else if (status === "error") {
      setError(message || "Authorization failed. Please try again.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Start OAuth: request the backend PKCE login URL and navigate there.
   * We pass a return_url hint so backend can route back to a frontend page after it completes.
   */
  async function startOAuth(provider: "jira" | "confluence") {
    try {
      setLoading(provider);
      setError(null);
      setSuccessMsg(null);

      const frontendBase =
        (process.env.NEXT_PUBLIC_FRONTEND_BASE_URL ||
          (typeof window !== "undefined" ? window.location.origin : "")).replace(/\/*$/, "");
      const returnUrl = `${frontendBase}/oauth/${provider}`;

      const url = await getAtlassianAuthUrl({
        returnUrl,
        state: "kc-oauth",
      });

      window.location.href = url;
    } catch (e: unknown) {
      console.error("Failed to start OAuth", e);
      setLoading(null);
      const msg =
        typeof e === "object" && e !== null && "message" in e
          ? String((e as { message?: string }).message || "")
          : "";
      setError(msg || "Failed to start OAuth. Please try again.");
    }
  }

  return (
    <div className="p-6 space-y-6 max-w-screen-lg mx-auto">
      <div>
        <h1 className="text-2xl font-semibold">Connect Integrations</h1>
        <p className="text-gray-600 mt-1">
          Connect to your JIRA and Confluence accounts. Clicking Connect Now will open the backend OAuth login flow.
        </p>
      </div>

      {error && (
        <FeedbackAlert type="error" message={error} onClose={() => setError(null)} />
      )}
      {successMsg && (
        <FeedbackAlert
          type="success"
          message={successMsg}
          onClose={() => setSuccessMsg(null)}
        />
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* JIRA Card */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium">JIRA</h2>
              <p className="text-sm text-gray-600">
                Starts Atlassian OAuth via backend.
              </p>
            </div>
            <span className="text-xs px-2 py-1 rounded bg-blue-50 text-blue-700 border border-blue-200">
              Integration
            </span>
          </div>

          <div className="mt-4">
            <button
              onClick={() => startOAuth("jira")}
              disabled={loading === "jira"}
              className="w-full inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-60 transition"
            >
              {loading === "jira" ? "Redirecting..." : "Connect Now"}
            </button>
          </div>

          <div className="mt-3 text-sm text-gray-500">
            You will be redirected to Atlassian to authorize, then returned here.
          </div>
        </div>

        {/* Confluence Card */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium">Confluence</h2>
              <p className="text-sm text-gray-600">
                Starts Atlassian OAuth via backend.
              </p>
            </div>
            <span className="text-xs px-2 py-1 rounded bg-amber-50 text-amber-700 border border-amber-200">
              Integration
            </span>
          </div>

          <div className="mt-4">
            <button
              onClick={() => startOAuth("confluence")}
              disabled={loading === "confluence"}
              className="w-full inline-flex items-center justify-center rounded-md bg-amber-500 px-4 py-2 text-white hover:bg-amber-600 disabled:opacity-60 transition"
            >
              {loading === "confluence" ? "Redirecting..." : "Connect Now"}
            </button>
          </div>

          <div className="mt-3 text-sm text-gray-500">
            You will be redirected to Atlassian to authorize, then returned here.
          </div>
        </div>
      </div>
    </div>
  );
}
