import { site } from "@/content/site";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { StickyCTA } from "@/components/layout/StickyCTA";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { ExitIntent } from "@/components/layout/ExitIntent";
import { Hero } from "@/components/sections/Hero";
import { Diagnostico } from "@/components/sections/Diagnostico";
import { Dimensiones } from "@/components/sections/Dimensiones";
import { QuienSoy } from "@/components/sections/QuienSoy";
import { Metodo } from "@/components/sections/Metodo";
import { ParaQuien } from "@/components/sections/ParaQuien";
import { Mentoria } from "@/components/sections/Mentoria";
import { Testimonios } from "@/components/sections/Testimonios";
import { Postulacion } from "@/components/sections/Postulacion";
import { Ebook } from "@/components/sections/Ebook";
import { Ecosistema } from "@/components/sections/Ecosistema";
import { FAQ, faqRespondidas } from "@/components/sections/FAQ";
import { CTAFinal } from "@/components/sections/CTAFinal";

function JsonLd() {
  const faq = faqRespondidas();
  const graph: Record<string, unknown>[] = [
    {
      "@type": "Person",
      "@id": `${site.url}/#alexis`,
      name: site.nombre,
      jobTitle: "Mentor de negocios para profesionales y empresarios de la salud",
      description: site.quienSoy.bio.join(" "),
      image: `${site.url}${site.quienSoy.imagen}`,
      url: site.url,
      knowsAbout: ["Estrategia de negocios", "Gestión de clínicas", "Inversión inmobiliaria", "Educación en salud"],
    },
    {
      "@type": "Service",
      name: `Mentoría 1:1 Método ${site.marca}`,
      serviceType: "Mentoría de negocios",
      provider: { "@id": `${site.url}/#alexis` },
      areaServed: { "@type": "Country", name: "Chile" },
      audience: { "@type": "Audience", audienceType: "Profesionales y empresarios de la salud" },
      description: site.seo.description,
    },
    {
      "@type": "Book",
      name: site.ebook.titulo,
      author: { "@id": `${site.url}/#alexis` },
      bookFormat: "https://schema.org/EBook",
      inLanguage: "es",
      isAccessibleForFree: true,
      description: site.ebook.bajada,
    },
  ];
  if (faq.length) {
    graph.push({
      "@type": "FAQPage",
      mainEntity: faq.map((f) => ({ "@type": "Question", name: f.pregunta, acceptedAnswer: { "@type": "Answer", text: f.respuesta } })),
    });
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c") }}
    />
  );
}

export default function Home() {
  return (
    <>
      <Nav />
      <main id="contenido" tabIndex={-1} className="outline-none">
        <Hero />
        <Diagnostico />
        <Dimensiones />
        <QuienSoy />
        <Metodo />
        <ParaQuien />
        <Mentoria />
        <Testimonios />
        <Postulacion />
        <Ebook />
        <Ecosistema />
        <FAQ />
        <CTAFinal />
      </main>
      <Footer />
      <StickyCTA />
      <WhatsAppButton />
      <ExitIntent />
      <JsonLd />
    </>
  );
}
