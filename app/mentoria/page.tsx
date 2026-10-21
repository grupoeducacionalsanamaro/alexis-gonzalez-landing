import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { site } from "@/content/site";
import { Logo } from "@/components/layout/Logo";
import { Footer } from "@/components/layout/Footer";
import { Eyebrow } from "@/components/ui/Tag";
import { ParaQuien } from "@/components/sections/ParaQuien";
import { Testimonios } from "@/components/sections/Testimonios";
import { Postulacion } from "@/components/sections/Postulacion";
import { DiagnosticoCompacto, MetodoCompacto, MentoriaCompacta, CierreCompacto, FaqCompacta } from "@/components/sections/MentoriaInfo";

export const metadata: Metadata = {
  title: site.mentoriaPagina.seoTitulo,
  description: site.seo.description,
  alternates: { canonical: "/mentoria" },
};

/** Mentoría estratégica: “¿Para quién es?” + formulario de postulación. */
export default function MentoriaPage() {
  const m = site.mentoriaPagina;
  return (
    <>
      <header className="container-x flex h-[72px] items-center justify-between">
        <Link href="/" aria-label={`${site.nombre} — inicio`}>
          <Logo priority className="h-8 lg:h-9" />
        </Link>
        <Link href="/" className="group inline-flex min-h-12 items-center gap-2 text-[14px] font-semibold text-paper/75 transition-colors hover:text-paper">
          <ArrowLeft strokeWidth={1.75} className="size-4 transition-transform duration-300 group-hover:-translate-x-0.5" aria-hidden="true" />
          {m.volver}
        </Link>
      </header>

      <main id="contenido" tabIndex={-1} className="outline-none">
        <section aria-labelledby="mentoria-title" className="relative bg-ink-950 pt-10 pb-2 lg:pt-16">
          <div className="container-x">
            <div data-reveal="up">
              <Eyebrow>{m.eyebrow}</Eyebrow>
            </div>
            <h1 id="mentoria-title" data-reveal="lines" className="t-h2 mt-5 max-w-[820px] text-[clamp(36px,4.6vw,64px)]! font-black! text-paper">
              {m.titulo}
            </h1>
            <p data-reveal="up" className="t-lead mt-4 max-w-[620px] text-[17px] text-paper/80 lg:text-[19px]">
              {m.bajada}
            </p>
          </div>
        </section>

        <DiagnosticoCompacto />
        <MetodoCompacto />
        <MentoriaCompacta />
        <ParaQuien />
        <Testimonios />
        <CierreCompacto />
        <Postulacion />
        <FaqCompacta />
      </main>

      <Footer />
    </>
  );
}
