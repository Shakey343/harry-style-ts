import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { useFirstInteraction } from "./useFirstInteraction";

const button = document.createElement("button");
const ignoreRef = { current: button };
document.body.appendChild(button);

const press = (key: string) => document.body.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true }));

afterEach(() => vi.restoreAllMocks());

describe("useFirstInteraction", () => {
  it("fires once on the first click anywhere", () => {
    const onFirst = vi.fn();
    renderHook(() => useFirstInteraction(onFirst, ignoreRef));
    document.body.click();
    document.body.click();
    expect(onFirst).toHaveBeenCalledTimes(1);
  });

  it("fires on Enter or Space, but not on other keys", () => {
    const onFirst = vi.fn();
    renderHook(() => useFirstInteraction(onFirst, ignoreRef));
    press("Tab");
    press("Escape");
    expect(onFirst).not.toHaveBeenCalled();
    press(" ");
    expect(onFirst).toHaveBeenCalledTimes(1);

    const other = vi.fn();
    renderHook(() => useFirstInteraction(other, ignoreRef));
    press("Enter");
    expect(other).toHaveBeenCalledTimes(1);
  });

  it("a first click on the ignored element is used up without firing", () => {
    const onFirst = vi.fn();
    renderHook(() => useFirstInteraction(onFirst, ignoreRef));
    button.click();
    document.body.click();
    expect(onFirst).not.toHaveBeenCalled();
  });

  it("stops listening when unmounted", () => {
    const onFirst = vi.fn();
    const { unmount } = renderHook(() => useFirstInteraction(onFirst, ignoreRef));
    unmount();
    document.body.click();
    expect(onFirst).not.toHaveBeenCalled();
  });
});
