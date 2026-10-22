import "server-only";
import { site } from "@/content/site";
import { correoAvisoPrioritario, correoEbook, correoPostulacion, textoPlano, type ResumenLead } from "@/lib/emailTemplates";

const FROM = process.env.RESEND_FROM || "Alexis González <onboarding@resend.dev>";
// Respuestas de los usuarios y copia oculta de cada correo enviado (se configuran en Vercel)
const REPLY_TO = process.env.EMAIL_REPLY_TO || undefined;
const COPIA = process.env.EMAIL_BCC || undefined;

async function send(to: string, subject: string, html: string, { copia = true } = {}) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.warn(`[email] RESEND_API_KEY no definido, no se envía: ${subject}`);
    return false;
  }
  try {
    const { Resend } = await import("resend");
    const resend = new Resend(key);
    const { data, error } = await resend.emails.send({ from: FROM, to, subject, html, text: textoPlano(html), replyTo: REPLY_TO, bcc: copia ? COPIA : undefined });
    if (error) console.error("[email] Resend:", error);
    else console.info(`[email] enviado ${data?.id} · ${subject}`);
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
  return send(to, subject, correoAvisoPrioritario(resumen), { copia: false });
}
