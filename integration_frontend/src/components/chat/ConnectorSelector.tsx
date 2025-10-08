"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import type {
  ConnectorAdapter,
  ConnectorSearchItem,
  StructuredReference,
} from "@/connectors/types";
import ConnectorSuggestionItem from "./ConnectorSuggestionItem";

/**
 * A lightweight overlay selector anchored to the caret inside a textarea.
 * - Debounced search
 * - Keyboard navigation (↑/↓/Enter/Escape)
 * - Emits a standardized StructuredReference on selection
 */

function useDebounced<T>(value: T, delay = 250): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

function computeCaretRect(textarea: HTMLTextAreaElement) {
  // Mirror technique to approximate caret coordinates
  const style = window.getComputedStyle(textarea);
  const div = document.createElement("div");
  div.style.whiteSpace = "pre-wrap";
  div.style.wordWrap = "break-word";
  div.style.position = "absolute";
  div.style.visibility = "hidden";
  div.style.zIndex = "-1000";
  div.style.top = "0";
  div.style.left = "-9999px";

  // Copy styles that affect layout
  const props = [
    "fontFamily",
    "fontSize",
    "fontWeight",
    "fontStyle",
    "letterSpacing",
    "textTransform",
    "textAlign",
    "lineHeight",
    "paddingTop",
    "paddingRight",
    "paddingBottom",
    "paddingLeft",
    "borderTopWidth",
    "borderRightWidth",
    "borderBottomWidth",
    "borderLeftWidth",
    "boxSizing",
    "width",
  ] as const;

  for (const p of props) {
    const v = (style as unknown as Record<string, string | undefined>)[p];
    if (v) {
      (div.style as unknown as Record<string, string | undefined>)[p] = v;
    }
  }

  div.textContent = textarea.value.substring(0, textarea.selectionStart ?? 0);

  const span = document.createElement("span");
  // Zero-width space to ensure rect is measurable
  span.textContent = "\u200b";
  div.appendChild(span);

  document.body.appendChild(div);
  const rectDiv = div.getBoundingClientRect();
  const rectSpan = span.getBoundingClientRect();
  document.body.removeChild(div);

  // Translate mirror rects to textarea coordinates
  const textareaRect = textarea.getBoundingClientRect();
  const caretLeft = Math.min(rectSpan.left - rectDiv.left + textareaRect.left, textareaRect.right);
  const caretTop = Math.min(rectSpan.top - rectDiv.top + textareaRect.top, textareaRect.bottom);

  return {
    left: caretLeft,
    top: caretTop,
    height: parseFloat(style.lineHeight || "16") || 16,
  };
}

// PUBLIC_INTERFACE
export default function ConnectorSelector({
  textareaRef,
  connector,
  queryText,
  onSelect,
  onClose,
}: {
  // Accept both RefObject and MutableRefObject by using a minimal structural type.
  textareaRef: { current: HTMLTextAreaElement | null };
  connector: ConnectorAdapter;
  queryText: string;
  onSelect: (ref: StructuredReference, picked: ConnectorSearchItem) => void;
  onClose: () => void;
}) {
  const debouncedQuery = useDebounced(queryText, 250);
  const [items, setItems] = useState<ConnectorSearchItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const abortRef = useRef<AbortController | null>(null);
  const [position, setPosition] = useState<{ left: number; top: number } | null>(null);

  // Compute anchor position next to caret
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    const rect = computeCaretRect(el);
    // Offset slightly below the caret
    const top = rect.top + rect.height + 6 + window.scrollY;
    const left = rect.left + window.scrollX;
    setPosition({ top, left });
  }, [textareaRef, debouncedQuery, queryText, items.length]);

  // Debounced search
  useEffect(() => {
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    setLoading(true);
    setError(null);

    connector
      .search(debouncedQuery, { limit: 10, signal: ctrl.signal })
      .then((res) => {
        setItems(res || []);
        setActiveIndex(0);
      })
      .catch((e) => {
        if (ctrl.signal.aborted) return;
        setError(e?.message || "Search failed");
      })
      .finally(() => setLoading(false));

    return () => ctrl.abort();
  }, [connector, debouncedQuery]);

  // Keyboard navigation
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => (items.length ? Math.min(i + 1, items.length - 1) : 0));
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => (items.length ? Math.max(i - 1, 0) : 0));
        return;
      }
      if (e.key === "Enter") {
        if (!items.length) return;
        e.preventDefault();
        const picked = items[Math.max(0, Math.min(activeIndex, items.length - 1))];
        onSelect(
          {
            connector: connector.id,
            id: picked.id,
            title: picked.title,
            type: picked.type,
            url: picked.url,
            meta: picked.metadata || {},
          },
          picked
        );
        return;
      }
    }

    window.addEventListener("keydown", onKeyDown, { capture: true });
    return () => window.removeEventListener("keydown", onKeyDown, { capture: true });
  }, [items, activeIndex, connector, onSelect, onClose]);

  const style = useMemo<React.CSSProperties>(() => {
    if (!position) return { display: "none" };
    // Keep within viewport bounds
    const maxLeft = Math.max(8, Math.min(position.left, window.innerWidth - 520));
    return {
      position: "absolute",
      top: position.top,
      left: maxLeft,
    };
  }, [position]);

  return (
    <div className="connector-overlay" style={style} role="listbox" aria-label={`${connector.displayName} results`}>
      <div className="connector-header">
        <div className="connector-title">{connector.displayName} • Suggestions</div>
        <div className="connector-help">↑/↓ to navigate • Enter select • Esc close</div>
      </div>

      {loading ? (
        <div className="connector-empty">Searching…</div>
      ) : error ? (
        <div className="connector-error">{error}</div>
      ) : !items.length ? (
        <div className="connector-empty">No results for “{debouncedQuery || "…" }”.</div>
      ) : (
        <div className="connector-list">
          {items.map((item, idx) => (
            <ConnectorSuggestionItem
              key={`${item.id}-${idx}`}
              item={item}
              isActive={idx === activeIndex}
              onClick={() =>
                onSelect(
                  {
                    connector: connector.id,
                    id: item.id,
                    title: item.title,
                    type: item.type,
                    url: item.url,
                    meta: item.metadata || {},
                  },
                  item
                )
              }
              providerInitial={connector.id === "jira" ? "J" : "C"}
            />
          ))}
        </div>
      )}
    </div>
  );
}
