/** Máscara de celular chileno: "9 XXXX XXXX". */
export function formatPhoneCL(raw: string): string {
  let d = raw.replace(/\D/g, "");
  if (d.startsWith("56")) d = d.slice(2);
  d = d.slice(0, 9);
  if (d.length <= 1) return d;
  if (d.length <= 5) return `${d[0]} ${d.slice(1)}`;
  return `${d[0]} ${d.slice(1, 5)} ${d.slice(5)}`;
}

export const SUBMITTED_KEY = "ag_submitted";

export function markSubmitted() {
  try {
    localStorage.setItem(SUBMITTED_KEY, "1");
  } catch {
    /* noop */
  }
}

export function hasSubmitted(): boolean {
  try {
    return localStorage.getItem(SUBMITTED_KEY) === "1";
  } catch {
    return false;
  }
}
