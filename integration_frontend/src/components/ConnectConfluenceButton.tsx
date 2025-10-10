"use client";

import React, { useState } from "react";
import { fetchOAuthAuthorizeUrl } from "@/lib/oauth";

/**
 * PUBLIC_INTERFACE
 * ConnectConfluenceButton
 * Starts the Confluence OAuth flow by asking the backend for the Atlassian authorize URL
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
 *  - returnUrl?: string                              // optional callback override; defaults to /oauth/confluence on frontend (:3000)
 */
export default function ConnectConfluenceButton({
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
        (typeof window !== "undefined" ? `${window.location.origin}/oauth/confluence` : "/oauth/confluence");

      // Ask backend for Atlassian authorize URL (redirect=false) and navigate to it.
      // Backend uses redirect_uri on :3001 and embeds server-generated `state`.
      const authorizeUrl = await fetchOAuthAuthorizeUrl("confluence", {
        returnUrl: cb,
      });

      window.location.href = authorizeUrl;
    } catch (err) {
      // Avoid logging sensitive details to console in production.
      setLoading(false);
      const message =
        err instanceof Error ? err.message : "Failed to start Confluence authorization.";
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
        "w-full inline-flex items-center justify-center rounded-md bg-amber-500 px-4 py-2 text-white hover:bg-amber-600 disabled:opacity-60 transition"
      }
    >
      {loading ? loadingLabel : idleLabel}
    </button>
  );
}
