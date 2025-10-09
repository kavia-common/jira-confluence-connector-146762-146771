"use client";

import React, { useEffect, useState } from "react";
import { fetchJiraProjects, type JiraProjectRead } from "@/lib/api";
import EmptyState from "@/components/EmptyState";
import FeedbackAlert from "@/components/FeedbackAlert";
import Link from "next/link";

export default function JiraProjectsPage() {
  const [items, setItems] = useState<JiraProjectRead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let mounted = true;
    fetchJiraProjects()
      .then((res) => {
        if (!mounted) return;
        setItems(res.items || []);
      })
      .catch((e) => setError(e?.message ?? "Failed to load projects"))
      .finally(() => setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="px-6 md:px-10 lg:px-16 pt-10 pb-14 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-semibold">JIRA Projects</h2>
        <Link
          href="/connect"
          className="h-11 px-6 rounded-lg bg-white border border-gray-200 text-gray-800 hover:border-gray-300 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-1"
        >
          Manage Connections
        </Link>
      </div>

      {error && (
        <div className="mb-4">
          <FeedbackAlert type="error" message={error} />
        </div>
      )}

      {loading ? (
        <div className="rounded-xl bg-white border border-gray-100 shadow-sm p-6 md:p-8">
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-4"></div>
          <div className="grid gap-5 md:gap-6">
            <div className="h-16 bg-gray-100 rounded animate-pulse"></div>
            <div className="h-16 bg-gray-100 rounded animate-pulse"></div>
            <div className="h-16 bg-gray-100 rounded animate-pulse"></div>
          </div>
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          title="No projects yet"
          description="Connect JIRA and fetch your projects."
          action={
            <Link
              href="/connect"
              className="inline-flex items-center justify-center h-11 px-6 rounded-lg bg-[#2563EB] text-white hover:bg-blue-600 active:bg-blue-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-1"
            >
              Connect JIRA
            </Link>
          }
        />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {items.map((p) => (
            <article key={p.id} className="rounded-xl border border-gray-100 p-5 md:p-6 hover:shadow-md transition">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl md:text-2xl font-medium">{p.key}</h3>
                <span className="badge">Lead: {p.lead || "—"}</span>
              </div>
              <p className="text-sm md:text-base text-gray-700 mb-4 leading-7">{p.name}</p>
              <div className="flex items-center gap-3">
                {p.url ? (
                  <a
                    className="h-11 px-6 rounded-lg bg-white border border-gray-200 text-gray-800 hover:border-gray-300 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-1 text-sm"
                    href={p.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open
                  </a>
                ) : null}
                <span className="text-xs text-gray-500">Owner #{p.owner_id}</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
