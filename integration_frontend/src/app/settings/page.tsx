"use client";

import React, { useEffect } from "react";
import { getApiBaseUrl } from "@/lib/api";

export default function SettingsPage() {
  const baseUrl = getApiBaseUrl();

  useEffect(() => {
    try {
      console.log("[Settings] getApiBaseUrl() resolved to:", baseUrl || "(same origin)");
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
    <div className="max-w-screen-md mx-auto">
      <div className="card p-6">
        <h2 className="text-lg font-semibold mb-2">Settings</h2>
        <div className="space-y-4">
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
