"use client";

import { useEffect, useRef, useState } from "react";
import { isDesktopPointer, isReducedMotion, loadMotion } from "@/lib/animations";

/** Cursor custom (desktop): punto 8px con mix-blend difference; crece sobre [data-cursor]. */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (!isDesktopPointer() || isReducedMotion()) return;
    const t = window.setTimeout(() => setEnabled(true), 0);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    let cleanup = () => {};
    loadMotion().then(({ gsap }) => {
      const el = dot.current;
      if (!el) return;
      const xTo = gsap.quickTo(el, "x", { duration: 0.35, ease: "power3.out" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.35, ease: "power3.out" });
      let shown = false;
      const onMove = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        if (!shown) {
          gsap.set(el, { x: e.clientX, y: e.clientY });
          gsap.to(el, { opacity: 1, duration: 0.3 });
          shown = true;
        }
        xTo(e.clientX);
        yTo(e.clientY);
        const target = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-cursor]");
        const kind = target?.dataset.cursor;
        setLabel(kind === "postular" ? "Postular" : kind === "ver" ? "Ver" : null);
      };
      const onLeave = () => {
        gsap.to(el, { opacity: 0, duration: 0.3 });
        shown = false;
      };
      window.addEventListener("pointermove", onMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeave);
      document.documentElement.classList.add("has-cursor");
      cleanup = () => {
        window.removeEventListener("pointermove", onMove);
        document.documentElement.removeEventListener("pointerleave", onLeave);
        document.documentElement.classList.remove("has-cursor");
      };
    });
    return () => cleanup();
  }, [enabled]);

  if (!enabled) return null;
  return (
    <div
      ref={dot}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[80] opacity-0 mix-blend-difference"
    >
      <div
        className="grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-paper transition-[width,height] duration-500 ease-out-expo"
        style={{ width: label ? 64 : 8, height: label ? 64 : 8 }}
      >
        <span
          className="font-display text-[10px] font-semibold tracking-[0.18em] text-ink-950 uppercase transition-opacity duration-300"
          style={{ opacity: label ? 1 : 0 }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}
