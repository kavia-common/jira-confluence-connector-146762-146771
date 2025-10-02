"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import FeedbackAlert from "@/components/FeedbackAlert";

/**
 * ConnectPage
 * One-click connect buttons calling public backend endpoints. No auth required.
 */
export default function ConnectPage() {
  const router = useRouter();

  const [loading, setLoading] = useState<"jira" | "confluence" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  async function handleConnect(provider: "jira" | "confluence") {
    setLoading(provider);
    setError(null);
    setSuccessMsg(null);

    try {
      const base = process.env.NEXT_PUBLIC_BACKEND_URL || "";
      const endpoint =
        provider === "jira"
          ? "/integrations/jira/connect"
          : "/integrations/confluence/connect";

      const res = await fetch(`${base}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Public access: no Authorization header
        },
      });

      if (!res.ok) {
        // Try to surface backend message if present
        let message = `Failed to connect to ${provider === "jira" ? "JIRA" : "Confluence"}`;
        try {
          const text = await res.text();
          if (text) message = text;
        } catch {
          /* ignore */
        }
        throw new Error(message);
      }

      const data: {
        provider: string;
        base_url: string;
        connected: boolean;
        redirect_url?: string | null;
      } = await res.json();

      if (!data.connected) {
        throw new Error("Connection not confirmed by server.");
      }

      setSuccessMsg(
        `${provider === "jira" ? "JIRA" : "Confluence"} connected successfully. Redirecting...`
      );

      // Prefer local pages as requested. If needed later, we may use data.redirect_url.
      const target = provider === "jira" ? "/jira" : "/confluence";
      setTimeout(() => router.push(target), 250);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Failed to connect.";
      setError(message);
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="p-6 space-y-6 max-w-screen-lg mx-auto">
      <div>
        <h1 className="text-2xl font-semibold">Connect Integrations</h1>
        <p className="text-gray-600 mt-1">
          Connect to your JIRA and Confluence accounts. This demo requires no credentials—just click
          Connect Now to initiate the backend flow.
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
                Click Connect Now to connect using the backend flow.
              </p>
            </div>
            <span className="text-xs px-2 py-1 rounded bg-blue-50 text-blue-700 border border-blue-200">
              Integration
            </span>
          </div>

          <div className="mt-4">
            <button
              onClick={() => handleConnect("jira")}
              disabled={loading === "jira"}
              className="w-full inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-60 transition"
            >
              {loading === "jira" ? "Connecting..." : "Connect Now"}
            </button>
          </div>

          <div className="mt-3 text-sm text-gray-500">
            On success, you will be redirected to JIRA projects.
          </div>
        </div>

        {/* Confluence Card */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium">Confluence</h2>
              <p className="text-sm text-gray-600">
                Click Connect Now to connect using the backend flow.
              </p>
            </div>
            <span className="text-xs px-2 py-1 rounded bg-amber-50 text-amber-700 border border-amber-200">
              Integration
            </span>
          </div>

          <div className="mt-4">
            <button
              onClick={() => handleConnect("confluence")}
              disabled={loading === "confluence"}
              className="w-full inline-flex items-center justify-center rounded-md bg-amber-500 px-4 py-2 text-white hover:bg-amber-600 disabled:opacity-60 transition"
            >
              {loading === "confluence" ? "Connecting..." : "Connect Now"}
            </button>
          </div>

          <div className="mt-3 text-sm text-gray-500">
            On success, you will be redirected to Confluence pages.
          </div>
        </div>
      </div>
    </div>
  );
}
