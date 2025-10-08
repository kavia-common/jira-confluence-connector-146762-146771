import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ConnectorSelector from "@/components/chat/ConnectorSelector";
import type { ConnectorAdapter, ConnectorSearchItem } from "@/connectors/types";

function makeTextareaRef() {
  const ta = document.createElement("textarea");
  ta.value = "@jira_ABC";
  document.body.appendChild(ta);
  // place caret at end
  ta.focus();
  ta.setSelectionRange(ta.value.length, ta.value.length);
  return { current: ta as HTMLTextAreaElement };
}

function makeItems(): ConnectorSearchItem[] {
  return [
    { id: "ISSUE-1", title: "First Issue", url: "http://x/1", type: "issue", metadata: {} },
    { id: "ISSUE-2", title: "Second Issue", url: "http://x/2", type: "issue", metadata: {} },
  ];
}

describe("ConnectorSelector", () => {
  test("shows loading then results and selects with Enter", async () => {
    const textareaRef = makeTextareaRef();
    const items = makeItems();
    const connector: ConnectorAdapter = {
      id: "jira",
      prefix: "@jira_",
      displayName: "Jira",
      search: jest.fn(() => new Promise((resolve) => setTimeout(() => resolve(items), 50))),
    };

    const onSelect = jest.fn();
    const onClose = jest.fn();
    render(
      <ConnectorSelector
        textareaRef={textareaRef}
        connector={connector}
        queryText="ABC"
        onSelect={(ref) => onSelect(ref)}
        onClose={onClose}
        listboxId="test-listbox"
      />
    );

    // Loading state visible
    expect(await screen.findByText(/Searching/i)).toBeInTheDocument();

    // Results after debounce+resolve
    await screen.findByRole("option", { name: /First Issue/i });

    // Down to move active then Enter to select
    await userEvent.keyboard("{ArrowDown}{Enter}");
    expect(onSelect).toHaveBeenCalledTimes(1);
    const picked = onSelect.mock.calls[0][0];
    expect(picked.connector).toBe("jira");
    expect(picked.id).toBe("ISSUE-2");
  });

  test("tab commits selection; escape closes", async () => {
    const textareaRef = makeTextareaRef();
    const connector: ConnectorAdapter = {
      id: "jira",
      prefix: "@jira_",
      displayName: "Jira",
      search: jest.fn(async () => makeItems()),
    };
    const onSelect = jest.fn();
    const onClose = jest.fn();

    render(
      <ConnectorSelector
        textareaRef={textareaRef}
        connector={connector}
        queryText="ABC"
        onSelect={(ref) => onSelect(ref)}
        onClose={onClose}
        listboxId="test-listbox-2"
      />
    );

    await screen.findByRole("option", { name: /First Issue/i });
    await userEvent.keyboard("{Tab}");
    expect(onSelect).toHaveBeenCalledTimes(1);

    // reopen to test escape
    onSelect.mockClear();
    render(
      <ConnectorSelector
        textareaRef={textareaRef}
        connector={connector}
        queryText="ABC"
        onSelect={(ref) => onSelect(ref)}
        onClose={onClose}
        listboxId="test-listbox-3"
      />
    );

    await screen.findByRole("listbox");
    await userEvent.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalled();
  });

  test("empty and error states", async () => {
    const textareaRef = makeTextareaRef();
    const connectorEmpty: ConnectorAdapter = {
      id: "jira",
      prefix: "@jira_",
      displayName: "Jira",
      search: jest.fn(async () => []),
    };
    render(
      <ConnectorSelector
        textareaRef={textareaRef}
        connector={connectorEmpty}
        queryText="ZZZ"
        onSelect={jest.fn()}
        onClose={jest.fn()}
        listboxId="test-listbox-4"
      />
    );

    const emptyEl = await screen.findByText(/No results/i);
    expect(emptyEl).toBeInTheDocument();

    // error path
    const connectorErr: ConnectorAdapter = {
      id: "jira",
      prefix: "@jira_",
      displayName: "Jira",
      search: jest.fn(async () => {
        throw new Error("boom");
      }),
    };
    render(
      <ConnectorSelector
        textareaRef={textareaRef}
        connector={connectorErr}
        queryText="ERR"
        onSelect={jest.fn()}
        onClose={jest.fn()}
        listboxId="test-listbox-5"
      />
    );

    const errEl = await screen.findByText(/boom/i);
    expect(errEl).toBeInTheDocument();
    expect(errEl).toHaveAttribute("role", "alert");
  });
});
