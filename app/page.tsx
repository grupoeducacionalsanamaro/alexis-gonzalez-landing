import { site } from "@/content/site";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { StickyCTA } from "@/components/layout/StickyCTA";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { ExitIntent } from "@/components/layout/ExitIntent";
import { Hero } from "@/components/sections/Hero";
import { SobreAlexis } from "@/components/sections/SobreAlexis";
import { Eventos } from "@/components/sections/Eventos";
import { Servicios } from "@/components/sections/Servicios";
import { Ebook } from "@/components/sections/Ebook";
import { Ecosistema } from "@/components/sections/Ecosistema";

function JsonLd() {
  const graph: Record<string, unknown>[] = [
    {
      "@type": "Person",
      "@id": `${site.url}/#alexis`,
      name: site.nombre,
      jobTitle: "MBA · Emprendedor · Mentor Estratégico",
      homeLocation: { "@type": "Place", name: "Concepción, Chile" },
      description: [...site.sobre.bio, ...site.sobre.bio2].join(" "),
      image: `${site.url}${site.hero.imagen}`,
      sameAs: site.footer.redes.map((r) => r.href),
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
        {/* Marca personal: partes 1–5 */}
        <Hero />
        <SobreAlexis />
        <Ecosistema />
        <Eventos />
        <Ebook />
        <Servicios />
      </main>
      <Footer />
      <StickyCTA />
      <WhatsAppButton />
      <ExitIntent />
      <JsonLd />
    </>
  );
}
