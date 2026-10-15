"use client";

import { useRef } from "react";
import Image from "next/image";
import { site } from "@/content/site";
import { Tag, GoldText } from "@/components/ui/Tag";
import { Counter } from "@/components/ui/Counter";
import { Marquee } from "@/components/ui/Marquee";
import { useMotion } from "@/lib/useMotion";

export function QuienSoy() {
  const q = site.quienSoy;
  const galleryRef = useRef<HTMLDivElement>(null);

  // Galería: se desplaza horizontalmente en sentido contrario al scroll (desktop)
  useMotion(galleryRef, ({ gsap, reduced, scope }) => {
    if (reduced) return;
    const track = scope.querySelector<HTMLElement>("[data-track]")!;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
      gsap.fromTo(track, { x: "4%" }, { x: "-15%", ease: "none", scrollTrigger: { trigger: scope, start: "top bottom", end: "bottom top", scrub: true } });
    });
    return () => mm.revert();
  });

  return (
    <section id="sobre-mi" aria-labelledby="quien-title" className="relative overflow-hidden fade-both-900 section-y">
      <div className="container-x">
        <div className="grid items-stretch gap-6 lg:grid-cols-2 lg:gap-8">
          {/* Retrato */}
          <div data-reveal="up" data-cursor="ver" className="group relative aspect-[4/5] overflow-hidden rounded-[4px] border border-ink-700 transition-colors duration-500 hover:border-gold-500 lg:aspect-auto lg:min-h-[640px]">
            <div data-parallax="6" className="absolute -inset-y-[8%] inset-x-0">
              <Image
                src={q.imagen}
                alt={q.imagenAlt}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="photo-bw photo-bw-hover object-cover object-[50%_20%]"
              />
            </div>
            <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(to_top,rgb(10_10_11/0.5),transparent_40%)]" />
          </div>

          {/* Card clara */}
          <div data-reveal="up" className="card-light flex flex-col justify-center p-8 md:p-12 lg:p-14">
            <div>
              <Tag className="bg-ink-950! text-paper!">{q.tag}</Tag>
            </div>
            <h2 id="quien-title" className="mt-8 font-display text-[36px] leading-[1.05] font-medium tracking-[-0.01em] md:text-[52px]">
              {q.saludoPre} <span className="font-semibold">{q.saludoNombre}</span>
            </h2>
            <span data-grow="" aria-hidden="true" className="mt-5 block h-px w-24 origin-left" style={{ background: "var(--gold-gradient)" }} />
            <ul className="mt-8 flex flex-col gap-4 text-[16px] leading-relaxed text-ink-950/80 md:text-[17px]">
              {q.bio.map((b) => (
                <li key={b} className="flex gap-4">
                  <span aria-hidden="true" className="mt-[11px] h-px w-4 shrink-0 bg-ink-950/40" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <p className="mt-8 inline-flex w-fit items-center gap-2 rounded-[2px] bg-ink-950 px-4 py-2.5 font-display text-[14px] font-medium text-paper">
              {q.badge} <GoldText className="font-semibold">{site.marca}</GoldText>
            </p>
            <p className="mt-6 text-[16px] leading-relaxed text-ink-950/80 md:text-[17px]">{q.cierre}</p>
          </div>
        </div>

        {/* Cifras */}
        <dl className="mt-16 grid grid-cols-3 gap-4 border-y border-ink-700 py-10 md:mt-24 md:gap-8 md:py-14" data-reveal-stagger="0.1">
          {q.cifras.map((c) => (
            <div key={c.label} className="flex flex-col gap-2 md:gap-3">
              <dt className="order-2 text-[13px] leading-snug text-mist md:text-[16px]">{c.label}</dt>
              <dd className="order-1 font-display text-[44px] leading-none font-semibold tracking-[-0.03em] text-paper md:text-[88px]">
                {c.prefijo && <span className="text-gold-500">{c.prefijo}</span>}
                <Counter to={c.valor} />
                {c.sufijo}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Galería de autoridad */}
      <div ref={galleryRef} className="mt-16 md:mt-24">
        <div data-track="" className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 lg:snap-none lg:gap-6 lg:overflow-visible lg:px-16">
          {q.galeria.map((g) => (
            <figure
              key={g.src}
              data-cursor="ver"
              className="group relative aspect-[4/5] w-[78vw] shrink-0 snap-center overflow-hidden rounded-[4px] border border-ink-700 sm:w-[46vw] lg:w-[34vw] lg:max-w-[520px]"
            >
              <Image src={g.src} alt={g.alt} fill sizes="(min-width: 1024px) 34vw, 78vw" className="photo-bw photo-bw-hover object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.03]" />
              <figcaption className="absolute inset-x-0 bottom-0 overflow-hidden">
                <span className="gallery-cap block bg-[linear-gradient(to_top,rgb(10_10_11/0.85),transparent)] px-5 pt-10 pb-5 t-eyebrow text-paper">
                  {g.pie}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      <Marquee items={q.marquee} className="mt-16 border-y border-ink-700 py-6 md:mt-24" />
    </section>
  );
}
