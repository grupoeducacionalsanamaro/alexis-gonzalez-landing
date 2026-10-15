/**
 * Captura UTMs + gclid/fbclid en la primera visita y los persiste 30 días
 * en una cookie first-party. Se adjuntan a todos los leads.
 */
const COOKIE = "ag_utm";
const KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "gclid", "fbclid"] as const;

export type Utm = {
  source?: string;
  medium?: string;
  campaign?: string;
  content?: string;
  term?: string;
  gclid?: string;
  fbclid?: string;
};

export function captureUtm() {
  if (typeof window === "undefined") return;
  try {
    const qs = new URLSearchParams(window.location.search);
    const found: Utm = {};
    KEYS.forEach((k) => {
      const v = qs.get(k);
      if (v) (found as Record<string, string>)[k.replace("utm_", "")] = v.slice(0, 200);
    });
    if (Object.keys(found).length === 0) return; // no pisar la atribución previa sin datos nuevos
    const value = encodeURIComponent(JSON.stringify(found));
    document.cookie = `${COOKIE}=${value}; Max-Age=${60 * 60 * 24 * 30}; Path=/; SameSite=Lax${
      location.protocol === "https:" ? "; Secure" : ""
    }`;
  } catch {
    /* noop */
  }
}

export function readUtm(): Utm {
  if (typeof document === "undefined") return {};
  try {
    const m = document.cookie.match(new RegExp(`(?:^|; )${COOKIE}=([^;]*)`));
    return m ? (JSON.parse(decodeURIComponent(m[1])) as Utm) : {};
  } catch {
    return {};
  }
}
