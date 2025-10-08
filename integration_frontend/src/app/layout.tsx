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
      <body suppressHydrationWarning>
        <Topbar />
        <div className="layout">
          <Sidebar />
          <main className="p-4 overflow-y-auto">{children}</main>
        </div>
      </body>
    </html>
  );
}
