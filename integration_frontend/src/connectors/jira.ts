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
export const jiraConnector: ConnectorAdapter = {
  id: "jira",
  prefix: "@jira_",
  displayName: "Jira",
  async search(query: string, options?: SearchOptions): Promise<ConnectorSearchItem[]> {
    return searchConnector("jira", query, {
      limit: options?.limit ?? 10,
      filters: options?.filters,
      signal: options?.signal,
    });
  },
  async quickCreate(payload: QuickCreatePayload): Promise<ConnectorCreateResult> {
    // Minimal stub wired to backend POST /connectors/jira/create
    return quickCreateConnector("jira", payload);
  },
};

export default jiraConnector;
