"use client";

import React, { useState } from "react";
import { connectJira, connectConfluence } from "@/lib/api";
import FeedbackAlert from "@/components/FeedbackAlert";
import { useAuth } from "@/lib/auth";

function ConnectForm({
  provider,
  onSubmit,
}: {
  provider: "JIRA" | "Confluence";
  // Accept any promise result since UI doesn't use the return value
  onSubmit: (data: { base_url: string; access_token: string }) => Promise<unknown>;
}) {
  const [baseUrl, setBaseUrl] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);
    try {
      await onSubmit({ base_url: baseUrl, access_token: token });
      setFeedback({ type: "success", msg: `${provider} connection saved.` });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to save connection.";
      setFeedback({ type: "error", msg: message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-4">
      <h3 className="text-sm font-semibold mb-2">{provider} Connection</h3>
      {feedback && (
        <div className="mb-3">
          <FeedbackAlert type={feedback.type} message={feedback.msg} onClose={() => setFeedback(null)} />
        </div>
      )}
      <form className="space-y-3" onSubmit={handleSubmit}>
        <div>
          <label className="label" htmlFor={`base_${provider}`}>Base URL</label>
          <input
            id={`base_${provider}`}
            className="input"
            placeholder={`https://your-${provider.toLowerCase()}.domain`}
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            required
            aria-required="true"
          />
        </div>
        <div>
          <label className="label" htmlFor={`token_${provider}`}>Access Token / API Key</label>
          <input
            id={`token_${provider}`}
            className="input"
            placeholder="Token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            required
            aria-required="true"
          />
        </div>
        <button className="btn btn-amber focus-ring" type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Connection"}
        </button>
      </form>
    </div>
  );
}

export default function ConnectPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="max-w-screen-lg mx-auto">
      {!isAuthenticated && (
        <div className="mb-4">
          <FeedbackAlert type="error" message="You must sign in before connecting providers." />
        </div>
      )}
      <div className="grid md:grid-cols-2 gap-4">
        <ConnectForm provider="JIRA" onSubmit={(data) => connectJira(data)} />
        <ConnectForm provider="Confluence" onSubmit={(data) => connectConfluence(data)} />
      </div>
    </div>
  );
}
