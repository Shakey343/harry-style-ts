import { useEffect, useRef, type RefObject } from "react";

// Keys that count as a deliberate interaction (browsers grant permission to
// play sound on keydown; Tab/Escape are excluded so keyboard navigation alone
// doesn't trigger it).
const ACTIVATING_KEYS = new Set(["Enter", " "]);

// Calls `onFirst` once, on the visitor's first click or Enter/Space anywhere
// on the page. A first interaction inside `ignoreRef` (a control that handles
// the same job itself) uses it up without calling `onFirst`.
export function useFirstInteraction(onFirst: () => void, ignoreRef: RefObject<HTMLElement>): void {
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
    // Capture phase: runs before the page's own handlers, so e.g. pressing an
    // MP3's play button first turns the sound on, then the player mutes it.
    document.addEventListener("click", handle, true);
    document.addEventListener("keydown", handle, true);
    return stop;
  }, [ignoreRef]);
}
