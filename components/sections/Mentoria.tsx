"use client";

import { useRef } from "react";
import { Stethoscope, CalendarRange, Repeat, Clock, UserRound } from "lucide-react";
import { site } from "@/content/site";
import { Stars } from "@/components/ui/Stars";
import { useMotion } from "@/lib/useMotion";

const ICONS = [Stethoscope, CalendarRange, Repeat];

export function Mentoria() {
  const m = site.mentoria;
  const ref = useRef<HTMLDivElement>(null);

  // Punto dorado que recorre la línea de tiempo ligado al scroll
  useMotion(ref, ({ gsap, reduced, scope }) => {
    const dot = scope.querySelector("[data-dot]");
    const fill = scope.querySelector("[data-fill]");
    const mm = gsap.matchMedia();
    if (reduced) {
      gsap.set(fill, { scaleX: 1, scaleY: 1 });
      return () => mm.revert();
    }
    const rail = scope.querySelector<HTMLElement>("[data-rail]")!;
    const st = { trigger: scope, start: "top 70%", end: "bottom 55%", scrub: 0.5, invalidateOnRefresh: true };
    // Solo transform: el punto se traslada a lo largo del riel
    mm.add("(min-width: 1024px)", () => {
      gsap.fromTo(dot, { x: 0 }, { x: () => rail.offsetWidth, ease: "none", scrollTrigger: st });
      gsap.fromTo(fill, { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: st });
    });
    mm.add("(max-width: 1023px)", () => {
      gsap.fromTo(dot, { y: 0 }, { y: () => rail.offsetHeight, ease: "none", scrollTrigger: st });
      gsap.fromTo(fill, { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: st });
    });
    return () => mm.revert();
  });

  return (
    <section id="mentoria" aria-labelledby="ment-title" className="relative bg-ink-950 section-y">
      <div className="container-x">
        <div className="flex flex-col gap-6 border-b border-ink-700 pb-10 md:flex-row md:items-end md:justify-between">
          <div data-reveal="up">
            <h2 id="ment-title" className="font-display text-[40px] leading-none font-semibold tracking-[-0.01em] text-paper uppercase md:text-[64px]">
              {m.titulo}
            </h2>
            <Stars className="mt-5" size={16} />
          </div>
          <div data-reveal="up" className="flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-2 rounded-[2px] border border-ink-700 px-4 py-2.5 font-display text-[14px] font-medium text-paper">
              <UserRound strokeWidth={1.5} className="size-4 text-gold-500" aria-hidden="true" />
              {m.badge}
            </span>
            {m.duracionPrograma && (
              <span className="inline-flex items-center gap-2 rounded-[2px] border border-ink-700 px-4 py-2.5 font-display text-[14px] font-medium text-paper">
                <Clock strokeWidth={1.5} className="size-4 text-gold-500" aria-hidden="true" />
                {m.duracionPrograma}
              </span>
            )}
          </div>
        </div>

        {/* Línea de tiempo: horizontal en desktop, vertical en mobile */}
        <div ref={ref} className="relative mt-14 pl-10 lg:mt-20 lg:pt-12 lg:pl-0">
          <div data-rail="" aria-hidden="true" className="absolute top-2 bottom-2 left-[11px] w-px bg-ink-700 lg:top-0 lg:right-0 lg:bottom-auto lg:left-0 lg:h-px lg:w-auto">
            <div data-fill="" className="absolute inset-0 origin-top bg-gold-700 lg:origin-left" />
            <span data-dot="" className="absolute top-0 left-0 block size-0">
              <span className="absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-500 shadow-[0_0_16px_rgb(212_165_55/0.6)]" />
            </span>
          </div>
          <ol className="grid gap-12 lg:grid-cols-3 lg:gap-8" data-reveal-stagger="0.12">
            {m.etapas.map((e, i) => {
              const Icon = ICONS[i];
              return (
                <li key={e.titulo} className="relative">
                  <span aria-hidden="true" className="absolute top-1.5 -left-10 grid size-[23px] place-items-center rounded-full border border-ink-700 bg-ink-950 lg:-top-12 lg:left-0 lg:-translate-y-1/2">
                    <span className="size-1.5 rounded-full bg-paper/60" />
                  </span>
                  <Icon strokeWidth={1.5} className="size-7 text-paper/80" aria-hidden="true" />
                  <p className="t-eyebrow mt-5 text-paper/50">Etapa 0{i + 1}</p>
                  <h3 className="t-h3 mt-2 text-paper">{e.titulo}</h3>
                  <p className="t-body mt-3 text-[16px]!">{e.detalle}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
