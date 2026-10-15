"use client";

import { useEffect, type RefObject } from "react";
import { isReducedMotion, loadMotion, type Motion } from "./animations";

type Setup = (m: Motion & { reduced: boolean; scope: HTMLElement }) => void | (() => void);

/**
 * Carga GSAP en cliente y ejecuta `setup` dentro de un gsap.context
 * acotado a `scope`. Todo (incluidos ScrollTriggers) se revierte al desmontar.
 */
export function useMotion(scope: RefObject<HTMLElement | null>, setup: Setup, deps: unknown[] = []) {
  useEffect(() => {
    let cancelled = false;
    let revert: (() => void) | undefined;
    loadMotion().then((m) => {
      const el = scope.current;
      if (cancelled || !el) return;
      let extra: void | (() => void);
      const ctx = m.gsap.context(() => {
        extra = setup({ ...m, reduced: isReducedMotion(), scope: el });
      }, el);
      revert = () => {
        if (typeof extra === "function") extra();
        ctx.revert();
      };
    });
    return () => {
      cancelled = true;
      revert?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
