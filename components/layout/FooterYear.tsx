"use client";

/** Año automático (cliente, para no congelarlo en el HTML estático). */
export function FooterYear() {
  return <span suppressHydrationWarning>{new Date().getFullYear()}</span>;
}
