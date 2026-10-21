import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { site } from "@/content/site";
import { Logo } from "./Logo";
import { FooterYear } from "./FooterYear";

const ICONS: Record<string, React.ReactNode> = {
  LinkedIn: (
    <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4v11H3v-11Zm6.5 0h3.8v1.5h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1v5.45h-4v-4.83c0-1.15-.02-2.63-1.6-2.63-1.6 0-1.85 1.25-1.85 2.55v4.91h-4v-11Z" />
  ),
  Instagram: (
    <path d="M12 2.8c3 0 3.36.01 4.54.07 1.1.05 1.7.23 2.1.39.52.2.9.45 1.3.85.4.4.65.78.85 1.3.16.4.34 1 .39 2.1.06 1.18.07 1.54.07 4.54s-.01 3.36-.07 4.54c-.05 1.1-.23 1.7-.39 2.1-.2.52-.45.9-.85 1.3-.4.4-.78.65-1.3.85-.4.16-1 .34-2.1.39-1.18.06-1.54.07-4.54.07s-3.36-.01-4.54-.07c-1.1-.05-1.7-.23-2.1-.39a3.5 3.5 0 0 1-1.3-.85 3.5 3.5 0 0 1-.85-1.3c-.16-.4-.34-1-.39-2.1C2.81 15.36 2.8 15 2.8 12s.01-3.36.07-4.54c.05-1.1.23-1.7.39-2.1.2-.52.45-.9.85-1.3.4-.4.78-.65 1.3-.85.4-.16 1-.34 2.1-.39C8.64 2.81 9 2.8 12 2.8Zm0 4.67a4.53 4.53 0 1 0 0 9.06 4.53 4.53 0 0 0 0-9.06Zm0 7.47a2.94 2.94 0 1 1 0-5.88 2.94 2.94 0 0 1 0 5.88Zm4.71-8.71a1.06 1.06 0 1 0 0 2.12 1.06 1.06 0 0 0 0-2.12Z" />
  ),
  Spotify: (
    <path d="M12 1.5a10.5 10.5 0 1 0 0 21 10.5 10.5 0 0 0 0-21Zm4.82 15.15a.65.65 0 0 1-.9.22c-2.46-1.5-5.55-1.84-9.2-1.01a.66.66 0 1 1-.29-1.28c3.99-.91 7.42-.52 10.17 1.16.31.19.41.6.22.91Zm1.28-2.86a.82.82 0 0 1-1.12.27c-2.82-1.73-7.12-2.23-10.45-1.22a.82.82 0 1 1-.48-1.57c3.81-1.15 8.54-.59 11.78 1.4.39.24.51.74.27 1.12Zm.11-2.98C14.83 8.8 9.27 8.62 6.05 9.6a.98.98 0 1 1-.57-1.88c3.7-1.12 9.84-.9 13.72 1.4a.98.98 0 0 1-1 1.69Z" />
  ),
};

export function Footer() {
  const f = site.footer;
  return (
    <footer className="relative bg-ink-950 pb-28 lg:pb-12">
      <div aria-hidden="true" className="h-px w-full" style={{ background: "var(--accent-gradient)" }} />

      {/* Redes sociales */}
      <div className="container-x pt-16 lg:pt-24">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <h2 className="font-display text-[clamp(40px,6vw,88px)] leading-none font-black tracking-[-0.045em] text-paper">{f.redesTitulo}</h2>
          <ul className="grid gap-3 sm:grid-cols-3 lg:w-[62%]">
            {f.redes.map((r) => (
              <li key={r.label}>
                <a
                  href={r.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 rounded-2xl p-4 ring-1 ring-ink-700 transition-[background-color,box-shadow] duration-300 hover:bg-accent-500 hover:ring-accent-500"
                >
                  <span className="grid size-11 shrink-0 place-items-center rounded-full bg-paper/[0.06] text-paper transition-colors group-hover:bg-paper/15">
                    <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden="true">
                      {ICONS[r.label]}
                    </svg>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-[15px] font-extrabold text-paper">{r.label}</span>
                    <span className="block truncate text-[13px] text-paper/60 group-hover:text-paper/85">{r.handle}</span>
                  </span>
                  <ArrowUpRight strokeWidth={1.75} className="size-4 text-paper/50 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-paper" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="container-x mt-16 flex flex-col gap-10 border-t border-ink-700 pt-10 md:flex-row md:items-center md:justify-between">
        <div>
          <Logo className="h-11" />
          <p className="t-small mt-3">Método {site.marca}</p>
        </div>
        <nav aria-label="Pie de página" className="flex flex-wrap gap-x-8 gap-y-3 text-[14px] text-paper/70">
          {f.email && (
            <a href={`mailto:${f.email}`} className="transition-colors hover:text-paper">
              {f.email}
            </a>
          )}
          <Link href="/privacidad" className="transition-colors hover:text-paper">
            Política de privacidad
          </Link>
          <Link href="/terminos" className="transition-colors hover:text-paper">
            Términos
          </Link>
        </nav>
      </div>
      <div className="container-x mt-8">
        <p className="t-small text-[13px]">
          © <FooterYear /> {f.tagline}. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
