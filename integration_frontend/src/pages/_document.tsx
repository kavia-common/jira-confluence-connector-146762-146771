/**
 * PUBLIC_INTERFACE
 * Minimal custom Document for legacy pages directory.
 * Note: In a primarily App Router app with "output: export", providing a lightweight
 * functional Document avoids SSR runtime chunk lookups that can fail during export.
 */
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
