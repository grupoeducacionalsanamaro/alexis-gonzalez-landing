"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { site, type Testimonio } from "@/content/site";
import { Card } from "@/components/ui/Card";

/** Oculto por defecto (site.flags.showTestimonios). Nunca mostrar testimonios inventados. */
export function Testimonios() {
  const [modal, setModal] = useState<Testimonio | null>(null);
  if (!site.flags.showTestimonios || site.testimonios.length === 0) return null;
  return (
    <section id="testimonios" aria-labelledby="test-title" className="relative bg-ink-950 section-y">
      <div className="container-x">
        <h2 id="test-title" data-reveal="lines" className="t-h2 text-paper">
          Lo que dicen los mentorados
        </h2>
        <ul className="mt-14 grid gap-6 lg:grid-cols-2" data-reveal-stagger="0.1">
          {site.testimonios.map((t) => (
            <li key={t.nombre}>
              <Card interactive className="h-full p-8 md:p-10">
                <div className="relative z-10">
                  {t.video ? (
                    <button type="button" onClick={() => setModal(t)} className="relative mb-8 block aspect-video w-full overflow-hidden rounded-[4px]" aria-label={`Ver testimonio de ${t.nombre}`}>
                      <video
                        src={t.video}
                        muted
                        playsInline
                        loop
                        preload="metadata"
                        className="size-full object-cover"
                        onMouseEnter={(e) => e.currentTarget.play()}
                        onMouseLeave={(e) => e.currentTarget.pause()}
                      />
                    </button>
                  ) : null}
                  <blockquote className="gold-text font-quote text-[24px] leading-tight font-bold italic md:text-[30px]">“{t.cita}”</blockquote>
                  <p className="t-body mt-6">{t.resultado}</p>
                  <div className="mt-8 flex items-center gap-4">
                    {t.foto && <Image src={t.foto} alt="" width={48} height={48} className="photo-bw size-12 rounded-full object-cover" />}
                    <div>
                      <p className="font-display text-[16px] font-medium text-paper">{t.nombre}</p>
                      <p className="t-small">{t.especialidad}</p>
                    </div>
                  </div>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      </div>
      {modal?.video && (
        <div role="dialog" aria-modal="true" aria-label={`Testimonio de ${modal.nombre}`} className="fixed inset-0 z-[75] grid place-items-center bg-ink-950/90 p-6" onClick={() => setModal(null)}>
          <button type="button" aria-label="Cerrar" className="absolute top-4 right-4 grid size-12 place-items-center text-paper" onClick={() => setModal(null)}>
            <X strokeWidth={1.5} />
          </button>
          <video src={modal.video} controls autoPlay playsInline className="max-h-[80vh] w-full max-w-[960px] rounded-[4px]" />
        </div>
      )}
    </section>
  );
}
