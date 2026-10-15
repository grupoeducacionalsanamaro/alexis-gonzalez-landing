/**
 * track(name, params) → dataLayer (GTM) + Meta Pixel si existe.
 * Los scripts de terceros solo se cargan tras el consentimiento (ver Analytics.tsx).
 */
type Params = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    fbq?: (...args: unknown[]) => void;
  }
}

const PIXEL_MAP: Record<string, string> = {
  form_submit: "SubmitApplication",
  form_qualified: "Lead",
  ebook_submit: "Lead",
  call_booked: "Schedule",
  whatsapp_click: "Contact",
};

export function track(name: string, params: Params = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: name, ...params });
  if (typeof window.fbq === "function") {
    const std = PIXEL_MAP[name];
    const { eventId, ...rest } = params;
    if (std) window.fbq("track", std, rest, eventId ? { eventID: String(eventId) } : undefined);
    else window.fbq("trackCustom", name, rest);
  }
  if (process.env.NODE_ENV === "development") console.debug("[track]", name, params);
}

export function newEventId(prefix = "ev") {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}
