"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { scrollToHash } from "./SmoothScroll";
import { MobileMenu } from "./MobileMenu";
import { Monogram } from "./Monogram";

export function Nav() {
  const [floating, setFloating] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const linksRef = useRef<HTMLUListElement>(null);
  const [indicator, setIndicator] = useState<{ x: number; w: number } | null>(null);

  // Cápsula flotante tras 80px + ocultar al bajar / mostrar al subir (umbral 8px)
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setFloating(y > 80);
      if (Math.abs(y - last) > 8) {
        setHidden(y > last && y > 400);
        last = y;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Sección activa con IntersectionObserver
  useEffect(() => {
    const ids = site.nav.links.map((l) => l.href.slice(1));
    const visible = new Map<string, number>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => visible.set(e.target.id, e.isIntersecting ? e.intersectionRatio : 0));
        let best: string | null = null;
        let max = 0;
        ids.forEach((id) => {
          const r = visible.get(id) ?? 0;
          if (r > max) {
            max = r;
            best = id;
          }
        });
        setActive(best);
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: [0, 0.01, 0.5, 1] },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  // Línea de acento que se desliza entre links
  useEffect(() => {
    const ul = linksRef.current;
    if (!ul) return;
    const update = () => {
      const a = active ? ul.querySelector<HTMLAnchorElement>(`a[href="#${active}"]`) : null;
      setIndicator(a ? { x: a.offsetLeft, w: a.offsetWidth } : null);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [active, floating]);

  return (
    <header
      className="fixed inset-x-0 top-0 z-40 transition-transform duration-500 ease-out-expo"
      // `none` (no translateY(0)) para no crear un containing block que rompa el menú fijo
      style={{ transform: hidden && !menuOpen ? "translateY(-120%)" : "none" }}
    >
      <div
        className={`mx-auto transition-[max-width,margin,border-radius,background-color,border-color,padding] duration-500 ease-out-expo ${
          floating
            ? "card-glass mt-3 max-w-[calc(100%-24px)] rounded-full px-4 lg:mt-4 lg:max-w-[960px] lg:px-6"
            : "mt-0 max-w-[1280px] border border-transparent px-6 lg:px-16"
        }`}
      >
        <nav aria-label="Principal" className={`flex items-center justify-between gap-6 transition-[height] duration-500 ease-out-expo ${floating ? "h-[60px]" : "h-[72px]"}`}>
          <a
            href="#inicio"
            onClick={(e) => {
              e.preventDefault();
              scrollToHash("#inicio");
            }}
            className="flex items-center gap-3"
            aria-label={`${site.nombre} — inicio`}
          >
            <Monogram className="size-9" />
            <span className="t-eyebrow hidden text-paper sm:inline">{site.nombre}</span>
          </a>

          <ul ref={linksRef} className="relative hidden items-center gap-8 lg:flex">
            {site.nav.links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToHash(l.href);
                  }}
                  aria-current={active === l.href.slice(1) ? "true" : undefined}
                  className={`block py-2 font-display text-[14px] font-medium transition-colors duration-200 hover:text-paper ${
                    active === l.href.slice(1) ? "text-paper" : "text-paper/65"
                  }`}
                >
                  {l.label}
                </a>
              </li>
            ))}
            <span
              aria-hidden="true"
              className="absolute bottom-0 left-0 h-px bg-accent-500 transition-[transform,width,opacity] duration-500 ease-out-expo"
              style={{
                width: indicator?.w ?? 0,
                transform: `translateX(${indicator?.x ?? 0}px)`,
                opacity: indicator ? 1 : 0,
              }}
            />
          </ul>

          <div className="flex items-center gap-3">
            <Button variant="ghost" href="#postular" location="nav" cursor="postular" className="hidden sm:inline-flex">
              {site.nav.cta}
            </Button>
            <button
              type="button"
              className="relative grid size-12 place-items-center lg:hidden"
              aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen((o) => !o)}
            >
              <span
                aria-hidden="true"
                className="absolute h-px w-6 bg-paper transition-transform duration-250 ease-micro"
                style={{ transform: menuOpen ? "rotate(45deg)" : "translateY(-4px)" }}
              />
              <span
                aria-hidden="true"
                className="absolute h-px w-6 bg-paper transition-transform duration-250 ease-micro"
                style={{ transform: menuOpen ? "rotate(-45deg)" : "translateY(4px)" }}
              />
            </button>
          </div>
        </nav>
      </div>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
}
