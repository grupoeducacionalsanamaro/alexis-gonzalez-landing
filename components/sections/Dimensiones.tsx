"use client";

import { useRef } from "react";
import { site } from "@/content/site";
import { Wireframe } from "@/components/ui/Wireframe";
import { AccentText } from "@/components/ui/Tag";
import { drawStroke, revealUp } from "@/lib/animations";
import { useMotion } from "@/lib/useMotion";

export function Dimensiones() {
  const d = site.dimensiones;
  const ref = useRef<HTMLElement>(null);

  useMotion(ref, ({ gsap, reduced, scope }) => {
    const stage = scope.querySelector<HTMLElement>(".dim-stage")!;
    const scenes = Array.from(scope.querySelectorAll<HTMLElement>(".dim-scene"));
    const final = scope.querySelector<HTMLElement>(".dim-final")!;
    const intro = scope.querySelector<HTMLElement>("[data-intro]")!;
    const mm = gsap.matchMedia();

    revealUp(gsap, intro, { scrollTrigger: { trigger: intro, start: "top 85%", once: true } });

    const staticReveal = () => {
      scenes.forEach((s) => {
        const parts = s.querySelectorAll("[data-part]");
        revealUp(gsap, parts, { stagger: 0.08, scrollTrigger: { trigger: s, start: "top 75%", once: true } });
        const svg = s.querySelector("svg");
        if (svg) drawStroke(gsap, svg, { scrollTrigger: { trigger: s, start: "top 75%", once: true } });
      });
      revealUp(gsap, final.querySelectorAll("[data-part]"), { stagger: 0.08, scrollTrigger: { trigger: final, start: "top 85%", once: true } });
      gsap.set(final.querySelector("[data-line]"), { scaleX: 1 });
    };

    if (reduced) {
      staticReveal();
      return () => mm.revert();
    }

    mm.add("(min-width: 1024px)", () => {
      stage.dataset.pinned = "true";
      const words = scenes.map((s) => s.querySelector("[data-word]"));
      const descs = scenes.map((s) => s.querySelector("[data-desc]"));
      const brows = scenes.map((s) => s.querySelector("[data-eyebrow]"));
      const wires = scenes.map((s) => s.querySelector("[data-wire]"));
      const finalParts = final.querySelectorAll("[data-part]");
      const line = final.querySelector("[data-line]");

      gsap.set(scenes.slice(1), { autoAlpha: 0 });
      gsap.set(final, { autoAlpha: 0 });
      // Escena 1 visible desde el inicio: el wireframe se dibuja al llegar
      scenes.forEach((s) => {
        const svg = s.querySelector("svg");
        if (svg) gsap.set(svg, { opacity: 1 });
      });
      const firstSvg = scenes[0].querySelector("svg");
      if (firstSvg) drawStroke(gsap, firstSvg, { scrollTrigger: { trigger: stage, start: "top 70%", once: true } });
      gsap.fromTo([brows[0], words[0], descs[0]], { y: 60, opacity: 0, filter: "blur(6px)" }, {
        y: 0, opacity: 1, filter: "blur(0px)", duration: 1, ease: "expo.out", stagger: 0.1,
        scrollTrigger: { trigger: stage, start: "top 70%", once: true },
      });
      // Los demás wireframes quedan dibujados (se transforman con crossfade + rotación)
      scenes.slice(1).forEach((s) => s.querySelectorAll<SVGPathElement>("path").forEach((p) => (p.style.strokeDasharray = "none")));

      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        scrollTrigger: { trigger: stage, start: "top top", end: "+=300%", scrub: 1, pin: true, anticipatePin: 1 },
      });

      const out = { y: -60, opacity: 0, filter: "blur(6px)", duration: 1 };
      const inn = (t: Element | null) => [t, { y: 60, opacity: 0, filter: "blur(6px)" }, { y: 0, opacity: 1, filter: "blur(0px)", duration: 1 }] as const;

      for (let i = 0; i < scenes.length - 1; i++) {
        const at = i * 2 + 0.6;
        tl.to([brows[i], words[i], descs[i]], out, at);
        tl.to(wires[i], { opacity: 0, rotate: 25, scale: 0.85, duration: 1 }, at);
        tl.set(scenes[i + 1], { autoAlpha: 1 }, at + 0.4);
        tl.fromTo(...inn(brows[i + 1]), at + 0.45);
        tl.fromTo(...inn(words[i + 1]), at + 0.5);
        tl.fromTo(...inn(descs[i + 1]), at + 0.6);
        tl.fromTo(wires[i + 1], { opacity: 0, rotate: -25, scale: 0.85 }, { opacity: 1, rotate: 0, scale: 1, duration: 1 }, at + 0.5);
        tl.set(scenes[i], { autoAlpha: 0 }, at + 1);
      }
      const end = (scenes.length - 1) * 2 + 0.6;
      const last = scenes.length - 1;
      tl.to([brows[last], words[last], descs[last]], out, end);
      tl.to(wires[last], { opacity: 0, scale: 0.85, duration: 1 }, end);
      tl.set(final, { autoAlpha: 1 }, end + 0.4);
      tl.fromTo(finalParts, { y: 40, opacity: 0, scale: 1.6 }, { y: 0, opacity: 1, scale: 1, duration: 1, stagger: 0.12, ease: "expo.out" }, end + 0.5);
      tl.fromTo(line, { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: "power3.inOut" }, end + 0.9);
      tl.to({}, { duration: 0.6 });

      return () => {
        delete stage.dataset.pinned;
      };
    });

    mm.add("(max-width: 1023px)", staticReveal);
    return () => mm.revert();
  });

  return (
    <section id="metodo" ref={ref} aria-labelledby="dim-title" data-own-motion="" className="relative bg-ink-950">
      <div className="container-x pt-24 lg:pt-40">
        <h2 id="dim-title" className="sr-only">
          Las tres dimensiones del Método {site.marca}
        </h2>
        <p data-intro="" className="mx-auto max-w-[760px] t-lead text-center text-[22px] leading-snug text-paper/80 md:text-[30px]">
          {d.intro}
        </p>
      </div>

      <div className="dim-stage">
        {d.items.map((it, i) => (
          <div key={it.palabra} className="dim-scene">
            <div className="container-x grid w-full items-center gap-10 lg:grid-cols-12">
              <div className="lg:col-span-8">
                <p data-part="" data-eyebrow="" className="t-eyebrow mb-4 text-paper/50 lg:mb-6">
                  0{i + 1} / 03
                </p>
                <h3 data-part="" data-word="" className="dim-word text-paper">
                  {it.palabra}
                  <span className="text-accent-300">.</span>
                </h3>
                <p data-part="" data-desc="" className="t-body mt-6 max-w-[520px] text-[19px]! md:text-[22px]! lg:mt-10">
                  {it.descripcion}
                </p>
              </div>
              <div data-wire="" className="flex justify-center lg:col-span-4 lg:justify-end">
                <Wireframe variant={it.wireframe} draw={false} strokeOpacity={0.9} strokeWidth={0.6} stroke="var(--mist)" className="h-auto w-[52vw] max-w-[360px] opacity-0 lg:w-[26vw]" />
              </div>
            </div>
          </div>
        ))}

        <div className="dim-final pb-24 lg:pb-0">
          <div className="container-x text-center">
            <div className="relative mx-auto flex max-w-[860px] flex-wrap items-center justify-center gap-x-6 gap-y-3 md:gap-x-12">
              {d.items.map((it) => (
                <span key={it.palabra} data-part="" className="relative z-10 bg-ink-950 px-3 font-display text-[26px] font-black tracking-[-0.02em] text-paper uppercase md:text-[44px]">
                  {it.palabra}.
                </span>
              ))}
              <span data-line="" aria-hidden="true" className="absolute inset-x-0 top-1/2 h-px origin-left" style={{ background: "var(--accent-gradient)" }} />
            </div>
            <p data-part="" className="mt-8 font-display text-[44px] leading-none font-black tracking-[-0.03em] uppercase md:text-[88px]">
              <AccentText>{site.marca}</AccentText>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
