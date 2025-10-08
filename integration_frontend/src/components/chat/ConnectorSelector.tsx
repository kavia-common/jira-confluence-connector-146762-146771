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
 * - Keyboard navigation (↑/↓/Enter/Tab/Escape)
 * - Emits a standardized StructuredReference on selection
 * - Accessible with ARIA attributes and live status updates
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
  listboxId,
  onActiveDescendantChange,
}: {
  // Accept both RefObject and MutableRefObject by using a minimal structural type.
  textareaRef: { current: HTMLTextAreaElement | null };
  connector: ConnectorAdapter;
  queryText: string;
  onSelect: (ref: StructuredReference, picked: ConnectorSearchItem) => void;
  onClose: () => void;
  /** DOM id used by the listbox for aria-controls from the textarea */
  listboxId: string;
  /** Callback to update aria-activedescendant on the textarea */
  onActiveDescendantChange?: (id: string | null) => void;
}) {
  const debouncedQuery = useDebounced(queryText, 250);
  const [items, setItems] = useState<ConnectorSearchItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const abortRef = useRef<AbortController | null>(null);
  const [position, setPosition] = useState<{ left: number; top: number } | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);

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

  // Outside click closes the selector
  useEffect(() => {
    function onDocMouseDown(ev: MouseEvent) {
      const target = ev.target as Node | null;
      const withinOverlay = overlayRef.current?.contains(target as Node) ?? false;
      const withinTextarea = textareaRef.current?.contains(target as Node) ?? false;
      if (!withinOverlay && !withinTextarea) {
        onClose();
      }
    }
    document.addEventListener("mousedown", onDocMouseDown, { capture: true });
    return () => document.removeEventListener("mousedown", onDocMouseDown, { capture: true });
  }, [onClose, textareaRef]);

  // Keyboard navigation and commit
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
      if (e.key === "Enter" || e.key === "Tab") {
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

  // Keep aria-activedescendant synced
  useEffect(() => {
    if (!items.length) {
      onActiveDescendantChange?.(null);
      return;
    }
    const id = `${listboxId}-option-${Math.max(0, Math.min(activeIndex, items.length - 1))}`;
    onActiveDescendantChange?.(id);
  }, [activeIndex, items.length, listboxId, onActiveDescendantChange]);

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
    <div
      ref={overlayRef}
      className="connector-overlay"
      style={style}
      role="listbox"
      id={listboxId}
      aria-label={`${connector.displayName} results`}
      aria-busy={loading ? "true" : "false"}
    >
      <div className="connector-header">
        <div className="connector-title">{connector.displayName} • Suggestions</div>
        <div className="connector-help">↑/↓ to navigate • Enter/Tab select • Esc close</div>
      </div>

      {loading ? (
        <div className="connector-empty" role="status" aria-live="polite">
          <span className="connector-spinner" aria-hidden="true" /> Searching…
        </div>
      ) : error ? (
        <div className="connector-error" role="alert" aria-live="assertive">
          {error}
        </div>
      ) : !items.length ? (
        <div className="connector-empty" role="status" aria-live="polite">
          No results for “{debouncedQuery || "…"}”.
        </div>
      ) : (
        <div className="connector-list">
          {items.map((item, idx) => (
            <ConnectorSuggestionItem
              key={`${item.id}-${idx}`}
              idAttr={`${listboxId}-option-${idx}`}
              item={item}
              isActive={idx === activeIndex}
              onMouseEnter={() => setActiveIndex(idx)}
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
