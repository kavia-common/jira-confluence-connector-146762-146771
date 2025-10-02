"use client";

import React, { useEffect, useState } from "react";
import { fetchJiraProjects } from "@/lib/api";
import { JiraProjectRead } from "@/lib/types";
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
    <div className="max-w-screen-2xl mx-auto">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">JIRA Projects</h2>
        <Link href="/connect" className="btn btn-outline focus-ring">Manage Connections</Link>
      </div>

      {error && (
        <div className="mb-3">
          <FeedbackAlert type="error" message={error} />
        </div>
      )}

      {loading ? (
        <div className="card p-4">
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2"></div>
          <div className="space-y-2">
            <div className="h-12 bg-gray-100 rounded animate-pulse"></div>
            <div className="h-12 bg-gray-100 rounded animate-pulse"></div>
            <div className="h-12 bg-gray-100 rounded animate-pulse"></div>
          </div>
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          title="No projects yet"
          description="Connect JIRA and fetch your projects."
          action={<Link href="/connect" className="btn btn-primary focus-ring">Connect JIRA</Link>}
        />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {items.map((p) => (
            <article key={p.id} className="list-item">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{p.key}</h3>
                <span className="badge">Lead: {p.lead || "—"}</span>
              </div>
              <p className="text-sm text-gray-700 mb-2">{p.name}</p>
              <div className="flex items-center gap-2">
                {p.url ? (
                  <a className="btn btn-outline focus-ring" href={p.url} target="_blank" rel="noreferrer">
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
