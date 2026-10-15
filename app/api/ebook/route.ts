import { NextResponse, type NextRequest } from "next/server";
import { ebookSchema, MIN_FILL_MS } from "@/lib/schemas";
import { deviceFromUA, sendMetaCapi, sendToCrm } from "@/lib/crm";
import { emailEbook } from "@/lib/email";
import { clientIp, rateLimit } from "@/lib/ratelimit";

export async function POST(req: NextRequest) {
  const ip = clientIp(req.headers);
  if (!rateLimit(`ebook:${ip}`)) {
    return NextResponse.json({ ok: false, error: "Demasiados intentos. Espera un minuto." }, { status: 429 });
  }
  const body = await req.json().catch(() => null);
  const parsed = ebookSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ ok: false, error: "Revisa los datos del formulario." }, { status: 422 });
  const d = parsed.data;
  const pdf = process.env.EBOOK_PDF_URL ?? null;

  if (d.empresa_web || Date.now() - d.startedAt < MIN_FILL_MS) return NextResponse.json({ ok: true, url: pdf });

  const ua = req.headers.get("user-agent");
  await Promise.allSettled([
    sendToCrm({
      tipo: "ebook",
      estado: "completa",
      respuestas: { nombre: d.nombre, email: d.email, whatsapp: `+56${d.whatsapp}`, consentimiento: true, origen: d.landing },
      utm: d.utm ?? {},
      landing: "/",
      dispositivo: deviceFromUA(ua),
      timestamp: new Date().toISOString(),
    }),
    emailEbook(d.email, d.nombre),
    sendMetaCapi({
      eventName: "Lead",
      eventId: d.eventId,
      email: d.email,
      phone: d.whatsapp,
      ip,
      ua,
      url: req.nextUrl.origin,
      customData: { content_name: "ebook" },
    }),
  ]);
  return NextResponse.json({ ok: true, url: pdf });
}
