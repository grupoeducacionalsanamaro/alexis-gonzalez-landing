"use client";

import { useEffect, useState } from "react";
import { site } from "@/content/site";
import { Button } from "@/components/ui/Button";

/** Barra inferior mobile: aparece al salir del hero y se oculta cuando la postulación está en pantalla. */
export function StickyCTA() {
  const [pastHero, setPastHero] = useState(false);
  const [formVisible, setFormVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("inicio");
    const form = document.getElementById("postular");
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.target === hero) setPastHero(!e.isIntersecting && e.boundingClientRect.top < 0);
        if (e.target === form) setFormVisible(e.isIntersecting);
      });
    });
    if (hero) io.observe(hero);
    if (form) io.observe(form);
    const onOverlay = (e: Event) => setFormVisible((e as CustomEvent<boolean>).detail);
    window.addEventListener("ag:apply-overlay", onOverlay);
    return () => {
      io.disconnect();
      window.removeEventListener("ag:apply-overlay", onOverlay);
    };
  }, []);

  const show = pastHero && !formVisible;
  return (
    <div
      className={`card-glass fixed inset-x-0 bottom-0 z-30 border-x-0 border-b-0 px-4 pt-3 pb-[calc(12px+env(safe-area-inset-bottom))] transition-transform duration-500 ease-out-expo lg:hidden ${
        show ? "translate-y-0" : "translate-y-full"
      }`}
      inert={!show}
    >
      <Button variant="primary" href="#postular" location="sticky_mobile" className="w-full" magnetic={false}>
        {site.nav.ctaMobile}
      </Button>
    </div>
  );
}
