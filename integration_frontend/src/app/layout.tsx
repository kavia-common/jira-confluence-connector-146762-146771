import type { Metadata } from "next";
import "./globals.css";
import Topbar from "@/components/Topbar";
import Sidebar from "@/components/Sidebar";
import { AuthProvider } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Jira–Confluence Integration",
  description: "Dashboard to connect and interact with JIRA and Confluence",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AuthProvider>
          <Topbar />
          <div className="layout">
            <Sidebar />
            <main className="p-4 overflow-y-auto">{children}</main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
