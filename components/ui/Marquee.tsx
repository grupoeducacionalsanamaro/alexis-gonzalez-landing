import { Fragment } from "react";

function Sep() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" aria-hidden="true" className="mx-6 shrink-0 md:mx-8">
      <path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6L2.5 9.4l6.6-.8z" fill="var(--accent-300)" />
    </svg>
  );
}

/** Cinta infinita (CSS, 40s). Pausa al hover; estática con reduced-motion. */
export function Marquee({ items, className = "" }: { items: string[]; className?: string }) {
  const row = (hidden: boolean) => (
    <div className="flex items-center" aria-hidden={hidden || undefined}>
      {items.map((t) => (
        <Fragment key={t}>
          <span className="t-eyebrow whitespace-nowrap text-paper/70">{t}</span>
          <Sep />
        </Fragment>
      ))}
    </div>
  );
  return (
    <div className={`marquee ${className}`}>
      <div className="marquee-track">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
