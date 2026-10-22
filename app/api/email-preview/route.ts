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
          ? correoAvisoPrioritario({
              nombre: "Camila Rojas",
              email: "camila@ejemplo.cl",
              whatsapp: "+56 9 1234 5678",
              whatsappDigitos: "912345678",
              perfil: ["Dueño o socio de un negocio de salud"],
              sector: ["Odontología"],
              facturacion: "$300 a $1.000 millones CLP",
              etapa: "Buscando escalar y delegar",
              problema: "Todo depende de mí y no tengo tiempo para pensar en el negocio.",
              resultado: "Tener un gerente operativo y los números ordenados.",
              inversion: "Sí, si la propuesta se ajusta a mis objetivos",
              score: 8,
            })
          : correoEbook("Camila Rojas", pdf);
  // Imágenes y links desde el servidor local mientras se revisa
  return new Response(html.replaceAll(EMAIL_BASE, u.origin), { headers: { "Content-Type": "text/html; charset=utf-8" } });
}
