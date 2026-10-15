"use client";

import { useEffect, useRef, type ReactNode, type MouseEvent } from "react";
import { track } from "@/lib/analytics";
import { isDesktopPointer, isReducedMotion, loadMotion } from "@/lib/animations";
import { scrollToHash } from "@/components/layout/SmoothScroll";

type Variant = "primary" | "gold" | "ghost" | "text";

type Props = {
  variant?: Variant;
  size?: "md" | "lg";
  href?: string;
  onClick?: (e: MouseEvent<HTMLElement>) => void;
  loading?: boolean;
  disabled?: boolean;
  magnetic?: boolean;
  type?: "button" | "submit";
  location?: string; // para track('cta_click', { location })
  cursor?: "postular" | "ver";
  className?: string;
  children: ReactNode;
  ariaLabel?: string;
  download?: boolean;
  external?: boolean;
};

export function Button({
  variant = "primary",
  size = "md",
  href,
  onClick,
  loading,
  disabled,
  magnetic,
  type = "button",
  location,
  cursor,
  className = "",
  children,
  ariaLabel,
  download,
  external,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const isMagnetic = magnetic ?? (variant === "primary" || variant === "gold");

  useEffect(() => {
    const el = ref.current;
    if (!el || !isMagnetic || !isDesktopPointer() || isReducedMotion()) return;
    let cleanup = () => {};
    let alive = true;
    loadMotion().then(({ gsap }) => {
      if (!alive) return;
      const xTo = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3.out" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3.out" });
      const RADIUS = 60;
      const MAX = 8;
      const onMove = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const inside =
          e.clientX > r.left - RADIUS && e.clientX < r.right + RADIUS && e.clientY > r.top - RADIUS && e.clientY < r.bottom + RADIUS;
        if (inside) {
          xTo(Math.max(-MAX, Math.min(MAX, dx * 0.15)));
          yTo(Math.max(-MAX, Math.min(MAX, dy * 0.3)));
        } else if (gsap.getProperty(el, "x") !== 0 || gsap.getProperty(el, "y") !== 0) {
          gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.4)", overwrite: true });
        }
      };
      window.addEventListener("pointermove", onMove, { passive: true });
      cleanup = () => window.removeEventListener("pointermove", onMove);
    });
    return () => {
      alive = false;
      cleanup();
    };
  }, [isMagnetic]);

  const cls = [
    "btn t-btn",
    `btn-${variant}`,
    size === "lg" && variant !== "text" ? "btn-lg" : "",
    loading ? "btn-loading" : "",
    className,
  ].join(" ");

  const content =
    variant === "text" ? (
      <span className="btn-label">
        {children}
        <span aria-hidden="true" className="btn-text-arrow">
          →
        </span>
      </span>
    ) : (
      <>
        <span className="btn-label">
          {children}
          <span aria-hidden="true" className="btn-arrow">
            →
          </span>
        </span>
        {loading && <span className="btn-loader" aria-hidden="true" />}
      </>
    );

  const handle = (e: MouseEvent<HTMLElement>) => {
    if (location) track("cta_click", { location });
    onClick?.(e);
    if (e.defaultPrevented) return;
    if (href?.startsWith("#")) {
      e.preventDefault();
      scrollToHash(href);
    }
  };

  if (href) {
    return (
      <a
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={href}
        className={cls}
        onClick={handle}
        aria-label={ariaLabel}
        data-cursor={cursor}
        download={download || undefined}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        aria-disabled={disabled || undefined}
      >
        {content}
      </a>
    );
  }
  return (
    <button
      ref={ref as React.RefObject<HTMLButtonElement>}
      type={type}
      className={cls}
      onClick={handle}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      aria-label={ariaLabel}
      data-cursor={cursor}
    >
      {content}
    </button>
  );
}
