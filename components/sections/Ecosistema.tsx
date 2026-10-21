import { ArrowUpRight } from "lucide-react";
import { site } from "@/content/site";
import { Card } from "@/components/ui/Card";

export function Ecosistema() {
  const e = site.ecosistema;
  return (
    <section id="ecosistema" aria-labelledby="eco-title" className="relative bg-ink-950 section-y">
      <div className="container-x">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <h2 id="eco-title" data-reveal="lines" className="t-h2 text-paper">
            {e.titulo}
          </h2>
          <p data-reveal="up" className="t-body md:text-right">
            {e.bajada}
          </p>
        </div>
        <ul className="mt-12 grid gap-4 md:mt-16 md:grid-cols-2 lg:grid-cols-3 lg:gap-6" data-reveal-stagger="0.06">
          {e.items.map((it, i) => {
            const inner = (
              <div className="relative z-10 flex h-full min-h-[180px] flex-col">
                <div className="flex items-start justify-between gap-4">
                  <span className="font-display text-[13px] font-semibold text-paper/40 tabular-nums">0{i + 1}</span>
                  {it.href && (
                    <ArrowUpRight
                      strokeWidth={1.5}
                      aria-hidden="true"
                      className="size-5 -translate-x-1 translate-y-1 text-accent-300 opacity-0 transition-all duration-300 ease-out-quart group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100"
                    />
                  )}
                </div>
                <h3 className="mt-auto font-display text-[21px] leading-snug font-extrabold tracking-[-0.015em] text-paper md:text-[23px]">{it.titulo}</h3>
                <p className="t-small mt-2 text-[15px]!">{it.detalle}</p>
              </div>
            );
            return (
              <li key={it.titulo}>
                <Card interactive className="group h-full p-7 md:p-8">
                  {it.href ? (
                    <a href={it.href} target="_blank" rel="noopener noreferrer" className="block h-full after:absolute after:inset-0 after:content-['']">
                      {inner}
                    </a>
                  ) : (
                    inner
                  )}
                </Card>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
