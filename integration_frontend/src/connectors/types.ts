"use client";

/**
 * Shared connector types for frontend integration.
 * These match the normalized backend schemas (SearchResultItem, CreateResult) and
 * provide a standard interface for the connector SDK.
 */

export type ConnectorId = "jira" | "confluence";
export type ConnectorPrefix = "@jira_" | "@confluence_";

/** Normalized search result item (aligned with backend SearchResultItem) */
export interface ConnectorSearchItem {
  id: string;
  title: string;
  url: string;
  type: string;
  icon?: string | null;
  snippet?: string | null;
  metadata: Record<string, unknown>;
}

/** Create result (aligned with backend CreateResult) */
export interface ConnectorCreateResult {
  id: string;
  url?: string | null;
  title?: string | null;
  metadata: Record<string, unknown>;
}

/** Structured reference emitted by selector UI back to chat input */
export interface StructuredReference {
  connector: ConnectorId;
  type: string;
  id: string;
  title: string;
  url: string;
  meta: Record<string, unknown>;
}

/** Adapter options for search calls */
export interface SearchOptions {
  limit?: number;
  signal?: AbortSignal;
  filters?: Record<string, unknown>;
}

/** Quick create payload. Shape is connector-specific; kept generic. */
export type QuickCreatePayload = Record<string, unknown>;

// PUBLIC_INTERFACE
export interface ConnectorAdapter {
  /** Stable connector id used for routing to backend endpoints */
  id: ConnectorId;
  /** Trigger prefix used in chat input to invoke selector */
  prefix: ConnectorPrefix;
  /** Human friendly display name */
  displayName: string;

  /**
   * Search connector resources using backend normalized endpoint.
   * @param query Text fragment to search for
   * @param options Optional limit, filters, abort signal
   */
  search(query: string, options?: SearchOptions): Promise<ConnectorSearchItem[]>;

  /**
   * Optionally create a resource on the connector (scaffold/stub by default).
   * @param payload Arbitrary connector-specific payload
   */
  quickCreate?(payload: QuickCreatePayload): Promise<ConnectorCreateResult>;
}
