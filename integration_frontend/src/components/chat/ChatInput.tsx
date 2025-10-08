"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import ConnectorSelector from "./ConnectorSelector";
import { parseTriggerAtCaret } from "@/connectors";
import type { StructuredReference } from "@/connectors/types";

/**
 * PUBLIC_INTERFACE
 * ChatInput
 * A minimal chat input with support for connector typeahead triggers:
 * - Type @jira_ or @confluence_ followed by a query fragment to open the selector.
 * - Arrow keys navigate, Enter/Tab selects, Escape closes.
 * - On selection, a text token is inserted and onReferenceSelected is called with a structured object.
 * - Selected references are displayed below as chips with accessible remove actions.
 */
export default function ChatInput({
  placeholder = "Type a message… Use @jira_ or @confluence_ to reference items.",
  onReferenceSelected,
  className,
}: {
  placeholder?: string;
  onReferenceSelected?: (ref: StructuredReference) => void;
  className?: string;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [value, setValue] = useState("");
  const [caret, setCaret] = useState(0);
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [trigger, setTrigger] = useState<ReturnType<typeof parseTriggerAtCaret>>(null);
  const [selectedRefs, setSelectedRefs] = useState<StructuredReference[]>([]);
  const [activeDescId, setActiveDescId] = useState<string | null>(null);
  const uid = useId();
  const listboxId = `connector-listbox-${uid}`;

  // Update caret on interactions
  const syncCaret = () => {
    const el = textareaRef.current;
    if (!el) return;
    setCaret(el.selectionStart || 0);
  };

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    const onClick = () => syncCaret();
    const onKeyup = () => syncCaret();
    el.addEventListener("click", onClick);
    el.addEventListener("keyup", onKeyup);
    return () => {
      el.removeEventListener("click", onClick);
      el.removeEventListener("keyup", onKeyup);
    };
  }, []);

  // Detect triggers when caret or value changes
  useEffect(() => {
    const t = parseTriggerAtCaret(value, caret);
    setTrigger(t);
    setSelectorOpen(!!t);
    // If closing the selector, reset aria-activedescendant
    if (!t) {
      setActiveDescId(null);
    }
  }, [value, caret]);

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    setCaret(e.target.selectionStart || 0);
  };

  const onCloseSelector = () => {
    setSelectorOpen(false);
    setActiveDescId(null);
  };

  const insertTokenForReference = (ref: StructuredReference) => {
    const el = textareaRef.current;
    if (!el || !trigger) return;
    const token =
      ref.connector === "jira"
        ? `[@jira ${ref.id}]`
        : `[@confluence ${ref.title}]`;
    const before = value.slice(0, trigger.start);
    const after = value.slice(caret);
    const next = `${before}${token} ${after}`;
    setValue(next);
    // Move caret to after inserted token + space
    const newPos = (before + token + " ").length;
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(newPos, newPos);
      setCaret(newPos);
    });
  };

  const onSelectFromSelector = (ref: StructuredReference) => {
    insertTokenForReference(ref);
    onReferenceSelected?.(ref);
    setSelectedRefs((prev) => [...prev, ref]);
    setSelectorOpen(false);
    setActiveDescId(null);
  };

  const removeRefAt = (idx: number) => {
    setSelectedRefs((prev) => prev.filter((_, i) => i !== idx));
  };

  const areaClass = className || "input w-full h-28 resize-y";

  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        className={areaClass}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={syncCaret}
        onBlur={syncCaret}
        aria-label="Chat input"
        aria-autocomplete="list"
        aria-haspopup="listbox"
        aria-controls={selectorOpen ? listboxId : undefined}
        aria-activedescendant={activeDescId || undefined}
      />
      {selectorOpen && trigger ? (
        <ConnectorSelector
          textareaRef={textareaRef}
          connector={trigger.adapter}
          queryText={trigger.query}
          onSelect={(ref) => onSelectFromSelector(ref)}
          onClose={onCloseSelector}
          listboxId={listboxId}
          onActiveDescendantChange={(id) => setActiveDescId(id)}
        />
      ) : null}

      {/* Selected references preview chips */}
      {selectedRefs.length > 0 ? (
        <div className="mt-2 flex flex-wrap gap-2" role="list" aria-label="Selected references">
          {selectedRefs.map((r, idx) => (
            <div key={`${r.connector}-${r.id}-${idx}`} className="chat-chip" role="listitem">
              <span className={`chat-chip-pill ${r.connector === "jira" ? "pill-blue" : "pill-amber"}`}>
                {r.connector === "jira" ? "Jira" : "Confluence"}
              </span>
              <a
                className="chat-chip-link"
                href={r.url}
                target="_blank"
                rel="noreferrer"
                title={r.title}
              >
                {r.title || r.id}
              </a>
              <button
                type="button"
                className="chat-chip-remove focus-ring"
                aria-label={`Remove reference ${r.id}`}
                onClick={() => removeRefAt(idx)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      ) : null}

      <div className="mt-2 text-xs text-gray-600">
        Tip: Type “@jira_ABC” or “@confluence_Project”, then use ↑/↓ and Enter/Tab to insert. Press Esc to close.
      </div>
    </div>
  );
}
