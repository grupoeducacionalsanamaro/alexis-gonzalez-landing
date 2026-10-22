import "server-only";
import { googleFormPostulacion } from "@/content/site";

export type CrmPayload = {
  tipo: "postulacion" | "ebook";
  estado: "completa" | "incompleta";
  score?: number;
  segmento?: string;
  respuestas: Record<string, unknown>;
  utm: Record<string, string | undefined>;
  landing: string;
  dispositivo: "mobile" | "desktop";
  timestamp: string;
};

/** Envía el lead al webhook del CRM (HubSpot / GoHighLevel / Pipedrive / Make). */
export async function sendToCrm(payload: CrmPayload): Promise<boolean> {
  const url = process.env.CRM_WEBHOOK_URL;
  if (!url) {
    if (process.env.NODE_ENV !== "production") console.info("[crm] CRM_WEBHOOK_URL no definido; payload:", payload);
    return false;
  }
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) console.error("[crm] webhook respondió", res.status);
    return res.ok;
  } catch (e) {
    console.error("[crm] error enviando webhook", e);
    return false;
  }
}

/**
 * Guarda la postulación en el Google Form de Alexis (POST a formResponse, como si se llenara el Form).
 * Las opciones deben coincidir exactamente con las del Form: ver formOptions en content/site.ts.
 */
export async function sendToGoogleForm(r: Record<string, unknown>): Promise<boolean> {
  const { url, entries } = googleFormPostulacion;
  const body = new URLSearchParams();
  for (const [campo, entry] of Object.entries(entries)) {
    const v = r[campo];
    for (const valor of Array.isArray(v) ? v : [v]) if (valor != null && valor !== "") body.append(entry, String(valor));
  }
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      redirect: "manual",
      signal: AbortSignal.timeout(8000),
    });
    // Google responde 200 con la página de confirmación; 400 si falta una pregunta obligatoria o una opción no existe
    if (!res.ok) console.error("[google-form] respondió", res.status);
    return res.ok;
  } catch (e) {
    console.error("[google-form] error", e);
    return false;
  }
}

export function deviceFromUA(ua: string | null): "mobile" | "desktop" {
  return ua && /Mobi|Android|iPhone|iPad/i.test(ua) ? "mobile" : "desktop";
}

/** Meta Conversions API (server-side), deduplicado con el Pixel vía event_id. */
export async function sendMetaCapi(opts: {
  eventName: string;
  eventId?: string;
  email?: string;
  phone?: string;
  ip?: string | null;
  ua?: string | null;
  url: string;
  customData?: Record<string, unknown>;
}) {
  const token = process.env.META_CAPI_TOKEN;
  const pixel = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  if (!token || !pixel) return;
  const { createHash } = await import("node:crypto");
  const h = (v?: string) => (v ? createHash("sha256").update(v.trim().toLowerCase()).digest("hex") : undefined);
  try {
    await fetch(`https://graph.facebook.com/v21.0/${pixel}/events?access_token=${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data: [
          {
            event_name: opts.eventName,
            event_time: Math.floor(Date.now() / 1000),
            event_id: opts.eventId,
            action_source: "website",
            event_source_url: opts.url,
            user_data: {
              em: h(opts.email) ? [h(opts.email)] : undefined,
              ph: h(opts.phone) ? [h(`56${opts.phone}`)] : undefined,
              client_ip_address: opts.ip ?? undefined,
              client_user_agent: opts.ua ?? undefined,
            },
            custom_data: opts.customData,
          },
        ],
      }),
      signal: AbortSignal.timeout(6000),
    });
  } catch (e) {
    console.error("[capi] error", e);
  }
}
