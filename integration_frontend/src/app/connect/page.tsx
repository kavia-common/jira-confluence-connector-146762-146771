"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import FeedbackAlert from "@/components/FeedbackAlert";
import { buildOAuthLoginUrl } from "@/lib/oauth";

/**
 * ConnectPage
 *
 * Starts OAuth by redirecting to backend /api/oauth/start with optional return_url,
 * which then redirects to Atlassian. We use window.location.assign for a full-page redirect.
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
   * Start OAuth: redirect the browser to backend /api/oauth/start.
   * We include a return_url hint so backend can send user back to our frontend callback page.
   */
  function startOAuth(provider: "jira" | "confluence") {
    setLoading(provider);
    setError(null);
    setSuccessMsg(null);

    const callbackUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}/api/oauth/callback/jira`
        : `/api/oauth/callback/jira`;

    const startUrl = buildOAuthLoginUrl(callbackUrl);
    if (!startUrl) {
      setLoading(null);
      setError(
        "Backend URL is not configured. Please set NEXT_PUBLIC_BACKEND_URL to your cloud backend."
      );
      return;
    }
    // Full page navigation to backend start endpoint
    window.location.assign(startUrl);
  }

  return (
    <div className="p-6 space-y-6 max-w-screen-lg mx-auto">
      <div>
        <h1 className="text-2xl font-semibold">Connect Integrations</h1>
        <p className="text-gray-600 mt-1">
          Connect to your Atlassian account. Clicking Connect Now will open the backend OAuth start flow.
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
              <p className="text-sm text-gray-600">Starts Atlassian OAuth via backend.</p>
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
              <p className="text-sm text-gray-600">Starts Atlassian OAuth via backend.</p>
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
