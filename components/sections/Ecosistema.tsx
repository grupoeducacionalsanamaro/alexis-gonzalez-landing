import Image from "next/image";
import { site } from "@/content/site";

/** Parte 3 · Ecosistema: logos agrupados por área sobre fondo claro. */
export function Ecosistema() {
  const e = site.ecosistema;
  return (
    <section id="ecosistema" aria-labelledby="eco-title" className="section-paper on-paper relative section-y">
      <div className="container-x">
        <div className="max-w-[760px]">
          <p data-reveal="up" className="t-eyebrow flex items-center gap-3 text-ink-950/60">
            <span aria-hidden="true" className="h-px w-6 bg-accent-500" />
            {e.eyebrow}
          </p>
          <h2 id="eco-title" data-reveal="lines" className="t-h2 mt-6 text-ink-950">
            {e.titulo}
          </h2>
        </div>

        <div className="mt-14 flex flex-col gap-14 lg:mt-20 lg:gap-16">
          {e.grupos.map((g) => (
            <div key={g.nombre} className="grid gap-6 border-t border-ink-950/10 pt-8 lg:grid-cols-12 lg:items-center lg:gap-8">
              <div data-reveal="up" className={`lg:col-span-3 ${g.destacado ? "mx-auto flex w-fit flex-col items-center text-center lg:mx-0" : ""}`}>
                <h3 className="font-display text-[20px] leading-snug font-extrabold tracking-[-0.015em] text-ink-950">{g.nombre}</h3>
                {g.destacado && (
                  <div className="mt-4 flex w-fit flex-col items-center gap-3">
                    {g.destacadoLogo && (
                      <Image src={g.destacadoLogo} alt="" width={64} height={64} unoptimized className="size-16 shrink-0 object-contain" />
                    )}
                    <p className="inline-flex rounded-full bg-[#686A6C] px-3.5 py-1.5 text-[13px] font-semibold whitespace-nowrap text-paper">{g.destacado}</p>
                  </div>
                )}
              </div>
              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:col-span-9 lg:gap-4 xl:grid-cols-5" data-reveal-stagger="0.05">
                {g.marcas.map((m) => (
                  <li
                    key={m.nombre}
                    className="relative grid h-[148px] place-items-center rounded-2xl bg-white px-4 text-center ring-1 ring-ink-950/[0.07] transition-[box-shadow,transform] duration-300 ease-out-quart hover:-translate-y-0.5 hover:shadow-[0_12px_32px_-12px_rgb(138_23_178/0.35)] hover:ring-accent-500/40 lg:h-[160px]"
                  >
                    {m.logo ? (
                      <span className="flex w-full flex-col items-center gap-2.5">
                        <span className="relative h-[68px] w-full max-w-[150px] lg:h-[76px]">
                          <Image src={m.logo} alt={m.nombre} fill sizes="150px" unoptimized className="object-contain" />
                        </span>
                        <span className="text-[11px] leading-tight font-semibold text-ink-950/55">{m.nombre}</span>
                      </span>
                    ) : (
                      <span className="flex flex-col items-center gap-1.5">
                        <span className="font-display text-[14px] leading-tight font-extrabold tracking-[-0.01em] text-ink-950/80 lg:text-[15px]">{m.nombre}</span>
                        <span className="text-[10px] font-semibold tracking-[0.18em] text-ink-950/35 uppercase">Logo pendiente</span>
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
