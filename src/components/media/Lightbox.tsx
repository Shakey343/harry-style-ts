import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import type { Photo } from "../../types/project";
import cloudinaryUrl from "../../utils/cloudinaryUrl";
import cn from "../../utils/cn";

interface LightboxProps {
  photos: Photo[];
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}

const SWIPE_THRESHOLD = 50;

const buttonClass =
  "absolute cursor-pointer rounded bg-night/70 px-3 py-2 text-bone hover:text-tangerine focus:outline-none focus-visible:ring-2 focus-visible:ring-tangerine";

const Lightbox = ({ photos, index, onIndexChange, onClose }: LightboxProps) => {
  const closeRef = useRef<HTMLButtonElement>(null);
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const pointerStartX = useRef<number | null>(null);
  const total = photos.length;
  const photo = photos[index];

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    return () => previouslyFocused?.focus();
  }, []);

  const go = (delta: number) => onIndexChange((index + delta + total) % total);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") {
      go(-1);
    } else if (e.key === "ArrowRight") {
      go(1);
    } else if (e.key === "Escape") {
      onClose();
    } else if (e.key === "Tab") {
      const order = [prevRef.current, nextRef.current, closeRef.current].filter(
        (el): el is HTMLButtonElement => el !== null
      );
      const at = order.indexOf(document.activeElement as HTMLButtonElement);
      const step = e.shiftKey ? -1 : 1;
      order[(at + step + order.length) % order.length]?.focus();
      e.preventDefault();
    } else {
      return;
    }
    e.stopPropagation();
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const startX = pointerStartX.current;
    pointerStartX.current = null;
    if (startX === null) {
      return;
    }
    const dx = e.clientX - startX;
    if (Math.abs(dx) > SWIPE_THRESHOLD) {
      go(dx < 0 ? 1 : -1);
    }
  };

  if (!photo) {
    return null;
  }

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Photo viewer"
      tabIndex={-1}
      onKeyDown={handleKeyDown}
      onClick={e => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      onPointerDown={e => {
        pointerStartX.current = e.clientX;
      }}
      onPointerUp={handlePointerUp}
      className="fixed inset-0 z-50 flex items-center justify-center bg-night/95 p-4 touch-pan-y"
    >
      <img
        src={cloudinaryUrl(photo.url, "f_auto,q_auto")}
        alt={photo.alt}
        draggable={false}
        className="max-h-full max-w-full select-none object-contain"
      />
      <button
        ref={prevRef}
        type="button"
        aria-label="Previous photo"
        onClick={() => go(-1)}
        className={cn(buttonClass, "left-4 top-1/2 -translate-y-1/2")}
      >
        ‹
      </button>
      <button
        ref={nextRef}
        type="button"
        aria-label="Next photo"
        onClick={() => go(1)}
        className={cn(buttonClass, "right-4 top-1/2 -translate-y-1/2")}
      >
        ›
      </button>
      <button
        ref={closeRef}
        type="button"
        aria-label="Close photo viewer"
        onClick={onClose}
        className={cn(buttonClass, "right-4 top-4")}
      >
        ✕
      </button>
      <span className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded bg-night/70 px-3 py-1 text-sm text-bone">
        {index + 1} / {total}
      </span>
    </div>,
    document.body
  );
};

export default Lightbox;
