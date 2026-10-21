import { ArrowUpRight, FileDown } from "lucide-react";
import { site } from "@/content/site";
import { ImageSlot } from "@/components/ui/ImageSlot";

const WA = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

/** Parte 5 · Servicios: tarjetas con foto + descarga del brochure. */
export function Servicios() {
  const s = site.servicios;
  const link = (tipo: string, href: string | null) => {
    if (href) return href;
    if (WA) return `https://wa.me/${WA}?text=${encodeURIComponent(`Hola Alexis, quiero solicitar un(a) ${tipo.toLowerCase()}.`)}`;
    return s.brochureHref;
  };
  return (
    <section id="servicios" aria-labelledby="serv-title" className="section-paper on-paper on-light relative section-y">
      <div className="container-x">
        <div className="mx-auto max-w-[760px] text-center">
          <p data-reveal="up" className="t-eyebrow inline-flex items-center gap-3 text-ink-950/60">
            <span aria-hidden="true" className="h-px w-6 bg-accent-500" />
            {s.eyebrow}
            <span aria-hidden="true" className="h-px w-6 bg-accent-500" />
          </p>
          <h2 id="serv-title" data-reveal="lines" className="t-h2 mt-6 text-ink-950">
            {s.titulo}
          </h2>
        </div>

        <ul className="mt-14 grid gap-4 md:grid-cols-3 lg:mt-20 lg:gap-6" data-reveal-stagger="0.1">
          {s.items.map((it) => {
            const href = link(it.tipo, it.href);
            return (
              <li key={it.tipo}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative block overflow-hidden rounded-3xl bg-ink-950 text-paper"
                >
                  <ImageSlot
                    src={it.src}
                    alt={`${it.tipo} de Alexis González`}
                    label={it.tipo}
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="aspect-[4/5] md:aspect-[3/4]"
                    imgClassName="transition-transform duration-700 ease-out-expo group-hover:scale-[1.04]"
                  />
                  {/* Fundido de abajo hacia arriba: la mitad inferior queda oscura para que el texto se lea */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,var(--ink-950)_0%,rgb(10_10_11/0.92)_28%,rgb(10_10_11/0.55)_50%,rgb(10_10_11/0.12)_68%,transparent_80%)]"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-6 lg:p-8">
                    <h3 className="font-display text-[26px] leading-none font-black tracking-[-0.03em] uppercase lg:text-[30px]">{it.tipo}</h3>
                    <p className="mt-3 text-[15px] leading-snug text-paper/85">{it.detalle}</p>
                    <span className="mt-6 inline-flex items-center gap-2 text-[14px] font-bold text-accent-300 transition-colors group-hover:text-paper">
                      {it.cta}
                      <ArrowUpRight strokeWidth={2} className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                    </span>
                  </div>
                </a>
              </li>
            );
          })}
        </ul>

        <div data-reveal="up" className="mt-12 flex justify-center lg:mt-16">
          <a href={s.brochureHref} target="_blank" rel="noopener noreferrer" className="btn btn-primary t-btn rounded-full!">
            <span className="btn-label">
              <FileDown strokeWidth={1.75} className="size-5" aria-hidden="true" />
              {s.brochureCta}
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
