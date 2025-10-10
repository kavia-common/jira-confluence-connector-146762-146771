"use client";

// Never log or render OAuth state/CSRF in this page.
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
    const sp = params;
    const error = sp?.get("error");
    const msg = sp?.get("message");

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
    <div className="max-w-screen-md mx-auto">
      <h1 className="text-2xl font-semibold mb-2">JIRA Authorization</h1>
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
                "/connect?status=error&provider=jira&message=" + encodeURIComponent(message)
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
