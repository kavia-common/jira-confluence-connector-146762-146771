"use client";

import React, { useEffect } from "react";
import Link from "next/link";

/**
 * PUBLIC_INTERFACE
 * OAuthJiraPage
 * Minimal placeholder page for /oauth/jira used as a return target after Atlassian authorization.
 * The backend will generally redirect to /api/oauth/callback/jira instead; this page exists to satisfy
 * legacy navigations and avoid build-time route errors.
 */
export default function OAuthJiraPage() {
  useEffect(() => {
    // No-op: this page can be enhanced to read query params and show status if needed.
  }, []);

  return (
    <main className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="max-w-lg w-full rounded-lg border border-gray-200 bg-white p-6 shadow-sm text-center">
        <h1 className="text-xl font-semibold">Jira OAuth</h1>
        <p className="text-gray-600 mt-2">
          This page is a placeholder for the Jira OAuth flow. If you reached here directly, you can return to the Connect page.
        </p>
        <div className="mt-6">
          <Link
            href="/connect"
            className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition"
          >
            Back to Connect
          </Link>
        </div>
      </div>
    </main>
  );
}
