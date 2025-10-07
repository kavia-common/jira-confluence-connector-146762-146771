'use client';

import React from 'react';
import Link from 'next/link';

/**
 * PUBLIC_INTERFACE
 * Custom Not Found page that is compatible with static export.
 * This page is rendered for unknown routes and avoids importing any server-only modules.
 */
export default function NotFoundPage() {
  return (
    <main className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8">
      <h1 className="text-2xl font-semibold mb-2">Page not found</h1>
      <p className="text-gray-600 mb-6">
        The page you are looking for could not be found.
      </p>
      <Link href="/" className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">
        Go to Dashboard
      </Link>
    </main>
  );
}
