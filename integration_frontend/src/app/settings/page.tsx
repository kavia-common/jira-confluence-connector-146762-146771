"use client";

import React, { useEffect } from "react";
import { getApiBaseUrl } from "@/lib/api";

export default function SettingsPage() {
  const baseUrl = getApiBaseUrl();

  // Lightweight diagnostic: log resolved backend base URL at runtime.
  useEffect(() => {
    try {
      // This helps detect build-time env embedding issues and stale values.
      // It is safe and only logs to the browser console.
      console.log("[Settings] getApiBaseUrl() resolved to:", baseUrl || "(same origin)");

      // Log the build-time embedded env value in a type-safe way without TS directives.
      const buildTimeEnv =
        typeof process !== "undefined" && (process as unknown as { env?: Record<string, string | undefined> }).env
          ? (process as unknown as { env: Record<string, string | undefined> }).env["NEXT_PUBLIC_BACKEND_URL"]
          : undefined;
      console.log("[Settings] NEXT_PUBLIC_BACKEND_URL (build-time):", buildTimeEnv);
    } catch {
      // ignore
    }
  }, [baseUrl]);

  return (
    <div className="px-6 md:px-10 lg:px-16 pt-10 pb-14 max-w-screen-md mx-auto">
      <div className="card p-5">
        <h2 className="text-lg font-semibold mb-2">Settings</h2>
        <div className="space-y-3">
          <div>
            <div className="text-sm font-medium mb-1">Access</div>
            <div className="text-sm text-gray-700">Public access enabled. No login required.</div>
          </div>
          <div>
            <div className="text-sm font-medium mb-1">Backend API Base URL</div>
            <div className="text-sm text-gray-700 break-all">{baseUrl || "(same origin)"}</div>
            <div className="text-xs text-gray-500 mt-1">
              Tip: Check the browser console for the resolved backend URL. Rebuild the app after changing
              NEXT_PUBLIC_BACKEND_URL.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
