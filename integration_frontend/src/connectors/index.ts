"use client";

import type { ConnectorAdapter, ConnectorPrefix } from "./types";
import jiraConnector from "./jira";
import confluenceConnector from "./confluence";

export const CONNECTORS: ConnectorAdapter[] = [jiraConnector, confluenceConnector];

export const CONNECTOR_PREFIX_MAP: Record<ConnectorPrefix, ConnectorAdapter> = {
  "@jira_": jiraConnector,
  "@confluence_": confluenceConnector,
};

export const CONNECTOR_ID_MAP: Record<ConnectorAdapter["id"], ConnectorAdapter> = {
  jira: jiraConnector,
  confluence: confluenceConnector,
};

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export interface TriggerParseResult {
  adapter: ConnectorAdapter;
  query: string;
  start: number; // start index of the trigger in the source text
}

/**
 * PUBLIC_INTERFACE
 * parseTriggerAtCaret
 * Parse an active connector trigger at the caret position.
 * Recognizes `@jira_` and `@confluence_` prefixes and returns the adapter and query fragment.
 *
 * Examples:
 *   "Check @jira_ABC-12"  -> query "ABC-12"
 *   "Link @confluence_Project" -> query "Project"
 */
export function parseTriggerAtCaret(
  text: string,
  caret: number
): TriggerParseResult | null {
  const head = text.slice(0, Math.max(0, caret));

  let bestMatch: TriggerParseResult | null = null;

  for (const adapter of CONNECTORS) {
    const idx = head.lastIndexOf(adapter.prefix);
    if (idx < 0) continue;
    // ensure token boundary before prefix (start of string or whitespace)
    const before = idx === 0 ? " " : head.charAt(idx - 1);
    if (idx > 0 && !/\s/.test(before)) continue;

    const fragment = head.slice(idx); // starts with prefix and ends at caret
    const re = new RegExp(`^${escapeRegExp(adapter.prefix)}([^\\s]*)$`);
    const m = fragment.match(re);
    if (!m) continue;

    const query = m[1] || "";
    const candidate: TriggerParseResult = { adapter, query, start: idx };
    if (!bestMatch || idx > bestMatch.start) {
      bestMatch = candidate;
    }
  }

  return bestMatch;
}
