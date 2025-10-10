import "@testing-library/jest-dom/extend-expect";

// Polyfill ResizeObserver used by some components/logic in jsdom
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
if (typeof globalThis.ResizeObserver === "undefined") {
  globalThis.ResizeObserver = ResizeObserverMock;
}

// Provide a default fetch stub that forces tests to mock as needed
if (typeof globalThis.fetch === "undefined") {
  globalThis.fetch = (..._args) =>
    Promise.reject(new Error("Fetch not mocked in this test"));
}

// Test guardrail: Consider asserting that UI does not render strings like `"csrf"` or tokens.
// Keep in mind false positives; prefer targeted tests around login and callback pages.
