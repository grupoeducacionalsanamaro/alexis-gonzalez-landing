"use client";

import { site } from "@/content/site";
import { Eyebrow, AccentText } from "@/components/ui/Tag";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { Marquee } from "@/components/ui/Marquee";
import { Documental } from "./Documental";

/** Programas y experiencias: collage (una foto grande + cuatro). */
function Programas() {
  const s = site.sobre;
  const [primero, ...resto] = s.carrusel;
  const caption = (titulo: string, lugar: string, big = false) => (
    <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 rounded-b-2xl bg-[linear-gradient(to_top,rgb(10_10_11/0.9),transparent)] p-4 pt-14 lg:p-5 lg:pt-16">
      <span className={`block font-display leading-tight font-extrabold tracking-[-0.015em] text-paper ${big ? "text-[20px] lg:text-[24px]" : "text-[15px] lg:text-[17px]"}`}>{titulo}</span>
      <span className="mt-1 block text-[12px] text-paper/70 lg:text-[13px]">{lugar}</span>
    </figcaption>
  );
  return (
    <div className="container-x mt-24 lg:mt-32">
      <h3 data-reveal="up" className="t-h3 text-paper">
        {s.carruselTitulo}
      </h3>
      <ul className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:grid-rows-2 lg:gap-4" data-reveal-stagger="0.06">
        <li className="col-span-2 lg:row-span-2">
          <figure className="group relative h-full">
            <ImageSlot
              src={primero.src}
              alt={`Alexis González en ${primero.titulo}`}
              label={primero.titulo}
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="aspect-[4/3] h-full rounded-2xl lg:aspect-auto"
              imgClassName="transition-transform duration-700 ease-out-expo group-hover:scale-[1.03]"
            />
            {caption(primero.titulo, primero.lugar, true)}
          </figure>
        </li>
        {resto.map((c) => (
          <li key={c.titulo}>
            <figure className="group relative">
              <ImageSlot
                src={c.src}
                alt={`Alexis González en ${c.titulo}`}
                label={c.titulo}
                sizes="(min-width: 1024px) 25vw, 50vw"
                className="aspect-square rounded-2xl"
                imgClassName="transition-transform duration-700 ease-out-expo group-hover:scale-[1.04]"
              />
              {caption(c.titulo, c.lugar)}
            </figure>
          </li>
        ))}
      </ul>
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

      {/* Filosofía: texto centrado, la frase destacada sin dominar la sección */}
      <div className="container-x mt-20 lg:mt-28">
        <div className="mx-auto max-w-[760px] text-center">
          <p data-reveal="up" className="t-small text-[15px]!">
            {s.filosofiaIntro}
          </p>
          <blockquote data-reveal="up" className="mt-5 font-display text-[clamp(28px,3.4vw,46px)] leading-[1.08] font-black tracking-[-0.02em] text-paper">
            {pre}
            <AccentText sweep>próspero</AccentText>
            {/* “que exitoso.” siempre juntos en la misma línea */}
            {medio.replace(/ $/, " ")}
            <span className="text-outline tracking-[0.01em]">exitoso</span>
            {final}
          </blockquote>
          <p data-reveal="up" className="t-lead mx-auto mt-6 max-w-[620px] text-[16px] text-paper/75 lg:text-[18px]">
            {s.filosofiaCierre}
          </p>
        </div>
      </div>

      {/* Programas y experiencias (collage), luego el documental */}
      <Programas />

      <Documental />

      <Marquee items={s.paises} className="mt-20 border-y border-ink-700 py-6 lg:mt-28" />

    </section>
  );
}
