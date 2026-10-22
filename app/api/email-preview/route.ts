import { notFound } from "next/navigation";
import { EMAIL_BASE, correoAvisoPrioritario, correoEbook, correoPostulacion } from "@/lib/emailTemplates";

/** Vista previa local de los correos: /api/email-preview?t=ebook|postulacion|postulacion-no|aviso (no existe en producción) */
export function GET(req: Request) {
  if (process.env.NODE_ENV === "production") notFound();
  const u = new URL(req.url);
  const t = u.searchParams.get("t") ?? "ebook";
  const pdf = "https://example.com/ebook.pdf";
  const html =
    t === "postulacion"
      ? correoPostulacion("Camila Rojas", true, pdf)
      : t === "postulacion-no"
        ? correoPostulacion("Camila Rojas", false, pdf)
        : t === "aviso"
          ? correoAvisoPrioritario({ nombre: "Camila Rojas", especialidad: "Odontología", facturacion: "$10M–$30M", objetivo: "Abrir una segunda clínica", email: "camila@ejemplo.cl", whatsapp: "912345678", score: 86 })
          : correoEbook("Camila Rojas", pdf);
  // Imágenes y links desde el servidor local mientras se revisa
  return new Response(html.replaceAll(EMAIL_BASE, u.origin), { headers: { "Content-Type": "text/html; charset=utf-8" } });
}
