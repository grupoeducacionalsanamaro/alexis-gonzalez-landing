import type { Metadata } from "next";
import { site } from "@/content/site";
import { LegalPage } from "@/components/layout/LegalPage";

export const metadata: Metadata = {
  title: "Términos y condiciones · Alexis González",
  description: `Términos de uso del sitio de la mentoría Método ${site.marca}.`,
  alternates: { canonical: "/terminos" },
};

// TODO(cliente): revisar con abogado antes de publicar.
export default function Terminos() {
  return (
    <LegalPage title="Términos y condiciones" updated="octubre de 2026">
      <p>Al usar este sitio aceptas estos términos. Si no estás de acuerdo, te pedimos no utilizarlo.</p>
      <h2>Objeto del sitio</h2>
      <p>
        Este sitio presenta la mentoría 1:1 Método {site.marca} de {site.nombre} y permite postular a ella o descargar contenido
        gratuito. Postular no garantiza la admisión: cada postulación se evalúa según el perfil y los objetivos declarados.
      </p>
      <h2>Contenido</h2>
      <p>
        Los textos, imágenes, marcas y materiales de este sitio (incluido el Método {site.marca} y el ebook) son de propiedad de su
        titular y están protegidos por la legislación de propiedad intelectual. No pueden reproducirse sin autorización.
      </p>
      <h2>Naturaleza del servicio</h2>
      <p>
        La mentoría es un servicio de dirección estratégica. No constituye asesoría legal, tributaria, financiera ni médica, y los
        resultados dependen de la ejecución de cada participante.
      </p>
      <h2>Datos personales</h2>
      <p>El tratamiento de tus datos se rige por nuestra Política de privacidad.</p>
      <h2>Modificaciones</h2>
      <p>Podemos actualizar estos términos. La versión vigente es la publicada en esta página.</p>
      <h2>Legislación aplicable</h2>
      <p>Estos términos se rigen por las leyes de la República de Chile.</p>
    </LegalPage>
  );
}
