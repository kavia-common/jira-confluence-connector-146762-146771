'use client';

import React from 'react';
import { fetchWithCorsDebug, getAuthStatusWithCors } from '@/lib/corsDiagnostics';
import { getBackendBaseUrl } from '@/lib/url';

type HealthDebug = Awaited<ReturnType<typeof fetchWithCorsDebug>>;
type AuthDebug = Awaited<ReturnType<typeof getAuthStatusWithCors>>;

export default function CorsDiagnosticsPage() {
  const [health, setHealth] = React.useState<HealthDebug | null>(null);
  const [auth, setAuth] = React.useState<AuthDebug | null>(null);
  const [loading, setLoading] = React.useState(false);

  const run = async () => {
    setLoading(true);
    try {
      const h = await fetchWithCorsDebug('/health');
      const a = await getAuthStatusWithCors();
      setHealth(h);
      setAuth(a);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    run();
  }, []);

  const frontendOrigin = typeof window !== 'undefined' ? window.location.origin : '(ssr)';
  const backendBase = getBackendBaseUrl() || '(same-origin)';

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-semibold">CORS Diagnostics</h1>

      <div className="rounded-md border p-4 bg-white">
        <div className="font-medium mb-2">Environment</div>
        <div className="text-sm">
          <div>Frontend origin: <code>{frontendOrigin}</code></div>
          <div>NEXT_PUBLIC_BACKEND_URL (normalized): <code>{backendBase}</code></div>
        </div>
        <button
          onClick={run}
          disabled={loading}
          className="mt-3 px-3 py-2 rounded bg-blue-600 text-white disabled:bg-gray-400"
        >
          {loading ? 'Checking…' : 'Re-run checks'}
        </button>
      </div>

      <div className="rounded-md border p-4 bg-white">
        <div className="font-medium mb-2">Health Check GET /health (with credentials)</div>
        <pre className="text-sm whitespace-pre-wrap">{JSON.stringify(health, null, 2)}</pre>
      </div>

      <div className="rounded-md border p-4 bg-white">
        <div className="font-medium mb-2">Auth Status GET /auth/status (with credentials)</div>
        <pre className="text-sm whitespace-pre-wrap">{JSON.stringify(auth, null, 2)}</pre>
      </div>

      <div className="text-xs text-gray-500">
        Expected:
        <ul className="list-disc ml-5 mt-1">
          <li>Access-Control-Allow-Origin should echo the frontend origin.</li>
          <li>Access-Control-Allow-Credentials should be &quot;true&quot;.</li>
          <li>Requests are sent with credentials: &quot;include&quot;.</li>
          <li>On OAuth redirects (3xx), CORS headers should still be present.</li>
        </ul>
      </div>
    </div>
  );
}
