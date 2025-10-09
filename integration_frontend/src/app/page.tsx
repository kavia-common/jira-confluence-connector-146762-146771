"use client";

import React, { useState } from "react";
import Link from "next/link";
import ChatInput from "@/components/chat/ChatInput";
import type { StructuredReference } from "@/connectors/types";

/**
 * PUBLIC_INTERFACE
 * Home is the public landing page. No login required.
 * Refined with Ocean Professional spec for a more spacious and modern UI.
 */
export default function Home() {
  const [picked, setPicked] = useState<StructuredReference[]>([]);

  return (
    <div className="max-w-7xl mx-auto pt-12 pb-16 px-6 md:px-10 lg:px-16 space-y-12">
      {/* Hero Section */}
      <section className="rounded-2xl p-8 md:p-10 bg-gradient-to-r from-blue-500/10 via-white to-amber-100/20 border border-gray-100 shadow-sm">
        <h1 className="text-3xl p-4 md:text-4xl font-semibold tracking-tight text-gray-900">
          Your Integration Hub
        </h1>
        <p className="mt-2 p-4 text-gray-600/80 text-base leading-7">
          Seamlessly connect and reference JIRA projects and Confluence pages from one unified platform.
        </p>
      </section>

      {/* Quick Actions Grid */}
      <section>
        <div className="grid gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <ActionCard
            href="/jira"
            title="JIRA Projects"
            description="View and manage projects."
            buttonLabel="Open Projects"
            buttonClass="inline-flex items-center justify-center h-11 px-6 rounded-lg bg-[#2563EB] text-white hover:bg-blue-600 active:bg-blue-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-1"
          />
          <ActionCard
            href="/confluence"
            title="Confluence Pages"
            description="Access your knowledge base."
            buttonLabel="Open Pages"
            buttonClass="inline-flex items-center justify-center h-11 px-6 rounded-lg bg-[#2563EB] text-white hover:bg-blue-600 active:bg-blue-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-1"
          />
          <ActionCard
            href="/connect"
            title="Manage Connections"
            description="Link your accounts."
            buttonLabel="Connect"
            buttonClass="h-11 px-6 rounded-lg bg-white border border-gray-200 text-gray-800 hover:bg-gray-50 hover:border-gray-300 inline-flex items-center justify-center"
          />
        </div>
      </section>

      {/* Chat Playground */}
      <section>
        <h2 className="text-2xl md:text-3xl font-semibold mb-5">Chat Playground</h2>
        <div className="rounded-xl bg-white border border-gray-100 shadow-sm p-6 md:p-8">
          <ChatInput
            onReferenceSelected={(ref) => {
              setPicked((prev) => [ref, ...prev].slice(0, 6));
              try {
                console.log("[ChatInput] Reference selected:", ref);
              } catch {/* noop */}
            }}
          />
          {picked.length > 0 && (
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
          )}
        </div>
      </section>
    </div>
  );
}

/**
 * Reusable ActionCard for the quick actions grid.
 */
function ActionCard({ href, title, description, buttonLabel, buttonClass }: {
  href: string;
  title: string;
  description: string;
  buttonLabel: string;
  buttonClass: string;
}) {
  return (
    <div className="rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-6 md:p-8 flex flex-col">
      <div className="flex-grow">
        <h3 className="text-lg md:text-xl font-medium text-gray-900">{title}</h3>
        <p className="mt-1 text-sm text-gray-600">{description}</p>
      </div>
      <div className="mt-4">
        <Link href={href} className={buttonClass}>
          {buttonLabel}
        </Link>
      </div>
    </div>
  );
}
