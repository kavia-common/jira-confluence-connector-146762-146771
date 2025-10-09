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
 * Applies Ocean Professional global background gradient and container spacing.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className="min-h-screen bg-gradient-to-b from-blue-500/10 via-gray-50 to-white"
      >
        <Topbar />
        <div className="layout">
          <Sidebar />
          <main className="w-full overflow-y-auto">
            <div className="max-w-7xl mx-auto pt-12 pb-16 px-6 md:px-10 lg:px-16 space-y-12 md:space-y-16">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
