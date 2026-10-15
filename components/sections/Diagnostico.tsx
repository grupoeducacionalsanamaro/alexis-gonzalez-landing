"use client";

import { useRef } from "react";
import { site } from "@/content/site";
import { Counter } from "@/components/ui/Counter";
import { GoldText } from "@/components/ui/Tag";
import { SectionDivider } from "@/components/ui/SectionDivider";
import { useMotion } from "@/lib/useMotion";

export function Diagnostico() {
  const d = site.diagnostico;
  const ref = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useMotion(ref, ({ gsap, reduced }) => {
    const items = Array.from(listRef.current?.children ?? []) as HTMLElement[];
    const mm = gsap.matchMedia();
    const mist = "#A1A1A6";
    const paper = "#F5F5F2";
    if (reduced) {
      gsap.set(items, { color: paper });
      return () => mm.revert();
    }

    // Desktop: se pinea ~150vh y los síntomas se encienden uno a uno (scrub)
    mm.add("(min-width: 1024px)", () => {
      const pin = ref.current!.querySelector<HTMLElement>("[data-pin]")!;
      const tl = gsap.timeline({
        scrollTrigger: { trigger: pin, start: "top top", end: "+=150%", scrub: 0.6, pin: true, anticipatePin: 1 },
      });
      items.forEach((el, i) => {
        const dash = el.querySelector("[data-dash]");
        tl.to(el, { color: paper, x: 12, duration: 1, ease: "power2.out" }, i);
        tl.to(dash, { scaleX: 1, duration: 1, ease: "power2.out" }, i);
        if (i < items.length - 1) {
          tl.to(el, { color: mist, x: 0, duration: 1, ease: "power2.in" }, i + 1);
          tl.to(dash, { scaleX: 0, duration: 1 }, i + 1);
        }
      });
      tl.to({}, { duration: 0.6 });
    });

    // Mobile: cada línea se enciende al cruzar el 55% del viewport
    mm.add("(max-width: 1023px)", () => {
      items.forEach((el) => {
        const dash = el.querySelector("[data-dash]");
        gsap.timeline({
          scrollTrigger: { trigger: el, start: "top 55%", end: "bottom 45%", toggleActions: "play reverse play reverse" },
        })
          .to(el, { color: paper, x: 8, duration: 0.4, ease: "quart.out" })
          .to(dash, { scaleX: 1, duration: 0.4, ease: "quart.out" }, 0);
      });
    });
    return () => mm.revert();
  });

  return (
    <section id="diagnostico" ref={ref} aria-labelledby="diag-title" className="relative bg-ink-950">
      <div data-pin="" className="flex items-center py-24 lg:min-h-screen lg:py-20">
        <div className="container-x">
          <div className="mx-auto max-w-[720px]">
            <h2 id="diag-title" data-reveal="lines" className="t-h2 text-paper">
              {d.tituloPre}{" "}
              <span className="gold-text" data-sweep="">
                <Counter to={d.tituloNumero} />
              </span>{" "}
              {d.tituloPost}
            </h2>
            <p data-reveal="up" className="mt-5 font-display text-[20px] font-medium text-paper/70 md:text-[24px]">
              {d.bajada}
            </p>

            <ul ref={listRef} className="mt-12 flex flex-col gap-4 md:mt-14 md:gap-5" data-reveal-stagger="0.08">
              {d.sintomas.map((s) => (
                <li key={s} className="flex items-center gap-4 font-display text-[26px] leading-tight font-medium text-mist md:text-[32px]">
                  <span data-dash="" aria-hidden="true" className="h-px w-6 shrink-0 origin-left scale-x-0 bg-gold-500" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>

            <p data-reveal="up" className="mt-14 font-display text-[24px] font-medium text-paper md:mt-16 md:text-[34px]">
              {d.rematePre} <GoldText sweep>{d.remateGold}</GoldText>
            </p>
            <SectionDivider className="mx-0! mt-8" />
          </div>
        </div>
      </div>
    </section>
  );
}
