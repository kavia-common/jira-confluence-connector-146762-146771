"use client";

import React from "react";
import type { ConnectorSearchItem } from "@/connectors/types";

export default function ConnectorSuggestionItem({
  item,
  isActive,
  onClick,
  providerInitial,
}: {
  item: ConnectorSearchItem;
  isActive?: boolean;
  onClick?: () => void;
  providerInitial: string;
}) {
  return (
    <div
      role="option"
      aria-selected={!!isActive}
      className={`connector-item ${isActive ? "active" : ""}`}
      onClick={onClick}
    >
      <div className="connector-icon" aria-hidden>
        {providerInitial}
      </div>
      <div className="connector-main">
        <div className="connector-title-line">{item.title}</div>
        <div className="connector-subtitle">
          {item.snippet || item.url}
        </div>
      </div>
      <div className="connector-type">{item.type}</div>
    </div>
  );
}
