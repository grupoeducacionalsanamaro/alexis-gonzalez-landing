"use client";

import { useRef, useState } from "react";
import { Compass, TrendingUp, Building2 } from "lucide-react";
import { site } from "@/content/site";
import { Tag } from "@/components/ui/Tag";
import { Card } from "@/components/ui/Card";
import { useMotion } from "@/lib/useMotion";
import { revealUp } from "@/lib/animations";

const ICONS = [Compass, TrendingUp, Building2];

export function Metodo() {
  const m = site.metodo;
  const items = site.dimensiones.items;
  const scroller = useRef<HTMLDivElement>(null);
  const band = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  // Banda remate: la primera frase se tacha y luego aparece la segunda
  useMotion(band, ({ gsap, reduced, scope }) => {
    const line = scope.querySelector("[data-strike]");
    const first = scope.querySelector("[data-first]");
    const second = scope.querySelector("[data-second]");
    if (reduced) {
      gsap.set(line, { scaleX: 1 });
      gsap.fromTo([first, second], { opacity: 0 }, { opacity: 1, duration: 0.2, scrollTrigger: { trigger: scope, start: "top 80%", once: true } });
      return;
    }
    const tl = gsap.timeline({ scrollTrigger: { trigger: scope, start: "top 75%", once: true } });
    tl.add(revealUp(gsap, first!))
      .fromTo(line, { scaleX: 0 }, { scaleX: 1, duration: 0.7, ease: "power3.inOut" }, 0.5)
      .add(revealUp(gsap, second!), 1.1);
  });

  const onScroll = () => {
    const el = scroller.current;
    if (!el) return;
    const w = el.firstElementChild?.clientWidth ?? 1;
    setIndex(Math.round(el.scrollLeft / (w + 16)));
  };
  const goTo = (i: number) => {
    const el = scroller.current;
    const child = el?.children[i] as HTMLElement | undefined;
    if (el && child) el.scrollTo({ left: child.offsetLeft - el.offsetLeft - 24, behavior: "smooth" });
  };

  return (
    <section id="prospera" aria-labelledby="metodo-title" className="relative bg-ink-950 section-y">
      <div className="container-x">
        <div data-reveal="up">
          <Tag>{m.tag}</Tag>
        </div>
        <h2 id="metodo-title" data-reveal="lines" className="t-h2 mt-6 max-w-[760px] text-paper">
          {m.titulo}
        </h2>
      </div>

      <div className="mt-14 md:mt-20 lg:container-x">
        <div
          ref={scroller}
          onScroll={onScroll}
          data-reveal-stagger="0.12"
          className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-6 px-6 pb-2 lg:grid lg:grid-cols-3 lg:gap-6 lg:overflow-visible lg:px-0"
        >
          {items.map((it, i) => {
            const Icon = ICONS[i];
            return (
              <Card key={it.palabra} interactive className="group w-[82vw] max-w-[400px] shrink-0 snap-start p-8 md:p-10 lg:w-auto lg:max-w-none">
                <div className="relative z-10 flex h-full flex-col">
                  <div className="flex items-start justify-between">
                    <span aria-hidden="true" className="num-outline text-[88px] md:text-[104px]">
                      0{i + 1}
                    </span>
                    <Icon strokeWidth={1.5} className="mt-3 size-7 text-paper/80 transition-colors duration-300 group-hover:text-accent-300" aria-hidden="true" />
                  </div>
                  <h3 className="mt-10 font-display text-[26px] font-black tracking-[0.02em] text-paper uppercase">{it.palabra}</h3>
                  <p className="t-body mt-4 text-[16px]!">{it.descripcion}</p>
                </div>
              </Card>
            );
          })}
        </div>
        {/* Paginación mobile */}
        <div className="mt-6 flex justify-center gap-2 lg:hidden" role="tablist" aria-label="Dimensiones">
          {items.map((it, i) => (
            <button
              key={it.palabra}
              type="button"
              role="tab"
              aria-selected={index === i}
              aria-label={`Ver ${it.palabra}`}
              onClick={() => goTo(i)}
              className="grid size-8 place-items-center"
            >
              <span className={`block h-1.5 rounded-full transition-all duration-300 ${index === i ? "w-6 bg-accent-500" : "w-1.5 bg-ink-700"}`} />
            </button>
          ))}
        </div>
      </div>

      {/* Banda remate */}
      <div ref={band} className="mt-24 border-y border-ink-700 bg-ink-900 py-16 md:mt-32 md:py-24">
        <div className="container-x flex flex-col gap-3 text-center font-display text-[26px] leading-tight font-extrabold tracking-[-0.025em] md:text-[44px]">
          <p data-first="" className="relative mx-auto w-fit text-mist">
            {m.remateTachado}
            <span data-strike="" aria-hidden="true" className="absolute inset-x-0 top-[55%] h-[2px] origin-left scale-x-0 bg-mist" />
          </p>
          <p data-second="" className="text-paper">
            {m.remate}
          </p>
        </div>
      </div>
    </section>
  );
}
