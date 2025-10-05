"use client";

import React from "react";
import { buildConfluenceLoginUrl } from "@/lib/oauth";

/**
 * PUBLIC_INTERFACE
 * OAuthConfluencePage
 * Simple page to initiate Confluence OAuth login using the helper.
 */
export default function OAuthConfluencePage() {
  const href = buildConfluenceLoginUrl();
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Connect Confluence</h1>
      <a
        href={href}
        className="inline-flex px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
      >
        Start Confluence OAuth
      </a>
    </div>
  );
}
