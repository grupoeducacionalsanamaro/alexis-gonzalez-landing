"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { site } from "@/content/site";
import { track } from "@/lib/analytics";
import { hasSubmitted } from "@/lib/formUtils";
import { isDesktopPointer } from "@/lib/animations";
import { useFocusTrap } from "@/lib/useFocusTrap";
import { EbookForm } from "@/components/forms/EbookForm";
import { Button } from "@/components/ui/Button";
import { lockScroll, unlockScroll } from "./SmoothScroll";

const KEY = "ag_exit_shown";

/** Modal sobrio ofreciendo el ebook al salir por el borde superior (desktop, 1 vez por sesión). */
export function ExitIntent() {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState<string | null | undefined>(undefined);
  const ref = useRef<HTMLDivElement>(null);
  const close = () => setOpen(false);
  useFocusTrap(ref, open, close);

  useEffect(() => {
    if (!site.flags.showExitIntent || !isDesktopPointer()) return;
    let armed = false;
    const arm = window.setTimeout(() => (armed = true), 8000); // no molestar en los primeros segundos
    const onOut = (e: MouseEvent) => {
      if (!armed || e.relatedTarget || e.clientY > 8) return;
      try {
        if (sessionStorage.getItem(KEY) || hasSubmitted()) return;
        sessionStorage.setItem(KEY, "1");
      } catch {
        return;
      }
      setOpen(true);
      track("exit_intent_shown");
    };
    document.addEventListener("mouseout", onOut);
    return () => {
      window.clearTimeout(arm);
      document.removeEventListener("mouseout", onOut);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    lockScroll();
    return () => unlockScroll();
  }, [open]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[70] grid place-items-center p-6" onMouseDown={(e) => e.target === e.currentTarget && close()}>
      <div aria-hidden="true" className="absolute inset-0 bg-ink-950/70 backdrop-blur-sm" style={{ animation: "fade-in 400ms var(--ease-out-quart)" }} />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="exit-title"
        className="card-glass relative w-full max-w-[560px] rounded-[4px] p-8 md:p-10"
        style={{ animation: "modal-in 600ms var(--ease-out-expo)" }}
      >
        <button type="button" onClick={close} aria-label="Cerrar" className="absolute top-3 right-3 grid size-12 place-items-center text-paper/70 transition-colors hover:text-paper">
          <X strokeWidth={1.5} className="size-5" />
        </button>
        <p className="t-eyebrow flex items-center gap-3 text-paper/70">
          <span aria-hidden="true" className="h-px w-6 bg-accent-500" />
          {site.exitIntent.eyebrow}
        </p>
        <h2 id="exit-title" className="t-quote accent-text mt-5 text-[34px]!">
          {site.exitIntent.titulo}
        </h2>
        <p className="t-body mt-4 text-[16px]!">{site.exitIntent.bajada}</p>
        <div className="mt-6">
          {url === undefined ? (
            <EbookForm location="exit_intent" onSuccess={(u) => setUrl(u)} autoFocus />
          ) : (
            <div className="flex flex-col gap-4">
              <div>
                <p className="text-paper">{site.ebook.exitoTitulo}</p>
                <p className="t-small mt-1">{site.ebook.exitoEmail}</p>
              </div>
              {url && (
                <Button variant="accent" href={url} external location="exit_intent_download">
                  {site.ebook.exitoDescargar}
                </Button>
              )}
              <Button variant="text" href="/mentoria" location="exit_intent_postular" onClick={close}>
                {site.ebook.exitoPostular}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
