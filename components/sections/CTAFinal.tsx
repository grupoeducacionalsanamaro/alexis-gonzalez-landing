"use client";

import { useRef } from "react";
import { site } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { AccentText } from "@/components/ui/Tag";
import { Wireframe } from "@/components/ui/Wireframe";
import { useMotion } from "@/lib/useMotion";
import { accentSweep, revealUp, scrubOpacityWords } from "@/lib/animations";

export function CTAFinal() {
  const c = site.ctaFinal;
  const ref = useRef<HTMLElement>(null);

  useMotion(ref, ({ gsap, scope }) => {
    const block = scope.querySelector<HTMLElement>("[data-manifesto]")!;
    scope.querySelectorAll<HTMLElement>("[data-words]").forEach((p) => scrubOpacityWords(gsap, p, block));
    const cta = scope.querySelector<HTMLElement>("[data-cta]")!;
    revealUp(gsap, cta, { scrollTrigger: { trigger: cta, start: "top 90%", once: true } });
    accentSweep(gsap, scope.querySelectorAll(".accent-text"), { scrollTrigger: { trigger: block, start: "center 55%", once: true } });
  });

  return (
    <section id="aplicar" ref={ref} aria-labelledby="cta-title" data-own-motion="" className="relative flex min-h-[100svh] items-center overflow-hidden bg-ink-950 py-24 lg:py-40">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <Wireframe variant="cluster" draw={false} strokeOpacity={0.22} strokeWidth={0.35} className="w-[120vw] max-w-[1100px]" />
      </div>
      <div className="container-x relative">
        <h2 id="cta-title" className="sr-only">
          Aplica a la mentoría
        </h2>
        <div data-manifesto="" className="mx-auto max-w-[980px]">
          {c.lineas.map((l) => (
            <p key={l} data-words="" className="t-h2 mb-3 text-paper md:mb-5">
              {l}
            </p>
          ))}
          <div aria-hidden="true" className="h-16 md:h-28" />
          {c.lineas2.map((l, i) => (
            <p key={l} data-words="" className="t-h2 mb-3 text-paper md:mb-5">
              {l}
              {i === c.lineas2.length - 1 && (
                <>
                  {" "}
                  <AccentText sweep>{c.palabraFinal}</AccentText>
                </>
              )}
            </p>
          ))}
        </div>
        <div data-cta="" className="mt-16 flex justify-center md:mt-24">
          <div className="relative">
            <span aria-hidden="true" className="breathe pointer-events-none absolute -inset-10 rounded-full" style={{ background: "radial-gradient(closest-side, rgb(138 23 178 / 0.55), transparent)" }} />
            <Button variant="accent" size="lg" href="#postular" location="cta_final" cursor="postular">
              {c.cta}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
