"use client";

/**
 * PUBLIC_INTERFACE
 * OAuthCallbackRouter
 * Handles the generic /oauth/callback redirect coming from the backend.
 * It reads ?provider=<jira|confluence>&status=<success|error>&message=... and
 * forwards to the corresponding provider-specific page already implemented:
 *  - /oauth/jira
 *  - /oauth/confluence
 *
 * This prevents 404s if the backend redirects to /oauth/callback as documented.
 */
import React, { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

/**
 * Wrap inner component that calls useSearchParams in a Suspense boundary per Next.js requirement.
 */
export default function OAuthCallbackRouter() {
  return (
    <Suspense
      fallback={
        <div className="p-6 max-w-screen-md mx-auto">
          <h1 className="text-2xl font-semibold mb-3">Finalizing authorization...</h1>
          <p className="text-sm text-gray-700">Redirecting you to the appropriate page.</p>
        </div>
      }
    >
      <OAuthCallbackRouterInner />
    </Suspense>
  );
}

function OAuthCallbackRouterInner() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const sp = params;
    const provider = sp?.get("provider") || "";
    const status = sp?.get("status") || "success";
    const message = sp?.get("message") || "";

    // Build query string to preserve status/message when forwarding
    const qs = new URLSearchParams();
    if (status) qs.set("status", status);
    if (message) qs.set("message", message);

    if (provider === "jira") {
      router.replace(`/oauth/jira?${qs.toString()}`);
    } else if (provider === "confluence") {
      router.replace(`/oauth/confluence?${qs.toString()}`);
    } else {
      // Fallback: go to /connect and surface error if unknown provider
      if (message) {
        router.replace(
          `/connect?status=${encodeURIComponent(status)}&message=${encodeURIComponent(message)}`
        );
      } else {
        router.replace("/connect");
      }
    }
  }, [params, router]);

  return (
    <div className="p-6 max-w-screen-md mx-auto">
      <h1 className="text-2xl font-semibold mb-3">Finalizing authorization...</h1>
      <p className="text-sm text-gray-700">Redirecting you to the appropriate page.</p>
    </div>
  );
}
