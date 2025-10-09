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
    <div className="max-w-screen-2xl mx-auto px-6 md:px-10 lg:px-16">
      {/* Hero/Welcome Section - More Attractive */}
      <section className="mb-8 card p-6 gradient-surface">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Jira-Confluence Integration</h1>
        <p className="text-sm text-gray-600">
          Seamlessly connect and interact with JIRA projects and Confluence pages from one platform.
        </p>
      </section>

      {/* Quick Access Cards - Improved Styling */}
      <section className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="card p-6 hover:shadow-lg transition-all duration-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
              <span className="text-blue-600 font-bold text-xl">J</span>
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">JIRA Projects</h3>
              <p className="text-xs text-gray-500">Project Management</p>
            </div>
          </div>
          <Link href="/jira" className="btn btn-primary focus-ring w-full">Open Projects</Link>
        </div>

        <div className="card p-6 hover:shadow-lg transition-all duration-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-lg bg-amber-50 flex items-center justify-center">
              <span className="text-amber-600 font-bold text-xl">C</span>
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">Confluence Pages</h3>
              <p className="text-xs text-gray-500">Knowledge Base</p>
            </div>
          </div>
          <Link href="/confluence" className="btn btn-primary focus-ring w-full">Open Pages</Link>
        </div>

        <div className="card p-6 hover:shadow-lg transition-all duration-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-50 to-amber-50 flex items-center justify-center">
              <span className="text-blue-600 font-bold text-xl">⚡</span>
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">Connections</h3>
              <p className="text-xs text-gray-500">Manage Integrations</p>
            </div>
          </div>
          <Link href="/connect" className="btn btn-amber focus-ring w-full">Connect</Link>
        </div>
      </section>

      {/* Chat Playground - Removed description under heading per requirements */}
      <div className="card p-6 mb-8 hover:shadow-md transition-shadow duration-200">
        <h3 className="text-base font-semibold mb-4">Chat Playground</h3>
        <ChatInput
          onReferenceSelected={(ref) => {
            setPicked((prev) => [ref, ...prev].slice(0, 6));
            try {
              console.log("[ChatInput] Reference selected:", ref);
            } catch {/* noop */}
          }}
        />
        {picked.length > 0 ? (
          <div className="mt-4">
            <div className="text-xs text-gray-600 mb-2 font-medium">Recent references:</div>
            <div className="flex flex-wrap gap-2">
              {picked.map((r, i) => (
                <a
                  key={`${r.connector}-${r.id}-${i}`}
                  className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 hover:border-blue-300 transition-all"
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
    </div>
  );
}
