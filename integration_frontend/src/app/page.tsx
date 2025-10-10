"use client";

import Link from "next/link";

/**
 * PUBLIC_INTERFACE
 * Home is the public landing page. No login required.
 */
export default function Home() {
  return (
    <div className="max-w-screen-2xl mx-auto">
      <section className="grid md:grid-cols-3 gap-6 md:gap-8 mb-6 md:mb-8">
        <div className="card p-4 md:p-6">
          <h3 className="text-base font-semibold leading-6 mb-2">JIRA Projects</h3>
          <p className="text-sm text-gray-600 leading-6 mb-4">View synced JIRA projects.</p>
          <Link href="/jira" className="btn btn-primary focus-ring inline-flex">Open Projects</Link>
        </div>
        <div className="card p-4 md:p-6">
          <h3 className="text-base font-semibold leading-6 mb-2">Confluence Pages</h3>
          <p className="text-sm text-gray-600 leading-6 mb-4">Access synced Confluence pages.</p>
          <Link href="/confluence" className="btn btn-primary focus-ring inline-flex">Open Pages</Link>
        </div>
        <div className="card p-4 md:p-6">
          <h3 className="text-base font-semibold leading-6 mb-2">Connections</h3>
          <p className="text-sm text-gray-600 leading-6 mb-4">Manage provider connections.</p>
          <Link href="/connect" className="btn btn-amber focus-ring inline-flex">Connect</Link>
        </div>
      </section>

      <div className="card p-4 md:p-6 gradient-surface">
        <h3 className="text-base font-semibold leading-6 mb-3">Welcome</h3>
        <p className="text-sm text-gray-700 leading-6">
          This application is publicly accessible. Use the sidebar to navigate projects, pages, or manage connections.
        </p>
      </div>
    </div>
  );
}
