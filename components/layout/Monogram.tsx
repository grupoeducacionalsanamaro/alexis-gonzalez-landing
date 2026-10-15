/** Monograma "AG" en trazo. `draw` habilita el dibujo del preloader. */
export function Monogram({ className = "", stroke = "var(--paper)", id }: { className?: string; stroke?: string; id?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" className={className} id={id}>
      <rect x="0.5" y="0.5" width="47" height="47" rx="1.5" stroke={stroke} strokeOpacity="0.35" />
      {/* A */}
      <path d="M9 33 L16.5 14 L24 33 M11.8 26.5 H21.2" stroke={stroke} strokeWidth="1.5" strokeLinecap="square" />
      {/* G */}
      <path
        d="M39.5 18.5 A8.5 9.5 0 1 0 39.5 28.5 V24.5 H33"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="square"
      />
    </svg>
  );
}
