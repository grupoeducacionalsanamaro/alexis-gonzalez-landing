"use client";

import { useRef, useState } from "react";
import { site } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { Wireframe } from "@/components/ui/Wireframe";
import { EbookForm } from "@/components/forms/EbookForm";
import { track } from "@/lib/analytics";
import { isDesktopPointer } from "@/lib/animations";
import { useMotion } from "@/lib/useMotion";

function Book({ open }: { open: boolean }) {
  const e = site.ebook;
  return (
    <div className="book relative h-[300px] w-[225px] sm:h-[400px] sm:w-[300px]" data-open={open}>
      {/* contratapa, cantos de páginas, lomo */}
      <div className="book-face book-back" />
      <div className="book-pages" />
      <div className="book-pages-top" />
      <div className="book-pages-bottom" />
      <div className="book-spine" />
      <div className="book-face book-inner" />
      {/* tapa dura */}
      <div className="book-face book-cover overflow-hidden">
        <Wireframe variant="cluster" draw={false} strokeOpacity={0.5} stroke="#3a3a40" className="absolute -right-10 -bottom-6 w-[90%] opacity-60" />
        {/* textura del cartón forrado + viñeta + bisagra de la tapa */}
        <div aria-hidden="true" className="book-texture" />
        <div aria-hidden="true" className="book-vignette" />
        <div aria-hidden="true" className="book-hinge" />
        <div className="relative flex h-full flex-col p-6 pl-8 sm:p-8 sm:pl-10">
          <p className="font-display text-[9px] tracking-[0.3em] text-paper/60 uppercase sm:text-[10px]">Mini ebook</p>
          <p className="accent-text book-foil mt-auto font-display text-[24px] leading-[1.02] font-black uppercase tracking-[-0.02em] sm:text-[32px]">
            {e.tituloPortada[0]}
            <br />
            {e.tituloPortada[1]}
          </p>
          <span className="mt-4 block h-px w-full" style={{ background: "var(--accent-gradient)" }} />
          <p className="mt-3 font-display text-[9px] leading-snug tracking-[0.14em] text-paper/70 uppercase sm:text-[10px]">{e.subtituloPortada}</p>
          <p className="mt-8 font-display text-[10px] font-bold tracking-[0.24em] text-accent-300 uppercase sm:text-[11px]">Alexis González C.</p>
        </div>
        {/* reflejo de luz que se mueve con el tilt */}
        <div data-glare="" aria-hidden="true" className="pointer-events-none absolute -inset-1/2 bg-[linear-gradient(115deg,transparent_40%,rgb(255_255_255/0.09)_50%,transparent_60%)]" />
        <div aria-hidden="true" className="book-sheen" />
      </div>
    </div>
  );
}

export function Ebook() {
  const e = site.ebook;
  const [expanded, setExpanded] = useState(false);
  const [done, setDone] = useState<{ url: string | null } | null>(null);
  const ref = useRef<HTMLElement>(null);

  useMotion(ref, ({ gsap, reduced, scope }) => {
    const book = scope.querySelector<HTMLElement>(".book")!;
    const glare = scope.querySelector<HTMLElement>("[data-glare]")!;
    const mm = gsap.matchMedia();
    if (reduced) return () => mm.revert();

    gsap.fromTo(book, { y: 60, opacity: 0, rotateY: -40 }, { y: 0, opacity: 1, rotateY: -22, duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: book, start: "top 85%", once: true } });

    if (isDesktopPointer()) {
      // Tilt con cursor (máx. 12°) + reflejo
      const ry = gsap.quickTo(book, "rotateY", { duration: 0.8, ease: "power3.out" });
      const rx = gsap.quickTo(book, "rotateX", { duration: 0.8, ease: "power3.out" });
      const gx = gsap.quickTo(glare, "xPercent", { duration: 0.8, ease: "power3.out" });
      const scene = scope.querySelector<HTMLElement>(".book-scene")!;
      const onMove = (ev: PointerEvent) => {
        const r = scene.getBoundingClientRect();
        const nx = (ev.clientX - r.left) / r.width - 0.5;
        const ny = (ev.clientY - r.top) / r.height - 0.5;
        ry(-22 + nx * 24);
        rx(6 - ny * 24);
        gx(nx * 40);
      };
      const onLeave = () => {
        ry(-22);
        rx(6);
        gx(0);
      };
      scene.addEventListener("pointermove", onMove);
      scene.addEventListener("pointerleave", onLeave);
      return () => {
        scene.removeEventListener("pointermove", onMove);
        scene.removeEventListener("pointerleave", onLeave);
        mm.revert();
      };
    }
    // Mobile: rotación leve ligada al scroll
    gsap.fromTo(book, { rotateY: -30 }, { rotateY: -12, ease: "none", scrollTrigger: { trigger: book, start: "top bottom", end: "bottom top", scrub: true } });
    return () => mm.revert();
  });

  const open = () => {
    setExpanded(true);
    track("ebook_open");
  };

  return (
    <section id="ebook" ref={ref} aria-labelledby="ebook-title" data-own-motion="" className="relative overflow-hidden fade-both-900 section-y pt-12! lg:pt-16!">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <Wireframe variant="stack" draw={false} strokeOpacity={0.35} strokeWidth={0.7} className="absolute top-[10%] -left-16 w-[300px] md:w-[380px]" />
        <Wireframe variant="cube" draw={false} strokeOpacity={0.3} className="absolute right-[6%] bottom-[8%] w-[140px]" />
      </div>
      <div className="container-x relative grid items-center gap-16 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-6">
          <p className="font-display text-[clamp(20px,2.2vw,28px)] leading-tight font-extrabold tracking-[-0.02em] text-paper/90">{e.antetitulo}</p>
          <h2 id="ebook-title" className="t-quote accent-text mt-4 pr-2">
            {e.titulo}
          </h2>
          <p className="t-body mt-6 max-w-[520px] text-[19px]! text-paper!">{e.bajada}</p>
          <p className="t-body mt-4 max-w-[520px]">
            {e.reflexionPre} <strong className="font-bold text-paper">{e.reflexionBold}</strong> {e.reflexionPost}
          </p>

          <div className="mt-10">
            {!expanded && (
              <Button variant="accent" onClick={open} location="ebook_open">
                {e.cta}
              </Button>
            )}
            <div className="acc-panel" data-open={expanded}>
              <div>
                <div className="card-dark mt-2 p-6 md:p-8" inert={!expanded}>
                  {done ? (
                    <div className="flex flex-col items-start gap-5" aria-live="polite">
                      <div>
                        <p className="font-display text-[22px] font-extrabold tracking-[-0.02em] text-paper">{e.exitoTitulo}</p>
                        <p className="t-small mt-1">{e.exitoEmail}</p>
                      </div>
                      {done.url && (
                        <Button variant="accent" href={done.url} external location="ebook_download">
                          {e.exitoDescargar}
                        </Button>
                      )}
                      <Button variant="text" href="#postular" location="ebook_to_apply" cursor="postular">
                        {e.exitoPostular}
                      </Button>
                    </div>
                  ) : (
                    expanded && <EbookForm location="ebook_section" onSuccess={(url) => setDone({ url })} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="book-scene flex justify-center py-6 lg:col-span-6 lg:py-0">
          <div className="relative">
            <div aria-hidden="true" className="absolute top-1/2 left-1/2 size-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: "radial-gradient(circle, rgb(138 23 178 / 0.12), transparent 65%)" }} />
            {/* sombra proyectada en el piso */}
            <div aria-hidden="true" className="book-floor-shadow" />
            <Book open={!!done} />
          </div>
        </div>
      </div>
    </section>
  );
}
