import { NextResponse, type NextRequest } from "next/server";
import { applyPartialSchema, applySchema, MIN_FILL_MS } from "@/lib/schemas";
import { calcularScore } from "@/lib/scoring";
import { deviceFromUA, sendMetaCapi, sendToCrm } from "@/lib/crm";
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
  const especialidad = d.especialidad === "Otro" && d.especialidadOtro ? `Otro: ${d.especialidadOtro}` : d.especialidad;

  const respuestas = {
    especialidad,
    facturacion: d.facturacion,
    equipo: d.equipo,
    dolores: d.dolores,
    objetivo: d.objetivo,
    compromiso: d.compromiso,
    nombre: d.nombre,
    email: d.email,
    whatsapp: `+56${d.whatsapp}`,
    ciudad: d.ciudad,
    webOInstagram: d.webOInstagram || undefined,
    consentimiento: true,
  };

  const url = new URL(d.landing || "/", req.nextUrl.origin).toString();
  await Promise.allSettled([
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
      ? emailAvisoPrioritario({ nombre: d.nombre, especialidad, facturacion: d.facturacion, objetivo: d.objetivo, email: d.email, whatsapp: d.whatsapp, score })
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

  return NextResponse.json({ ok: true, segmento, ebookUrl: segmento === "nutrir" ? (process.env.EBOOK_PDF_URL || site.ebook.pdfUrl) : null });
}
