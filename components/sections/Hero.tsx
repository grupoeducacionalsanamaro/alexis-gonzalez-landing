"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowDown } from "lucide-react";
import { site } from "@/content/site";
import { Eyebrow, AccentText } from "@/components/ui/Tag";
import { accentSweep, maskLines, stagger } from "@/lib/animations";
import { useMotion } from "@/lib/useMotion";
import { track } from "@/lib/analytics";
import { scrollToHash } from "@/components/layout/SmoothScroll";

export function Hero() {
  const h = site.hero;
  const ref = useRef<HTMLElement>(null);
  const [video, setVideo] = useState(false);

  // Slot de video opcional: solo ≥1024px y conexión rápida
  useEffect(() => {
    if (!h.videoSrc) return;
    const conn = (navigator as Navigator & { connection?: { effectiveType?: string; saveData?: boolean } }).connection;
    const slow = conn?.saveData || /(^|-)2g|3g/.test(conn?.effectiveType ?? "");
    if (window.innerWidth >= 1024 && !slow && !document.documentElement.classList.contains("rm")) {
      const t = window.setTimeout(() => setVideo(true), 0);
      return () => window.clearTimeout(t);
    }
  }, [h.videoSrc]);

  useMotion(ref, ({ gsap, reduced, scope }) => {
    const h1 = scope.querySelector<HTMLElement>("h1")!;
    const rest = Array.from(scope.querySelectorAll<HTMLElement>("[data-hero='rest']"));
    let tl: gsap.core.Timeline | null = null;

    const run = () =>
      document.fonts.ready.then(() => {
        if (reduced) {
          gsap.to([h1, ...rest], { opacity: 1, duration: 0.2 });
          return;
        }
        tl = gsap.timeline({ defaults: { ease: "expo.out" } });
        tl.fromTo(rest[0], { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, 0.3);
        tl.add(maskLines(gsap, h1), 0.4);
        tl.add(accentSweep(gsap, h1.querySelectorAll(".accent-text")), 0.95);
        tl.fromTo(
          rest.slice(1),
          { y: 24, opacity: 0, filter: "blur(6px)" },
          { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.9, stagger: stagger.items, clearProps: "filter" },
          1.05,
        );
      });

    const root = document.documentElement;
    if (root.dataset.preloader === "on") {
      window.addEventListener("ag:preloader-done", run, { once: true });
    } else run();

    return () => {
      window.removeEventListener("ag:preloader-done", run);
      tl?.kill();
    };
  });

  return (
    <section
      id="inicio"
      ref={ref}
      aria-labelledby="hero-title"
      data-own-motion=""
      className="relative isolate flex h-[100svh] min-h-[680px] flex-col overflow-hidden bg-ink-950"
    >
      {/* Foto: Alexis a la izquierda; el texto ocupa el lado derecho.
          Se muestra tal cual (1920×1080, WebP sin pérdida, sin capas encima) y su
          contenedor nunca supera 1920×1080, así la foto solo se reduce, nunca se agranda. */}
      <div className="absolute inset-x-0 top-0 -z-10 h-[62svh] lg:inset-0 lg:h-full">
        <div className="relative mx-auto size-full lg:top-1/2 lg:max-h-[1080px] lg:max-w-[1920px] lg:-translate-y-1/2">
          {video && h.videoSrc ? (
            <video
              className="size-full object-cover object-[27%_18%] lg:object-[32%_50%]"
              src={h.videoSrc}
              poster={h.imagen}
              autoPlay
              muted
              loop
              playsInline
              aria-hidden="true"
            />
          ) : (
            <Image
              src={h.imagen}
              alt={h.imagenAlt}
              fill
              priority
              fetchPriority="high"
              unoptimized
              sizes="100vw"
              className="object-cover object-[27%_18%] lg:object-[32%_50%]"
            />
          )}
          {/* Solo el borde inferior se funde con el fondo de la sección siguiente (sin cortes) */}
          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-20 bg-[linear-gradient(to_top,var(--ink-950),transparent)] lg:h-28" />
        </div>
      </div>

      {/* Texto a la derecha del personaje */}
      <div className="container-x relative flex flex-1 flex-col justify-end pt-[calc(var(--nav-h)+16px)] pb-10 lg:flex-row lg:items-center lg:justify-end lg:pb-0">
        <div className="lg:w-[52%] xl:w-[50%]">
          <div data-hero="rest">
            <Eyebrow>{h.eyebrow}</Eyebrow>
          </div>
          <h1
            id="hero-title"
            data-hero=""
            className="mt-5 font-display text-[clamp(46px,5.4vw,92px)] leading-[0.94] font-black tracking-[-0.045em] text-paper lg:mt-7"
          >
            {h.h1Pre}
            <br />
            <AccentText>{h.h1Destacado}</AccentText>
            <br />
            {h.h1Medio}&nbsp;<span className="text-outline">{h.h1Contraste}</span>
            {h.h1Cierre}
          </h1>
          <div data-hero="rest" className="mt-8 lg:mt-12">
            <a
              href={h.ctaHref}
              onClick={(e) => {
                e.preventDefault();
                track("cta_click", { location: "hero" });
                scrollToHash(h.ctaHref);
              }}
              className="group inline-flex min-h-12 items-center gap-4 font-display text-[15px] font-bold tracking-[0.04em] text-paper"
            >
              <span className="grid size-12 place-items-center rounded-full border border-paper/30 transition-colors duration-300 group-hover:border-accent-300 group-hover:bg-accent-500">
                <ArrowDown strokeWidth={1.75} className="size-5 transition-transform duration-300 group-hover:translate-y-0.5" aria-hidden="true" />
              </span>
              {h.cta}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
