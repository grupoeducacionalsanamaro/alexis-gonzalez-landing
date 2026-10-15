"use client";

import { useEffect, useMemo } from "react";
import { site } from "@/content/site";
import { track } from "@/lib/analytics";
import { Button } from "@/components/ui/Button";
import { Stars } from "@/components/ui/Stars";
import type { Resultado as R } from "./types";

const BOOKING = process.env.NEXT_PUBLIC_BOOKING_URL;
const WA = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

export function Resultado({ result, nombre, email }: { result: R; nombre: string; email: string }) {
  const T = site.applyForm.resultado;
  const calificado = result.segmento !== "nutrir";

  const src = useMemo(() => {
    if (!BOOKING) return null;
    try {
      const u = new URL(BOOKING);
      u.searchParams.set("name", nombre);
      u.searchParams.set("email", email);
      if (u.hostname.includes("calendly")) {
        u.searchParams.set("embed_domain", window.location.hostname);
        u.searchParams.set("embed_type", "Inline");
        u.searchParams.set("hide_gdpr_banner", "1");
      }
      return u.toString();
    } catch {
      return null;
    }
  }, [nombre, email]);

  // Evento de reserva desde el widget (Calendly / Cal.com)
  useEffect(() => {
    if (!calificado || !src) return;
    let fired = false;
    const onMsg = (e: MessageEvent) => {
      const raw = typeof e.data === "string" ? e.data : JSON.stringify(e.data ?? "");
      if (!fired && /event_scheduled|bookingSuccessful|booking_successful/i.test(raw)) {
        fired = true;
        track("call_booked", { segmento: result.segmento });
      }
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, [calificado, src, result.segmento]);

  if (calificado) {
    return (
      <div className="text-ink-950">
        <p className="t-eyebrow flex items-center gap-3 text-ink-950/70">
          <span aria-hidden="true" className="h-px w-6 bg-gold-500" />
          {T.calificadoEyebrow}
        </p>
        <h3 className="t-h3 mt-4" tabIndex={-1} data-result-heading="">
          {T.calificadoTitulo}
        </h3>
        <Stars className="mt-4" />
        {src ? (
          <>
            <p className="mt-4 text-[16px] opacity-75">{T.calificadoBajada}</p>
            <div className="mt-6 overflow-hidden rounded-[4px] border border-ink-950/10 bg-white">
              <iframe src={src} title="Agenda tu conversación estratégica" className="h-[680px] w-full" loading="lazy" />
            </div>
          </>
        ) : (
          <>
            <p className="mt-4 max-w-[560px] text-[16px] opacity-75">{T.sinAgenda}</p>
            {WA && (
              <div className="mt-6">
                <Button
                  variant="primary"
                  href={`https://wa.me/${WA}?text=${encodeURIComponent(site.whatsapp.mensaje)}`}
                  external
                  onClick={() => track("whatsapp_click", { location: "resultado" })}
                >
                  WhatsApp
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    );
  }

  const podcasts = site.ecosistema.items.filter((i) => i.titulo.toLowerCase().includes("podcast") && i.href);
  return (
    <div className="text-ink-950">
      <p className="t-eyebrow flex items-center gap-3 text-ink-950/70">
        <span aria-hidden="true" className="h-px w-6 bg-gold-500" />
        {T.nutrirEyebrow}
      </p>
      <h3 className="t-h3 mt-4" tabIndex={-1} data-result-heading="">
        {T.nutrirTitulo}
      </h3>
      <p className="mt-4 max-w-[600px] text-[16px] opacity-75">{T.nutrirBajada}</p>
      <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
        {result.ebookUrl ? (
          <Button variant="primary" href={result.ebookUrl} external location="resultado_ebook">
            {T.nutrirEbook}
          </Button>
        ) : (
          <Button variant="primary" href="#ebook" location="resultado_ebook">
            {T.nutrirEbook}
          </Button>
        )}
        {podcasts.map((p) => (
          <a key={p.titulo} href={p.href!} target="_blank" rel="noopener noreferrer" className="t-btn underline-offset-8 hover:underline">
            {T.nutrirPodcast}: {p.titulo.replace(/^Podcast\s*/i, "")} →
          </a>
        ))}
      </div>
    </div>
  );
}
