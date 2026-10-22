import { site } from "@/content/site";

/**
 * Plantilla única de correos transaccionales (ebook, postulación, avisos).
 * Misma línea que la web: negro + blanco + púrpura #8A17B2, Montserrat
 * (con Helvetica/Arial de respaldo donde el cliente no carga fuentes web)
 * y la cabecera del hero, exportada como imagen en /public/email/cabecera.jpg.
 * Maquetada con tablas y estilos en línea para Gmail, Outlook y Apple Mail.
 */

// Las imágenes del correo necesitan una URL absoluta y pública
export const EMAIL_BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://alexis-gonzalez-landing.vercel.app";

const C = {
  fondo: "#0A0A0B",
  tarjeta: "#141416",
  borde: "#2A2A2E",
  blanco: "#F5F5F2",
  texto: "#D9D9DC",
  gris: "#A1A1A6",
  morado: "#8A17B2",
  lila: "#B85CDB",
};
const FUENTE = "'Montserrat',Helvetica,Arial,sans-serif";

export const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export const primerNombre = (nombre: string) => esc(nombre.trim().split(/\s+/)[0] || nombre);

/** Párrafo de cuerpo con el estilo de la plantilla */
export const p = (html: string) => `<p style="margin:0 0 18px;font-family:${FUENTE};font-size:16px;line-height:1.65;color:${C.texto}">${html}</p>`;
/** Texto destacado en lila */
export const destacado = (s: string) => `<strong style="color:${C.lila};font-weight:700">${s}</strong>`;
/** Enlace secundario (texto con flecha) */
export const enlace = (label: string, href: string) =>
  `<a href="${esc(href)}" style="font-family:${FUENTE};font-size:15px;font-weight:700;color:${C.lila};text-decoration:none">${esc(label)}&nbsp;&rarr;</a>`;

function boton(label: string, href: string) {
  const h = esc(href);
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:10px auto 26px"><tr>
<td align="center" bgcolor="${C.morado}" style="border-radius:2px;background:${C.morado}">
<!--[if mso]><v:rect xmlns:v="urn:schemas-microsoft-com:vml" href="${h}" style="height:54px;v-text-anchor:middle;width:280px" stroked="f" fillcolor="${C.morado}"><center style="color:#ffffff;font-family:Arial,sans-serif;font-size:14px;font-weight:bold;letter-spacing:2px">${esc(label.toUpperCase())}</center></v:rect><![endif]-->
<!--[if !mso]><!--><a href="${h}" style="display:inline-block;padding:18px 36px;font-family:${FUENTE};font-size:14px;font-weight:800;letter-spacing:2.5px;text-transform:uppercase;color:#FFFFFF;text-decoration:none">${esc(label)}</a><!--<![endif]-->
</td></tr></table>`;
}

export type Correo = {
  /** Texto de vista previa en la bandeja (no se ve en el cuerpo) */
  preheader: string;
  /** Antetítulo en mayúsculas, con raya lila */
  eyebrow?: string;
  titulo: string;
  /** HTML del cuerpo: usar p(), destacado(), enlace() */
  cuerpo: string;
  cta?: { label: string; href: string };
  /** HTML bajo el botón (cierre, enlace secundario…) */
  cierre?: string;
  /** Firma de Alexis al final (true por defecto) */
  firma?: boolean;
  /** Motivo por el que recibe el correo, en el pie */
  motivo?: string;
};

export function plantillaCorreo(c: Correo) {
  const redes = site.footer.redes
    .map((r) => `<a href="${esc(r.href)}" style="color:${C.blanco};text-decoration:none;font-weight:600">${esc(r.label)}</a>`)
    .join(`<span style="color:${C.lila}">&nbsp;&nbsp;·&nbsp;&nbsp;</span>`);

  const eyebrow = c.eyebrow
    ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 18px"><tr>
<td style="width:28px;vertical-align:middle"><div style="width:28px;height:2px;background:${C.lila};font-size:0;line-height:0">&nbsp;</div></td>
<td style="padding-left:12px;font-family:${FUENTE};font-size:12px;font-weight:600;letter-spacing:3px;text-transform:uppercase;color:${C.lila}">${esc(c.eyebrow)}</td>
</tr></table>`
    : "";

  const firma =
    c.firma === false
      ? ""
      : `<tr><td style="padding:0 44px"><div style="height:1px;background:${C.morado};background-image:linear-gradient(100deg,#5C0F78,#8A17B2 45%,#B85CDB 75%,#8A17B2);font-size:0;line-height:0">&nbsp;</div></td></tr>
<tr><td class="px" style="padding:26px 44px 40px">
<p style="margin:0;font-family:${FUENTE};font-size:18px;font-weight:900;letter-spacing:-0.3px;color:${C.blanco}">Alexis González C.</p>
<p style="margin:4px 0 0;font-family:${FUENTE};font-size:13px;font-weight:500;color:${C.gris}">MBA · Mentor estratégico · Método ${esc(site.marca)}</p>
</td></tr>`;

  return `<!doctype html>
<html lang="es" xmlns:v="urn:schemas-microsoft-com:vml">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="dark light">
<meta name="supported-color-schemes" content="dark light">
<title>${esc(c.titulo)}</title>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<style>
body{margin:0;padding:0;background:${C.fondo}}
a{color:${C.lila}}
@media (max-width:620px){
  .px{padding-left:24px!important;padding-right:24px!important}
  .h1{font-size:25px!important}
}
</style>
</head>
<body style="margin:0;padding:0;background:${C.fondo}">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:${C.fondo}">${esc(c.preheader)}&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.fondo}" style="background:${C.fondo}">
<tr><td align="center" style="padding:32px 12px 40px">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background:${C.tarjeta};border:1px solid ${C.borde}">

<tr><td style="padding:0;font-size:0;line-height:0">
<a href="${EMAIL_BASE}" style="display:block"><img src="${EMAIL_BASE}/email/cabecera.jpg" width="600" alt="Alexis González · Es mejor ser próspero que exitoso." style="display:block;width:100%;max-width:600px;height:auto;border:0;background:${C.fondo};color:${C.blanco};font-family:${FUENTE};font-size:16px"></a>
</td></tr>

<tr><td class="px" style="padding:38px 44px 14px">
${eyebrow}
<h1 class="h1" style="margin:0 0 20px;font-family:${FUENTE};font-size:29px;line-height:1.15;font-weight:900;letter-spacing:-0.6px;color:${C.blanco}">${c.titulo}</h1>
${c.cuerpo}
${c.cta ? boton(c.cta.label, c.cta.href) : ""}
${c.cierre ?? ""}
</td></tr>
${firma}
</table>

<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px">
<tr><td class="px" align="center" style="padding:28px 24px 0;font-family:${FUENTE};font-size:13px;line-height:1.6;color:${C.gris}">
<p style="margin:0 0 14px;font-size:13px">${redes}</p>
<p style="margin:0">${esc(site.footer.tagline)}</p>
${c.motivo ? `<p style="margin:10px 0 0;font-size:12px;color:#6E6E73">${esc(c.motivo)}</p>` : ""}
</td></tr>
</table>

</td></tr>
</table>
</body>
</html>`;
}

/* ───────────── Correos de la web ───────────── */

export function correoEbook(nombre: string, pdfUrl: string | null) {
  const e = site.ebook;
  return plantillaCorreo({
    preheader: `Aquí tienes el link de descarga de “${e.titulo}”.`,
    eyebrow: "Mini ebook gratuito",
    titulo: `Hola ${primerNombre(nombre)}, tu ebook ya está&nbsp;aquí.`,
    cuerpo:
      p(`Gracias por descargar ${destacado(`“${esc(e.titulo)}”`)}. Es una guía rápida para entender en qué etapa está tu práctica y qué necesitas para dar el paso de gran clínico a empresario.`) +
      (pdfUrl ? "" : p("En unos minutos te llegará el link de descarga.")),
    cta: pdfUrl ? { label: "Descargar ebook", href: pdfUrl } : undefined,
    cierre:
      p("Léelo con calma y anota lo que resuene contigo. Si al terminar sientes que es momento de escalar, la mentoría estratégica es el siguiente paso.") +
      `<p style="margin:0 0 6px">${enlace("Conoce la mentoría", `${EMAIL_BASE}/mentoria`)}</p>`,
    motivo: "Recibes este correo porque solicitaste el ebook en nuestra web.",
  });
}

export function correoPostulacion(nombre: string, calificado: boolean, pdfUrl: string | null) {
  const marca = esc(site.marca);
  if (calificado) {
    return plantillaCorreo({
      preheader: "Recibimos tu postulación a la mentoría estratégica.",
      eyebrow: "Mentoría estratégica",
      titulo: `Hola ${primerNombre(nombre)}, recibimos tu postulación.`,
      cuerpo:
        p(`Tu perfil cumple con los criterios de la mentoría ${destacado(`Método ${marca}`)}. El siguiente paso es una conversación estratégica inicial para conocer tu negocio y ver si somos un buen fit.`) +
        p("Si aún no agendaste tu conversación, puedes hacerlo desde la página de postulación."),
      cta: { label: "Agendar conversación", href: `${EMAIL_BASE}/mentoria#postular` },
      cierre: p("Nos vemos pronto."),
      motivo: "Recibes este correo porque postulaste a la mentoría en nuestra web.",
    });
  }
  return plantillaCorreo({
    preheader: "Gracias por postular. Te dejamos un primer paso.",
    eyebrow: "Mentoría estratégica",
    titulo: `Hola ${primerNombre(nombre)}, gracias por postular.`,
    cuerpo: p(
      `Por ahora, el mejor siguiente paso es leer el ebook ${destacado(`“${esc(site.ebook.titulo)}”`)}: te ayudará a identificar en qué etapa está tu negocio y qué te falta para escalar.`,
    ),
    cta: pdfUrl ? { label: "Descargar ebook", href: pdfUrl } : undefined,
    cierre: p("Cuando estés listo, puedes volver a postular."),
    motivo: "Recibes este correo porque postulaste a la mentoría en nuestra web.",
  });
}

export type ResumenLead = {
  nombre: string;
  email: string;
  /** Formateado, ej. +56 9 1234 5678 */
  whatsapp: string;
  /** Solo dígitos sin +56, para el link de WhatsApp */
  whatsappDigitos: string;
  perfil: readonly string[];
  sector: readonly string[];
  facturacion: string;
  etapa: string;
  problema: string;
  resultado: string;
  inversion: string;
  score: number;
};

/** Aviso interno de lead prioritario (para el equipo, no para el usuario) */
export function correoAvisoPrioritario(r: ResumenLead) {
  const fila = (k: string, v: string) =>
    `<tr><td style="padding:10px 0;border-bottom:1px solid ${C.borde};font-family:${FUENTE};font-size:13px;color:${C.gris};width:130px;vertical-align:top">${k}</td><td style="padding:10px 0;border-bottom:1px solid ${C.borde};font-family:${FUENTE};font-size:15px;color:${C.blanco}">${v}</td></tr>`;
  return plantillaCorreo({
    preheader: `${r.nombre} · ${r.facturacion} · score ${r.score}`,
    eyebrow: "Lead prioritario",
    titulo: esc(r.nombre),
    cuerpo: `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px">
${fila("Perfil", esc(r.perfil.join(", ")))}
${fila("Sector", esc(r.sector.join(", ")))}
${fila("Facturación", esc(r.facturacion))}
${fila("Etapa", esc(r.etapa))}
${fila("Problema", esc(r.problema))}
${fila("Resultado a 90 días", esc(r.resultado))}
${fila("Inversión", esc(r.inversion))}
${fila("Email", `<a href="mailto:${esc(r.email)}" style="color:${C.lila};text-decoration:none">${esc(r.email)}</a>`)}
${fila("WhatsApp", esc(r.whatsapp))}
${fila("Score", String(r.score))}
</table>`,
    cta: { label: "Escribir por WhatsApp", href: `https://wa.me/56${r.whatsappDigitos}` },
    firma: false,
  });
}

/** Versión en texto plano del correo: los correos solo-HTML puntúan peor en los filtros de spam */
export function textoPlano(html: string) {
  return html
    .replace(/<head[\s\S]*?<\/head>/i, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<div style="display:none[\s\S]*?<\/div>/i, "")
    .replace(/<img[^>]*>/gi, "")
    .replace(/<a [^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi, (_, href: string, label: string) => {
      const t = label.replace(/<[^>]+>|&nbsp;&rarr;/g, "").trim();
      return t && !href.startsWith("mailto:") && !href.endsWith(".vercel.app") ? `${t}: ${href}` : t;
    })
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|h1|tr|table)>/gi, "\n\n")
    .replace(/<\/td>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&rarr;/g, "→")
    .replace(/&#847;|&zwnj;/g, "")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/[ \t]+/g, " ")
    .replace(/ *\n */g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
