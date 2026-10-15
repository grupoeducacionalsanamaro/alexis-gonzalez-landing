"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { site } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { Eyebrow, GoldText } from "@/components/ui/Tag";
import { Stars } from "@/components/ui/Stars";
import { Wireframe } from "@/components/ui/Wireframe";
import { drawStroke, goldSweep, isDesktopPointer, maskLines, stagger } from "@/lib/animations";
import { useMotion } from "@/lib/useMotion";

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
    const q = <T extends Element = HTMLElement>(s: string) => Array.from(scope.querySelectorAll<T>(s));
    const h1 = scope.querySelector<HTMLElement>("h1")!;
    const img = scope.querySelector<HTMLElement>("[data-hero-img]")!;
    const wires = q<SVGSVGElement>("svg[data-draw]");
    const rest = q("[data-hero='rest']");
    const bg = scope.querySelector<HTMLElement>("[data-hero='bg']")!;
    let tl: gsap.core.Timeline | null = null;

    const run = () =>
      document.fonts.ready.then(() => {
        if (reduced) {
          gsap.set(img, { y: 0, filter: "none" });
          gsap.set(wires, { opacity: 1 });
          wires.forEach((w) => drawStroke(gsap, w));
          gsap.to([bg, h1, ...rest], { opacity: 1, duration: 0.2 });
          return;
        }
        tl = gsap.timeline({ defaults: { ease: "expo.out" } });
        tl.to(bg, { opacity: 1, duration: 0.6, ease: "power2.out" }, 0);
        wires.forEach((w, i) => tl!.add(drawStroke(gsap, w, { duration: 1.2 }), 0.2 + i * 0.08));
        tl.to(img, { y: 0, filter: "blur(0px)", duration: 1, onComplete: () => gsap.set(img, { filter: "none" }) }, 0.3);
        tl.add(maskLines(gsap, h1), 0.5);
        tl.add(goldSweep(gsap, h1.querySelectorAll(".gold-text"), { stagger: 0.06 }), 0.95);
        tl.fromTo(
          rest,
          { y: 32, opacity: 0, filter: "blur(8px)" },
          { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.9, stagger: stagger.items, clearProps: "filter" },
          1.0,
        );
      });

    const root = document.documentElement;
    if (root.dataset.preloader === "on") {
      window.addEventListener("ag:preloader-done", run, { once: true });
    } else run();

    // Parallax de mouse en wireframes (máx. 12px)
    let off = () => {};
    if (!reduced && isDesktopPointer()) {
      const layers = q("[data-depth]").map((el) => ({
        d: Number(el.dataset.depth),
        x: gsap.quickTo(el, "x", { duration: 1.2, ease: "power3.out" }),
        y: gsap.quickTo(el, "y", { duration: 1.2, ease: "power3.out" }),
      }));
      const onMove = (e: PointerEvent) => {
        const nx = e.clientX / window.innerWidth - 0.5;
        const ny = e.clientY / window.innerHeight - 0.5;
        layers.forEach((l) => {
          l.x(nx * 24 * l.d);
          l.y(ny * 24 * l.d);
        });
      };
      window.addEventListener("pointermove", onMove, { passive: true });
      off = () => window.removeEventListener("pointermove", onMove);

      // Retrato: leve parallax de scroll
      gsap.to(img, { yPercent: 6, ease: "none", scrollTrigger: { trigger: scope, start: "top top", end: "bottom top", scrub: true } });
    }
    return () => {
      off();
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
      {/* Fondo: wireframes en capas + halo */}
      <div data-hero="bg" aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div data-depth="0.25" className="absolute top-[12%] -left-[8%] w-[46vw] max-w-[520px] lg:top-[8%] lg:left-[2%] lg:w-[28vw]">
          <Wireframe variant="cluster" strokeOpacity={0.4} className="h-auto w-full" />
        </div>
        <div data-depth="0.5" className="absolute right-[4%] bottom-[18%] hidden w-[14vw] max-w-[220px] lg:block">
          <Wireframe variant="cube" strokeOpacity={0.5} className="h-auto w-full" />
        </div>
        <div data-depth="1" className="absolute bottom-[6%] left-[38%] hidden w-[9vw] max-w-[140px] lg:block">
          <Wireframe variant="prism" strokeOpacity={0.6} className="h-auto w-full" />
        </div>
      </div>

      {/* Retrato */}
      <div className="absolute inset-x-0 top-0 -z-10 h-[60svh] lg:inset-y-0 lg:right-0 lg:left-auto lg:h-full lg:w-[55%] lg:[mask-image:linear-gradient(to_right,transparent_0%,rgb(0_0_0/0.4)_20%,#000_50%)]">
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ background: "radial-gradient(60% 50% at 55% 38%, rgb(212 165 55 / 0.08), transparent 70%)" }}
        />
        <div data-hero-img="" className="absolute inset-0">
          {video && h.videoSrc ? (
            <video
              className="photo-bw size-full object-cover object-[50%_18%]"
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
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="photo-bw object-cover object-[50%_18%]"
            />
          )}
        </div>
        {/* Funde la foto con el negro (bordes) */}
        <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(to_top,var(--ink-950)_8%,rgb(10_10_11/0.85)_30%,transparent_62%)] lg:bg-[linear-gradient(to_top,var(--ink-950)_0%,transparent_32%)]" />
        <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(to_bottom,rgb(10_10_11/0.55)_0%,transparent_18%)]" />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ background: "radial-gradient(45% 40% at 52% 30%, rgb(232 199 112 / 0.07), transparent 70%)" }}
        />
      </div>

      {/* Contenido */}
      <div className="container-x relative flex flex-1 flex-col justify-end pt-[calc(var(--nav-h)+16px)] pb-8 lg:justify-center lg:pb-0">
        <div className="max-w-[640px] lg:max-w-[600px] xl:max-w-[660px]">
          <div data-hero="rest">
            <Eyebrow>{h.eyebrow}</Eyebrow>
          </div>
          <h1
            id="hero-title"
            data-hero=""
            className="mt-5 font-display text-[clamp(34px,5.2vw,78px)] leading-[0.98] font-semibold tracking-[-0.02em] text-paper uppercase lg:mt-7"
          >
            {h.h1Pre} <GoldText>{h.h1Gold}</GoldText>
          </h1>
          <p data-hero="rest" className="mt-4 font-display text-[22px] font-medium text-paper/70 lg:mt-6 lg:text-[28px]">
            {h.subtitulo}
          </p>
          <p data-hero="rest" className="t-body mt-3 max-w-[520px] text-[16px]! lg:mt-5 lg:text-[18px]!">
            {h.bajada}
          </p>
          <div data-hero="rest" className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-8 lg:mt-10">
            <Button href="#postular" location="hero" cursor="postular" className="w-full sm:w-auto">
              {h.ctaPrimario}
            </Button>
            <Button variant="text" href="#ebook" location="hero_ebook" className="self-center sm:self-auto">
              {h.ctaSecundario}
            </Button>
          </div>
          <div data-hero="rest" className="mt-4 flex items-center gap-3 lg:mt-8">
            <Stars />
            <span className="text-[13px] text-paper/70 lg:text-[14px]">{h.microPrueba}</span>
          </div>
        </div>
      </div>

      {/* Indicador de scroll */}
      <div data-hero="rest" aria-hidden="true" className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 lg:[@media(min-height:860px)]:flex">
        <span className="font-display text-[11px] tracking-[0.3em] text-paper/60 uppercase">Scroll</span>
        <span className="scroll-cue relative block h-12 w-px overflow-hidden bg-paper/15" />
      </div>
    </section>
  );
}
