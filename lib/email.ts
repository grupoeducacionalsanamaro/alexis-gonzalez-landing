import "server-only";
import { site } from "@/content/site";

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

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

function layout(body: string) {
  return `<!doctype html><html lang="es"><body style="margin:0;background:#0A0A0B;font-family:Helvetica,Arial,sans-serif;color:#F5F5F2">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0A0A0B"><tr><td align="center" style="padding:40px 16px">
<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%">
<tr><td style="padding-bottom:24px;border-bottom:1px solid #8A17B2;font-size:12px;letter-spacing:4px;text-transform:uppercase;color:#F5F5F2">AG · Alexis González</td></tr>
<tr><td style="padding:32px 0;font-size:16px;line-height:1.6;color:#D9D9DC">${body}</td></tr>
<tr><td style="padding-top:24px;border-top:1px solid #2A2A2E;font-size:12px;color:#A1A1A6">${esc(site.footer.tagline)}</td></tr>
</table></td></tr></table></body></html>`;
}

export async function emailConfirmacionPostulacion(to: string, nombre: string, calificado: boolean) {
  const primer = esc(nombre.split(" ")[0] ?? nombre);
  const body = calificado
    ? `<p style="font-size:22px;color:#F5F5F2;margin:0 0 16px">Hola ${primer}, recibimos tu postulación.</p>
<p>Tu perfil cumple con los criterios de la mentoría Método ${esc(site.marca)}. Si aún no agendaste tu conversación estratégica inicial, puedes hacerlo desde la página de postulación.</p>
<p>Nos vemos pronto.</p><p style="color:#B85CDB">— Alexis</p>`
    : `<p style="font-size:22px;color:#F5F5F2;margin:0 0 16px">Hola ${primer}, gracias por postular.</p>
<p>Por ahora, el mejor siguiente paso es leer el ebook <strong style="color:#B85CDB">“${esc(site.ebook.titulo)}”</strong>: te ayudará a identificar en qué etapa está tu negocio.</p>
${process.env.EBOOK_PDF_URL ? `<p><a href="${esc(process.env.EBOOK_PDF_URL)}" style="color:#0A0A0B;background:#F5F5F2;padding:14px 24px;text-decoration:none;display:inline-block;letter-spacing:2px;font-size:13px;text-transform:uppercase">Descargar ebook</a></p>` : ""}
<p>Cuando estés listo, puedes volver a postular.</p><p style="color:#B85CDB">— Alexis</p>`;
  return send(to, `Recibimos tu postulación · Método ${site.marca}`, layout(body));
}

export async function emailEbook(to: string, nombre: string) {
  const primer = esc(nombre.split(" ")[0] ?? nombre);
  const url = process.env.EBOOK_PDF_URL;
  const body = `<p style="font-size:22px;color:#F5F5F2;margin:0 0 16px">Hola ${primer}, aquí está tu ebook.</p>
<p><strong style="color:#B85CDB">“${esc(site.ebook.titulo)}”</strong>: ${esc(site.ebook.bajada)}</p>
${url ? `<p><a href="${esc(url)}" style="color:#0A0A0B;background:#F5F5F2;padding:14px 24px;text-decoration:none;display:inline-block;letter-spacing:2px;font-size:13px;text-transform:uppercase">Descargar PDF</a></p>` : ""}
<p>Soy Alexis González: MBA, inversionista inmobiliario y fundador de un ecosistema educacional en salud. Ayudo a profesionales de la salud a dar el paso de gran clínico a empresario.</p>
<p style="color:#B85CDB">— Alexis</p>`;
  return send(to, `Tu ebook: ${site.ebook.titulo}`, layout(body));
}

export async function emailAvisoPrioritario(resumen: {
  nombre: string;
  especialidad: string;
  facturacion: string;
  objetivo: string;
  email: string;
  whatsapp: string;
  score: number;
}) {
  const to = process.env.LEADS_NOTIFY_EMAIL;
  if (!to) return false;
  const subject = `[PRIORITARIO] ${resumen.nombre} · ${resumen.especialidad} · ${resumen.facturacion}`;
  const body = `<p style="color:#F5F5F2">${esc(resumen.nombre)} · ${esc(resumen.especialidad)} · ${esc(resumen.facturacion)} · score ${resumen.score}</p>
<p>Objetivo: ${esc(resumen.objetivo)}</p>
<p>${esc(resumen.email)} · <a style="color:#B85CDB" href="https://wa.me/56${esc(resumen.whatsapp)}">+56 ${esc(resumen.whatsapp)}</a></p>`;
  return send(to, subject, layout(body));
}
