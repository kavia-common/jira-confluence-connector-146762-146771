"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * PUBLIC_INTERFACE
 * NavItem - Individual navigation link with active state
 */
const NavItem = ({ href, label }: { href: string; label: string }) => {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      className={`transition-base flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium ${
        isActive
          ? "bg-white text-primary shadow-sm"
          : "text-gray-700 hover:bg-white/60 hover:text-gray-900"
      }`}
      aria-current={isActive ? "page" : undefined}
    >
      {label}
    </Link>
  );
};

/**
 * PUBLIC_INTERFACE
 * Sidebar - Main navigation sidebar
 */
export default function Sidebar() {
  return (
    <aside className="sidebar overflow-y-auto">
      <nav className="space-y-1">
        <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3 px-3">
          Navigation
        </div>
        <NavItem href="/" label="Overview" />
        <NavItem href="/jira" label="JIRA Projects" />
        <NavItem href="/confluence" label="Confluence Pages" />
        <NavItem href="/connect" label="Connect Accounts" />
      </nav>
    </aside>
  );
}
