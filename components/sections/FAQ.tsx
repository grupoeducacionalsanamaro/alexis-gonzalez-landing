import { site } from "@/content/site";
import { Accordion } from "@/components/ui/Accordion";

export function faqRespondidas() {
  return site.faq.items.filter((f): f is { pregunta: string; respuesta: string } => Boolean(f.respuesta));
}

export function FAQ() {
  const items = faqRespondidas();
  if (items.length === 0) return null;
  return (
    <section id="faq" aria-labelledby="faq-title" className="relative fade-both-900 section-y">
      <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <h2 id="faq-title" data-reveal="lines" className="t-h2 text-paper">
            {site.faq.titulo}
          </h2>
        </div>
        <div data-reveal="up" className="lg:col-span-8">
          <Accordion items={items} />
        </div>
      </div>
    </section>
  );
}
