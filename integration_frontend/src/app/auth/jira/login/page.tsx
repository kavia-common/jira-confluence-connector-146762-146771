"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getBackendPublicBaseUrl } from "@/lib/url";

/**
 * PUBLIC_INTERFACE
 * Page: /auth/jira/login
 *
 * Client page that redirects the browser to the backend OAuth login endpoint
 * (/api/oauth/atlassian/login), preserving query params. Does not fall back to
 * window.origin for backend base to avoid incorrect ports. Shows a helpful message
 * when backend base URL is not configured.
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
  const backendBase = useMemo(() => getBackendPublicBaseUrl(), []);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    if (!backendBase) {
      setMissing(true);
      return;
    }
    const relPath = "/api/oauth/atlassian/login";
    const params = new URLSearchParams();

    if (searchParams) {
      searchParams.forEach((v, k) => params.set(k, v));
    }

    const qs = params.toString();
    const target = `${backendBase}${relPath}${qs ? `?${qs}` : ""}`;

    window.location.replace(target);
  }, [searchParams, backendBase]);

  if (missing) {
    return (
      <div className="p-6 space-y-2">
        <div className="text-red-600 font-semibold">Backend URL not configured</div>
        <p>
          Please set NEXT_PUBLIC_BACKEND_URL (preferred), or NEXT_PUBLIC_BACKEND_PUBLIC_BASE_URL /
          NEXT_PUBLIC_BACKEND_BASE_URL, then reload this page.
        </p>
      </div>
    );
  }

  return <div className="p-6">Redirecting to Atlassian login...</div>;
}
