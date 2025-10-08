"use client";

import React, { useState } from "react";
import { getJiraLoginUrl } from "@/lib/api";

/**
 * PUBLIC_INTERFACE
 * ConnectJiraButton
 * A reusable button that starts the Jira OAuth flow by calling the backend
 * GET /auth/jira/login to obtain the Atlassian authorize URL and then redirects
 * the browser (window.location.href) to it.
 *
 * Props:
 *  - onError?: (message: string) => void             // optional error callback
 *  - idleLabel?: string                              // button text when idle
 *  - loadingLabel?: string                           // button text while fetching/redirecting
 *  - className?: string                              // button CSS classes
 *  - state?: string                                  // optional OAuth state param
 *  - scope?: string                                  // optional scope string
 *  - returnUrl?: string                              // optional callback override; defaults to /oauth/jira
 */
export default function ConnectJiraButton({
  onError,
  idleLabel = "Connect Now",
  loadingLabel = "Redirecting...",
  className,
  state = "kc-oauth",
  scope = "read",
  returnUrl,
}: {
  onError?: (message: string) => void;
  idleLabel?: string;
  loadingLabel?: string;
  className?: string;
  state?: string;
  scope?: string;
  returnUrl?: string;
}) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    try {
      setLoading(true);
      const cb =
        returnUrl ||
        (typeof window !== "undefined"
          ? `${window.location.origin}/oauth/jira`
          : "/oauth/jira");

      const authorizeUrl = await getJiraLoginUrl({
        state,
        scope,
        returnUrl: cb,
      });

      // Immediately redirect to Atlassian's authorize page
      window.location.href = authorizeUrl;
    } catch (err) {
      console.error("Jira connect error:", err);
      setLoading(false);
      const message =
        err instanceof Error ? err.message : "Failed to start Jira authorization.";
      onError?.(message);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      aria-busy={loading}
      className={
        className ||
        "w-full inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-60 transition"
      }
    >
      {loading ? loadingLabel : idleLabel}
    </button>
  );
}
