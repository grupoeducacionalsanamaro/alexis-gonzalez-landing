import "server-only";
import { site } from "@/content/site";
import { correoAvisoPrioritario, correoEbook, correoPostulacion, type ResumenLead } from "@/lib/emailTemplates";

const FROM = process.env.RESEND_FROM || "Alexis González <onboarding@resend.dev>";

async function send(to: string, subject: string, html: string) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    if (process.env.NODE_ENV !== "production") console.info(`[email] RESEND_API_KEY no definido. Para: ${to} · ${subject}`);
    return false;
  }
  try {
    const { Resend } = await import("resend");
    const resend = new Resend(key);
    const { error } = await resend.emails.send({ from: FROM, to, subject, html });
    if (error) console.error("[email] Resend:", error);
    return !error;
  } catch (e) {
    console.error("[email] error", e);
    return false;
  }
}

export async function emailConfirmacionPostulacion(to: string, nombre: string, calificado: boolean) {
  return send(to, `Recibimos tu postulación · Método ${site.marca}`, correoPostulacion(nombre, calificado, process.env.EBOOK_PDF_URL || site.ebook.pdfUrl));
}

export async function emailEbook(to: string, nombre: string) {
  return send(to, `Tu ebook: ${site.ebook.titulo}`, correoEbook(nombre, process.env.EBOOK_PDF_URL || site.ebook.pdfUrl));
}

export async function emailAvisoPrioritario(resumen: ResumenLead) {
  const to = process.env.LEADS_NOTIFY_EMAIL;
  if (!to) return false;
  const subject = `[PRIORITARIO] ${resumen.nombre} · ${resumen.especialidad} · ${resumen.facturacion}`;
  return send(to, subject, correoAvisoPrioritario(resumen));
}
