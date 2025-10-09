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
    const sp = params;
    const status = sp?.get("status");
    const provider = sp?.get("provider");
    const message = sp?.get("message");

    if (status === "success" && provider) {
      setSuccessMsg(`${provider === "jira" ? "JIRA" : "Confluence"} connected successfully.`);
    } else if (status === "error") {
      setError(message || "Authorization failed. Please try again.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="px-6 md:px-10 lg:px-16 pt-10 pb-14 space-y-6 max-w-6xl mx-auto">
      <header>
        <h1 className="text-2xl font-semibold text-gray-900">Connect Integrations</h1>
        <p className="text-sm text-gray-600 mt-1">
          Link your Atlassian accounts to access JIRA and Confluence data.
        </p>
      </header>

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

      {/* Enhanced vertical spacing around connection cards: mt-20 mb-24 with increased gaps */}
      <section className="mt-20 mb-24 space-y-6">
        <div className="grid md:grid-cols-2 gap-y-10 gap-x-6 md:gap-10">
          {/* JIRA Card */}
          <article className="card card-tall p-6 md:p-8 hover:shadow-lg transition-all duration-200">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12  rounded-lg bg-blue-50 flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-xl">J</span>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">JIRA</h2>
                  <p className="text-xs text-gray-500">Project Management</p>
                </div>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                OAuth 2.0
              </span>
            </div>

            <ConnectJiraButton
              onError={(msg) => setError(msg)}
              idleLabel="Connect JIRA"
              loadingLabel="Connecting..."
              className="w-full btn btn-primary focus-ring"
            />
          </article>

          {/* Confluence Card */}
          <article className="card card-tall p-6 md:p-8 hover:shadow-lg transition-all duration-200">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-amber-50 flex items-center justify-center">
                  <span className="text-amber-600 font-bold text-xl">C</span>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Confluence</h2>
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
              className="w-full btn btn-amber focus-ring"
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
