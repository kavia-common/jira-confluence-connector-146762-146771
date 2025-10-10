import type { Metadata } from "next";
import "./globals.css";
import Topbar from "@/components/Topbar";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Jira–Confluence Integration",
  description: "Dashboard to connect and interact with JIRA and Confluence",
};

/**
 * RootLayout renders the public app shell without any authentication wrappers.
 * Applies consistent responsive paddings for page content.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Topbar />
        <div className="layout">
          <Sidebar />
          <main className="overflow-y-auto">
            <div className="container mx-auto px-6 md:px-8 lg:px-10 py-6 md:py-8">
              <div className="space-y-6">{children}</div>
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
