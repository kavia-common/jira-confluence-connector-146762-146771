"use client";

import React, { useState } from "react";
import { getJiraLoginUrl } from "@/lib/api";
import { buildOAuthLoginUrl } from "@/lib/oauth";

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
      window.location.assign(authorizeUrl);
    } catch (err) {
      console.error("Jira connect error:", err);
      // Fallback: try direct navigation to backend to let browser follow 302 redirect.
      try {
        const cb2 =
          returnUrl ||
          (typeof window !== "undefined"
            ? `${window.location.origin}/oauth/jira`
            : "/oauth/jira");
        const direct = buildOAuthLoginUrl("jira", cb2, state, scope);
        const u = new URL(
          direct,
          typeof window !== "undefined" ? window.location.origin : "http://localhost"
        );
        // Hint backend to send a 302 redirect if supported
        u.searchParams.set("redirect", "true");
        window.location.assign(u.toString());
        return;
      } catch (navErr) {
        console.error("Jira direct navigation fallback failed:", navErr);
      }
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
