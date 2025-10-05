import type { AppProps } from "next/app";

/**
 * PUBLIC_INTERFACE
 * Minimal custom App wrapper for legacy pages routing. Kept intentionally simple.
 */
export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
