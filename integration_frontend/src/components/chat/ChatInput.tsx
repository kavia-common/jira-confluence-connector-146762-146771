"use client";

import React, { useEffect, useRef, useState } from "react";
import ConnectorSelector from "./ConnectorSelector";
import { parseTriggerAtCaret } from "@/connectors";
import type { StructuredReference } from "@/connectors/types";

/**
 * PUBLIC_INTERFACE
 * ChatInput
 * A minimal chat input with support for connector typeahead triggers:
 * - Type @jira_ or @confluence_ followed by a query fragment to open the selector.
 * - Arrow keys navigate, Enter selects, Escape closes.
 * - On selection, a text token is inserted and onReferenceSelected is called with a structured object.
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
  }, [value, caret]);

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    setCaret(e.target.selectionStart || 0);
  };

  const onCloseSelector = () => {
    setSelectorOpen(false);
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
    setSelectorOpen(false);
  };

  const areaClass =
    className ||
    "input w-full h-28 resize-y";

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
      />
      {selectorOpen && trigger ? (
        <ConnectorSelector
          textareaRef={textareaRef}
          connector={trigger.adapter}
          queryText={trigger.query}
          onSelect={(ref) => onSelectFromSelector(ref)}
          onClose={onCloseSelector}
        />
      ) : null}
      <div className="mt-2 text-xs text-gray-600">
        Tip: Try typing “@jira_ABC” or “@confluence_Project”.
      </div>
    </div>
  );
}
