import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ChatInput from "@/components/chat/ChatInput";

// Mock buildBackendUrl to a fake host to ensure no hardcoded URL usage
jest.mock("@/lib/api", () => ({
  buildBackendUrl: (path: string) => `https://api.example.test${path}`,
}));

describe("ChatInput selector flow", () => {
  beforeEach(() => {
    // Mock fetch to serve connector search results
    (global.fetch as jest.Mock) = jest.fn((input: RequestInfo | URL) => {
      const urlStr =
        typeof input === "string"
          ? input
          : input instanceof URL
          ? input.toString()
          : (input as Request).url;

      if (urlStr.includes("/connectors/jira/search")) {
        return Promise.resolve({
          ok: true,
          json: async () => [
            {
              id: "TEST-1",
              title: "Issue TEST-1",
              url: "https://jira.example/browse/TEST-1",
              type: "issue",
              metadata: { key: "TEST-1" },
            },
          ],
          text: async () => "[]",
        } as any);
      }
      return Promise.resolve({
        ok: true,
        json: async () => [],
        text: async () => "[]",
      } as any);
    }) as any;
  });

  test("typing @jira_ triggers selector; Enter inserts token and shows chip", async () => {
    const onRef = jest.fn();
    render(<ChatInput onReferenceSelected={onRef} />);

    const ta = screen.getByLabelText(/Chat input/i);
    await userEvent.type(ta, "Please see @jira_TEST-1");

    // Wait for selector to appear and load items
    const listbox = await screen.findByRole("listbox");
    expect(listbox).toBeInTheDocument();
    await screen.findByRole("option", { name: /Issue TEST-1/i });

    // Select with Enter
    await userEvent.keyboard("{Enter}");

    // onReferenceSelected called
    expect(onRef).toHaveBeenCalledTimes(1);
    const arg = onRef.mock.calls[0][0];
    expect(arg.connector).toBe("jira");
    expect(arg.id).toBe("TEST-1");

    // The token was inserted into the textarea
    expect((ta as HTMLTextAreaElement).value).toMatch(/\[@jira TEST-1\]/);

    // Chip rendered
    const chipRemoveBtn = await screen.findByRole("button", { name: /Remove reference TEST-1/i });
    expect(chipRemoveBtn).toBeInTheDocument();
  });
});
