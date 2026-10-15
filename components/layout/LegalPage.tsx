import Link from "next/link";
import type { ReactNode } from "react";
import { Monogram } from "./Monogram";
import { Footer } from "./Footer";

export function LegalPage({ title, updated, children }: { title: string; updated: string; children: ReactNode }) {
  return (
    <>
      <header className="container-x flex h-[72px] items-center">
        <Link href="/" className="flex items-center gap-3" aria-label="Volver al inicio">
          <Monogram className="size-9" />
          <span className="t-eyebrow text-paper">Alexis González</span>
        </Link>
      </header>
      <main id="contenido" className="container-x pt-16 pb-32">
        <article className="mx-auto max-w-[760px]">
          <h1 className="t-h2 text-paper">{title}</h1>
          <p className="t-small mt-4">Última actualización: {updated}</p>
          <div className="legal mt-12 flex flex-col gap-6 text-[17px] leading-relaxed text-paper/80 [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-[22px] [&_h2]:font-medium [&_h2]:text-paper [&_li]:ml-5 [&_li]:list-disc [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-2">
            {children}
          </div>
          <p className="mt-16">
            <Link href="/" className="t-btn text-paper underline-offset-8 hover:underline">
              ← Volver al inicio
            </Link>
          </p>
        </article>
      </main>
      <Footer />
    </>
  );
}
