"use client";

import { useEffect, useRef } from "react";
import { track } from "@/lib/analytics";

/** Filete de acento 2px ligado al progreso del scroll + evento scroll_depth. */
export function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const fired = new Set<number>();
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      if (bar.current) bar.current.style.transform = `scaleX(${p})`;
      [25, 50, 75, 100].forEach((d) => {
        if (p * 100 >= d - 0.5 && !fired.has(d)) {
          fired.add(d);
          track("scroll_depth", { depth: d });
        }
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px]">
      <div ref={bar} className="h-full origin-left" style={{ background: "var(--accent-gradient)", transform: "scaleX(0)" }} />
    </div>
  );
}
