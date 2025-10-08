"use client";

import React, { useState } from "react";
import Link from "next/link";
import ChatInput from "@/components/chat/ChatInput";
import type { StructuredReference } from "@/connectors/types";

/**
 * PUBLIC_INTERFACE
 * Home is the public landing page. No login required.
 */
export default function Home() {
  const [picked, setPicked] = useState<StructuredReference[]>([]);
  return (
    <div className="max-w-screen-2xl mx-auto">
      <section className="grid md:grid-cols-3 gap-4 mb-4">
        <div className="card p-4">
          <h3 className="text-sm font-semibold mb-1">JIRA Projects</h3>
          <p className="text-sm text-gray-600 mb-3">View synced JIRA projects.</p>
          <Link href="/jira" className="btn btn-primary focus-ring inline-block">Open Projects</Link>
        </div>
        <div className="card p-4">
          <h3 className="text-sm font-semibold mb-1">Confluence Pages</h3>
          <p className="text-sm text-gray-600 mb-3">Access synced Confluence pages.</p>
          <Link href="/confluence" className="btn btn-primary focus-ring inline-block">Open Pages</Link>
        </div>
        <div className="card p-4">
          <h3 className="text-sm font-semibold mb-1">Connections</h3>
          <p className="text-sm text-gray-600 mb-3">Manage provider connections.</p>
          <Link href="/connect" className="btn btn-amber focus-ring inline-block">Connect</Link>
        </div>
      </section>

      <div className="card p-4 mb-4">
        <h3 className="text-sm font-semibold mb-2">Chat Playground</h3>
        <p className="text-sm text-gray-700 mb-3">
          Try referencing items with <span className="font-mono">@jira_</span> or{" "}
          <span className="font-mono">@confluence_</span>. A selector will appear near the caret.
        </p>
        <ChatInput
          onReferenceSelected={(ref) => {
            setPicked((prev) => [ref, ...prev].slice(0, 6));
            try {
              console.log("[ChatInput] Reference selected:", ref);
            } catch {/* noop */}
          }}
        />
        {picked.length > 0 ? (
          <div className="mt-3">
            <div className="text-xs text-gray-600 mb-1">Recent references:</div>
            <div className="flex flex-wrap gap-2">
              {picked.map((r, i) => (
                <a
                  key={`${r.connector}-${r.id}-${i}`}
                  className="text-xs px-2 py-1 rounded border border-gray-200 bg-white hover:bg-gray-50 transition"
                  href={r.url}
                  target="_blank"
                  rel="noreferrer"
                  title={r.title}
                >
                  {r.connector}:{r.type}:{r.id}
                </a>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-semibold mb-2">Welcome</h3>
        <p className="text-sm text-gray-700">
          This application is publicly accessible. Use the sidebar to navigate projects, pages, or manage connections.
        </p>
      </div>
    </div>
  );
}
