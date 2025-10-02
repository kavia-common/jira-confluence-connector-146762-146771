import React from "react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-screen-md mx-auto">
      <section className="card p-6 gradient-surface" role="alert" aria-live="assertive">
        <header className="mb-2">
          <h1 className="text-xl font-semibold">404 – Page Not Found</h1>
          <p className="text-sm text-gray-600">The page you’re looking for doesn’t exist.</p>
        </header>
        <div className="flex gap-2">
          <Link href="/" className="btn btn-primary focus-ring inline-block">Return home</Link>
          <Link href="/connect" className="btn btn-outline focus-ring inline-block">Go to Connect</Link>
          <Link href="/jira" className="btn btn-outline focus-ring inline-block">JIRA Projects</Link>
          <Link href="/confluence" className="btn btn-outline focus-ring inline-block">Confluence Pages</Link>
        </div>
      </section>
    </div>
  );
}
