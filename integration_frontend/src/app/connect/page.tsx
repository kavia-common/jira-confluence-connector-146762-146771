"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import FeedbackAlert from "@/components/FeedbackAlert";
import ConnectJiraButton from "@/components/ConnectJiraButton";
import ConnectConfluenceButton from "@/components/ConnectConfluenceButton";

/**
 * PUBLIC_INTERFACE
 * ConnectPage
 * Simplified connection page for JIRA and Confluence OAuth flows.
 * Preserves all OAuth button functionality while presenting a cleaner UI.
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

  return (
    <div className="px-6 md:px-10 lg:px-16 pt-10 pb-14 space-y-6 max-w-7xl mx-auto">
      <header>
        <h1 className="text-3xl md:text-4xl font-semibold text-gray-900">Connect Integrations</h1>
        <p className="text-sm md:text-base text-gray-600 mt-1 leading-7">
          Link your Atlassian accounts to access Jira and Confluence data.
        </p>
      </header>

      {error && <FeedbackAlert type="error" message={error} onClose={() => setError(null)} />}
      {successMsg && (
        <FeedbackAlert type="success" message={successMsg} onClose={() => setSuccessMsg(null)} />
      )}

      {/* Generous spacing and larger grid gaps */}
      <section className="mt-20 mb-24">
        <div className="grid md:grid-cols-2 gap-8 md:gap-10">
          {/* JIRA Card */}
          <article className="rounded-xl bg-white border border-gray-100 shadow-sm p-6 md:p-8 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-xl">J</span>
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-medium text-gray-900">Jira</h2>
                  <p className="text-xs text-gray-500">Project Management</p>
                </div>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                OAuth 2.0
              </span>
            </div>

            <ConnectJiraButton
              onError={(msg) => setError(msg)}
              idleLabel="Connect Jira"
              loadingLabel="Connecting..."
              className="w-full inline-flex items-center justify-center h-11 px-6 rounded-lg bg-[#2563EB] text-white hover:bg-blue-600 active:bg-blue-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-1"
            />
          </article>

          {/* Confluence Card */}
          <article className="rounded-xl bg-white border border-gray-100 shadow-sm p-6 md:p-8 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-amber-50 flex items-center justify-center">
                  <span className="text-amber-600 font-bold text-xl">C</span>
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-medium text-gray-900">Confluence</h2>
                  <p className="text-xs text-gray-500">Knowledge Base</p>
                </div>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                OAuth 2.0
              </span>
            </div>

            <ConnectConfluenceButton
              onError={(msg) => setError(msg)}
              idleLabel="Connect Confluence"
              loadingLabel="Connecting..."
              className="w-full inline-flex items-center justify-center h-11 px-6 rounded-lg bg-white border border-gray-200 text-gray-800 hover:border-gray-300 hover:bg-gray-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-1"
            />
          </article>
        </div>
      </section>

      <div className="text-center">
        <p className="text-xs text-gray-500">
          Secure authentication via Atlassian. Your credentials are never stored.
        </p>
      </div>
    </div>
  );
}
