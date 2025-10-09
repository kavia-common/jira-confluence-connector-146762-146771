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
    <div className="space-y-10">
      {/* Hero Section */}
      <section className="rounded-2xl p-8 md:p-10 bg-gradient-to-r from-blue-500/10 via-white to-amber-100/20 border border-gray-100 shadow-sm">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-gray-900">
          Your Integration Hub
        </h1>
        <p className="mt-2 text-gray-600/80 text-base leading-7">
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
            variant="primary"
          />
          <ActionCard
            href="/confluence"
            title="Confluence Pages"
            description="Access your knowledge base."
            buttonLabel="Open Pages"
            variant="primary"
          />
          <ActionCard
            href="/connect"
            title="Manage Connections"
            description="Link your accounts."
            buttonLabel="Connect"
            variant="secondary"
          />
        </div>
      </section>

      {/* Chat Playground */}
      <section className="space-y-4">
        <h2 className="text-2xl md:text-3xl font-semibold">Chat Playground</h2>
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
                    className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 hover:border-primary/50 transition-all"
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
function ActionCard({
  href,
  title,
  description,
  buttonLabel,
  variant = "primary",
}: {
  href: string;
  title: string;
  description: string;
  buttonLabel: string;
  variant?: "primary" | "secondary";
}) {
  const buttonClass =
    variant === "primary"
      ? "btn btn-primary focus-ring"
      : "btn btn-outline focus-ring";

  return (
    <div className="rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-6 md:p-8 flex flex-col">
      <div className="flex-grow space-y-1">
        <h3 className="text-lg md:text-xl font-medium text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      <div className="mt-4">
        <Link href={href} className={buttonClass}>
          {buttonLabel}
        </Link>
      </div>
    </div>
  );
}
