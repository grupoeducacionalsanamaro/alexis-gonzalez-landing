"use client";

import { useEffect } from "react";
import type Lenis from "lenis";
import { isReducedMotion, loadMotion } from "@/lib/animations";

let lenis: Lenis | null = null;
const expoOut = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

/** Scroll suave a un ancla (#id) con Lenis 1.2s expo.out; fallback nativo. */
export function scrollToHash(hash: string) {
  const target = document.querySelector<HTMLElement>(hash);
  if (!target) return;
  const offset = hash === "#inicio" ? 0 : -24;
  if (lenis) lenis.scrollTo(target, { duration: 1.2, easing: expoOut, offset });
  else target.scrollIntoView({ behavior: isReducedMotion() ? "auto" : "smooth", block: "start" });
  history.replaceState(null, "", hash);
  // Mueve el foco al destino para teclado / lector de pantalla
  window.setTimeout(() => {
    if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
  }, lenis ? 1200 : 400);
}

export function lockScroll() {
  lenis?.stop();
  document.documentElement.style.overflow = "hidden";
}
export function unlockScroll() {
  lenis?.start();
  document.documentElement.style.overflow = "";
}

/** Lenis sincronizado con ScrollTrigger (import dinámico, solo cliente). */
export function SmoothScroll() {
  useEffect(() => {
    // En táctil el scroll nativo es mejor y se ahorra JS (Lenis no suaviza touch por defecto)
    if (isReducedMotion() || !window.matchMedia("(pointer: fine)").matches) return;
    let destroyed = false;
    let tick: ((t: number) => void) | null = null;
    Promise.all([import("lenis"), loadMotion()]).then(([{ default: LenisCtor }, { gsap, ScrollTrigger }]) => {
      if (destroyed) return;
      lenis = new LenisCtor({ duration: 1.1, easing: expoOut, smoothWheel: true });
      lenis.on("scroll", ScrollTrigger.update);
      tick = (t: number) => lenis?.raf(t * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    });
    return () => {
      destroyed = true;
      loadMotion().then(({ gsap }) => tick && gsap.ticker.remove(tick));
      lenis?.destroy();
      lenis = null;
    };
  }, []);
  return null;
}
