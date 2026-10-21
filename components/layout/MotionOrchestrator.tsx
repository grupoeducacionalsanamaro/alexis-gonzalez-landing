"use client";

import { useEffect } from "react";
import { countUp, drawStroke, accentSweep, isReducedMotion, loadMotion, maskLines, queueMotion, revealUp, stagger } from "@/lib/animations";

/** Elementos por tarea: cada lote debe quedar muy por debajo de 50ms en un mobile lento. */
const BATCH = 4;

/**
 * Animaciones declarativas por atributo, para no repetir lógica en cada sección:
 *  data-reveal="up" | "lines"   · data-reveal-stagger (hijos)
 *  data-draw (SVG)              · data-grow (filete)
 *  data-count                   · data-stars
 *  .accent-text[data-sweep]       · data-parallax="8" (yPercent ±)
 * Los elementos dentro de [data-own-motion] se excluyen (los anima su sección).
 * El trabajo se reparte en lotes (queueMotion) para no generar una tarea larga.
 */
export function MotionOrchestrator() {
  useEffect(() => {
    let ctx: { revert: () => void } | null = null;
    let cancelled = false;
    let ro: ResizeObserver | null = null;

    Promise.all([loadMotion(), document.fonts?.ready ?? Promise.resolve()]).then(([{ gsap, ScrollTrigger }]) => {
      if (cancelled) return;
      const reduced = isReducedMotion();
      const q = <T extends Element = HTMLElement>(sel: string) =>
        Array.from(document.querySelectorAll<T>(sel)).filter((el) => !el.closest("[data-own-motion]"));
      const st = (trigger: Element, start = "top 85%") => ({ trigger, start, once: true });
      const jobs: (() => void)[] = [];

      q("[data-reveal='up']").forEach((el) => jobs.push(() => revealUp(gsap, el, { scrollTrigger: st(el) })));

      q("[data-reveal-stagger]").forEach((el) =>
        jobs.push(() =>
          revealUp(gsap, Array.from(el.children), { stagger: Number(el.dataset.revealStagger) || stagger.items, scrollTrigger: st(el) }),
        ),
      );

      q("[data-reveal='lines']").forEach((el) => jobs.push(() => maskLines(gsap, el, { scrollTrigger: st(el, "top 88%") })));

      q<SVGSVGElement>("svg[data-draw]").forEach((svg) => jobs.push(() => drawStroke(gsap, svg, { scrollTrigger: st(svg, "top 90%") })));

      q("[data-grow]").forEach((el) =>
        jobs.push(() => {
          if (reduced) gsap.set(el, { scaleX: 1 });
          else gsap.fromTo(el, { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: "expo.out", scrollTrigger: st(el, "top 92%") });
        }),
      );

      q("[data-count]").forEach((el) => {
        const to = Number(el.dataset.count);
        jobs.push(() => ScrollTrigger.create({ ...st(el, "top 90%"), onEnter: () => countUp(gsap, el, to) }));
      });

      q("[data-stars]").forEach((el) => {
        if (reduced) return;
        jobs.push(() => {
          const stars = el.querySelectorAll(".star");
          gsap.fromTo(
            stars,
            { opacity: 0.15, scale: 0.6 },
            {
              opacity: 1,
              scale: 1,
              duration: 0.5,
              ease: "back.out(3)",
              stagger: 0.08,
              scrollTrigger: st(el, "top 92%"),
              onComplete: () => {
                gsap.fromTo(stars, { filter: "brightness(1.8)" }, { filter: "brightness(1)", duration: 0.6, stagger: 0.05, clearProps: "filter" });
              },
            },
          );
        });
      });

      q(".accent-text[data-sweep]").forEach((el) => jobs.push(() => accentSweep(gsap, el, { scrollTrigger: st(el, "top 85%") })));

      if (!reduced) {
        q("[data-parallax]").forEach((el) => {
          const amt = Number(el.dataset.parallax) || 8;
          jobs.push(() =>
            gsap.fromTo(
              el,
              { yPercent: -amt },
              { yPercent: amt, ease: "none", scrollTrigger: { trigger: el.parentElement ?? el, start: "top bottom", end: "bottom top", scrub: true } },
            ),
          );
        });
      }

      const context = gsap.context(() => {});
      ctx = context;
      for (let i = 0; i < jobs.length; i += BATCH) {
        const batch = jobs.slice(i, i + BATCH);
        queueMotion(() => {
          if (!cancelled) context.add(() => batch.forEach((job) => job()));
        });
      }

      queueMotion(() => {
        if (cancelled) return;
        // Recalcular tras cargar imágenes perezosas / fuentes
        const refresh = () => ScrollTrigger.refresh();
        if (document.readyState === "complete") refresh();
        else window.addEventListener("load", refresh, { once: true });
        setTimeout(refresh, 600);

        // …y cuando cambia la altura del contenido (formularios que se expanden, acordeones,
        // secciones con content-visibility que se pintan por primera vez, etc.)
        const main = document.getElementById("contenido");
        if (main && "ResizeObserver" in window) {
          let last = main.offsetHeight;
          let t = 0;
          ro = new ResizeObserver(() => {
            window.clearTimeout(t);
            t = window.setTimeout(() => {
              const h = main.offsetHeight;
              if (Math.abs(h - last) > 2) {
                ScrollTrigger.refresh();
                last = main.offsetHeight;
              }
            }, 200);
          });
          ro.observe(main);
        }
      });
    });

    return () => {
      cancelled = true;
      ro?.disconnect();
      ctx?.revert();
    };
  }, []);
  return null;
}
