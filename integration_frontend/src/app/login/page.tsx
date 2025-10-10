"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import FeedbackAlert from "@/components/FeedbackAlert";
import { fetchCsrfToken, loginWithCredentials } from "@/lib/auth";

/**
 * PUBLIC_INTERFACE
 * LoginPage
 * UI for demo username/password login. CSRF token is fetched and held in state only,
 * never rendered or logged. On submit, the token is sent in X-CSRF-Token header.
 *
 * Behavior:
 * - On mount, prefetch CSRF.
 * - Submit via fetch; on success redirect to "/".
 * - No console.log of CSRF or auth state.
 */
export default function LoginPage() {
  const router = useRouter();
  const [csrf, setCsrf] = useState<string>("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string>("");

  // Prefetch CSRF token
  useEffect(() => {
    let mounted = true;
    fetchCsrfToken()
      .then((t) => {
        if (mounted) setCsrf(t);
      })
      .catch((e) => {
        // Show generic error; do not leak token/state.
        setError(e?.message || "Unable to initialize login.");
      });
    return () => {
      mounted = false;
    };
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setPending(true);
    try {
      const res = await loginWithCredentials({ email, password, csrf });
      // Redirect to root if ok, or to provided redirectUrl.
      router.replace(res.redirectUrl || "/");
    } catch (err) {
      setPending(false);
      const msg = err instanceof Error ? err.message : "Login failed.";
      setError(msg);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="card p-6">
        <h1 className="text-xl font-semibold mb-1">Sign in</h1>
        <p className="text-sm text-gray-600 mb-4">
          Enter your credentials to continue.
        </p>

        {error ? <FeedbackAlert type="error" message={error} onClose={() => setError("")} /> : null}

        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          {/* Hidden CSRF input is optional if the backend expects the header only.
              We keep it to support traditional form backends while still sending a header in JS. */}
          <input type="hidden" name="csrf" value={csrf} readOnly />

          <div>
            <label htmlFor="email" className="label">Email</label>
            <input
              id="email"
              className="input"
              type="email"
              name="email"
              autoComplete="username"
              inputMode="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-required="true"
            />
          </div>

          <div>
            <label htmlFor="password" className="label">Password</label>
            <input
              id="password"
              className="input"
              type="password"
              name="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              aria-required="true"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary focus-ring w-full"
            disabled={pending || !csrf}
            aria-busy={pending ? "true" : "false"}
          >
            {pending ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
