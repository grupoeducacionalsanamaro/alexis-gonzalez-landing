"use client";

import { useEffect, useRef } from "react";
import { loadMotion } from "@/lib/animations";
import { Monogram } from "./Monogram";

/**
 * Preloader de primera visita (≤1.2s): monograma AG en trazo dorado + cortina.
 * El script de <head> decide si se muestra (data-preloader="on"): primera visita
 * de la sesión, desktop y sin reduced-motion. Al terminar emite `ag:preloader-done`.
 */
export function Preloader() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const done = () => {
      root.dataset.preloader = "done";
      window.dispatchEvent(new Event("ag:preloader-done"));
    };
    if (root.dataset.preloader !== "on") return;
    try {
      sessionStorage.setItem("ag_preloaded", "1");
    } catch {
      /* noop */
    }
    let killed = false;
    const fallback = window.setTimeout(done, 2500);
    loadMotion().then(({ gsap }) => {
      const el = ref.current;
      if (killed || !el) return;
      const paths = el.querySelectorAll<SVGPathElement>("path, rect");
      paths.forEach((p) => {
        const len = p.getTotalLength();
        p.style.strokeDasharray = `${len}`;
        p.style.strokeDashoffset = `${len}`;
      });
      gsap
        .timeline({
          onComplete: () => {
            window.clearTimeout(fallback);
            done();
          },
        })
        .to(paths, { strokeDashoffset: 0, duration: 0.7, ease: "power3.inOut", stagger: 0.08 })
        .to(el, { clipPath: "inset(0 0 100% 0)", duration: 0.6, ease: "power3.inOut" }, "+=0.05");
    });
    return () => {
      killed = true;
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="preloader fixed inset-0 z-[90] place-items-center bg-ink-950"
      style={{ clipPath: "inset(0 0 0 0)" }}
    >
      <Monogram className="size-20" stroke="var(--gold-500)" />
    </div>
  );
}
