"use client";

import { useEffect, useState } from "react";
import { site } from "@/content/site";
import { track } from "@/lib/analytics";

const NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

export function WhatsAppButton() {
  const [lifted, setLifted] = useState(false);

  useEffect(() => {
    if (!NUMBER) {
      if (process.env.NODE_ENV === "development") console.info("[whatsapp] NEXT_PUBLIC_WHATSAPP_NUMBER no definido: botón oculto");
      return;
    }
    // En mobile se ubica sobre la sticky CTA cuando ésta aparece
    const hero = document.getElementById("inicio");
    if (!hero) return;
    const io = new IntersectionObserver(([e]) => setLifted(!e.isIntersecting));
    io.observe(hero);
    return () => io.disconnect();
  }, []);

  if (!NUMBER) return null;
  const href = `https://wa.me/${NUMBER}?text=${encodeURIComponent(site.whatsapp.mensaje)}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track("whatsapp_click")}
      aria-label="Escribir por WhatsApp a Alexis González"
      className={`card-glass group fixed right-4 z-30 flex h-12 items-center gap-2 rounded-full px-4 text-paper transition-[bottom,border-color] duration-500 ease-out-expo hover:border-accent-500 lg:right-6 lg:bottom-6 ${
        lifted ? "bottom-[calc(92px+env(safe-area-inset-bottom))]" : "bottom-4"
      }`}
    >
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.5 20.5l1.3-4.2A8.5 8.5 0 1 1 8 19.4l-4.5 1.1z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 8.8c0 3.2 2.9 6.2 6.2 6.2l1.2-1.4-2-1-1 .8c-1-.4-2-1.4-2.4-2.4l.8-1-1-2L9.4 8.4"
        />
      </svg>
      <span className="t-eyebrow hidden text-[11px] lg:inline">WhatsApp</span>
    </a>
  );
}
