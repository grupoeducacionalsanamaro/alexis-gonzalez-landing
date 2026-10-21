"use client";

import { useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";
import { site } from "@/content/site";
import { Eyebrow } from "@/components/ui/Tag";
import { track } from "@/lib/analytics";

/**
 * Documental de YouTube. Se carga y reproduce solo al llegar a la sección
 * (silenciado: los navegadores no permiten autoplay con sonido). Antes de eso
 * se muestra la miniatura, así la página no carga el reproductor de YouTube.
 */
export function Documental() {
  const d = site.sobre.documental;
  const ref = useRef<HTMLDivElement>(null);
  const [play, setPlay] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || play) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setPlay(true);
          track("documental_autoplay");
        }
      },
      { threshold: 0.55 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [play]);

  const src = `https://www.youtube-nocookie.com/embed/${d.youtubeId}?autoplay=1&mute=1&playsinline=1&rel=0&modestbranding=1`;

  return (
    <div className="container-x mt-24 lg:mt-32">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div data-reveal="up">
            <Eyebrow>{d.eyebrow}</Eyebrow>
          </div>
          <h3 data-reveal="up" className="t-h2 mt-5 text-paper">
            {d.titulo}
          </h3>
        </div>
      </div>
      <div ref={ref} data-reveal="up" className="relative mt-10 aspect-video overflow-hidden rounded-2xl bg-ink-900 ring-1 ring-ink-700">
        {play ? (
          <iframe
            src={src}
            title={`${d.eyebrow}: ${d.titulo}`}
            className="absolute inset-0 size-full"
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
          />
        ) : (
          <button type="button" onClick={() => setPlay(true)} className="group absolute inset-0" aria-label={`Reproducir ${d.eyebrow.toLowerCase()}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://i.ytimg.com/vi/${d.youtubeId}/maxresdefault.jpg`}
              alt=""
              loading="lazy"
              className="absolute inset-0 size-full object-cover opacity-80 transition-opacity duration-500 group-hover:opacity-100"
            />
            <span className="absolute inset-0 grid place-items-center">
              <span className="grid size-20 place-items-center rounded-full bg-accent-500 text-paper shadow-[0_0_48px_rgb(138_23_178/0.5)] transition-transform duration-300 group-hover:scale-105">
                <Play className="ml-1 size-8 fill-current" aria-hidden="true" />
              </span>
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
