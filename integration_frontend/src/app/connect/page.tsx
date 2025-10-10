"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import FeedbackAlert from "@/components/FeedbackAlert";
import { buildOAuthLoginUrl } from "@/lib/oauth";

/**
 * ConnectPage
 *
 * Starts OAuth by navigating to backend login endpoints:
 * - JIRA:        GET {BACKEND}/auth/jira/login
 * - Confluence:  GET {BACKEND}/auth/confluence/login
 *
 * Backend redirects the browser to Atlassian, and later to a frontend callback page:
 * - /oauth/jira and /oauth/confluence
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

  const [loading, setLoading] = useState<"jira" | "confluence" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // If user returned here from callback with query flags, surface them.
  useEffect(() => {
    const status = params.get("status");
    const provider = params.get("provider");
    const message = params.get("message");

    if (status === "success" && provider) {
      setSuccessMsg(`${provider === "jira" ? "JIRA" : "Confluence"} connected successfully.`);
    } else if (status === "error") {
      setError(message || "Authorization failed. Please try again.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Start OAuth: redirect the browser to backend /auth/<provider>/login.
   * We include a return_url hint so backend can send user back to our callback page.
   */
  function startOAuth(provider: "jira" | "confluence") {
    setLoading(provider);
    setError(null);
    setSuccessMsg(null);

    const callbackUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}/oauth/${provider}`
        : `/oauth/${provider}`;

    const url = buildOAuthLoginUrl(provider, callbackUrl, "kc-oauth", "read");
    window.location.href = url;
  }

  return (
    <div className="space-y-6 max-w-screen-lg mx-auto">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold leading-8">Connect Integrations</h1>
        <p className="text-gray-600 text-sm leading-6">
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

      <div className="grid md:grid-cols-2 gap-6 md:gap-8">
        {/* JIRA Card */}
        <div className="card p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium leading-7">JIRA</h2>
              <p className="text-sm text-gray-600 leading-6">
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
              className="w-full btn btn-primary focus-ring"
            >
              {loading === "jira" ? "Redirecting..." : "Connect Now"}
            </button>
          </div>

          <div className="mt-3 text-sm text-gray-500 leading-6">
            You will be redirected to Atlassian to authorize, then returned here.
          </div>
        </div>

        {/* Confluence Card */}
        <div className="card p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium leading-7">Confluence</h2>
              <p className="text-sm text-gray-600 leading-6">
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
              className="w-full btn btn-amber focus-ring"
            >
              {loading === "confluence" ? "Redirecting..." : "Connect Now"}
            </button>
          </div>

          <div className="mt-3 text-sm text-gray-500 leading-6">
            You will be redirected to Atlassian to authorize, then returned here.
          </div>
        </div>
      </div>
    </div>
  );
}
