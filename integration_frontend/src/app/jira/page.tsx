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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">JIRA Projects</h2>
        <Link href="/connect" className="btn btn-outline focus-ring">Manage Connections</Link>
      </div>

      {error && (
        <FeedbackAlert type="error" message={error} />
      )}

      {loading ? (
        <div className="card p-6">
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-3"></div>
          <div className="space-y-3">
            <div className="h-16 bg-gray-100 rounded animate-pulse"></div>
            <div className="h-16 bg-gray-100 rounded animate-pulse"></div>
            <div className="h-16 bg-gray-100 rounded animate-pulse"></div>
          </div>
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          title="No projects yet"
          description="Connect JIRA and fetch your projects."
          action={<Link href="/connect" className="btn btn-primary focus-ring">Connect JIRA</Link>}
        />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((p) => (
            <article key={p.id} className="list-item p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-base">{p.key}</h3>
                <span className="badge">Lead: {p.lead || "—"}</span>
              </div>
              <p className="text-sm text-gray-700 mb-4">{p.name}</p>
              <div className="flex items-center gap-3">
                {p.url ? (
                  <a className="btn btn-outline focus-ring text-sm" href={p.url} target="_blank" rel="noreferrer">
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
