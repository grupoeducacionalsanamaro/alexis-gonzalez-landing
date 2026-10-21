"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { site } from "@/content/site";
import { Eyebrow, AccentText } from "@/components/ui/Tag";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { Marquee } from "@/components/ui/Marquee";
import { Documental } from "./Documental";

function Carrusel() {
  const s = site.sobre;
  const track = useRef<HTMLDivElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });

  const onScroll = () => {
    const el = track.current;
    if (!el) return;
    setEdge({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 8 });
  };
  const move = (dir: 1 | -1) => {
    const el = track.current;
    const card = el?.firstElementChild as HTMLElement | null;
    if (!el || !card) return;
    el.scrollBy({ left: dir * (card.offsetWidth + 16), behavior: "smooth" });
  };

  return (
    <div className="mt-24 lg:mt-32">
      <div className="container-x flex items-end justify-between gap-6">
        <h3 data-reveal="up" className="t-h3 text-paper">
          {s.carruselTitulo}
        </h3>
        <div className="hidden gap-2 sm:flex">
          {([-1, 1] as const).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => move(d)}
              disabled={d === -1 ? edge.start : edge.end}
              aria-label={d === -1 ? "Ver anteriores" : "Ver siguientes"}
              className="grid size-12 place-items-center rounded-full border border-ink-700 text-paper transition-colors duration-200 hover:border-accent-300 hover:bg-accent-500 disabled:pointer-events-none disabled:opacity-30"
            >
              {d === -1 ? <ChevronLeft strokeWidth={1.5} className="size-5" /> : <ChevronRight strokeWidth={1.5} className="size-5" />}
            </button>
          ))}
        </div>
      </div>
      <div
        ref={track}
        onScroll={onScroll}
        className="no-scrollbar mt-8 flex snap-x snap-mandatory scroll-px-6 gap-4 overflow-x-auto px-6 pb-2 lg:scroll-px-16 lg:px-16"
        aria-label={s.carruselTitulo}
        role="region"
        tabIndex={0}
      >
        {s.carrusel.map((c) => (
          <figure key={c.titulo} className="group relative w-[78vw] shrink-0 snap-start sm:w-[44vw] lg:w-[30vw] lg:max-w-[420px]">
            <ImageSlot
              src={c.src}
              alt={`Alexis González en ${c.titulo}`}
              label={c.titulo}
              sizes="(min-width: 1024px) 30vw, 78vw"
              className="aspect-[4/5] rounded-2xl"
              imgClassName="transition-transform duration-700 ease-out-expo group-hover:scale-[1.04]"
            />
            <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 rounded-b-2xl bg-[linear-gradient(to_top,rgb(10_10_11/0.9),transparent)] p-5 pt-16">
              <span className="block font-display text-[19px] leading-tight font-extrabold tracking-[-0.015em] text-paper">{c.titulo}</span>
              <span className="mt-1 block text-[13px] text-paper/70">{c.lugar}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}

export function SobreAlexis() {
  const s = site.sobre;
  const [pre, resto] = s.filosofia.split("próspero");
  const [medio, final] = resto.split("exitoso");

  return (
    <section id="sobre-mi" aria-labelledby="sobre-title" className="relative overflow-hidden bg-ink-950 section-y">
      <div className="container-x grid gap-14 lg:grid-cols-12 lg:items-start lg:gap-12">
        {/* Foto 1080×1350 */}
        <div data-reveal="up" className="lg:col-span-5">
          <ImageSlot
            src={s.foto.src}
            alt={s.foto.alt}
            sizes="(min-width: 1024px) 40vw, 100vw"
            unoptimized
            className="aspect-[1080/1350] w-full max-w-[1080px] rounded-2xl"
          />
        </div>

        {/* Bio */}
        <div data-bio="" className="lg:col-span-7 lg:pl-4">
          <div data-reveal="up">
            <Eyebrow>{s.eyebrow}</Eyebrow>
          </div>
          <h2 id="sobre-title" data-reveal="lines" className="t-h2 mt-5 text-[clamp(32px,3.2vw,46px)]! font-black! text-paper uppercase">
            {s.nombre}
          </h2>
          <p data-reveal="up" className="t-eyebrow mt-3 text-accent-300!">
            {s.rol}
          </p>
          <div className="mt-5 flex flex-col gap-3" data-reveal-stagger="0.08">
            {s.bio.map((p) => (
              <p key={p} className="text-[15px] leading-[1.6] text-paper/80">
                {p}
              </p>
            ))}
          </div>

          <div data-reveal="up" className="mt-5">
            <p className="t-lead text-[14px] text-paper">{s.formacionTitulo}</p>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {s.formacion.map((f) => (
                <li key={f} className="rounded-full border border-ink-700 px-3 py-1.5 text-[12.5px] font-medium text-paper/85">
                  {f}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-5 flex flex-col gap-3" data-reveal-stagger="0.08">
            {s.bio2.map((p) => (
              <p key={p} className="text-[15px] leading-[1.6] text-paper/80">
                {p}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Filosofía */}
      <div className="container-x mt-24 lg:mt-36">
        <div className="mx-auto max-w-[1040px] border-t border-ink-700 pt-14 lg:pt-20">
          <p data-reveal="up" className="t-small text-[15px]!">
            {s.filosofiaIntro}
          </p>
          <blockquote data-reveal="lines" className="mt-6 font-display text-[clamp(40px,6.4vw,96px)] leading-[0.95] font-black tracking-[-0.045em] text-paper">
            {pre}
            <AccentText sweep>próspero</AccentText>
            {medio}
            <span className="text-outline">exitoso</span>
            {final}
          </blockquote>
          <p data-reveal="up" className="t-lead mt-10 max-w-[680px] text-[18px] text-paper/80 lg:text-[21px]">
            {s.filosofiaCierre}
          </p>
        </div>
      </div>

      <Marquee items={s.paises} className="mt-20 border-y border-ink-700 py-6 lg:mt-28" />

      <Carrusel />

      <Documental />
    </section>
  );
}
