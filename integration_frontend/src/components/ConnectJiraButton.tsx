"use client";

import React, { useState } from "react";
import { fetchOAuthAuthorizeUrl } from "@/lib/oauth";

/**
 * PUBLIC_INTERFACE
 * ConnectJiraButton
 * Starts the Jira OAuth flow by asking the backend for the Atlassian authorize URL
 * with redirect=false (JSON { url }) and then navigating to that URL.
 *
 * Critical: Do NOT send a client-generated `state` or `scope`. The backend generates
 * a secure state and embeds it into the returned Atlassian URL. The same state must
 * come back on callback for strict validation.
 *
 * Props:
 *  - onError?: (message: string) => void             // optional error callback
 *  - idleLabel?: string                              // button text when idle
 *  - loadingLabel?: string                           // button text while fetching/redirecting
 *  - className?: string                              // button CSS classes
 *  - returnUrl?: string                              // optional callback override; defaults to /oauth/jira on frontend (:3000)
 */
export default function ConnectJiraButton({
  onError,
  idleLabel = "Connect Now",
  loadingLabel = "Redirecting...",
  className,
  returnUrl,
}: {
  onError?: (message: string) => void;
  idleLabel?: string;
  loadingLabel?: string;
  className?: string;
  returnUrl?: string;
}) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    try {
      setLoading(true);
      const cb =
        returnUrl ||
        (typeof window !== "undefined" ? `${window.location.origin}/oauth/jira` : "/oauth/jira");

      // Ask backend for Atlassian authorize URL (redirect=false) and navigate to it.
      // Backend uses redirect_uri on :3001 and embeds server-generated `state`.
      const authorizeUrl = await fetchOAuthAuthorizeUrl("jira", {
        returnUrl: cb,
      });

      window.location.href = authorizeUrl;
    } catch (err) {
      console.error("Jira connect navigation error:", err);
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
