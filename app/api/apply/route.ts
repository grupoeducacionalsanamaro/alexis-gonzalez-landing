import { NextResponse, type NextRequest } from "next/server";
import { applyPartialSchema, applySchema, MIN_FILL_MS } from "@/lib/schemas";
import { calcularScore } from "@/lib/scoring";
import { deviceFromUA, sendMetaCapi, sendToCrm, sendToGoogleForm } from "@/lib/crm";
import { emailAvisoPrioritario, emailConfirmacionPostulacion } from "@/lib/email";
import { clientIp, rateLimit } from "@/lib/ratelimit";
import { site } from "@/content/site";

export async function POST(req: NextRequest) {
  const ip = clientIp(req.headers);
  if (!rateLimit(`apply:${ip}`)) {
    return NextResponse.json({ ok: false, error: "Demasiados intentos. Espera un minuto." }, { status: 429 });
  }
  const ua = req.headers.get("user-agent");
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ ok: false, error: "Solicitud inválida." }, { status: 400 });

  // Captura parcial (recuperación de postulaciones incompletas)
  if (req.nextUrl.searchParams.get("partial") === "1") {
    const parsed = applyPartialSchema.safeParse(body);
    if (!parsed.success || parsed.data.empresa_web) return NextResponse.json({ ok: true });
    const { utm, landing, startedAt, eventId, empresa_web, ...respuestas } = parsed.data;
    void startedAt;
    void eventId;
    void empresa_web;
    await sendToCrm({
      tipo: "postulacion",
      estado: "incompleta",
      respuestas,
      utm: utm ?? {},
      landing: landing ?? "/",
      dispositivo: deviceFromUA(ua),
      timestamp: new Date().toISOString(),
    });
    return NextResponse.json({ ok: true });
  }

  const parsed = applySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Revisa los datos del formulario." }, { status: 422 });
  }
  const d = parsed.data;

  // Anti-bot: honeypot y tiempo mínimo de llenado. Se responde ok para no dar pistas.
  if (d.empresa_web || Date.now() - d.startedAt < MIN_FILL_MS) {
    return NextResponse.json({ ok: true, segmento: "nutrir", ebookUrl: process.env.EBOOK_PDF_URL || site.ebook.pdfUrl });
  }

  // Score siempre en servidor
  const { score, segmento } = calcularScore(d);
  const whatsapp = `+56 ${d.whatsapp.replace(/^(\d)(\d{4})(\d{4})$/, "$1 $2 $3")}`;

  const respuestas = {
    nombre: d.nombre,
    email: d.email,
    whatsapp,
    perfil: d.perfil,
    sector: d.sector,
    facturacion: d.facturacion,
    etapa: d.etapa,
    problema: d.problema,
    resultado: d.resultado,
    inversion: d.inversion,
    consentimiento: true,
  };

  const url = new URL(d.landing || "/", req.nextUrl.origin).toString();
  const [formOk] = await Promise.allSettled([
    sendToGoogleForm(respuestas),
    sendToCrm({
      tipo: "postulacion",
      estado: "completa",
      score,
      segmento,
      respuestas,
      utm: d.utm ?? {},
      landing: d.landing ?? "/",
      dispositivo: deviceFromUA(ua),
      timestamp: new Date().toISOString(),
    }),
    emailConfirmacionPostulacion(d.email, d.nombre, segmento !== "nutrir"),
    segmento === "prioritario"
      ? emailAvisoPrioritario({ ...respuestas, whatsappDigitos: d.whatsapp, score })
      : Promise.resolve(false),
    sendMetaCapi({
      eventName: "Lead",
      eventId: d.eventId,
      email: d.email,
      phone: d.whatsapp,
      ip,
      ua,
      url,
      customData: { content_name: "postulacion", segmento },
    }),
  ]);

  // Si el Google Form no la recibió, que quede rastro para recuperarla desde los logs
  if (formOk.status !== "fulfilled" || !formOk.value) console.error("[apply] postulación no guardada en Google Form", JSON.stringify(respuestas));

  return NextResponse.json({ ok: true, segmento, ebookUrl: segmento === "nutrir" ? (process.env.EBOOK_PDF_URL || site.ebook.pdfUrl) : null });
}
