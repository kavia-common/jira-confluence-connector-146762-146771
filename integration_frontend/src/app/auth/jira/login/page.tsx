"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";

/**
 * PUBLIC_INTERFACE
 * Page: /auth/jira/login
 *
 * Static-export friendly client page that immediately redirects the browser to the
 * backend OAuth login endpoint (/api/oauth/atlassian/login), preserving query params.
 * Ensures build succeeds in "export" mode and the route functions as a linkable page.
 */
export default function JiraLoginRedirectPage() {
  return (
    <Suspense fallback={<div className="p-6">Preparing redirect…</div>}>
      <RedirectWorker />
    </Suspense>
  );
}

function RedirectWorker() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const backendBase =
      (process.env.NEXT_PUBLIC_BACKEND_URL ||
        (process.env as Record<string, string | undefined>).BACKEND_URL ||
        ""
      )
        .trim()
        .replace(/\/*$/, "");

    const relPath = "/api/oauth/atlassian/login";
    const params = new URLSearchParams();

    if (searchParams) {
      searchParams.forEach((v, k) => params.set(k, v));
    }

    const qs = params.toString();
    const target = backendBase
      ? `${backendBase}${relPath}${qs ? `?${qs}` : ""}`
      : `${relPath}${qs ? `?${qs}` : ""}`;

    window.location.replace(target);
  }, [searchParams]);

  return <div className="p-6">Redirecting to Atlassian login...</div>;
}
