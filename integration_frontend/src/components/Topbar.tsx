"use client";

import React from "react";
import Link from "next/link";

/**
 * PUBLIC_INTERFACE
 * Topbar - Application header with branding and settings link
 */
export default function Topbar() {
  return (
    <header className="topbar sticky top-0 z-40 w-full">
      <div className="max-w-screen-2xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <span className="text-primary font-bold text-sm">JC</span>
          </div>
          <div>
            <h1 className="text-sm font-semibold text-gray-900">Jira–Confluence</h1>
            <p className="text-xs text-gray-500">Integration Platform</p>
          </div>
        </Link>
        <nav>
          <Link href="/settings" className="btn btn-outline focus-ring text-sm">
            Settings
          </Link>
        </nav>
      </div>
    </header>
  );
}
