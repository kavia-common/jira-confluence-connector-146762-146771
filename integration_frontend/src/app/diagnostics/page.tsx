'use client';

import React from 'react';
import { checkBackendConnectivity } from '@/lib/connectivity';
import CorsLink from './_components/CorsLink';

export default function DiagnosticsPage() {
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<Awaited<ReturnType<typeof checkBackendConnectivity>> | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const run = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await checkBackendConnectivity();
      setResult(res);
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    // auto-run on mount to surface status quickly
    run();
  }, []);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Diagnostics: Backend Connectivity</h1>
      <p className="text-sm text-gray-600">
        Uses NEXT_PUBLIC_BACKEND_URL through url.ts to contact the FastAPI backend. Tries /health then /.
      </p>
      <CorsLink />
      <div className="flex items-center gap-2">
        <button
          onClick={run}
          disabled={loading}
          className="px-3 py-2 rounded bg-blue-600 text-white disabled:bg-gray-400"
        >
          {loading ? 'Checking…' : 'Re-run check'}
        </button>
        {result && (
          <span className={`text-sm ${result.overallOk ? 'text-green-600' : 'text-red-600'}`}>
            Overall: {result.overallOk ? 'Healthy' : 'Unreachable'}
          </span>
        )}
      </div>

      {error && (
        <div className="p-3 rounded bg-red-50 text-red-700 text-sm">
          Error running diagnostics: {error}
        </div>
      )}

      {result && (
        <div className="space-y-2">
          <div className="text-sm">
            <span className="font-medium">Backend URL:</span> {result.backendUrl}
          </div>
          <div className="text-sm">
            <span className="font-medium">Attempted:</span>
            <ul className="list-disc ml-6">
              {result.attempted.map((u) => (
                <li key={u} className="break-all">{u}</li>
              ))}
            </ul>
          </div>
          <div className="text-sm">
            <span className="font-medium">Results:</span>
            <ul className="list-disc ml-6 space-y-2">
              {result.results.map((r, idx) => (
                <li key={idx} className="break-all">
                  <div><span className="font-medium">Path:</span> {r.path}</div>
                  <div><span className="font-medium">OK:</span> {String(r.ok)}</div>
                  {typeof r.status !== 'undefined' && (
                    <div><span className="font-medium">HTTP Status:</span> {r.status}</div>
                  )}
                  {r.responseUrl && (
                    <div><span className="font-medium">Response URL:</span> {r.responseUrl}</div>
                  )}
                  {r.headers && (
                    <div className="text-gray-700">
                      <span className="font-medium">Response headers (selected):</span>
                      <ul className="list-disc ml-6">
                        {Object.entries(r.headers).map(([k, v]) => (
                          <li key={k}><span className="font-medium">{k}:</span> {String(v)}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {r.payloadSnippet && (
                    <div className="text-gray-700">
                      <span className="font-medium">Payload snippet:</span>
                      <pre className="whitespace-pre-wrap bg-gray-50 p-2 rounded border">{r.payloadSnippet}</pre>
                    </div>
                  )}
                  {r.error && (
                    <div className="text-red-700">
                      <span className="font-medium">Error:</span> {r.error}
                    </div>
                  )}
                  {r.corsLikely && (
                    <div className="text-amber-700">
                      CORS likely issue detected. Ensure backend allows Origin from the frontend host and includes
                      appropriate Access-Control-Allow-Origin headers.
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
          {!result.overallOk && (
            <div className="p-3 rounded bg-yellow-50 text-yellow-800 text-sm">
              Troubleshooting:
              <ul className="list-disc ml-6">
                <li>Verify the backend is running and reachable on http://localhost:3001.</li>
                <li>Confirm NEXT_PUBLIC_BACKEND_URL is set in the frontend environment and matches the backend public URL.</li>
                <li>If you see CORS-related errors, update backend CORS settings to allow requests from your frontend origin.</li>
                <li>Fallback endpoint attempts include /health and / — ensure at least one exists.</li>
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
