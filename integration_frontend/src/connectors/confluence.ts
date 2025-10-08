"use client";

import type {
  ConnectorAdapter,
  ConnectorSearchItem,
  ConnectorCreateResult,
  SearchOptions,
  QuickCreatePayload,
} from "./types";
import { searchConnector, quickCreateConnector } from "@/lib/connectorsClient";

// PUBLIC_INTERFACE
export const confluenceConnector: ConnectorAdapter = {
  id: "confluence",
  prefix: "@confluence_",
  displayName: "Confluence",
  async search(query: string, options?: SearchOptions): Promise<ConnectorSearchItem[]> {
    return searchConnector("confluence", query, {
      limit: options?.limit ?? 10,
      filters: options?.filters,
      signal: options?.signal,
    });
  },
  async quickCreate(payload: QuickCreatePayload): Promise<ConnectorCreateResult> {
    // Minimal stub wired to backend POST /connectors/confluence/create
    return quickCreateConnector("confluence", payload);
  },
};

export default confluenceConnector;
