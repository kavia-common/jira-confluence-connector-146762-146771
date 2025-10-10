import React from "react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-screen-md mx-auto">
      <section className="card p-4 md:p-6 gradient-surface space-y-3" role="alert" aria-live="assertive">
        <header className="space-y-1.5">
          <h1 className="text-xl font-semibold leading-7">404 – Page Not Found</h1>
          <p className="text-sm text-gray-600 leading-6">The page you’re looking for doesn’t exist.</p>
        </header>
        <div className="flex flex-wrap gap-3">
          <Link href="/" className="btn btn-primary focus-ring inline-flex">Return home</Link>
          <Link href="/connect" className="btn btn-outline focus-ring inline-flex">Go to Connect</Link>
          <Link href="/jira" className="btn btn-outline focus-ring inline-flex">JIRA Projects</Link>
          <Link href="/confluence" className="btn btn-outline focus-ring inline-flex">Confluence Pages</Link>
        </div>
      </section>
    </div>
  );
}
