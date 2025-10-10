"use client";

import React, { useEffect, useState } from "react";
import { fetchConfluencePages, type ConfluencePageRead } from "@/lib/api";
import EmptyState from "@/components/EmptyState";
import FeedbackAlert from "@/components/FeedbackAlert";
import Link from "next/link";

export default function ConfluencePagesPage() {
  const [items, setItems] = useState<ConfluencePageRead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let mounted = true;
    fetchConfluencePages()
      .then((res) => {
        if (!mounted) return;
        setItems(res.items || []);
      })
      .catch((e) => setError(e?.message ?? "Failed to load pages"))
      .finally(() => setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="max-w-screen-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold leading-7">Confluence Pages</h2>
        <Link href="/connect" className="btn btn-outline focus-ring">Manage Connections</Link>
      </div>

      {error && (
        <div className="mb-4">
          <FeedbackAlert type="error" message={error} />
        </div>
      )}

      {loading ? (
        <div className="card p-4 md:p-6">
          <div className="h-4 w-28 bg-gray-200 rounded animate-pulse mb-3"></div>
          <div className="space-y-3">
            <div className="h-12 bg-gray-100 rounded animate-pulse"></div>
            <div className="h-12 bg-gray-100 rounded animate-pulse"></div>
            <div className="h-12 bg-gray-100 rounded animate-pulse"></div>
          </div>
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          title="No pages yet"
          description="Connect Confluence and fetch your pages."
          action={<Link href="/connect" className="btn btn-primary focus-ring">Connect Confluence</Link>}
        />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((p) => (
            <article key={p.id} className="list-item space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold leading-6">{p.title}</h3>
                <span className="badge">{p.space_key}</span>
              </div>
              <p className="text-sm text-gray-700 leading-6">Page ID: {p.page_id}</p>
              <div className="flex items-center gap-3">
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
