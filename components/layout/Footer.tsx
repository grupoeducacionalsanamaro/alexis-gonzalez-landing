import Link from "next/link";
import { site } from "@/content/site";
import { Monogram } from "./Monogram";
import { FooterYear } from "./FooterYear";

export function Footer() {
  const redes = site.footer.redes.filter((r) => r.href);
  return (
    <footer className="relative bg-ink-950 pb-28 lg:pb-12">
      <div aria-hidden="true" className="h-px w-full" style={{ background: "var(--gold-gradient)" }} />
      <div className="container-x flex flex-col gap-10 pt-14 md:flex-row md:items-end md:justify-between">
        <div className="flex items-center gap-4">
          <Monogram className="size-11" />
          <div>
            <p className="t-eyebrow text-paper">{site.nombre}</p>
            <p className="t-small mt-1">Método {site.marca}</p>
          </div>
        </div>
        <nav aria-label="Pie de página" className="flex flex-wrap gap-x-8 gap-y-3 text-[14px] text-paper/70">
          {redes.map((r) => (
            <a key={r.label} href={r.href!} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-paper">
              {r.label}
            </a>
          ))}
          {site.footer.email && (
            <a href={`mailto:${site.footer.email}`} className="transition-colors hover:text-paper">
              {site.footer.email}
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
      <div className="container-x mt-12">
        <p className="t-small text-[13px]">
          © <FooterYear /> {site.footer.tagline}. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
