import { Compass, TrendingUp, Building2, Stethoscope, CalendarRange, Repeat, UserRound, Clock } from "lucide-react";
import { site } from "@/content/site";
import { Tag, AccentText } from "@/components/ui/Tag";
import { Card } from "@/components/ui/Card";
import { Counter } from "@/components/ui/Counter";
import { Stars } from "@/components/ui/Stars";
import { Accordion } from "@/components/ui/Accordion";

/**
 * Versiones compactas de las secciones de la mentoría para /mentoria:
 * misma línea visual que tenían en la home, pero con tipografía y aire reducidos
 * y sin escenas fijas de scroll, para que la página no se alargue.
 */

const titulo = "font-display text-[clamp(26px,2.8vw,38px)] leading-[1.08] font-extrabold tracking-[-0.025em] text-paper";

/** Diagnóstico: titular con el 100 + síntomas en dos columnas + remate */
export function DiagnosticoCompacto() {
  const d = site.diagnostico;
  return (
    <section aria-labelledby="diag-title" className="relative bg-ink-950 py-14 lg:py-20">
      <div className="container-x grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-12">
        <div className="lg:col-span-5">
          <h2 id="diag-title" data-reveal="up" className={titulo}>
            {d.tituloPre}{" "}
            <span className="accent-text" data-sweep="">
              <Counter to={d.tituloNumero} />
            </span>{" "}
            {d.tituloPost}
          </h2>
          <p data-reveal="up" className="t-lead mt-3 text-[16px] text-paper/70 lg:text-[18px]">
            {d.bajada}
          </p>
          <p data-reveal="up" className="mt-6 font-display text-[18px] leading-snug font-extrabold tracking-[-0.015em] text-paper lg:text-[21px]">
            {d.rematePre} <AccentText sweep>{d.remateAccent}</AccentText>
          </p>
        </div>
        <ul className="grid gap-2.5 sm:grid-cols-2 lg:col-span-7" data-reveal-stagger="0.06">
          {d.sintomas.map((s) => (
            <li key={s} className="flex items-center gap-3 rounded-xl px-4 py-3.5 text-[15px] font-medium text-paper/85 ring-1 ring-ink-700 lg:text-[16px]">
              <span aria-hidden="true" className="h-px w-4 shrink-0 bg-accent-300" />
              {s}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

const ICONOS = [Compass, TrendingUp, Building2];

/** Método PROSPERA®: intro + 3 dimensiones en tarjetas + remate “no es coaching” */
export function MetodoCompacto() {
  const m = site.metodo;
  const dims = site.dimensiones;
  return (
    <section aria-labelledby="metodo-title" className="relative fade-both-900 py-14 lg:py-20">
      <div className="container-x">
        <div className="grid gap-4 lg:grid-cols-12 lg:items-end lg:gap-12">
          <div className="lg:col-span-6">
            <div data-reveal="up">
              <Tag>{m.tag}</Tag>
            </div>
            <h2 id="metodo-title" data-reveal="up" className={`${titulo} mt-4`}>
              {m.titulo}
            </h2>
          </div>
          <p data-reveal="up" className="t-small text-[15px]! text-paper/70! lg:col-span-6 lg:text-[16px]!">
            {dims.intro}
          </p>
        </div>

        <ul className="mt-8 grid gap-3 md:grid-cols-3 lg:mt-10 lg:gap-4" data-reveal-stagger="0.08">
          {dims.items.map((it, i) => {
            const Icon = ICONOS[i];
            return (
              <li key={it.palabra}>
                <Card interactive className="group h-full rounded-2xl p-6 lg:p-7">
                  <div className="relative z-10">
                    <div className="flex items-center justify-between">
                      <span aria-hidden="true" className="num-outline text-[44px]">
                        0{i + 1}
                      </span>
                      <Icon strokeWidth={1.5} className="size-6 text-paper/75 transition-colors duration-300 group-hover:text-accent-300" aria-hidden="true" />
                    </div>
                    <h3 className="mt-4 font-display text-[22px] font-black tracking-[-0.01em] text-paper uppercase">
                      {it.palabra}
                      <span className="text-accent-300">.</span>
                    </h3>
                    <p className="mt-2 text-[14.5px] leading-relaxed text-paper/75">{it.descripcion}</p>
                  </div>
                </Card>
              </li>
            );
          })}
        </ul>

        <p data-reveal="up" className="mt-8 text-center font-display text-[18px] leading-snug font-extrabold tracking-[-0.015em] lg:mt-10 lg:text-[22px]">
          <span className="relative mr-2 inline-block text-mist">
            {m.remateTachado}
            <span aria-hidden="true" className="absolute inset-x-0 top-[55%] h-[2px] bg-mist" />
          </span>{" "}
          <span className="text-paper">{m.remate}</span>
        </p>
      </div>
    </section>
  );
}

const ICONOS_ETAPA = [Stethoscope, CalendarRange, Repeat];

/** La mentoría: formato en una fila de tres etapas */
export function MentoriaCompacta() {
  const m = site.mentoria;
  return (
    <section aria-labelledby="ment-title" className="relative bg-ink-950 py-14 lg:py-20">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div data-reveal="up">
            <h2 id="ment-title" className={`${titulo} uppercase`}>
              {m.titulo}
            </h2>
            <Stars className="mt-3" size={13} />
          </div>
          <div data-reveal="up" className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[13px] font-semibold text-paper ring-1 ring-ink-700">
              <UserRound strokeWidth={1.75} className="size-4 text-accent-300" aria-hidden="true" />
              {m.badge}
            </span>
            {m.duracionPrograma && (
              <span className="inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[13px] font-semibold text-paper ring-1 ring-ink-700">
                <Clock strokeWidth={1.75} className="size-4 text-accent-300" aria-hidden="true" />
                {m.duracionPrograma}
              </span>
            )}
          </div>
        </div>
        <ol className="mt-8 grid gap-3 md:grid-cols-3 lg:gap-4" data-reveal-stagger="0.08">
          {m.etapas.map((e, i) => {
            const Icon = ICONOS_ETAPA[i];
            return (
              <li key={e.titulo} className="relative rounded-2xl p-6 ring-1 ring-ink-700">
                <div className="flex items-center gap-3">
                  <span className="grid size-9 place-items-center rounded-full bg-accent-500 text-paper">
                    <Icon strokeWidth={1.75} className="size-4" aria-hidden="true" />
                  </span>
                  <span className="t-eyebrow text-[11px]! text-paper/55">Etapa 0{i + 1}</span>
                </div>
                <h3 className="mt-4 font-display text-[18px] leading-snug font-extrabold tracking-[-0.015em] text-paper lg:text-[19px]">{e.titulo}</h3>
                <p className="mt-1.5 text-[14.5px] leading-relaxed text-paper/70">{e.detalle}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

/** Cierre breve antes del formulario (manifiesto del antiguo CTA final) */
export function CierreCompacto() {
  const c = site.ctaFinal;
  return (
    <section aria-label="Antes de postular" className="relative bg-ink-950 pt-8 pb-2 lg:pt-12">
      <div className="container-x">
        <div data-reveal="up" className="mx-auto max-w-[860px] rounded-3xl bg-ink-900 px-6 py-8 text-center ring-1 ring-ink-700 lg:px-12 lg:py-10">
          <p className="font-display text-[clamp(20px,2.3vw,30px)] leading-[1.2] font-extrabold tracking-[-0.02em] text-paper">
            {c.lineas[0]} <span className="text-paper/60">{c.lineas[1]}</span>
          </p>
          <p className="mt-4 text-[16px] text-paper/75 lg:text-[18px]">
            {c.lineas2[0]} {c.lineas2[1]} <AccentText sweep>{c.palabraFinal}</AccentText>
          </p>
        </div>
      </div>
    </section>
  );
}

/** Preguntas frecuentes: solo las que tienen respuesta */
export function FaqCompacta() {
  const items = site.faq.items.filter((f): f is { pregunta: string; respuesta: string } => Boolean(f.respuesta));
  if (items.length === 0) return null;
  return (
    <section aria-labelledby="faq-title" className="relative bg-ink-950 pt-4 pb-16 lg:pb-24">
      <div className="container-x grid gap-6 lg:grid-cols-12 lg:gap-12">
        <h2 id="faq-title" data-reveal="up" className={`${titulo} lg:col-span-4`}>
          {site.faq.titulo}
        </h2>
        <div data-reveal="up" className="lg:col-span-8">
          <Accordion items={items} />
        </div>
      </div>
    </section>
  );
}
