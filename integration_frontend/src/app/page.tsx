"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth";
import EmptyState from "@/components/EmptyState";

export default function Home() {
  const { isAuthenticated } = useAuth();

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

      {!isAuthenticated ? (
        <EmptyState
          title="You are not signed in"
          description="Sign in with your email to begin. This demo issues a temporary token."
          action={<Link href="/login" className="btn btn-primary focus-ring">Go to Sign in</Link>}
        />
      ) : (
        <div className="card p-4">
          <h3 className="text-sm font-semibold mb-2">Welcome</h3>
          <p className="text-sm text-gray-700">
            Use the sidebar to navigate projects, pages, or connect your accounts.
          </p>
        </div>
      )}
    </div>
  );
}
