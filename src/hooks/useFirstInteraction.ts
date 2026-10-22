import { useEffect, useRef, type RefObject } from "react";

const ACTIVATING_KEYS = new Set(["Enter", " "]);

// Calls `onFirst` on the visitor's first click or Enter/Space anywhere. A first
// interaction inside `ignoreRef` is used up without calling it.
export default function useFirstInteraction(
  onFirst: () => void,
  ignoreRef: RefObject<HTMLElement>
): void {
  const onFirstRef = useRef(onFirst);
  onFirstRef.current = onFirst;

  useEffect(() => {
    const stop = () => {
      document.removeEventListener("click", handle, true);
      document.removeEventListener("keydown", handle, true);
    };
    function handle(e: Event) {
      if (e instanceof KeyboardEvent && !ACTIVATING_KEYS.has(e.key)) return;
      stop();
      if (!ignoreRef.current?.contains(e.target as Node)) onFirstRef.current();
    }
    // Capture phase, so it runs before the page's own click handlers.
    document.addEventListener("click", handle, true);
    document.addEventListener("keydown", handle, true);
    return stop;
  }, [ignoreRef]);
}
