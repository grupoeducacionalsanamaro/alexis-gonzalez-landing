"use client";

import type { ReactNode, PointerEvent, ElementType } from "react";

type Props = {
  tone?: "dark" | "light" | "glass";
  interactive?: boolean;
  className?: string;
  children: ReactNode;
  as?: ElementType;
};

/** Card de marca. `interactive` agrega spotlight que sigue al cursor + borde dorado al hover. */
export function Card({ tone = "dark", interactive, className = "", children, as: Tag = "div" }: Props) {
  const onMove = (e: PointerEvent<HTMLElement>) => {
    if (!interactive || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--x", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--y", `${e.clientY - r.top}px`);
  };
  return (
    <Tag
      onPointerMove={interactive ? onMove : undefined}
      className={`card-${tone} ${interactive ? "card-interactive" : ""} ${className}`}
    >
      {children}
    </Tag>
  );
}
