import type { Metadata } from "next";
import { site } from "@/content/site";
import { LegalPage } from "@/components/layout/LegalPage";

export const metadata: Metadata = {
  title: "Política de privacidad · Alexis González",
  description: "Cómo tratamos tus datos personales al postular a la mentoría o descargar el ebook.",
  alternates: { canonical: "/privacidad" },
};

// TODO(cliente): revisar con abogado antes de publicar (Ley 19.628 y Ley 21.719).
export default function Privacidad() {
  const { responsable, contacto } = site.legal;
  return (
    <LegalPage title="Política de privacidad" updated="octubre de 2026">
      <p>
        Esta política explica cómo se recolectan, usan y protegen los datos personales que entregas en este sitio, de acuerdo con la
        Ley N° 19.628 sobre protección de la vida privada y la Ley N° 21.719 que regula la protección y el tratamiento de los datos
        personales en Chile.
      </p>
      <h2>Responsable del tratamiento</h2>
      <p>
        {responsable}. Contacto: <a className="underline underline-offset-4" href={`mailto:${contacto}`}>{contacto}</a>.
      </p>
      <h2>Datos que recolectamos</h2>
      <ul>
        <li>Formulario de postulación: especialidad, rango de facturación, tamaño de equipo, preocupaciones, objetivos, nivel de compromiso, nombre, email, WhatsApp, ciudad y, opcionalmente, web o Instagram.</li>
        <li>Formulario del ebook: nombre, email y WhatsApp.</li>
        <li>Datos de navegación: origen de la visita (parámetros UTM) y, solo si aceptas cookies, datos de medición de Google Tag Manager, Meta Pixel y Microsoft Clarity.</li>
      </ul>
      <h2>Finalidades</h2>
      <ul>
        <li>Evaluar tu postulación a la mentoría y coordinar una conversación estratégica inicial.</li>
        <li>Enviarte el ebook solicitado y contenido relacionado por email y WhatsApp.</li>
        <li>Medir y mejorar el funcionamiento de este sitio.</li>
      </ul>
      <h2>Base de licitud</h2>
      <p>Tu consentimiento expreso, otorgado al marcar la casilla de aceptación en cada formulario. Puedes revocarlo en cualquier momento.</p>
      <h2>Destinatarios</h2>
      <p>
        Tus datos pueden ser procesados por proveedores que nos prestan servicios (CRM, envío de emails, agenda y analítica), quienes
        solo los usan para dichos fines. No vendemos ni cedemos tus datos a terceros.
      </p>
      <h2>Conservación</h2>
      <p>Conservamos tus datos mientras sean necesarios para las finalidades indicadas o hasta que solicites su eliminación.</p>
      <h2>Tus derechos</h2>
      <p>
        Puedes ejercer en cualquier momento tus derechos de acceso, rectificación, supresión, oposición, portabilidad y bloqueo,
        escribiendo a <a className="underline underline-offset-4" href={`mailto:${contacto}`}>{contacto}</a>. Responderemos dentro de los plazos legales.
      </p>
      <h2>Seguridad</h2>
      <p>Aplicamos medidas técnicas y organizativas razonables para proteger tus datos frente a accesos no autorizados, pérdida o alteración.</p>
    </LegalPage>
  );
}
