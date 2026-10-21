import type { ReactNode } from "react";

export function Tag({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`inline-block rounded-[2px] bg-silver px-4 py-1.5 font-display text-[13px] font-semibold leading-snug text-ink-950 ${className}`}
    >
      {children}
    </span>
  );
}

export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`t-eyebrow flex items-center gap-3 text-paper/80 ${className}`}>
      <span aria-hidden="true" className="h-px w-6 shrink-0 bg-accent-500" />
      <span>{children}</span>
    </p>
  );
}

export function AccentText({ children, sweep = false, className = "" }: { children: ReactNode; sweep?: boolean; className?: string }) {
  return (
    <span className={`accent-text ${className}`} data-sweep={sweep ? "" : undefined}>
      {children}
    </span>
  );
}
