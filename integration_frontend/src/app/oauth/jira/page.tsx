"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import FeedbackAlert from "@/components/FeedbackAlert";

/**
 * PUBLIC_INTERFACE
 * JiraOAuthCallbackPage
 * Wraps the inner component that uses useSearchParams in a Suspense boundary,
 * satisfying Next.js requirement.
 */
export default function JiraOAuthCallbackPage() {
  return (
    <Suspense fallback={<div className="p-6">Finalizing authorization...</div>}>
      <JiraOAuthCallbackInner />
    </Suspense>
  );
}

function JiraOAuthCallbackInner() {
  const router = useRouter();
  const params = useSearchParams();

  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState<string>("Finalizing authorization...");

  useEffect(() => {
    const error = params.get("error");
    const msg = params.get("message");

    if (error) {
      setStatus("error");
      setMessage(msg || "Authorization failed.");
      return;
    }

    setStatus("success");
    setMessage("JIRA connected successfully. Redirecting to projects...");
    const t = setTimeout(() => {
      router.replace("/jira");
    }, 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="p-6 max-w-screen-md mx-auto space-y-3">
      <h1 className="text-2xl font-semibold leading-8">JIRA Authorization</h1>
      {status === "error" ? (
        <FeedbackAlert type="error" message={message} />
      ) : (
        <FeedbackAlert type="success" message={message} />
      )}
      {status === "error" ? (
        <div>
          <button
            className="btn btn-outline focus-ring"
            onClick={() =>
              router.replace(
                "/connect?status=error&provider=jira&message=" + encodeURIComponent(message)
              )
            }
          >
            Back to Connect
          </button>
        </div>
      ) : (
        <div>
          <button
            className="btn btn-outline focus-ring"
            onClick={() =>
              router.replace("/connect?status=success&provider=jira")
            }
          >
            Back to Connect
          </button>
        </div>
      )}
    </div>
  );
}
