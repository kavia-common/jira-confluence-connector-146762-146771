import type { Metadata } from "next";
import "./globals.css";
import "@/styles/connector.css";
import Topbar from "@/components/Topbar";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Jira–Confluence Integration",
  description: "Dashboard to connect and interact with JIRA and Confluence",
};

/**
 * RootLayout renders the public app shell without any authentication wrappers.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-ocean-bg text-ocean-text" suppressHydrationWarning>
        <Topbar />
        <div className="layout">
          <Sidebar />
          <main className="overflow-y-auto">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
