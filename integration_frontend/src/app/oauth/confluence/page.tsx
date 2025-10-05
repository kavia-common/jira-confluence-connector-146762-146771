"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import FeedbackAlert from "@/components/FeedbackAlert";

/**
 * PUBLIC_INTERFACE
 * ConfluenceOAuthCallbackPage
 * Wraps the inner component that uses useSearchParams in a Suspense boundary.
 */
export default function ConfluenceOAuthCallbackPage() {
  return (
    <Suspense fallback={<div className="p-6">Finalizing authorization...</div>}>
      <ConfluenceOAuthCallbackInner />
    </Suspense>
  );
}

function ConfluenceOAuthCallbackInner() {
  const router = useRouter();
  const params = useSearchParams();
  const safeParams = params ?? new URLSearchParams();

  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState<string>("Finalizing authorization...");

  useEffect(() => {
    const error = safeParams.get("error");
    const msg = safeParams.get("message");

    if (error) {
      setStatus("error");
      setMessage(msg || "Authorization failed.");
      return;
    }

    setStatus("success");
    setMessage("Confluence connected successfully. Redirecting to pages...");
    const t = setTimeout(() => {
      router.replace("/confluence");
    }, 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="p-6 max-w-screen-md mx-auto">
      <h1 className="text-2xl font-semibold mb-3">Confluence Authorization</h1>
      {status === "error" ? (
        <FeedbackAlert type="error" message={message} />
      ) : (
        <FeedbackAlert type="success" message={message} />
      )}
      {status === "error" ? (
        <div className="mt-4">
          <button
            className="btn btn-outline focus-ring"
            onClick={() =>
              router.replace(
                "/connect?status=error&provider=confluence&message=" + encodeURIComponent(message)
              )
            }
          >
            Back to Connect
          </button>
        </div>
      ) : (
        <div className="mt-4">
          <button
            className="btn btn-outline focus-ring"
            onClick={() =>
              router.replace(
                "/connect?status=success&provider=confluence"
              )
            }
          >
            Back to Connect
          </button>
        </div>
      )}
    </div>
  );
}
