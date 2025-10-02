"use client";

import React from "react";
import { getApiBaseUrl } from "@/lib/api";

export default function SettingsPage() {
  const baseUrl = getApiBaseUrl();

  return (
    <div className="max-w-screen-md mx-auto">
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
          </div>
        </div>
      </div>
    </div>
  );
}
