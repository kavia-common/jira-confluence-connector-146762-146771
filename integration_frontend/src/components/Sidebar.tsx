"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NavItem = ({ href, label, icon }: { href: string; label: string; icon?: React.ReactNode }) => {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      className={`transition-base flex items-center gap-2 px-3 py-2 rounded-md aria-[current=page]:bg-white hover:bg-white ${isActive ? "bg-white shadow" : "bg-transparent"}`}
      aria-current={isActive ? "page" : undefined}
    >
      {icon}
      <span className={`text-sm ${isActive ? "text-primary" : "text-gray-700"}`}>{label}</span>
    </Link>
  );
};

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="mb-4">
        <div className="text-xs uppercase tracking-wide text-gray-500 mb-2">Navigation</div>
        <div className="flex flex-col gap-1">
          <NavItem href="/" label="Overview" />
          <NavItem href="/jira" label="JIRA Projects" />
          <NavItem href="/confluence" label="Confluence Pages" />
          <NavItem href="/connect" label="Connect Accounts" />
        </div>
      </div>
      <div className="mt-6">
        <div className="text-xs uppercase tracking-wide text-gray-500 mb-2">Links</div>
        <a
          className="text-sm text-primary hover:underline"
          href="https://vscode-internal-14593-beta.beta01.cloud.kavia.ai:3001/docs"
          target="_blank"
          rel="noreferrer"
        >
          API Docs
        </a>
      </div>
    </aside>
  );
}
