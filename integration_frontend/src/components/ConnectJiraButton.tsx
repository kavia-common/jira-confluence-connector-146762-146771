"use client";

import React, { useState } from "react";
import { buildOAuthLoginUrl } from "@/lib/oauth";

/**
 * PUBLIC_INTERFACE
 * ConnectJiraButton
 * A reusable button that starts the Jira OAuth flow by navigating the browser
 * directly to the backend login endpoint with ?redirect=true so the server issues
 * a 307 redirect to Atlassian's authorize URL (auth.atlassian.com/authorize...).
 *
 * This component does not construct or rewrite any Atlassian URLs and relies solely
 * on the backend to produce the correct authorize URL and redirect.
 *
 * Props:
 *  - onError?: (message: string) => void             // optional error callback
 *  - idleLabel?: string                              // button text when idle
 *  - loadingLabel?: string                           // button text while fetching/redirecting
 *  - className?: string                              // button CSS classes
 *  - state?: string                                  // optional OAuth state param (preserved)
 *  - scope?: string                                  // optional scope string (preserved)
 *  - returnUrl?: string                              // optional callback override; defaults to /oauth/jira
 */
export default function ConnectJiraButton({
  onError,
  idleLabel = "Connect Now",
  loadingLabel = "Redirecting...",
  className,
  state = "kc-oauth",
  // Default Jira scopes ensure offline refresh and read access:
  // offline_access read:jira-work read:jira-user
  scope = "offline_access read:jira-work read:jira-user",
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

  function handleClick() {
    try {
      setLoading(true);
      const cb =
        returnUrl ||
        (typeof window !== "undefined"
          ? `${window.location.origin}/oauth/jira`
          : "/oauth/jira");

      // Build backend login URL and let the backend issue the 307 redirect to Atlassian.
      const direct = buildOAuthLoginUrl("jira", cb, state, scope);
      const u = new URL(
        direct,
        typeof window !== "undefined" ? window.location.origin : "http://localhost"
      );
      // Ask the backend to perform a redirect (307) instead of returning JSON.
      u.searchParams.set("redirect", "true");

      // Immediately navigate; the backend will redirect to auth.atlassian.com/authorize...
      window.location.assign(u.toString());
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
