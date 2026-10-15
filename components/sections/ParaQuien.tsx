import { site } from "@/content/site";
import { Tag } from "@/components/ui/Tag";
import { Button } from "@/components/ui/Button";

function CheckSvg() {
  return (
    <svg data-draw="" viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden="true" className="mt-1 shrink-0">
      <circle cx="12" cy="12" r="11" stroke="var(--ok)" strokeOpacity="0.5" strokeWidth="1" />
      <path d="M7 12.5l3.2 3L17 8.5" stroke="var(--ok)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function CrossSvg() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true" className="mt-1 shrink-0">
      <path d="M7 7l10 10M17 7L7 17" stroke="var(--no)" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function ParaQuien() {
  const p = site.paraQuien;
  return (
    <section id="para-quien" aria-labelledby="pq-title" className="relative fade-both-900 section-y">
      <div className="container-x grid gap-16 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-7">
          <div data-reveal="up">
            <Tag>{p.tag}</Tag>
          </div>
          <h2 id="pq-title" className="sr-only">
            {p.tag}
          </h2>
          <ul className="mt-10 flex flex-col gap-6" data-reveal-stagger="0.1">
            {p.si.map((s) => (
              <li key={s} className="flex gap-4 font-display text-[20px] leading-snug font-medium text-paper md:text-[26px]">
                <CheckSvg />
                <span>{s}</span>
              </li>
            ))}
          </ul>
          <div data-reveal="up" className="mt-10">
            <Button variant="text" href="#postular" location="para_quien" cursor="postular">
              {p.ctaTexto}
            </Button>
          </div>
        </div>

        <div className="lg:col-span-5 lg:border-l lg:border-ink-700 lg:pl-12">
          <p data-reveal="up" className="t-eyebrow text-paper/70">
            {p.noTitulo}
          </p>
          <ul className="mt-8 flex flex-col gap-5 opacity-70" data-reveal-stagger="0.1">
            {p.no.map((s) => (
              <li key={s} className="strike-hover flex gap-4 text-[18px] leading-snug text-paper italic md:text-[20px]">
                <CrossSvg />
                <span className="relative">
                  {s}
                  <span aria-hidden="true" className="strike-line bg-no" />
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
