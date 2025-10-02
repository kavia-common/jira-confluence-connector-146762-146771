"use client";

import React from "react";

export default function Topbar() {
  return (
    <header className="topbar sticky top-0 z-40 w-full">
      <div className="max-w-screen-2xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <span className="text-primary font-semibold">JC</span>
          </div>
          <div>
            <h1 className="text-sm font-semibold">Jira–Confluence</h1>
            <p className="text-xs text-gray-500">Unified Integration</p>
          </div>
        </div>
        <nav className="flex items-center gap-3">
          <span className="text-sm text-gray-700">Public access</span>
          <a href="/settings" className="btn btn-outline focus-ring" aria-label="Settings">
            Settings
          </a>
        </nav>
      </div>
    </header>
  );
}
