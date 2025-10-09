"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * PUBLIC_INTERFACE
 * NavItem - Individual navigation link with active state and enhanced spacing
 */
const NavItem = ({ href, label }: { href: string; label: string }) => {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      className={`transition-base flex items-center gap-4 px-3 py-5 rounded-lg text-sm font-medium ${
        isActive
          ? "bg-white text-primary shadow-md"
          : "text-white hover:bg-white/20 hover:text-white"
      }`}
      aria-current={isActive ? "page" : undefined}
    >
      {label}
    </Link>
  );
};

/**
 * PUBLIC_INTERFACE
 * Sidebar - Main navigation sidebar with enhanced spacing and gradient background
 */
export default function Sidebar() {
  return (
    <aside className="sidebar overflow-y-auto bg-gradient-to-b from-blue-500/15 via-blue-600/10 to-amber-100/20">
      <nav className="pt-6 pb-8 space-y-4">
        <div className="text-xs font-semibold uppercase tracking-wider text-white/80 mb-4 px-3">
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
