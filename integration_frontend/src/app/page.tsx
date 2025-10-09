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
    <>
      {/* Tasteful Hero */}
      <section className="rounded-2xl p-8 md:p-10 bg-gradient-to-r from-blue-500/10 via-white to-amber-100/20 border border-gray-100">
        <h1 className="text-3xl md:text-4xl font-semibold text-gray-900">
          Work across Jira and Confluence, together
        </h1>
        <p className="mt-2 text-sm md:text-base text-gray-600 leading-7">
          Connect accounts and navigate projects and pages from one place.
        </p>
        <div className="mt-6 flex gap-3">
          <Link href="/connect" className="inline-flex items-center justify-center h-11 px-6 rounded-lg bg-[#2563EB] text-white hover:bg-blue-600 active:bg-blue-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-1">
            Connect Accounts
          </Link>
          <Link href="/jira" className="h-11 px-6 rounded-lg bg-white border border-gray-200 text-gray-800 hover:border-gray-300 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-1">
            View Projects
          </Link>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="grid md:grid-cols-3 gap-6 md:gap-8">
        <div className="rounded-xl bg-white border border-gray-100 shadow-sm p-6 md:p-8 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
              <span className="text-blue-600 font-bold text-xl">J</span>
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-medium">Jira Projects</h3>
              <p className="text-xs text-gray-500">Project management</p>
            </div>
          </div>
          <Link href="/jira" className="inline-flex items-center justify-center h-11 px-6 rounded-lg bg-[#2563EB] text-white hover:bg-blue-600 active:bg-blue-700 transition-colors w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-1">
            Open Projects
          </Link>
        </div>
        <div className="rounded-xl bg-white border border-gray-100 shadow-sm p-6 md:p-8 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-lg bg-amber-50 flex items-center justify-center">
              <span className="text-amber-600 font-bold text-xl">C</span>
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-medium">Confluence Pages</h3>
              <p className="text-xs text-gray-500">Knowledge base</p>
            </div>
          </div>
          <Link href="/confluence" className="inline-flex items-center justify-center h-11 px-6 rounded-lg bg-[#2563EB] text-white hover:bg-blue-600 active:bg-blue-700 transition-colors w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-1">
            Open Pages
          </Link>
        </div>
        <div className="rounded-xl bg-white border border-gray-100 shadow-sm p-6 md:p-8 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-50 to-amber-50 flex items-center justify-center">
              <span className="text-blue-600 font-bold text-xl">⚡</span>
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-medium">Connections</h3>
              <p className="text-xs text-gray-500">Manage integrations</p>
            </div>
          </div>
          <Link href="/connect" className="inline-flex items-center justify-center h-11 px-6 rounded-lg bg-white border border-gray-200 text-gray-800 hover:border-gray-300 hover:bg-gray-50 transition-colors w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-1">
            Manage
          </Link>
        </div>
      </section>

      {/* Chat Playground (concise) */}
      <section className="rounded-xl bg-white border border-gray-100 shadow-sm p-6 md:p-8 hover:shadow-md transition-shadow">
        <h3 className="text-xl md:text-2xl font-medium mb-4">Chat Playground</h3>
        <ChatInput
          onReferenceSelected={(ref) => {
            setPicked((prev) => [ref, ...prev].slice(0, 6));
            try {
              console.log("[ChatInput] Reference selected:", ref);
            } catch {
              /* noop */
            }
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
      </section>
    </>
  );
}
