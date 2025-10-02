"use client";

import React, { useState } from "react";
import { issueToken } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import FeedbackAlert from "@/components/FeedbackAlert";

export default function LoginPage() {
  const { setAuth, isAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);
    try {
      const token = await issueToken({ email, display_name: displayName || null });
      setAuth(token);
      setFeedback({ type: "success", msg: "Signed in successfully." });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to sign in";
      setFeedback({ type: "error", msg: message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="card p-5 gradient-surface">
        <h2 className="text-lg font-semibold mb-1">Sign in</h2>
        <p className="text-sm text-gray-600 mb-3">
          Enter your email. This demo issues a temporary token.
        </p>

        {feedback && (
          <div className="mb-3">
            <FeedbackAlert type={feedback.type} message={feedback.msg} onClose={() => setFeedback(null)} />
          </div>
        )}

        {isAuthenticated && (
          <div className="mb-3">
            <FeedbackAlert type="success" message="You are already signed in." />
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="label" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-required="true"
            />
          </div>
          <div>
            <label className="label" htmlFor="displayName">Display name (optional)</label>
            <input
              id="displayName"
              type="text"
              className="input"
              placeholder="Your name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </div>
          <button className="btn btn-primary focus-ring w-full" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
