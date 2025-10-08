import { CONNECTOR_PREFIX_MAP, parseTriggerAtCaret } from "@/connectors";

describe("connectors registry and trigger parsing", () => {
  test("CONNECTOR_PREFIX_MAP maps @jira_ to jira adapter", () => {
    const adapter = CONNECTOR_PREFIX_MAP["@jira_"];
    expect(adapter).toBeDefined();
    expect(adapter.id).toBe("jira");
    expect(adapter.displayName.toLowerCase()).toContain("jira");
  });

  test("parseTriggerAtCaret finds @jira_ with query", () => {
    const text = "Please check @jira_ISSUE-123 for details.";
    const caret = text.indexOf("details"); // caret placed after ISSUE-123 (space before 'for')
    const res = parseTriggerAtCaret(text, caret);
    expect(res).not.toBeNull();
    expect(res!.adapter.id).toBe("jira");
    expect(res!.query).toBe("ISSUE-123");
    // start index must point to '@'
    expect(text.slice(res!.start, res!.start + 6)).toBe("@jira_");
  });

  test("parseTriggerAtCaret requires boundary before prefix", () => {
    const text = "email@jira_ABC should not parse";
    const caret = text.length;
    const res = parseTriggerAtCaret(text, caret);
    expect(res).toBeNull();
  });

  test("parseTriggerAtCaret supports confluence prefix", () => {
    const text = "Link @confluence_ProjectXYZ immediately";
    const caret = text.length;
    const res = parseTriggerAtCaret(text, caret);
    expect(res).not.toBeNull();
    expect(res!.adapter.id).toBe("confluence");
    expect(res!.query).toBe("ProjectXYZ");
  });
});
