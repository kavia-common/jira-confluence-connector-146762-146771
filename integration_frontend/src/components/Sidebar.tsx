"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { buildBackendUrl } from "@/lib/api";

const NavItem = ({ href, label, icon }: { href: string; label: string; icon?: React.ReactNode }) => {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      className={`transition-base flex items-center gap-2 px-3 py-2.5 rounded-md aria-[current=page]:bg-white hover:bg-white ${isActive ? "bg-white shadow" : "bg-transparent"}`}
      aria-current={isActive ? "page" : undefined}
    >
      {icon}
      <span className={`text-sm leading-6 ${isActive ? "text-primary" : "text-gray-700"}`}>{label}</span>
    </Link>
  );
};

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="mb-6">
        <div className="text-xs uppercase tracking-wide text-gray-500 mb-3">Navigation</div>
        <div className="flex flex-col gap-2">
          <NavItem href="/" label="Overview" />
          {/* These routes are implemented under app/jira, app/confluence, app/connect */}
          <NavItem href="/jira" label="JIRA Projects" />
          <NavItem href="/confluence" label="Confluence Pages" />
          <NavItem href="/connect" label="Connect Accounts" />
        </div>
      </div>
      <div className="mt-8">
        <div className="text-xs uppercase tracking-wide text-gray-500 mb-3">Links</div>
        <a
          className="text-sm leading-6 text-primary hover:underline"
          href={buildBackendUrl("/docs")}
          target="_blank"
          rel="noreferrer"
        >
          API Docs
        </a>
      </div>
    </aside>
  );
}
