"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getAtlassianAuthUrl } from "@/lib/oauth";

/**
 * PUBLIC_INTERFACE
 * ConnectPage
 *
 * Connects JIRA/Confluence by starting the Atlassian OAuth flow and uses this page (/connect) as the return page.
 * - Builds an absolute returnUrl to this page (/connect) on the client.
 * - Uses getAtlassianAuthUrl({ returnUrl }) to retrieve the authorization URL from the backend.
 * - Redirects the browser to Atlassian on button click.
 * - Optionally displays status messages from query parameters (e.g., ?result=success|error&message=...).
 */
export default function ConnectPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <ConnectInner />
    </Suspense>
  );
}

function ConnectInner() {
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState<"jira" | "confluence" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [authUrl, setAuthUrl] = useState<string>("");

  // Prepare absolute return URL to this page (/connect) on the client only
  useEffect(() => {
    const origin =
      typeof window !== "undefined"
        ? window.location.origin
        : process.env.NEXT_PUBLIC_FRONTEND_BASE_URL || "";
    if (!origin) return;
    const returnUrl = `${origin.replace(/\/*$/, "")}/connect`;

    // Precompute the authorization URL so we can redirect quickly on click
    getAtlassianAuthUrl({ returnUrl })
      .then((url) => {
        setAuthUrl(url);
        setReady(true);
      })
      .catch((e) => {
        console.error(e);
        setError(e?.message || "Failed to prepare authorization URL");
      });
  }, []);

  const handleConnectClick = async (provider: "jira" | "confluence") => {
    try {
      setLoading(provider);
      setError(null);
      if (!authUrl) throw new Error("Authorization URL not ready");
      window.location.href = authUrl;
    } catch (e) {
      setLoading(null);
      const message =
        e instanceof Error ? e.message : "Unable to start Atlassian OAuth";
      setError(message);
    }
  };

  // Optional: display feedback from backend redirect parameters
  const result = searchParams?.get("result"); // "success" | "error"
  const message = searchParams?.get("message");

  useEffect(() => {
    if (!result) return;
    if (result === "success") {
      setSuccessMsg(message || "Connected to Atlassian successfully.");
    } else if (result === "error") {
      setError(message || "Failed to connect to Atlassian.");
    }
  }, [result, message]);

  return (
    <div className="p-6 space-y-6 max-w-screen-lg mx-auto">
      <div>
        <h1 className="text-2xl font-semibold">Connect Integrations</h1>
        <p className="text-gray-600 mt-1">
          Connect to your JIRA and Confluence accounts. Clicking Connect Now will open the backend OAuth login flow and return here.
        </p>
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-red-800">
          {error}
        </div>
      )}
      {successMsg && (
        <div className="rounded-md border border-green-200 bg-green-50 p-3 text-green-800">
          {successMsg}
        </div>
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
              onClick={() => handleConnectClick("jira")}
              disabled={!ready || loading === "jira"}
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
              onClick={() => handleConnectClick("confluence")}
              disabled={!ready || loading === "confluence"}
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
