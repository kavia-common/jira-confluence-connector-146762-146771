"use client";

import React from "react";
import { getApiBaseUrl } from "@/lib/api";

export default function SettingsPage() {
  const baseUrl = getApiBaseUrl();

  return (
    <div className="max-w-screen-md mx-auto">
      <div className="card p-4 md:p-6">
        <h2 className="text-lg font-semibold leading-7 mb-3">Settings</h2>
        <div className="space-y-4">
          <div>
            <div className="text-sm font-medium leading-6 mb-1.5">Access</div>
            <div className="text-sm text-gray-700 leading-6">Public access enabled. No login required.</div>
          </div>
          <div>
            <div className="text-sm font-medium leading-6 mb-1.5">Backend API Base URL</div>
            <div className="text-sm text-gray-700 leading-6 break-all">{baseUrl || "(same origin)"}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
