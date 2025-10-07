"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";

/**
 * PUBLIC_INTERFACE
 * Page: /auth/confluence/login
 *
 * Static-export friendly client page that immediately redirects the browser to the
 * backend OAuth login endpoint (/api/oauth/atlassian/login), preserving query params.
 * This avoids PageNotFoundError during Next.js "export" builds where route handlers
 * can't be used to pre-render page data.
 */
export default function ConfluenceLoginRedirectPage() {
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

    // Construct target URL
    const relPath = "/api/oauth/atlassian/login";
    const params = new URLSearchParams();

    // passthrough incoming query params (state, scope, return_url, etc.)
    if (searchParams) {
      searchParams.forEach((v, k) => params.set(k, v));
    }

    const qs = params.toString();
    const target = backendBase
      ? `${backendBase}${relPath}${qs ? `?${qs}` : ""}`
      : `${relPath}${qs ? `?${qs}` : ""}`;

    // navigate
    window.location.replace(target);
  }, [searchParams]);

  return <div className="p-6">Redirecting to Atlassian login...</div>;
}
