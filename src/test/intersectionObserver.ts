import { act } from "@testing-library/react";

// jsdom has no IntersectionObserver. This stand-in records what is observed so
// tests can report an element moving in or out of view.
type Observer = {
  callback: IntersectionObserverCallback;
  options?: IntersectionObserverInit;
  targets: Set<Element>;
};

const observers = new Set<Observer>();

class FakeIntersectionObserver {
  private observer: Observer;

  constructor(
    callback: IntersectionObserverCallback,
    options?: IntersectionObserverInit
  ) {
    this.observer = { callback, options, targets: new Set() };
    observers.add(this.observer);
  }

  observe(target: Element) {
    this.observer.targets.add(target);
  }

  unobserve(target: Element) {
    this.observer.targets.delete(target);
  }

  disconnect() {
    observers.delete(this.observer);
  }

  takeRecords() {
    return [];
  }
}

export const installIntersectionObserver = () => {
  Object.defineProperty(window, "IntersectionObserver", {
    configurable: true,
    writable: true,
    value: FakeIntersectionObserver,
  });
};

export const observedOptions = (target: Element) =>
  [...observers].find(o => o.targets.has(target))?.options;

// Reports `target` as in view, or as out of view with its top at `top`.
export const setInView = (target: Element, inView: boolean, top = -100) => {
  act(() => {
    observers.forEach(o => {
      if (!o.targets.has(target)) return;
      const entry = {
        target,
        isIntersecting: inView,
        boundingClientRect: { top } as DOMRectReadOnly,
      } as IntersectionObserverEntry;
      o.callback([entry], o as unknown as IntersectionObserver);
    });
  });
};
