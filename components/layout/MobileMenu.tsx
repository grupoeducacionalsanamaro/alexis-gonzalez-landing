"use client";

import { useEffect, useRef } from "react";
import { site } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { lockScroll, scrollToHash, unlockScroll } from "./SmoothScroll";
import { useFocusTrap } from "@/lib/useFocusTrap";

export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useFocusTrap(ref, open, onClose);

  useEffect(() => {
    if (!open) return;
    lockScroll();
    return () => unlockScroll();
  }, [open]);

  const go = (href: string) => {
    onClose();
    // espera a que se desbloquee el scroll
    window.setTimeout(() => scrollToHash(href), 60);
  };

  return (
    <div
      id="mobile-menu"
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-label="Menú"
      inert={!open}
      className={`fixed inset-0 top-0 z-[-1] flex flex-col bg-ink-950 px-6 pt-[104px] pb-[calc(24px+env(safe-area-inset-bottom))] transition-opacity duration-500 ease-out-expo lg:hidden ${
        open ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <ul className="flex flex-col gap-2">
        {site.nav.links.map((l, i) => (
          <li
            key={l.href}
            className="transition-[transform,opacity] duration-500 ease-out-expo"
            style={{
              transitionDelay: open ? `${120 + i * 60}ms` : "0ms",
              transform: open ? "translateY(0)" : "translateY(24px)",
              opacity: open ? 1 : 0,
            }}
          >
            <a
              href={l.href}
              onClick={(e) => {
                e.preventDefault();
                go(l.href);
              }}
              className="block py-2 font-display text-[40px] leading-tight font-medium text-paper"
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>
      <div className="mt-auto">
        <Button
          variant="primary"
          href="#postular"
          location="mobile_menu"
          className="w-full"
          onClick={(e) => {
            e.preventDefault();
            go("#postular");
          }}
        >
          {site.nav.ctaMobile}
        </Button>
      </div>
    </div>
  );
}
