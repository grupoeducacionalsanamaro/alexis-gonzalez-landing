import { site } from "@/content/site";
import { Eyebrow } from "@/components/ui/Tag";
import { ImageSlot } from "@/components/ui/ImageSlot";

function SpotifyIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 1.5a10.5 10.5 0 1 0 0 21 10.5 10.5 0 0 0 0-21Zm4.82 15.15a.65.65 0 0 1-.9.22c-2.46-1.5-5.55-1.84-9.2-1.01a.66.66 0 1 1-.29-1.28c3.99-.91 7.42-.52 10.17 1.16.31.19.41.6.22.91Zm1.28-2.86a.82.82 0 0 1-1.12.27c-2.82-1.73-7.12-2.23-10.45-1.22a.82.82 0 1 1-.48-1.57c3.81-1.15 8.54-.59 11.78 1.4.39.24.51.74.27 1.12Zm.11-2.98C14.83 8.8 9.27 8.62 6.05 9.6a.98.98 0 1 1-.57-1.88c3.7-1.12 9.84-.9 13.72 1.4a.98.98 0 0 1-1 1.69Z" />
    </svg>
  );
}

/** Parte 4 · Eventos (mosaico) + podcasts. El ebook va en la sección siguiente. */
export function Eventos() {
  const c = site.contenido;
  const [primero, ...resto] = c.eventos;
  return (
    <section id="eventos" aria-labelledby="eventos-title" className="relative bg-ink-950 section-y">
      <div className="container-x">
        <div data-reveal="up">
          <Eyebrow>{c.eyebrow}</Eyebrow>
        </div>
        <h2 id="eventos-title" data-reveal="lines" className="t-h2 mt-6 max-w-[820px] text-paper">
          {c.titulo}
        </h2>

        {/* Mosaico de eventos: banda ancha (foto grupal completa) + cuatro en 4:3 */}
        <ul className="mt-12 grid grid-cols-2 gap-3 lg:mt-16 lg:grid-cols-4 lg:gap-4" data-reveal-stagger="0.06">
          <li className="relative col-span-2 lg:col-span-4">
            <ImageSlot src={primero.src} alt={primero.alt} label={primero.titulo} sizes="(min-width: 1024px) 1312px, 100vw" className="aspect-[2000/877] rounded-2xl" />
            <span className="pointer-events-none absolute bottom-4 left-4 rounded-full bg-ink-950/70 px-3.5 py-1.5 text-[13px] font-semibold text-paper backdrop-blur">{primero.titulo}</span>
          </li>
          {resto.map((ev) => (
            <li key={ev.titulo} className="relative">
              <ImageSlot src={ev.src} alt={ev.alt} label={ev.titulo} sizes="(min-width: 1024px) 25vw, 50vw" className="aspect-[4/3] rounded-2xl" />
              <span className="pointer-events-none absolute bottom-3 left-3 max-w-[calc(100%-24px)] rounded-full bg-ink-950/70 px-3 py-1 text-[12px] leading-snug font-semibold text-paper backdrop-blur">{ev.titulo}</span>
            </li>
          ))}
        </ul>

        {/* Podcasts: el bloque de color de la página */}
        <div data-reveal="up" className="relative mt-16 overflow-hidden rounded-3xl bg-accent-500 p-8 text-paper sm:p-10 lg:mt-24 lg:p-14">
          <div aria-hidden="true" className="pointer-events-none absolute -top-24 -right-24 size-[420px] rounded-full border border-paper/15" />
          <div aria-hidden="true" className="pointer-events-none absolute -top-8 -right-8 size-[260px] rounded-full border border-paper/10" />
          <div className="relative grid gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-6">
              <p className="t-eyebrow flex items-center gap-3 text-paper/80">
                <span aria-hidden="true" className="h-px w-6 bg-paper/70" />
                {c.podcastsEyebrow}
              </p>
              <h3 className="mt-5 font-display text-[clamp(32px,4vw,56px)] leading-[1] font-black tracking-[-0.035em]">{c.podcastsTitulo}</h3>
              <p className="t-lead mt-5 max-w-[460px] text-[17px] text-paper/85">{c.podcastsBajada}</p>
              <a
                href={c.spotify}
                target="_blank"
                rel="noopener noreferrer"
                className="btn t-btn mt-8 h-14 rounded-full bg-paper px-7 text-ink-950 transition-transform duration-200 hover:scale-[1.02]"
              >
                <span className="btn-label">
                  <SpotifyIcon className="size-5 text-[#1DB954]" />
                  {c.spotifyCta}
                </span>
              </a>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2 lg:col-span-6">
              {c.podcasts.map((p) => (
                <li key={p.nombre} className="rounded-2xl bg-ink-950/25 p-6 ring-1 ring-paper/15 backdrop-blur-sm">
                  <span className="block font-display text-[28px] leading-none font-black tracking-[-0.03em]">{p.nombre}</span>
                  <span className="mt-3 block text-[14px] leading-snug text-paper/80">{p.detalle}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
