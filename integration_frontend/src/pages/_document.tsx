import Document, { Html, Head, Main, NextScript, DocumentContext } from "next/document";

/**
 * PUBLIC_INTERFACE
 * Custom Document to satisfy Next.js build requirements in hybrid appDir setup.
 * Provides the basic HTML structure for SSR-rendered pages.
 */
export default class MyDocument extends Document {
  // PUBLIC_INTERFACE
  static async getInitialProps(ctx: DocumentContext) {
    /** Retrieve initial document props */
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
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
}
