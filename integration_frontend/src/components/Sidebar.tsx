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
      className={`transition-base flex items-center gap-4 px-4 py-6 rounded-lg text-sm font-medium ${
        isActive ? "bg-white text-primary shadow-md" : "hover:bg-white/20"
      } focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-1`}
      aria-current={isActive ? "page" : undefined}
    >
      {label}
    </Link>
  );
};

/**
 * PUBLIC_INTERFACE
 * Sidebar - Main navigation sidebar with enhanced spacing and gradient background
 * Note: Do not force nav item text colors; keep only gradient background and spacing.
 */
export default function Sidebar() {
  return (
    <aside className="sidebar overflow-y-auto bg-gradient-to-b from-blue-500/15 via-blue-600/10 to-amber-100/20">
      <nav className="pt-6 pb-8 space-y-5">
        <div className="text-xs font-semibold uppercase tracking-wider mb-4 px-4 opacity-70">
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
