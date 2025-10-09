import { Html, Head, Main, NextScript } from "next/document";

/**
 * PUBLIC_INTERFACE
 * Document
 * Minimal Next.js Pages Router Document to satisfy environments expecting /_document.
 * This does not interfere with the App Router; it simply ensures the build can
 * resolve the /_document module when the runtime probes for it.
 */
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
