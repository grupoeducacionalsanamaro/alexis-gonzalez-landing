"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { site } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { ApplyForm } from "@/components/forms/ApplyForm";
import { lockScroll, unlockScroll } from "@/components/layout/SmoothScroll";
import { useFocusTrap } from "@/lib/useFocusTrap";
import { Monogram } from "@/components/layout/Monogram";

function useIsDesktop() {
  const [v, setV] = useState<boolean | null>(null);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const on = () => setV(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return v;
}

export function Postulacion() {
  const p = site.postulacion;
  const isDesktop = useIsDesktop();
  const [overlay, setOverlay] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const close = () => setOverlay(false);
  useFocusTrap(overlayRef, overlay, close);

  useEffect(() => {
    if (!overlay) return;
    lockScroll();
    window.dispatchEvent(new CustomEvent("ag:apply-overlay", { detail: true }));
    return () => {
      unlockScroll();
      window.dispatchEvent(new CustomEvent("ag:apply-overlay", { detail: false }));
    };
  }, [overlay]);

  useEffect(() => {
    if (isDesktop && overlay) {
      const t = window.setTimeout(() => setOverlay(false), 0);
      return () => window.clearTimeout(t);
    }
  }, [isDesktop, overlay]);

  return (
    <section id="postular" aria-labelledby="post-title" className="relative overflow-hidden bg-ink-950 py-12 lg:py-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(50% 45% at 50% 45%, rgb(138 23 178 / 0.10), transparent 70%)" }}
      />
      <div className="container-x relative">
        <div data-reveal="up" className="card-light mx-auto max-w-[880px] p-7 sm:p-10 md:p-14">
          <h2 id="post-title" className="font-display text-[28px] leading-[1.1] font-extrabold tracking-[-0.025em] md:text-[40px]">
            {p.titulo}
          </h2>
          <div className="mt-8 grid gap-8 md:grid-cols-[1fr_1fr] md:gap-10">
            <div>
              <p className="t-eyebrow text-ink-950/60">{p.evaluacionTitulo}</p>
              <ol className="mt-4 flex flex-col gap-3">
                {p.evaluacion.map((e, i) => (
                  <li key={e} className="flex items-baseline gap-4 border-b border-ink-950/10 pb-3 text-[16px] md:text-[17px]">
                    <span className="font-display text-[13px] font-bold text-accent-700 tabular-nums">0{i + 1}</span>
                    {e}
                  </li>
                ))}
              </ol>
            </div>
            <div className="flex flex-col justify-between gap-6">
              <p className="text-[17px] leading-relaxed text-ink-950/80 md:text-[19px]">{p.siCumples}</p>
              {p.cuposTexto && (
                <p className="inline-flex w-fit items-center gap-2 rounded-[2px] bg-ink-950 px-4 py-2 font-display text-[13px] font-medium text-paper">
                  <span aria-hidden="true" className="size-1.5 rounded-full bg-accent-500" />
                  {p.cuposTexto}
                </p>
              )}
            </div>
          </div>

          <div className="mt-12 border-t border-ink-950/10 pt-10">
            {isDesktop === true && <ApplyForm location="postulacion_desktop" />}
            {isDesktop !== true && (
              <div className="lg:hidden">
                <Button variant="primary" onClick={() => setOverlay(true)} location="postulacion_mobile_open" className="w-full" magnetic={false}>
                  {p.ctaAbrir}
                </Button>
              </div>
            )}
          </div>
        </div>
        <p data-reveal="up" className="t-small mx-auto mt-8 max-w-[640px] text-center">
          {p.nota}
        </p>
      </div>

      {/* Overlay mobile a pantalla completa */}
      {overlay && (
        <div
          ref={overlayRef}
          role="dialog"
          aria-modal="true"
          aria-label="Postulación a la mentoría"
          className="on-light fixed inset-0 z-[75] overflow-y-auto overscroll-contain bg-paper text-ink-950"
          style={{ animation: "modal-in 500ms var(--ease-out-expo)" }}
          data-lenis-prevent=""
        >
          <div className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-ink-950/10 bg-paper/95 px-5 backdrop-blur">
            <span className="flex items-center gap-3">
              <Monogram className="size-8" stroke="var(--ink-950)" />
              <span className="t-eyebrow">Postulación</span>
            </span>
            <button type="button" onClick={close} aria-label="Cerrar postulación" className="grid size-12 place-items-center">
              <X strokeWidth={1.5} className="size-5" />
            </button>
          </div>
          <div className="px-5 pt-8 pb-[calc(40px+env(safe-area-inset-bottom))]">
            <ApplyForm location="postulacion_mobile" />
          </div>
        </div>
      )}
    </section>
  );
}
